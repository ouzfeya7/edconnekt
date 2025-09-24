import { getActiveContext } from '../utils/contextStorage';

interface WebSocketMessage {
  type: 'message_received' | 'typing_start' | 'typing_stop' | 'presence_update' | 'conversation_updated';
  payload: unknown;
}

interface MessageReceivedPayload {
  conversationId: string;
  message: {
    id: string;
    senderId: string;
    content: string;
    type: 'text' | 'image' | 'file';
    attachments?: Array<{
      id: string;
      filename: string;
      url: string;
      type: string;
    }>;
    createdAt: string;
  };
}

interface TypingPayload {
  conversationId: string;
  userId: string;
  username?: string;
}

interface PresencePayload {
  userId: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

interface ConversationUpdatedPayload {
  conversationId: string;
  action: 'created' | 'updated' | 'deleted';
  conversation?: {
    id: string;
    type: 'DM' | 'GROUP';
    title: string;
    members: Array<{
      userId: string;
      role: string;
    }>;
    lastMessageAt: string;
    unreadCount: number;
  };
}

type WebSocketEventListener = (payload: unknown) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private listeners: Map<string, Set<WebSocketEventListener>> = new Map();
  private isConnecting = false;
  private connectionPromise: Promise<void> | null = null;

  constructor() {
    this.connect();
  }

  private async getWebSocketUrl(): Promise<string> {
    // Base URL depuis les variables d'environnement
    const baseUrl = import.meta.env.VITE_MESSAGE_API_BASE_URL || 'https://api.uat1-engy-partners.com/message/';
    
    // Convertir HTTP(S) en WS(S)
    const wsUrl = baseUrl.replace(/^https?:\/\//, baseUrl.startsWith('https') ? 'wss://' : 'ws://');
    
    // Endpoint WebSocket
    return `${wsUrl}ws`;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = sessionStorage.getItem('keycloak-token');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  public async connect(): Promise<void> {
    if (this.isConnecting && this.connectionPromise) {
      return this.connectionPromise;
    }

    this.isConnecting = true;
    this.connectionPromise = this._connect();
    
    try {
      await this.connectionPromise;
    } finally {
      this.isConnecting = false;
      this.connectionPromise = null;
    }
  }

  private async _connect(): Promise<void> {
    try {
      const wsUrl = await this.getWebSocketUrl();
      
      console.log('[WebSocket] Tentative de connexion à:', wsUrl);

      // Créer la connexion WebSocket
      // Note: Les headers ne peuvent pas être passés directement dans le constructeur WebSocket
      // dans le navigateur. L'authentification devra être gérée côté serveur via des query params
      // ou un protocole d'authentification WebSocket spécifique.
      const token = sessionStorage.getItem('keycloak-token');
      const { etabId: activeEtabId, role: activeRole } = getActiveContext();
      
      const urlWithAuth = new URL(wsUrl);
      if (token) {
        urlWithAuth.searchParams.set('token', token);
      }
      if (activeEtabId) urlWithAuth.searchParams.set('etab_id', activeEtabId);
      if (activeRole) urlWithAuth.searchParams.set('role', activeRole);

      this.ws = new WebSocket(urlWithAuth.toString());

      return new Promise((resolve, reject) => {
        if (!this.ws) return reject(new Error('WebSocket not initialized'));

        this.ws.onopen = () => {
          console.log('[WebSocket] Connexion établie');
          this.reconnectAttempts = 0;
          this.reconnectDelay = 1000;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('[WebSocket] Erreur parsing message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('[WebSocket] Connexion fermée:', event.code, event.reason);
          this.ws = null;
          
          // Reconnexion automatique si ce n'est pas une fermeture intentionnelle
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('[WebSocket] Erreur:', error);
          reject(error);
        };
      });
    } catch (error) {
      console.error('[WebSocket] Erreur connexion:', error);
      throw error;
    }
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000);
    
    console.log(`[WebSocket] Reconnexion dans ${delay}ms (tentative ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect().catch(error => {
        console.error('[WebSocket] Échec reconnexion:', error);
      });
    }, delay);
  }

  private handleMessage(message: WebSocketMessage): void {
    console.log('[WebSocket] Message reçu:', message.type, message.payload);
    
    const listeners = this.listeners.get(message.type);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(message.payload);
        } catch (error) {
          console.error('[WebSocket] Erreur dans listener:', error);
        }
      });
    }
  }

  public on(eventType: string, listener: WebSocketEventListener): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);
  }

  public off(eventType: string, listener: WebSocketEventListener): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        this.listeners.delete(eventType);
      }
    }
  }

  public send(type: string, payload: unknown): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type, payload });
      this.ws.send(message);
      console.log('[WebSocket] Message envoyé:', type, payload);
    } else {
      console.warn('[WebSocket] Impossible d\'envoyer le message, connexion non disponible');
    }
  }

  public sendTyping(conversationId: string, isTyping: boolean): void {
    this.send(isTyping ? 'typing_start' : 'typing_stop', {
      conversationId,
      timestamp: new Date().toISOString(),
    });
  }

  public updatePresence(status: 'online' | 'offline' | 'away'): void {
    this.send('presence_update', {
      status,
      timestamp: new Date().toISOString(),
    });
  }

  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Disconnection intentionnelle');
      this.ws = null;
    }
  }

  public getConnectionState(): 'connecting' | 'open' | 'closing' | 'closed' {
    if (!this.ws) return 'closed';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'connecting';
      case WebSocket.OPEN: return 'open';
      case WebSocket.CLOSING: return 'closing';
      case WebSocket.CLOSED: return 'closed';
      default: return 'closed';
    }
  }
}

// Instance singleton
export const websocketService = new WebSocketService();

// Types exports
export type {
  WebSocketMessage,
  MessageReceivedPayload,
  TypingPayload,
  PresencePayload,
  ConversationUpdatedPayload,
  WebSocketEventListener
};

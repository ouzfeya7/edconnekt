/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ChatActions, ChatMessage, ChatState, Conversation, ConversationMember, PresenceEvent } from '../types/chat';
import { websocketService, type MessageReceivedPayload, type TypingPayload, type PresencePayload, type ConversationUpdatedPayload } from '../services/websocketService';

interface ChatContextType extends ChatState, ChatActions {}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const buildInitialState = (): ChatState => {
  // Récupérer l'ID de l'utilisateur connecté depuis le token Keycloak
  const currentUserId = (() => {
    try {
      const raw = sessionStorage.getItem('keycloak-token');
      if (!raw) return 'mock-user-123'; // fallback pour dev
      const parts = raw.split('.');
      if (parts.length < 2) return 'mock-user-123';
      const payload = JSON.parse(atob(parts[1]));
      return payload?.sub || 'mock-user-123';
    } catch {
      return 'mock-user-123';
    }
  })();

  const conversations: Record<string, Conversation> = {
    'conv-1': {
      id: 'conv-1',
      type: 'DM',
      title: 'Mme Diallo (Parent)',
      members: [
        { userId: currentUserId, role: 'enseignant' },
        { userId: 'parent-1', role: 'parent' },
      ],
      lastMessageAt: new Date().toISOString(),
      unreadCount: 2,
    },
    'conv-2': {
      id: 'conv-2',
      type: 'GROUP',
      title: 'Infos rentrée',
      members: [
        { userId: 'directeur-1', role: 'directeur' },
        { userId: currentUserId, role: 'enseignant' },
        { userId: 'parent-1', role: 'parent' },
      ],
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0,
    },
  };

  const messagesByConversation: Record<string, ChatMessage[]> = {
    'conv-1': [
      {
        id: 'm-1',
        conversationId: 'conv-1',
        senderId: 'parent-1',
        type: 'TEXT',
        content: "Pouvez-vous m'expliquer la note de l'évaluation ?",
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
      {
        id: 'm-2',
        conversationId: 'conv-1',
        senderId: currentUserId,
        type: 'TEXT',
        content: 'Oui, je vous détaille cela après le cours à 11h.',
        createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      },
    ],
    'conv-2': [
      {
        id: 'm-3',
        conversationId: 'conv-2',
        senderId: 'directeur-1',
        type: 'TEXT',
        content: 'Réunion parents-professeurs le 10 septembre à 10h.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
    ],
  };

  return {
    conversations,
    messagesByConversation,
    acksByMessage: {},
    typingByConversation: {},
    presenceByUser: {},
    wsStatus: 'disconnected',
  };
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ChatState>(buildInitialState());

  // Gestion des événements WebSocket
  useEffect(() => {
    const handleMessageReceived = (payload: unknown) => {
      const data = payload as MessageReceivedPayload;
      const message: ChatMessage = {
        id: data.message.id,
        conversationId: data.conversationId,
        senderId: data.message.senderId,
        type: data.message.type === 'text' ? 'TEXT' : data.message.type === 'image' ? 'IMAGE' : 'FILE',
        content: data.message.content,
        attachments: data.message.attachments,
        createdAt: data.message.createdAt,
      };

      setState(prev => ({
        ...prev,
        messagesByConversation: {
          ...prev.messagesByConversation,
          [data.conversationId]: [
            ...(prev.messagesByConversation[data.conversationId] || []),
            message,
          ],
        },
        conversations: {
          ...prev.conversations,
          [data.conversationId]: prev.conversations[data.conversationId] ? {
            ...prev.conversations[data.conversationId],
            lastMessageAt: data.message.createdAt,
            unreadCount: (prev.conversations[data.conversationId].unreadCount || 0) + 1,
          } : prev.conversations[data.conversationId],
        },
      }));
    };

    const handleTypingStart = (payload: unknown) => {
      const data = payload as TypingPayload;
      setState(prev => ({
        ...prev,
        typingByConversation: {
          ...prev.typingByConversation,
          [data.conversationId]: {
            ...(prev.typingByConversation[data.conversationId] || {}),
            [data.userId]: true,
          },
        },
      }));
    };

    const handleTypingStop = (payload: unknown) => {
      const data = payload as TypingPayload;
      setState(prev => ({
        ...prev,
        typingByConversation: {
          ...prev.typingByConversation,
          [data.conversationId]: {
            ...(prev.typingByConversation[data.conversationId] || {}),
            [data.userId]: false,
          },
        },
      }));
    };

    const handlePresenceUpdate = (payload: unknown) => {
      const data = payload as PresencePayload;
      const event: PresenceEvent = {
        userId: data.userId,
        status: data.status,
        lastSeenAt: data.lastSeen,
      };
      setState(prev => ({
        ...prev,
        presenceByUser: {
          ...prev.presenceByUser,
          [data.userId]: event,
        },
      }));
    };

    const handleConversationUpdated = (payload: unknown) => {
      const data = payload as ConversationUpdatedPayload;
      if (data.action === 'created' && data.conversation) {
        const conversation: Conversation = {
          id: data.conversation.id,
          type: data.conversation.type,
          title: data.conversation.title,
          members: data.conversation.members.map(member => ({
            userId: member.userId,
            role: member.role as ConversationMember['role'],
          })),
          lastMessageAt: data.conversation.lastMessageAt,
          unreadCount: data.conversation.unreadCount,
        };
        setState(prev => ({
          ...prev,
          conversations: {
            ...prev.conversations,
            [conversation.id]: conversation,
          },
        }));
      } else if (data.action === 'deleted') {
        setState(prev => {
          const remainingConversations = { ...prev.conversations };
          delete remainingConversations[data.conversationId];
          const remainingMessages = { ...prev.messagesByConversation };
          delete remainingMessages[data.conversationId];
          return {
            ...prev,
            conversations: remainingConversations,
            messagesByConversation: remainingMessages,
          };
        });
      }
    };

    // Enregistrer les listeners
    websocketService.on('message_received', handleMessageReceived);
    websocketService.on('typing_start', handleTypingStart);
    websocketService.on('typing_stop', handleTypingStop);
    websocketService.on('presence_update', handlePresenceUpdate);
    websocketService.on('conversation_updated', handleConversationUpdated);

    // Mettre à jour le statut de connexion
    const updateConnectionStatus = () => {
      const wsStatus = websocketService.isConnected() ? 'connected' : 'disconnected';
      setState(prev => ({ ...prev, wsStatus }));
    };

    // Vérifier le statut initial
    updateConnectionStatus();

    // Vérifier périodiquement le statut de connexion
    const statusInterval = setInterval(updateConnectionStatus, 1000);

    // Nettoyage
    return () => {
      websocketService.off('message_received', handleMessageReceived);
      websocketService.off('typing_start', handleTypingStart);
      websocketService.off('typing_stop', handleTypingStop);
      websocketService.off('presence_update', handlePresenceUpdate);
      websocketService.off('conversation_updated', handleConversationUpdated);
      clearInterval(statusInterval);
    };
  }, []);

  const joinConversation = useCallback((conversationId: string) => {
    // Préparer l'état local
    setState(prev => ({
      ...prev,
      typingByConversation: {
        ...prev.typingByConversation,
        [conversationId]: prev.typingByConversation[conversationId] || {},
      },
    }));

    // Envoyer l'événement via WebSocket si connecté
    if (websocketService.isConnected()) {
      websocketService.send('join_conversation', { conversationId });
    }
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    // Envoyer l'événement via WebSocket si connecté
    if (websocketService.isConnected()) {
      websocketService.send('leave_conversation', { conversationId });
    }
  }, []);

  const sendMessage = useCallback(async (draft: Omit<ChatMessage, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Créer le message local optimiste
    const id = `local-${Date.now()}`;
    const createdAt = new Date().toISOString();
    const message: ChatMessage = { 
      ...draft, 
      id, 
      createdAt,
      isOptimistic: true,
      sendingStatus: 'sending'
    };
    
    // Ajouter immédiatement à l'interface (UI optimiste)
    setState(prev => ({
      ...prev,
      messagesByConversation: {
        ...prev.messagesByConversation,
        [draft.conversationId]: [
          ...(prev.messagesByConversation[draft.conversationId] || []),
          message,
        ],
      },
    }));

    try {
      // Envoyer via WebSocket si connecté
      if (websocketService.isConnected()) {
        websocketService.send('send_message', {
          conversationId: draft.conversationId,
          content: draft.content,
          type: draft.type.toLowerCase(),
          attachments: draft.attachments,
          tempId: id, // Pour identifier le message local lors de la confirmation
        });
        
        // Marquer comme envoyé (optimiste)
        setState(prev => ({
          ...prev,
          messagesByConversation: {
            ...prev.messagesByConversation,
            [draft.conversationId]: prev.messagesByConversation[draft.conversationId]?.map(m => 
              m.id === id ? { ...m, sendingStatus: 'sent' as const } : m
            ) || [],
          },
        }));
      } else {
        // Pas de WebSocket, marquer comme échec
        setState(prev => ({
          ...prev,
          messagesByConversation: {
            ...prev.messagesByConversation,
            [draft.conversationId]: prev.messagesByConversation[draft.conversationId]?.map(m => 
              m.id === id ? { ...m, sendingStatus: 'failed' as const } : m
            ) || [],
          },
        }));
      }
    } catch (error) {
      console.error('[ChatContext] Erreur envoi message:', error);
      // Marquer comme échec en cas d'erreur
      setState(prev => ({
        ...prev,
        messagesByConversation: {
          ...prev.messagesByConversation,
          [draft.conversationId]: prev.messagesByConversation[draft.conversationId]?.map(m => 
            m.id === id ? { ...m, sendingStatus: 'failed' as const } : m
          ) || [],
        },
      }));
    }
  }, []);

  const markRead = useCallback((_conversationId: string, _messageIds: string[]) => {
    void _conversationId;
    void _messageIds;
    // Mocks: on pourrait ajuster unreadCount plus tard
  }, []);

  const setTyping = useCallback((conversationId: string, isTyping: boolean) => {
    const currentUserId = (() => {
      try {
        const raw = sessionStorage.getItem('keycloak-token');
        if (!raw) return 'mock-user-123';
        const parts = raw.split('.');
        if (parts.length < 2) return 'mock-user-123';
        const payload = JSON.parse(atob(parts[1]));
        return payload?.sub || 'mock-user-123';
      } catch {
        return 'mock-user-123';
      }
    })();
    
    // Mettre à jour l'état local
    setState(prev => ({
      ...prev,
      typingByConversation: {
        ...prev.typingByConversation,
        [conversationId]: { ...(prev.typingByConversation[conversationId] || {}), [currentUserId]: isTyping },
      },
    }));

    // Envoyer via WebSocket si connecté
    if (websocketService.isConnected()) {
      websocketService.sendTyping(conversationId, isTyping);
    }
  }, []);

  const setPresence = useCallback((userId: string, status: 'online' | 'offline' | 'away') => {
    const event: PresenceEvent = { userId, status, lastSeenAt: status === 'offline' ? new Date().toISOString() : undefined };
    setState(prev => ({
      ...prev,
      presenceByUser: { ...prev.presenceByUser, [userId]: event },
    }));

    // Envoyer via WebSocket si connecté (seulement pour notre propre statut)
    const currentUserId = (() => {
      try {
        const raw = sessionStorage.getItem('keycloak-token');
        if (!raw) return 'mock-user-123';
        const parts = raw.split('.');
        if (parts.length < 2) return 'mock-user-123';
        const payload = JSON.parse(atob(parts[1]));
        return payload?.sub || 'mock-user-123';
      } catch {
        return 'mock-user-123';
      }
    })();

    if (userId === currentUserId && websocketService.isConnected()) {
      websocketService.updatePresence(status);
    }
  }, []);

  const value = useMemo<ChatContextType>(() => ({
    ...state,
    joinConversation,
    leaveConversation,
    sendMessage,
    markRead,
    setTyping,
    setPresence,
  }), [state, joinConversation, leaveConversation, sendMessage, markRead, setTyping, setPresence]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};



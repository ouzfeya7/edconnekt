import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ChatActions, ChatMessage, ChatState, Conversation, PresenceEvent } from '../types/chat';

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

  const joinConversation = useCallback((conversationId: string) => {
    // Mocks: pas d'action réseau, prépare l'état si nécessaire
    setState(prev => ({
      ...prev,
      typingByConversation: {
        ...prev.typingByConversation,
        [conversationId]: prev.typingByConversation[conversationId] || {},
      },
    }));
  }, []);

  const leaveConversation = useCallback((_conversationId: string) => {
    void _conversationId;
    // Mocks: rien à faire pour l'instant
  }, []);

  const sendMessage = useCallback(async (draft: Omit<ChatMessage, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `local-${Date.now()}`;
    const createdAt = new Date().toISOString();
    const message: ChatMessage = { ...draft, id, createdAt };
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
    setState(prev => ({
      ...prev,
      typingByConversation: {
        ...prev.typingByConversation,
        [conversationId]: { ...(prev.typingByConversation[conversationId] || {}), [currentUserId]: isTyping },
      },
    }));
  }, []);

  const setPresence = useCallback((userId: string, status: 'online' | 'offline') => {
    const event: PresenceEvent = { userId, status, lastSeenAt: status === 'offline' ? new Date().toISOString() : undefined };
    setState(prev => ({
      ...prev,
      presenceByUser: { ...prev.presenceByUser, [userId]: event },
    }));
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



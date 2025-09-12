// Types de messagerie instantanée (frontend only, mocks)

export type ConversationType = 'DM' | 'GROUP';

export interface ConversationMember {
  userId: string;
  role: 'parent' | 'eleve' | 'enseignant' | 'admin' | 'directeur';
  lastReadAt?: string;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  title?: string;
  members: ConversationMember[];
  lastMessageAt?: string;
  unreadCount?: number;
}

export type MessageType = 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  type: MessageType;
  content: string;
  attachments?: Array<{
    id: string;
    filename: string;
    url: string;
    type: string;
  }>;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  // UI optimiste
  isOptimistic?: boolean;
  sendingStatus?: 'sending' | 'sent' | 'failed';
}

export type AckType = 'DELIVERED' | 'READ';

export interface MessageAck {
  messageId: string;
  userId: string;
  type: AckType;
  timestamp: string;
}

export interface TypingEvent {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

export interface PresenceEvent {
  userId: string;
  status: 'online' | 'offline' | 'away';
  lastSeenAt?: string;
}

export interface ChatState {
  conversations: Record<string, Conversation>;
  messagesByConversation: Record<string, ChatMessage[]>;
  acksByMessage: Record<string, MessageAck[]>;
  typingByConversation: Record<string, Record<string, boolean>>;
  presenceByUser: Record<string, PresenceEvent>;
  wsStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  error?: string;
}

export interface ChatActions {
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (draft: Omit<ChatMessage, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  markRead: (conversationId: string, messageIds: string[]) => void;
  setTyping: (conversationId: string, isTyping: boolean) => void;
  setPresence?: (userId: string, status: 'online' | 'offline' | 'away') => void;
}



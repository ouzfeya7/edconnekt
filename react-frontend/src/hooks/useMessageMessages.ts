import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { messagesApi } from '../api/message-service/client';
import type { MessageOut, MessageCreate, MessageEdit } from '../api/message-service/api';

function getErrorMessage(error: unknown): string {
  const maybeAxios = error as { response?: { data?: unknown } } | undefined;
  const data = maybeAxios?.response?.data as unknown;
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (typeof obj.message === 'string') return obj.message;
    if (typeof obj.msg === 'string') return obj.msg;
    if (typeof obj.detail === 'string') return obj.detail;
    if (Array.isArray(obj.detail) && obj.detail.length > 0) {
      const first = obj.detail[0] as Record<string, unknown>;
      if (typeof first.msg === 'string') return first.msg;
    }
  }
  if (error instanceof Error && error.message) return error.message;
  try { return JSON.stringify(error); } catch { return 'Une erreur est survenue'; }
}

const root = ['message-service', 'messages'] as const;

export function useConversationMessages(conversationId?: string, params?: { limit?: number; after?: string | null; before?: string | null }) {
  const limit = params?.limit ?? 50;
  const after = params?.after ?? null;
  const before = params?.before ?? null;
  return useQuery<MessageOut[], Error>({
    queryKey: [...root, conversationId, { limit, after, before }],
    enabled: Boolean(conversationId),
    queryFn: async () => {
      if (!conversationId) throw new Error('conversationId requis');
      try {
        const res = await messagesApi.listMessagesConversationsConversationIdMessagesGet(conversationId, limit, after, before);
        return res.data;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    staleTime: 30_000,
  });
}

export function useSendMessage(conversationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: MessageCreate) => {
      const res = await messagesApi.sendMessageConversationsConversationIdMessagesPost(conversationId, payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...root, conversationId] });
    },
    onError: (err: unknown) => {
      throw new Error(getErrorMessage(err));
    },
  });
}

export function useEditMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { messageId: string; payload: MessageEdit }) => {
      const res = await messagesApi.editMessageConversationsMessagesMessageIdEditPost(params.messageId, params.payload);
      return res.data;
    },
    onSuccess: (data) => {
      const convId = (data as unknown as { conversation_id?: string }).conversation_id;
      if (convId) qc.invalidateQueries({ queryKey: ['message-service','messages', convId] });
    },
    onError: (err: unknown) => { throw new Error(getErrorMessage(err)); },
  });
}

export function useDeleteMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { messageId: string }) => {
      const res = await messagesApi.deleteMessageConversationsMessagesMessageIdDeletePost(params.messageId);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate all message queries; backend ne renvoie pas le convId ici
      qc.invalidateQueries({ queryKey: ['message-service','messages'] });
    },
    onError: (err: unknown) => { throw new Error(getErrorMessage(err)); },
  });
}



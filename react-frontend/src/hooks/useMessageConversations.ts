import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { conversationsApi } from '../api/message-service/client';
import type { ConversationOut, ConversationCreate } from '../api/message-service/api';

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

const keyRoot = ['message-service', 'conversations'] as const;

export function useConversations() {
  return useQuery<ConversationOut[], Error>({
    queryKey: keyRoot,
    queryFn: async () => {
      try {
        const res = await conversationsApi.listConversationsConversationsGet();
        return res.data;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ConversationCreate) => {
      try {
        const res = await conversationsApi.createConversationConversationsPost(payload);
        return res.data;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keyRoot });
    },
  });
}



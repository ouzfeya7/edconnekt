import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { replacementsApi } from '../api/timetable-service/client';
import type { ReplacementCreate, ReplacementRead } from '../api/timetable-service/api';

export function useCreateReplacement() {
  const queryClient = useQueryClient();
  return useMutation<ReplacementRead, Error, ReplacementCreate>({
    mutationKey: ['replacement:create'],
    mutationFn: async (payload: ReplacementCreate) => {
      const res = await replacementsApi.createReplacementReplacementsPost(payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['replacements'] });
    },
  });
}

export function useDeleteReplacement() {
  const queryClient = useQueryClient();
  return useMutation<ReplacementRead, Error, string>({
    mutationKey: ['replacement:delete'],
    mutationFn: async (replacementId: string) => {
      const res = await replacementsApi.deleteReplacementReplacementsReplacementIdDelete(replacementId);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['replacements'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
}

export function useReplacements(params?: { skip?: number; limit?: number }) {
  const { skip = 0, limit = 100 } = params || {};
  return useQuery<ReplacementRead[], Error>({
    queryKey: ['replacements', { skip, limit }],
    queryFn: async () => {
      const res = await replacementsApi.listReplacementsReplacementsGet(skip, limit);
      return res.data;
    },
    staleTime: 30_000,
  });
}
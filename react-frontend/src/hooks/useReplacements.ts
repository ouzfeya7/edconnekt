import { useMutation, useQueryClient } from '@tanstack/react-query';
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



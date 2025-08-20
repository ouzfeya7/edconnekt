import { useQuery } from '@tanstack/react-query';
import { classesApi } from '../api/classe-service/client';
import type { ClasseHistoryOut } from '../api/classe-service/api';

export function useClasseHistory(classeId: string | undefined) {
  return useQuery<ClasseHistoryOut[], Error>({
    queryKey: ['classe-history', classeId],
    queryFn: async () => {
      if (!classeId) throw new Error('classeId requis');
      const { data } = await classesApi.getHistoryApiV1ClassesClasseIdHistoryGet(classeId);
      return data;
    },
    enabled: Boolean(classeId),
    retry: false,
    refetchOnWindowFocus: false,
  });
}



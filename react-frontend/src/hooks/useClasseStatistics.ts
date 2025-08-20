import { useQuery } from '@tanstack/react-query';
import { classesApi } from '../api/classe-service/client';
import type { StandardResponseClasseStatistics } from '../api/classe-service/api';

export function useClasseStatistics(classeId: string | undefined) {
  return useQuery<StandardResponseClasseStatistics, Error>({
    queryKey: ['classe-statistics', classeId],
    queryFn: async () => {
      if (!classeId) throw new Error('classeId requis');
      const { data } = await classesApi.getStatisticsApiV1ClassesClasseIdStatisticsGet(classeId);
      return data;
    },
    enabled: Boolean(classeId),
    retry: false,
    refetchOnWindowFocus: false,
  });
}



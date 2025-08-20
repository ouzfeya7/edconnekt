import { useQuery } from '@tanstack/react-query';
import { classesApi } from '../api/classe-service/client';
import type { ClasseOut } from '../api/classe-service/api';

export function useClasse(classeId: string | undefined) {
  return useQuery<ClasseOut, Error>({
    queryKey: ['classe', classeId],
    queryFn: async () => {
      if (!classeId) throw new Error('classeId requis');
      const { data } = await classesApi.getClasseApiV1ClassesClasseIdGet(classeId);
      return data;
    },
    enabled: Boolean(classeId),
    retry: false,
    refetchOnWindowFocus: false,
  });
}



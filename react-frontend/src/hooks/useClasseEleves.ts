import { useQuery } from '@tanstack/react-query';
import { classesApi } from '../api/classe-service/client';
import type { ClasseEleveOut } from '../api/classe-service/api';

export function useClasseEleves(classeId: string | undefined) {
  return useQuery<ClasseEleveOut[], Error>({
    queryKey: ['classe-eleves', classeId],
    queryFn: async () => {
      if (!classeId) throw new Error('classeId requis');
      const { data } = await classesApi.getElevesApiV1ClassesClasseIdElevesGet(classeId);
      return data;
    },
    enabled: Boolean(classeId),
    retry: false,
    refetchOnWindowFocus: false,
  });
}



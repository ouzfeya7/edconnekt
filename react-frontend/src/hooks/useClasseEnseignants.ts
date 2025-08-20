import { useQuery } from '@tanstack/react-query';
import { classesApi } from '../api/classe-service/client';
import type { ClasseEnseignantOut } from '../api/classe-service/api';

export function useClasseEnseignants(classeId: string | undefined) {
  return useQuery<ClasseEnseignantOut[], Error>({
    queryKey: ['classe-enseignants', classeId],
    queryFn: async () => {
      if (!classeId) throw new Error('classeId requis');
      const { data } = await classesApi.getEnseignantsApiV1ClassesClasseIdEnseignantsGet(classeId);
      return data;
    },
    enabled: Boolean(classeId),
    retry: false,
    refetchOnWindowFocus: false,
  });
}



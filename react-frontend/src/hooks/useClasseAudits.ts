import { useQuery } from '@tanstack/react-query';
import { classesApi } from '../api/classe-service/client';
import type { ClasseAuditOut } from '../api/classe-service/api';

export function useClasseAudits(classeId: string | undefined) {
  return useQuery<ClasseAuditOut[], Error>({
    queryKey: ['classe-audits', classeId],
    queryFn: async () => {
      if (!classeId) throw new Error('classeId requis');
      const { data } = await classesApi.getAuditsApiV1ClassesClasseIdAuditsGet(classeId);
      return data;
    },
    enabled: Boolean(classeId),
    retry: false,
    refetchOnWindowFocus: false,
  });
}



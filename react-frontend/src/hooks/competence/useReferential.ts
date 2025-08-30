import { useQuery } from '@tanstack/react-query';
import { competenceReferentialsApi } from '../../api/competence-service/client';
import type { ResponseGetReferentialApiCompetenceReferentialsReferentialIdGet } from '../../api/competence-service/api';

export function useReferential(params: { referentialId?: string; versionNumber?: number | null; includeTree?: boolean }) {
  const { referentialId, versionNumber = null, includeTree = false } = params;

  return useQuery<ResponseGetReferentialApiCompetenceReferentialsReferentialIdGet, Error>({
    queryKey: ['competence:referential', { referentialId, versionNumber, includeTree }],
    enabled: Boolean(referentialId),
    queryFn: async () => {
      if (!referentialId) throw new Error('referentialId requis');
      const { data } = await competenceReferentialsApi.getReferentialApiCompetenceReferentialsReferentialIdGet(
        referentialId,
        versionNumber,
        includeTree
      );
      return data;
    },
    staleTime: 60_000,
  });
}



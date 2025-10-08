import { useQuery } from '@tanstack/react-query';
import { competencePublicApi } from '../../api/competence-service/client';
import type { ReferentialTree } from '../../api/competence-service/api';

export function usePublicReferentialTree(referentialId: string, version: number) {
  return useQuery<ReferentialTree, Error>({
    queryKey: ['competence:public-referential:tree', { referentialId, version }],
    queryFn: async () => {
      const { data } = await competencePublicApi.getReferentialTreeApiCompetencePublicReferentialsReferentialIdTreeGet(referentialId, version);
      return data;
    },
    enabled: !!referentialId && (version !== undefined && version !== null),
    staleTime: 60_000,
  });
}

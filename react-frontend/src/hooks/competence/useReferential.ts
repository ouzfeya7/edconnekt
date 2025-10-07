import { useQuery } from '@tanstack/react-query';
import { competenceReferentialsApi } from '../../api/competence-service/client';
import type { ReferentialResponse, ReferentialTree } from '../../api/competence-service/api';

export function useReferential(params: { referentialId?: string; versionNumber?: number | null; includeTree?: boolean }) {
  const { referentialId, versionNumber = null, includeTree = false } = params;

  return useQuery<ReferentialResponse | ReferentialTree, Error>({
    queryKey: ['competence:referential', { referentialId, versionNumber, includeTree }],
    enabled: Boolean(referentialId),
    queryFn: async () => {
      if (!referentialId) throw new Error('referentialId requis');
      const { data } = await competenceReferentialsApi.getReferentialApiCompetenceReferentialsReferentialIdGet(
        referentialId,
        versionNumber ?? undefined,
        includeTree
      );
      // Nouveau type spécifique renvoyé par l'API -> on caste vers l'union attendue par les appels existants
      return data as unknown as ReferentialResponse | ReferentialTree;
    },
    staleTime: 60_000,
  });
}



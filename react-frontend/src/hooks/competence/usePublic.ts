import { useQuery } from '@tanstack/react-query';
import { competencePublicApi } from '../../api/competence-service/client';
import type { ReferentialTree, CompetencyResponse } from '../../api/competence-service/api';

export function usePublicReferentialTree(params: { referentialId?: string; version?: number }) {
  const { referentialId, version } = params;
  return useQuery<ReferentialTree, Error>({
    queryKey: ['competence:public:tree', { referentialId, version }],
    enabled: Boolean(referentialId) && (typeof version === 'number'),
    queryFn: async () => {
      if (!referentialId || typeof version !== 'number') throw new Error('referentialId et version requis');
      const { data } = await competencePublicApi.getReferentialTreeApiCompetencePublicReferentialsReferentialIdTreeGet(referentialId, version);
      return data;
    },
    staleTime: 60_000,
  });
}

export function useLookupCompetencyByCode(params: { code?: string; referentialId?: string | null; version?: number | null }) {
  const { code, referentialId = null, version = null } = params;
  return useQuery<CompetencyResponse, Error>({
    queryKey: ['competence:public:lookup', { code, referentialId, version }],
    enabled: Boolean(code),
    queryFn: async () => {
      if (!code) throw new Error('code requis');
      const { data } = await competencePublicApi.lookupCompetencyByCodeApiCompetencePublicCompetenciesByCodeCodeGet(code, referentialId ?? undefined, version ?? undefined);
      return data;
    },
    staleTime: 60_000,
  });
}



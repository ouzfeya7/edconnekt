import { useQuery } from '@tanstack/react-query';
import { competenceReferentialsApi } from '../../api/competence-service/client';
import type { GlobalReferentialListResponse } from '../../api/competence-service/api';

export interface UseGlobalReferentialsParams {
  page?: number;
  size?: number;
  cycle?: string | null;
  q?: string | null;
}

export function useGlobalReferentials(params: UseGlobalReferentialsParams = {}) {
  const { page = 1, size = 20, cycle = null, q = null } = params;

  return useQuery<GlobalReferentialListResponse, Error>({
    queryKey: ['competence:global-referentials', { page, size, cycle, q }],
    queryFn: async () => {
      const { data } = await competenceReferentialsApi.listGlobalReferentialsApiCompetenceGlobalReferentialsGet(
        page,
        size,
        cycle ?? undefined,
        q ?? undefined
      );
      return data;
    },
    staleTime: 60_000,
  });
}

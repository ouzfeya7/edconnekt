import { useQuery } from '@tanstack/react-query';
import { competenceReferentialsApi } from '../../api/competence-service/client';
import type { ReferentialListResponse } from '../../api/competence-service/api';

export interface UseReferentialsParams {
  page?: number;
  size?: number;
  cycle?: string | null;
  state?: string | null;
  visibility?: string | null;
  q?: string | null;
}

export function useReferentials(params: UseReferentialsParams = {}) {
  const { page = 1, size = 20, cycle = null, state = null, visibility = null, q = null } = params;

  return useQuery<ReferentialListResponse, Error>({
    queryKey: ['competence:referentials', { page, size, cycle, state, visibility, q }],
    queryFn: async () => {
      const { data } = await competenceReferentialsApi.listReferentialsApiCompetenceReferentialsGet(
        page,
        size,
        cycle,
        state,
        visibility,
        q
      );
      return data;
    },
    placeholderData: (prev: ReferentialListResponse | undefined) => prev,
    staleTime: 60_000,
  });
}



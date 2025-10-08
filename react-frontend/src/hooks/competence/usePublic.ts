import { useQuery } from '@tanstack/react-query';
import { competenceReferentialsApi } from '../../api/competence-service/client';
import type { GlobalReferentialListResponse } from '../../api/competence-service/api';

export function useGlobalReferentials(page: number = 1, size: number = 20, cycle?: string, q?: string) {
  return useQuery<GlobalReferentialListResponse, Error>({
    queryKey: ['competence:global-referentials', { page, size, cycle, q }],
    queryFn: async () => {
      const { data } = await competenceReferentialsApi.listGlobalReferentialsApiCompetenceGlobalReferentialsGet(
        page,
        size,
        cycle,
        q
      );
      return data;
    },
    staleTime: 60_000,
  });
}

// Outbox events hook déplacé vers useEvents.ts pour éviter les duplications.



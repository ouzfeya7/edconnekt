import { useQuery } from '@tanstack/react-query';
import { competenceReferentialsApi, competenceEventsApi } from '../../api/competence-service/client';
import type { GlobalReferentialListResponse, OutboxEventResponse } from '../../api/competence-service/api';

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

export function useOutboxEvents(page: number = 1, size: number = 20) {
  return useQuery<OutboxEventResponse[], Error>({
    queryKey: ['competence:outbox-events', { page, size }],
    queryFn: async () => {
      const { data } = await competenceEventsApi.listOutboxEventsApiCompetenceEventsEventsGet(page.toString(), size.toString());
      return data;
    },
    staleTime: 30_000, // Plus court car les événements changent fréquemment
  });
}



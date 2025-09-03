import { useQuery } from '@tanstack/react-query';
import { competenceReferentialsApi, competenceEventsApi } from '../../api/competence-service/client';
import type { ReferentialTree, OutboxEventResponse } from '../../api/competence-service/api';

export function usePublicReferentialTree(referentialId: string) {
  return useQuery<ReferentialTree, Error>({
    queryKey: ['competence:public-referential:tree', { referentialId }],
    queryFn: async () => {
      const { data } = await competenceReferentialsApi.getReferentialTreeApiCompetencePublicReferentialsReferentialIdTreeGet(referentialId);
      return data;
    },
    enabled: !!referentialId,
    staleTime: 60_000,
  });
}

export function useOutboxEvents(page: number = 1, size: number = 20) {
  return useQuery<OutboxEventResponse, Error>({
    queryKey: ['competence:outbox-events', { page, size }],
    queryFn: async () => {
      const { data } = await competenceEventsApi.listOutboxEventsApiCompetenceEventsEventsOutboxGet(page, size);
      return data;
    },
    staleTime: 30_000, // Plus court car les événements changent fréquemment
  });
}

import { useQuery } from '@tanstack/react-query';
import { competencePublicApi, competenceEventsApi } from '../../api/competence-service/client';
import type { ReferentialTree, OutboxEventResponse } from '../../api/competence-service/api';

export function usePublicReferentialTree(referentialId: string, version: number) {
  return useQuery<ReferentialTree, Error>({
    queryKey: ['competence:public-referential:tree', { referentialId, version }],
    queryFn: async () => {
      const { data } = await competencePublicApi.getReferentialTreeApiV1PublicReferentialsReferentialIdTreeGet(referentialId, version);
      return data;
    },
    enabled: !!referentialId && (version !== undefined && version !== null),
    staleTime: 60_000,
  });
}

export function useOutboxEvents(page: number = 1, size: number = 20) {
  return useQuery<OutboxEventResponse[], Error>({
    queryKey: ['competence:outbox-events', { page, size }],
    queryFn: async () => {
      const { data } = await competenceEventsApi.listOutboxEventsApiV1EventsEventsGet(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        page,
        size
      );
      return data;
    },
    staleTime: 30_000, // Plus court car les événements changent fréquemment
  });
}

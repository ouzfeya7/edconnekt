import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { competenceEventsApi } from '../../api/competence-service/client';
import { competenceAxios } from '../../api/competence-service/http';
import type { OutboxEventResponse } from '../../api/competence-service/api';

export function useReplayOutboxEvents() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['competence:events:replay'],
    mutationFn: async () => {
      const { data } = await competenceEventsApi.replayEventsApiCompetenceEventsEventsReplayPost();
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competence:outbox-events'] });
    },
  });
}

export function useOutboxEvents(params: {
  page?: number;
  size?: number;
  eventType?: string | null;
  aggregateType?: string | null;
  aggregateId?: string | null;
  status?: string | null;
  startDate?: string | null;
  endDate?: string | null;
} = {}) {
  const { page = 1, size = 20, eventType = undefined, aggregateType = undefined, aggregateId = undefined, status = undefined, startDate = undefined, endDate = undefined } = params;
  return useQuery<OutboxEventResponse[], Error>({
    queryKey: ['competence:outbox-events', { page, size, eventType, aggregateType, aggregateId, status, startDate, endDate }],
    queryFn: async () => {
      const { data } = await competenceEventsApi.listOutboxEventsApiCompetenceEventsEventsGet(
        eventType,
        aggregateType,
        aggregateId,
        status,
        startDate,
        endDate,
        page,
        size
      );
      return data;
    },
    staleTime: 30_000,
  });
}

export function useDebugHeaders() {
  return useMutation<Record<string, unknown>>({
    mutationKey: ['competence:debug:headers'],
    mutationFn: async () => {
      const { data } = await competenceAxios.get('/debug/headers');
      return data as Record<string, unknown>;
    },
  });
}

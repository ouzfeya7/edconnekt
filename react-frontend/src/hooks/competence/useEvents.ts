import { useMutation, useQueryClient } from '@tanstack/react-query';
import { competenceEventsApi } from '../../api/competence-service/client';

export function useReplayOutboxEvents() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['competence:events:replay'],
    mutationFn: async () => {
      const { data } = await competenceEventsApi.replayEventsApiV1EventsEventsReplayPost();
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['competence:outbox-events'] });
    },
  });
}

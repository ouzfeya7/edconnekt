import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '../api/event-service/client';

export type EventParticipant = Record<string, unknown>;

export function useEventParticipants(eventId?: string) {
  return useQuery<EventParticipant[], Error>({
    queryKey: ['event-service', 'events', eventId, 'participants'],
    enabled: Boolean(eventId),
    queryFn: async () => {
      if (!eventId) return [];
      const { data } = await eventsApi.getParticipantsApiV1EventsEventIdParticipantsGet(eventId);
      // L'API ne spécifie pas de type strict pour participant: on retourne tel quel (array d'objets)
      return (data as unknown as EventParticipant[]) ?? [];
    },
    staleTime: 60_000,
  });
}

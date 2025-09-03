import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '../api/event-service/client';
import type { EventOut } from '../api/event-service/api';

function getErrorMessage(error: unknown): string {
  // Essayez d'extraire un message utile depuis une erreur Axios ou générique
  const maybeAxios = error as { response?: { data?: unknown } } | undefined;
  const data = maybeAxios?.response?.data as unknown;
  if (data && typeof data === 'object') {
    const anyData = data as Record<string, unknown>;
    if (typeof anyData.message === 'string') return anyData.message;
    if (typeof anyData.msg === 'string') return anyData.msg;
    if (typeof anyData.detail === 'string') return anyData.detail;
    if (Array.isArray(anyData.detail) && anyData.detail.length > 0) {
      const first = anyData.detail[0] as Record<string, unknown>;
      if (typeof first.msg === 'string') return first.msg;
    }
  }
  if (error instanceof Error && error.message) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return 'Une erreur est survenue';
  }
}

export function useEvents(params?: {
  page?: number;
  size?: number;
  category?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}) {
  const page = params?.page ?? 1;
  const size = params?.size ?? 20;
  const category = params?.category ?? null;
  const startDate = params?.startDate ?? null;
  const endDate = params?.endDate ?? null;

  return useQuery<unknown, Error>({
    queryKey: ['event-service', 'events', { page, size, category, startDate, endDate }],
    queryFn: async () => {
      try {
        const res = await eventsApi.listEventsApiV1EventsGet(page, size, category, startDate, endDate);
        return res.data;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useEvent(eventId?: string) {
  return useQuery<EventOut, Error>({
    queryKey: ['event-service', 'events', eventId],
    enabled: Boolean(eventId),
    queryFn: async () => {
      if (!eventId) throw new Error('eventId requis');
      try {
        const res = await eventsApi.getEventByIdApiV1EventsEventIdGet(eventId);
        return res.data;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    staleTime: 60_000,
  });
}



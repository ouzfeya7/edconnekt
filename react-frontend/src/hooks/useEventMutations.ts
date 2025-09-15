import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '../api/event-service/client';
import type { EventCreate, EventOut, EventUpdate, RegistrationRequest, RegistrationResponse } from '../api/event-service/api';

function getErrorMessage(error: unknown): string {
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

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation<EventOut, Error, EventCreate>({
    mutationFn: async (payload: EventCreate) => {
      // Normaliser les dates: s'assurer qu'elles incluent un fuseau horaire (ISO 8601)
      const normalize = (value?: string | null): string | undefined => {
        if (!value) return undefined;
        // Si la chaîne contient déjà un indicateur de fuseau (Z ou +HH:MM / -HH:MM), garder tel quel
        const hasTz = /Z$|[+-]\d{2}:?\d{2}$/.test(value);
        if (hasTz) return value;
        // Sinon, interpréter comme heure locale et retourner en ISO (UTC avec Z)
        const date = new Date(value);
        const iso = date.toISOString();
        return iso;
      };

      const payloadToSend: EventCreate = {
        ...payload,
        start_time: normalize(payload.start_time) as string,
        end_time: normalize(payload.end_time) as string,
      };
      try {
        const { data } = await eventsApi.createEventApiV1EventsPost(payloadToSend);
        return data;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['event-service', 'events'] });
    },
  });
}

export function useUpdateEvent(eventId?: string) {
  const queryClient = useQueryClient();
  return useMutation<EventOut, Error, EventUpdate>({
    mutationFn: async (payload: EventUpdate) => {
      if (!eventId) throw new Error('eventId requis');
      const normalize = (value?: string | null): string | undefined => {
        if (!value) return undefined;
        const hasTz = /Z$|[+-]\d{2}:?\d{2}$/.test(value);
        if (hasTz) return value;
        const date = new Date(value);
        return date.toISOString();
      };
      const payloadToSend: EventUpdate = {
        ...payload,
        start_time: normalize(payload.start_time) as string | null | undefined,
        end_time: normalize(payload.end_time) as string | null | undefined,
      };
      try {
        const { data } = await eventsApi.updateEventApiV1EventsEventIdPatch(eventId, payloadToSend);
        return data;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['event-service', 'events'] });
      if (eventId) void queryClient.invalidateQueries({ queryKey: ['event-service', 'events', eventId] });
    },
  });
}

export function usePublishEvent(eventId?: string) {
  const queryClient = useQueryClient();
  return useMutation<EventOut, Error, void>({
    mutationFn: async () => {
      if (!eventId) throw new Error('eventId requis');
      try {
        const { data } = await eventsApi.publishEventApiV1EventsEventIdPublishPost(eventId);
        return data;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['event-service', 'events'] });
      if (eventId) void queryClient.invalidateQueries({ queryKey: ['event-service', 'events', eventId] });
    },
  });
}

// Variante: publier en passant l'ID au moment de l'appel
export function usePublishEventById() {
  const queryClient = useQueryClient();
  return useMutation<EventOut, Error, string>({
    mutationFn: async (eventId: string) => {
      if (!eventId) throw new Error('eventId requis');
      try {
        const { data } = await eventsApi.publishEventApiV1EventsEventIdPublishPost(eventId);
        return data;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    onSuccess: (_data, eventId) => {
      void queryClient.invalidateQueries({ queryKey: ['event-service', 'events'] });
      void queryClient.invalidateQueries({ queryKey: ['event-service', 'events', eventId] });
    },
  });
}

export function useRegisterToEvent(eventId?: string) {
  const queryClient = useQueryClient();
  return useMutation<RegistrationResponse, Error, RegistrationRequest>({
    mutationFn: async (payload: RegistrationRequest) => {
      if (!eventId) throw new Error('eventId requis');
      try {
        const { data } = await eventsApi.registerParticipantApiV1EventsEventIdRegisterPost(eventId, payload);
        return data;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['event-service', 'events'] });
      if (eventId) void queryClient.invalidateQueries({ queryKey: ['event-service', 'events', eventId] });
    },
  });
}

export function useCancelRegistration(eventId?: string) {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { registrationId: string }>({
    mutationFn: async ({ registrationId }) => {
      if (!eventId) throw new Error('eventId requis');
      try {
        const { data } = await eventsApi.cancelRegistrationApiV1EventsEventIdRegisterRegistrationIdDelete(eventId, registrationId);
        return data;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['event-service', 'events'] });
      if (eventId) void queryClient.invalidateQueries({ queryKey: ['event-service', 'events', eventId] });
    },
  });
}

// Export d'assistance pour lister/rafraîchir
export const invalidateEventsListKey = ['event-service', 'events'] as const;



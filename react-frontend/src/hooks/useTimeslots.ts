import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timeslotsApi } from '../api/timetable-service/client';
import type { TimeslotRead, TimeslotCreate, TimeslotUpdate } from '../api/timetable-service/api';

export function useTimeslots(params?: { skip?: number; limit?: number; establishmentId?: string | null }) {
  const { skip = 0, limit = 100, establishmentId } = params || {};

  return useQuery<TimeslotRead[], Error>({
    queryKey: ['timeslots', { skip, limit, establishmentId }],
    queryFn: async () => {
      const res = await timeslotsApi.listTimeslotsTimeslotsGet(skip, limit, establishmentId ?? undefined);
      return res.data;
    },
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useCreateTimeslot() {
  const queryClient = useQueryClient();
  return useMutation<TimeslotRead, Error, TimeslotCreate>({
    mutationKey: ['timeslot:create'],
    mutationFn: async (payload: TimeslotCreate) => {
      const res = await timeslotsApi.createTimeslotTimeslotsPost(payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeslots'] });
    },
  });
}

export function useTimeslot(timeslotId?: string) {
  return useQuery<TimeslotRead, Error>({
    queryKey: ['timeslot', timeslotId],
    enabled: Boolean(timeslotId),
    queryFn: async () => {
      const res = await timeslotsApi.getTimeslotTimeslotsTimeslotIdGet(timeslotId as string);
      return res.data;
    },
    staleTime: 60_000,
  });
}

export function useUpdateTimeslot() {
  const queryClient = useQueryClient();
  return useMutation<TimeslotRead, Error, { timeslotId: string; update: TimeslotUpdate }>({
    mutationKey: ['timeslot:update'],
    mutationFn: async ({ timeslotId, update }) => {
      const res = await timeslotsApi.updateTimeslotTimeslotsTimeslotIdPatch(timeslotId, update);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['timeslots'] });
      queryClient.invalidateQueries({ queryKey: ['timeslot', variables.timeslotId] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
}

export function useDeleteTimeslot() {
  const queryClient = useQueryClient();
  return useMutation<TimeslotRead, Error, string>({
    mutationKey: ['timeslot:delete'],
    mutationFn: async (timeslotId: string) => {
      const res = await timeslotsApi.deleteTimeslotTimeslotsTimeslotIdDelete(timeslotId);
      return res.data;
    },
    onSuccess: (_data, timeslotId) => {
      queryClient.invalidateQueries({ queryKey: ['timeslots'] });
      queryClient.invalidateQueries({ queryKey: ['timeslot', timeslotId] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
}



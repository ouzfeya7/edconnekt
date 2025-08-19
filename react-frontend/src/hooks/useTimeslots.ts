import { useQuery } from '@tanstack/react-query';
import { timeslotsApi } from '../api/timetable-service/client';
import type { TimeslotRead } from '../api/timetable-service/api';

export function useTimeslots(params?: { skip?: number; limit?: number }) {
  const { skip = 0, limit = 100 } = params || {};

  return useQuery<TimeslotRead[], Error>({
    queryKey: ['timeslots', { skip, limit }],
    queryFn: async () => {
      const res = await timeslotsApi.listTimeslotsTimeslotsGet(skip, limit);
      return res.data;
    },
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}



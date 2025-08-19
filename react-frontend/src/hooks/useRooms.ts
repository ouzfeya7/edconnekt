import { useQuery } from '@tanstack/react-query';
import { roomsApi } from '../api/timetable-service/client';
import type { RoomRead } from '../api/timetable-service/api';

export function useRooms(params?: { skip?: number; limit?: number }) {
  const { skip = 0, limit = 100 } = params || {};

  return useQuery<RoomRead[], Error>({
    queryKey: ['rooms', { skip, limit }],
    queryFn: async () => {
      const res = await roomsApi.listRoomsRoomsGet(skip, limit);
      return res.data;
    },
    staleTime: 60_000,
  });
}



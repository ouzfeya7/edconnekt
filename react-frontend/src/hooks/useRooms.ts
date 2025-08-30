import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomsApi } from '../api/timetable-service/client';
import type { RoomRead, RoomCreate } from '../api/timetable-service/api';

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

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation<RoomRead, Error, RoomCreate>({
    mutationKey: ['room:create'],
    mutationFn: async (payload: RoomCreate) => {
      const res = await roomsApi.createRoomRoomsPost(payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
}

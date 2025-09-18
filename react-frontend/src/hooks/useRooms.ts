import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomsApi } from '../api/timetable-service/client';
import type { RoomRead, RoomCreate, RoomUpdate } from '../api/timetable-service/api';

export function useRooms(params?: { skip?: number; limit?: number; establishmentId?: string | null }) {
  const { skip = 0, limit = 100, establishmentId } = params || {};

  return useQuery<RoomRead[], Error>({
    queryKey: ['rooms', { skip, limit, establishmentId }],
    queryFn: async () => {
      const res = await roomsApi.listRoomsRoomsGet(skip, limit, establishmentId ?? undefined);
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

export function useRoom(roomId?: string) {
  return useQuery<RoomRead, Error>({
    queryKey: ['room', roomId],
    enabled: Boolean(roomId),
    queryFn: async () => {
      const res = await roomsApi.getRoomRoomsRoomIdGet(roomId as string);
      return res.data;
    },
    staleTime: 60_000,
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();
  return useMutation<RoomRead, Error, { roomId: string; update: RoomUpdate }>({
    mutationKey: ['room:update'],
    mutationFn: async ({ roomId, update }) => {
      const res = await roomsApi.updateRoomRoomsRoomIdPatch(roomId, update);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room', variables.roomId] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();
  return useMutation<RoomRead, Error, string>({
    mutationKey: ['room:delete'],
    mutationFn: async (roomId: string) => {
      const res = await roomsApi.deleteRoomRoomsRoomIdDelete(roomId);
      return res.data;
    },
    onSuccess: (_data, roomId) => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room', roomId] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { etablissementsApi } from '../api/establishment-service/client';
import type { RoomCreate, RoomOut, RoomUpdate } from '../api/establishment-service/api';

export function useRoomsByBuilding(params: { establishmentId?: string; buildingId?: string; page?: number; size?: number; q?: string | null; orderBy?: string; orderDir?: string }) {
  const { establishmentId, buildingId, page = 1, size = 10, q = null, orderBy = 'created_at', orderDir = 'desc' } = params;
  return useQuery<{ items: RoomOut[]; total: number; page: number; size: number; pages: number; has_next: boolean; has_prev: boolean } | undefined, Error>({
    queryKey: ['rooms:establishment', { establishmentId, buildingId, page, size, q, orderBy, orderDir }],
    enabled: Boolean(establishmentId && buildingId),
    queryFn: async () => {
      if (!establishmentId || !buildingId) return undefined;
      const { data } = await etablissementsApi.listRoomsApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesGet(
        establishmentId,
        buildingId,
        page,
        size,
        q,
        orderBy,
        orderDir
      );
      return data as unknown as { items: RoomOut[]; total: number; page: number; size: number; pages: number; has_next: boolean; has_prev: boolean };
    },
  });
}

export function useRoom(establishmentId?: string, buildingId?: string, roomId?: string) {
  return useQuery<RoomOut, Error>({
    queryKey: ['room:establishment', { establishmentId, buildingId, roomId }],
    enabled: Boolean(establishmentId && buildingId && roomId),
    queryFn: async () => {
      const { data } = await etablissementsApi.getRoomApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesRoomIdGet(
        establishmentId as string,
        buildingId as string,
        roomId as string
      );
      return data as RoomOut;
    },
  });
}

export function useCreateRoomEstablishment() {
  const queryClient = useQueryClient();
  return useMutation<RoomOut, Error, { establishmentId: string; buildingId: string; payload: RoomCreate }>({
    mutationKey: ['room:create:establishment'],
    mutationFn: async ({ establishmentId, buildingId, payload }) => {
      const { data } = await etablissementsApi.createRoomApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesPost(
        establishmentId,
        buildingId,
        payload
      );
      return data as RoomOut;
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['rooms:establishment', { establishmentId: vars.establishmentId, buildingId: vars.buildingId }] });
    },
  });
}

export function useUpdateRoomEstablishment() {
  const queryClient = useQueryClient();
  return useMutation<RoomOut, Error, { establishmentId: string; buildingId: string; roomId: string; update: RoomUpdate }>({
    mutationKey: ['room:update:establishment'],
    mutationFn: async ({ establishmentId, buildingId, roomId, update }) => {
      const { data } = await etablissementsApi.updateRoomApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesRoomIdPatch(
        establishmentId,
        buildingId,
        roomId,
        update
      );
      return data as RoomOut;
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['room:establishment', { establishmentId: vars.establishmentId, buildingId: vars.buildingId, roomId: vars.roomId }] });
      queryClient.invalidateQueries({ queryKey: ['rooms:establishment', { establishmentId: vars.establishmentId, buildingId: vars.buildingId }] });
    },
  });
}

export function useDeleteRoomEstablishment() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { establishmentId: string; buildingId: string; roomId: string }>({
    mutationKey: ['room:delete:establishment'],
    mutationFn: async ({ establishmentId, buildingId, roomId }) => {
      await etablissementsApi.deleteRoomApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesRoomIdDelete(
        establishmentId,
        buildingId,
        roomId
      );
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['rooms:establishment', { establishmentId: vars.establishmentId, buildingId: vars.buildingId }] });
    },
  });
}



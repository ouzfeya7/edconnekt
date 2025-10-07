import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { etablissementsApi } from '../api/establishment-service/client';
import type { BuildingCreate, BuildingOut, BuildingUpdate } from '../api/establishment-service/api';

export function useBuildings(params: { establishmentId?: string; page?: number; size?: number; q?: string | null; orderBy?: string; orderDir?: string }) {
  const { establishmentId, page = 1, size = 10, q = null, orderBy = 'created_at', orderDir = 'desc' } = params;
  return useQuery<{ items: BuildingOut[]; total: number; page: number; size: number; pages: number; has_next: boolean; has_prev: boolean } | undefined, Error>({
    queryKey: ['buildings', { establishmentId, page, size, q, orderBy, orderDir }],
    enabled: Boolean(establishmentId),
    queryFn: async () => {
      if (!establishmentId) return undefined;
      const { data } = await etablissementsApi.listBuildingsApiEtablissementsEstablishmentIdBatimentsGet(
        establishmentId,
        page,
        size,
        q,
        orderBy,
        orderDir
      );
      return data as unknown as { items: BuildingOut[]; total: number; page: number; size: number; pages: number; has_next: boolean; has_prev: boolean };
    },
  });
}

export function useBuilding(establishmentId?: string, buildingId?: string) {
  return useQuery<BuildingOut, Error>({
    queryKey: ['building', { establishmentId, buildingId }],
    enabled: Boolean(establishmentId && buildingId),
    queryFn: async () => {
      const { data } = await etablissementsApi.getBuildingApiEtablissementsEstablishmentIdBatimentsBuildingIdGet(establishmentId as string, buildingId as string);
      return data as BuildingOut;
    },
  });
}

export function useCreateBuilding() {
  const queryClient = useQueryClient();
  return useMutation<BuildingOut, Error, { establishmentId: string; payload: BuildingCreate }>({
    mutationKey: ['building:create'],
    mutationFn: async ({ establishmentId, payload }) => {
      const { data } = await etablissementsApi.createBuildingApiEtablissementsEstablishmentIdBatimentsPost(establishmentId, payload);
      return data as BuildingOut;
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['buildings', { establishmentId: vars.establishmentId }] });
    },
  });
}

export function useUpdateBuilding() {
  const queryClient = useQueryClient();
  return useMutation<BuildingOut, Error, { establishmentId: string; buildingId: string; update: BuildingUpdate }>({
    mutationKey: ['building:update'],
    mutationFn: async ({ establishmentId, buildingId, update }) => {
      const { data } = await etablissementsApi.updateBuildingApiEtablissementsEstablishmentIdBatimentsBuildingIdPatch(establishmentId, buildingId, update);
      return data as BuildingOut;
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['building', { establishmentId: vars.establishmentId, buildingId: vars.buildingId }] });
      queryClient.invalidateQueries({ queryKey: ['buildings', { establishmentId: vars.establishmentId }] });
    },
  });
}

export function useDeleteBuilding() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { establishmentId: string; buildingId: string }>({
    mutationKey: ['building:delete'],
    mutationFn: async ({ establishmentId, buildingId }) => {
      await etablissementsApi.deleteBuildingApiEtablissementsEstablishmentIdBatimentsBuildingIdDelete(establishmentId, buildingId);
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['buildings', { establishmentId: vars.establishmentId }] });
    },
  });
}



import { useQuery } from '@tanstack/react-query';
import { etablissementsApi } from '../api/establishment-service/client';
import type { BuildingListResponse, RoomListResponse, RoomOut } from '../api/establishment-service/api';

export function useAllRoomsForEstablishment(establishmentId?: string) {
  return useQuery<RoomOut[] | undefined, Error>({
    queryKey: ['rooms:all-by-establishment', establishmentId],
    enabled: Boolean(establishmentId),
    queryFn: async () => {
      if (!establishmentId) return undefined;

      // 1) Charger les bâtiments (page unique taille 100)
      const buildingsRes = await etablissementsApi.listBuildingsApiEtablissementsEstablishmentIdBatimentsGet(
        establishmentId,
        1,
        100,
        null,
        'created_at',
        'desc'
      );
      const buildings = (buildingsRes.data as unknown as BuildingListResponse | undefined)?.items || [];

      // 2) Pour chaque bâtiment, charger les salles (page unique taille 100)
      const allRooms: RoomOut[] = [];
      for (const b of buildings) {
        const roomsRes = await etablissementsApi.listRoomsApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesGet(
          establishmentId,
          b.id as string,
          1,
          100,
          null,
          'created_at',
          'desc'
        );
        const rooms = (roomsRes.data as unknown as RoomListResponse | undefined)?.items || [];
        allRooms.push(...rooms);
      }

      return allRooms;
    },
    staleTime: 60_000,
  });
}



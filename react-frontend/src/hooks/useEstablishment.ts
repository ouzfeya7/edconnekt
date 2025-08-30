import { useQuery } from '@tanstack/react-query';
import { etablissementsApi } from '../api/establishment-service/client';
import type { EtablissementOut } from '../api/establishment-service/api';

export function useEstablishment(establishmentId?: string) {
  return useQuery<EtablissementOut, Error>({
    queryKey: ['establishment', establishmentId],
    enabled: Boolean(establishmentId),
    queryFn: async () => {
      if (!establishmentId) throw new Error('establishmentId requis');
      const { data } = await etablissementsApi.getEstablishmentApiEtablissementsEstablishmentIdGet(establishmentId);
      return data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
}



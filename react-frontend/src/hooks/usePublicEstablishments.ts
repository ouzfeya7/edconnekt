import { useQuery } from '@tanstack/react-query';
import { etablissementsApi } from '../api/establishment-service/client';
import type { EtablissementOut } from '../api/establishment-service/api';

export interface UsePublicEstablishmentsParams {
  limit?: number;
  offset?: number;
}

export function usePublicEstablishments(params: UsePublicEstablishmentsParams = {}) {
  const { limit = 10, offset = 0 } = params;

  return useQuery<EtablissementOut[], Error>({
    queryKey: ['public-establishments', { limit, offset }],
    queryFn: async () => {
      const { data } = await etablissementsApi.listPublicEstablishmentsApiEtablissementsPublicGet(
        limit,
        offset
      );
      return data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
}



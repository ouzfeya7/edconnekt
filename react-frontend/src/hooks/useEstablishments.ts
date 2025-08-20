import { useQuery } from '@tanstack/react-query';
import { etablissementsApi } from '../api/establishment-service/client';
import type { EtablissementOut, StatusEnum } from '../api/establishment-service/api';

export interface UseEstablishmentsParams {
  status?: StatusEnum;
  limit?: number;
  offset?: number;
}

export function useEstablishments(params: UseEstablishmentsParams = {}) {
  const { status = undefined, limit = 10, offset = 0 } = params;

  return useQuery<EtablissementOut[], Error>({
    queryKey: ['establishments', { status, limit, offset }],
    queryFn: async () => {
      const { data } = await etablissementsApi.listEstablishmentsApiEtablissementsGet(
        status,
        limit,
        offset
      );
      return data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
}



import { useQuery } from '@tanstack/react-query';
import { etablissementsApi } from '../api/establishment-service/client';
import type { LastCodeEtablissementResponse } from '../api/establishment-service/api';

export function useEstablishmentLastCode() {
  return useQuery<string | undefined, Error>({
    queryKey: ['establishment:last-code'],
    queryFn: async () => {
      const { data } = await etablissementsApi.getLastCodeEtablissementApiEtablissementsLastCodeGet();
      const v: LastCodeEtablissementResponse | string | undefined = data as unknown as LastCodeEtablissementResponse | string | undefined;
      if (v && typeof v === 'object' && 'last_code' in v) {
        const lc = (v as { last_code?: unknown }).last_code;
        return typeof lc === 'string' ? lc : undefined;
      }
      if (typeof v === 'string') return v;
      return undefined;
    },
    staleTime: 60_000,
  });
}



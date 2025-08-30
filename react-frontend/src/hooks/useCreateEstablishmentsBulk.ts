import { useMutation, useQueryClient } from '@tanstack/react-query';
import { etablissementsApi } from '../api/establishment-service/client';
import type { EtablissementCreate, EtablissementCreateFlexible } from '../api/establishment-service/api';

export function useCreateEstablishmentsBulk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payloads: EtablissementCreate[]) => {
      const body: EtablissementCreateFlexible = { data: payloads as unknown as EtablissementCreateFlexible['data'] };
      return etablissementsApi.createEstablishmentApiEtablissementsPost(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['establishments'] });
    },
  });
}

export default useCreateEstablishmentsBulk;



import { useMutation, useQueryClient } from '@tanstack/react-query';
import { etablissementsApi } from '../api/establishment-service/client';
import type { EtablissementCreate } from '../api/establishment-service/api';

export function useCreateEstablishmentsBulk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payloads: EtablissementCreate[]) => {
      // Le backend attend un objet avec { data: [...] }
      return etablissementsApi.createEstablishmentApiEtablissementsPost({ data: payloads } as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['establishments'] });
    },
  });
}

export default useCreateEstablishmentsBulk;



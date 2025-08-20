import { useMutation, useQueryClient } from '@tanstack/react-query';
import { etablissementsApi } from '../api/establishment-service/client';
import type { EtablissementCreate, EtablissementOut } from '../api/establishment-service/api';

export function useCreateEstablishment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EtablissementCreate) =>
      etablissementsApi.createEstablishmentApiEtablissementsPost(payload),
    onSuccess: (res) => {
      const created: EtablissementOut = res.data;
      queryClient.invalidateQueries({ queryKey: ['establishments'] });
      if (created?.id) {
        queryClient.invalidateQueries({ queryKey: ['establishment', created.id] });
      }
    },
  });
}



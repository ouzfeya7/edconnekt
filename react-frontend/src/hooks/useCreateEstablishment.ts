import { useMutation, useQueryClient } from '@tanstack/react-query';
import { etablissementsApi } from '../api/establishment-service/client';
import type { EtablissementCreate, EtablissementCreateFlexible, ResponseCreateEstablishmentApiEtablissementsPost } from '../api/establishment-service/api';

export function useCreateEstablishment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EtablissementCreate) => {
      const body: EtablissementCreateFlexible = { data: payload as any };
      return etablissementsApi.createEstablishmentApiEtablissementsPost(body);
    },
    onSuccess: (res) => {
      const created: ResponseCreateEstablishmentApiEtablissementsPost = res.data;
      queryClient.invalidateQueries({ queryKey: ['establishments'] });
      if ((created as any)?.id) {
        queryClient.invalidateQueries({ queryKey: ['establishment', (created as any).id] });
      }
    },
  });
}



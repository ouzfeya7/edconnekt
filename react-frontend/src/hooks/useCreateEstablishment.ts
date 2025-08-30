import { useMutation, useQueryClient } from '@tanstack/react-query';
import { etablissementsApi } from '../api/establishment-service/client';
import type { EtablissementCreate, EtablissementCreateFlexible, ResponseCreateEstablishmentApiEtablissementsPost } from '../api/establishment-service/api';

export function useCreateEstablishment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EtablissementCreate) => {
      const body: EtablissementCreateFlexible = { data: payload as unknown as EtablissementCreateFlexible['data'] };
      return etablissementsApi.createEstablishmentApiEtablissementsPost(body);
    },
    onSuccess: (res) => {
      const created: ResponseCreateEstablishmentApiEtablissementsPost = res.data;
      queryClient.invalidateQueries({ queryKey: ['establishments'] });
      const createdId = (created as unknown as { id?: string })?.id;
      if (createdId) {
        queryClient.invalidateQueries({ queryKey: ['establishment', createdId] });
      }
    },
  });
}



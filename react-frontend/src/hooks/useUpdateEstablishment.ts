import { useMutation, useQueryClient } from '@tanstack/react-query';
import { etablissementsApi } from '../api/establishment-service/client';
import type { EtablissementUpdate } from '../api/establishment-service/api';

interface UpdateEstablishmentVariables {
  establishmentId: string;
  update: EtablissementUpdate;
}

export function useUpdateEstablishment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ establishmentId, update }: UpdateEstablishmentVariables) =>
      etablissementsApi.updateEstablishmentApiEtablissementsEstablishmentIdPatch(
        establishmentId,
        update
      ),
    onSuccess: (_res, vars) => {
      queryClient.invalidateQueries({ queryKey: ['establishments'] });
      if (vars?.establishmentId) {
        queryClient.invalidateQueries({ queryKey: ['establishment', vars.establishmentId] });
      }
    },
  });
}



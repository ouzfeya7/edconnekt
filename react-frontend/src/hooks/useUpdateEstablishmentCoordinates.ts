import { useMutation, useQueryClient } from '@tanstack/react-query';
import { etablissementsApi } from '../api/establishment-service/client';
import type { EtablissementCoordinatesUpdate } from '../api/establishment-service/api';

interface UpdateEstablishmentCoordinatesVariables {
  establishmentId: string;
  update: EtablissementCoordinatesUpdate;
}

export function useUpdateEstablishmentCoordinates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ establishmentId, update }: UpdateEstablishmentCoordinatesVariables) =>
      etablissementsApi.updateEstablishmentCoordinatesApiEtablissementsEstablishmentIdCoordinatesPatch(
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



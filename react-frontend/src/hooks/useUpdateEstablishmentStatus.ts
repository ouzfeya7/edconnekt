import { useMutation, useQueryClient } from '@tanstack/react-query';
import { etablissementsApi } from '../api/establishment-service/client';
import type { StatusEnum } from '../api/establishment-service/api';

interface UpdateEstablishmentStatusVariables {
  establishmentId: string;
  status: StatusEnum;
  motif?: string;
}

export function useUpdateEstablishmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ establishmentId, status, motif }: UpdateEstablishmentStatusVariables) =>
      etablissementsApi.updateEstablishmentStatusApiEtablissementsEstablishmentIdStatusPatch(
        establishmentId,
        status,
        motif
      ),
    onSuccess: (_res, vars) => {
      queryClient.invalidateQueries({ queryKey: ['establishments'] });
      if (vars?.establishmentId) {
        queryClient.invalidateQueries({ queryKey: ['establishment', vars.establishmentId] });
      }
    },
  });
}



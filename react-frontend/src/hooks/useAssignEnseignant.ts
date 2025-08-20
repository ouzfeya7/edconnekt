import { useMutation, useQueryClient } from '@tanstack/react-query';
import { classesApi } from '../api/classe-service/client';
import type { ClasseEnseignantCreate, ClasseEnseignantOut } from '../api/classe-service/api';

export function useAssignEnseignant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ClasseEnseignantCreate) =>
      classesApi.assignEnseignantApiV1ClassesEnseignantsPost(payload),
    onSuccess: (res, payload) => {
      const created: ClasseEnseignantOut = res.data;
      if (payload?.classe_id) {
        queryClient.invalidateQueries({ queryKey: ['classe-enseignants', payload.classe_id] });
        queryClient.invalidateQueries({ queryKey: ['classe', payload.classe_id] });
      }
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
}



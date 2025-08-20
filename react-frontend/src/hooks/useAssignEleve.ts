import { useMutation, useQueryClient } from '@tanstack/react-query';
import { classesApi } from '../api/classe-service/client';
import type { ClasseEleveCreate, ClasseEleveOut } from '../api/classe-service/api';

export function useAssignEleve() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ClasseEleveCreate) => classesApi.assignEleveApiV1ClassesElevesPost(payload),
    onSuccess: (res, payload) => {
      const created: ClasseEleveOut = res.data;
      // Invalidate liste des élèves et la classe concernée
      if (payload?.classe_id) {
        queryClient.invalidateQueries({ queryKey: ['classe-eleves', payload.classe_id] });
        queryClient.invalidateQueries({ queryKey: ['classe', payload.classe_id] });
      }
      // Invalidate liste des classes
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
}



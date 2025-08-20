import { useMutation, useQueryClient } from '@tanstack/react-query';
import { classesApi } from '../api/classe-service/client';
import type { ClasseCreate, ClasseOut } from '../api/classe-service/api';

export function useCreateClasse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ClasseCreate) => classesApi.createClasseApiV1ClassesPost(payload),
    onSuccess: (res) => {
      const created: ClasseOut = res.data;
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      if (created?.id) {
        queryClient.invalidateQueries({ queryKey: ['classe', created.id] });
      }
    },
  });
}



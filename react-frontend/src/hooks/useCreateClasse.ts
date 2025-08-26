import { useMutation, useQueryClient } from '@tanstack/react-query';
import { classesApi } from '../api/classe-service/client';
import type { ClasseCreate, ClasseCreateFlexible } from '../api/classe-service/api';

export function useCreateClasse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ClasseCreate) => {
      const body: ClasseCreateFlexible = { data: payload as unknown as ClasseCreateFlexible['data'] };
      return classesApi.createClasseApiV1ClassesPost(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
}



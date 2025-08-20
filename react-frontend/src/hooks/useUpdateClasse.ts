import { useMutation, useQueryClient } from '@tanstack/react-query';
import { classesApi } from '../api/classe-service/client';
import type { ClasseUpdate } from '../api/classe-service/api';

interface UpdateClasseVariables {
  classeId: string;
  update: ClasseUpdate;
}

export function useUpdateClasse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classeId, update }: UpdateClasseVariables) =>
      classesApi.updateClasseApiV1ClassesClasseIdPatch(classeId, update),
    onSuccess: (_res, vars) => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      if (vars?.classeId) {
        queryClient.invalidateQueries({ queryKey: ['classe', vars.classeId] });
      }
    },
  });
}



import { useMutation, useQueryClient } from '@tanstack/react-query';
import { classesApi } from '../api/classe-service/client';

export function useArchiveClasse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (classeId: string) => classesApi.archiveClasseApiV1ClassesClasseIdDelete(classeId),
    onSuccess: (_res, classeId) => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      if (classeId) {
        queryClient.invalidateQueries({ queryKey: ['classe', classeId] });
      }
    },
  });
}



import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../../api/student-service/client';
import type { ParentImportResponse } from '../../api/student-service/api';

export function useImportParentRelations() {
  const qc = useQueryClient();
  return useMutation<ParentImportResponse, Error, { file: File }>({
    mutationKey: ['students:parent-relations:import'],
    mutationFn: async ({ file }) => {
      const { data } = await studentsApi.importParentRelationsApiStudentsParentRelationsImportPost(file);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] });
    },
  });
}



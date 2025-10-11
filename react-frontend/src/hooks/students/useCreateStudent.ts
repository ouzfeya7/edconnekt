import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../../api/student-service/client';
import type { StudentCreate, StudentResponse } from '../../api/student-service/api';

export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation<StudentResponse, Error, { payload: StudentCreate; etabId?: string }>({
    mutationKey: ['student:create'],
    mutationFn: async ({ payload }) => {
      const { data } = await studentsApi.createStudentApiStudentsPost(payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] });
    },
  });
}



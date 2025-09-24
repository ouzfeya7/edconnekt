import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../../api/student-service/client';

export function useDeleteStudent() {
  const qc = useQueryClient();
  return useMutation<void, Error, { studentId: string; etabId?: string }>({
    mutationKey: ['student:delete'],
    mutationFn: async ({ studentId, etabId }) => {
      await studentsApi.deleteStudentApiStudentsStudentIdDelete(studentId);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['students'] });
      if (vars?.studentId) qc.invalidateQueries({ queryKey: ['student', vars.studentId] });
    },
  });
}



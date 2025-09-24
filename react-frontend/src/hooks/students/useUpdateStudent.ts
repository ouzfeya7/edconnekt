import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../../api/student-service/client';
import type { StudentUpdate, StudentResponse } from '../../api/student-service/api';

export function useUpdateStudent() {
  const qc = useQueryClient();
  return useMutation<StudentResponse, Error, { studentId: string; update: StudentUpdate; etabId?: string }>({
    mutationKey: ['student:update'],
    mutationFn: async ({ studentId, update, etabId }) => {
      const { data } = await studentsApi.updateStudentApiStudentsStudentIdPatch(
        studentId,
        update
      );
      return data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['students'] });
      if (vars?.studentId) qc.invalidateQueries({ queryKey: ['student', vars.studentId] });
    },
  });
}



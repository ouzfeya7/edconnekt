import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../../api/student-service/client';
import type { StudentParentCreate, StudentParentResponse } from '../../api/student-service/api';

export function useLinkParent() {
  const qc = useQueryClient();
  return useMutation<StudentParentResponse, Error, StudentParentCreate>({
    mutationKey: ['student:link-parent'],
    mutationFn: async (payload: StudentParentCreate) => {
      const { data } = await studentsApi.linkParentToStudentApiStudentsStudentIdParentsPost(payload);
      return data;
    },
    onSuccess: (_d, vars) => {
      if (vars?.student_id) qc.invalidateQueries({ queryKey: ['student', vars.student_id] });
    },
  });
}



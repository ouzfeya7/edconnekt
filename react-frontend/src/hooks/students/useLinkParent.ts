import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../../api/student-service/client';
import type { StudentParentCreate, StudentParentResponse } from '../../api/student-service/api';

export function useLinkParent() {
  const qc = useQueryClient();
  return useMutation<StudentParentResponse, Error, { payload: StudentParentCreate; etabId?: string }>({
    mutationKey: ['student:link-parent'],
    mutationFn: async ({ payload }) => {
      const { data } = await studentsApi.linkParentToStudentApiStudentsStudentIdParentsPost(
        payload.student_id,
        payload,
        undefined
      );
      return data;
    },
    onSuccess: (_d, vars) => {
      if (vars?.payload?.student_id) qc.invalidateQueries({ queryKey: ['student', vars.payload.student_id] });
    },
  });
}



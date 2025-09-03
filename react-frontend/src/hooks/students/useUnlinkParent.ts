import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../../api/student-service/client';

export function useUnlinkParent() {
  const qc = useQueryClient();
  return useMutation<void, Error, { studentId: string; parentId: string; etabId?: string }>({
    mutationKey: ['student:unlink-parent'],
    mutationFn: async ({ studentId, parentId, etabId }) => {
      await studentsApi.unlinkParentFromStudentApiStudentsStudentIdParentsParentIdDelete(
        studentId,
        parentId,
        etabId ? { headers: { 'X-Establishment-Id': etabId } } : undefined
      );
    },
    onSuccess: (_d, vars) => {
      if (vars?.studentId) qc.invalidateQueries({ queryKey: ['student', vars.studentId] });
    },
  });
}



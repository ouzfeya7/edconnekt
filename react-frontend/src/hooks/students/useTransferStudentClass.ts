import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../../api/student-service/client';
import type { ClassMembershipUpdate, ClassMembershipResponse } from '../../api/student-service/api';

export function useTransferStudentClass() {
  const qc = useQueryClient();
  return useMutation<ClassMembershipResponse, Error, { studentId: string; update: ClassMembershipUpdate; etabId?: string }>({
    mutationKey: ['student:transfer-class'],
    mutationFn: async ({ studentId, update }) => {
      const { data } = await studentsApi.transferStudentClassApiStudentsStudentIdClassPatch(
        studentId,
        update
      );
      return data;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['students'] });
      if (vars?.studentId) qc.invalidateQueries({ queryKey: ['student', vars.studentId] });
    },
  });
}



import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '../../api/student-service/client';
import type { StudentAuditResponse } from '../../api/student-service/api';

export function useStudentAudit(studentId?: string) {
  return useQuery<StudentAuditResponse[], Error>({
    queryKey: ['student:audit', studentId],
    enabled: Boolean(studentId),
    queryFn: async () => {
      if (!studentId) throw new Error('studentId requis');
      const { data } = await studentsApi.getStudentAuditApiStudentsStudentIdAuditGet(studentId);
      return data;
    },
    staleTime: 60_000,
  });
}



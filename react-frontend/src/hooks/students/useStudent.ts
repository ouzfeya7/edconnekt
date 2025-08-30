import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '../../api/student-service/client';
import type { StudentResponse } from '../../api/student-service/api';

export function useStudent(studentId?: string) {
  return useQuery<StudentResponse, Error>({
    queryKey: ['student', studentId],
    enabled: Boolean(studentId),
    queryFn: async () => {
      if (!studentId) throw new Error('studentId requis');
      const { data } = await studentsApi.getStudentApiStudentsStudentIdGet(studentId);
      return data;
    },
    staleTime: 60_000,
  });
}



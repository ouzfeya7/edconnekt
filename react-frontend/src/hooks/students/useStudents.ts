import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '../../api/student-service/client';
import type { StudentPaginatedResponse } from '../../api/student-service/api';

export function useStudents(params?: { page?: number; size?: number; classId?: string | null; status?: 'ACTIVE' | 'TRANSFERRED' | 'ARCHIVED' | null; search?: string | null }) {
  const page = params?.page ?? 1;
  const size = params?.size ?? 100;
  const classId = params?.classId ?? null;
  const status = params?.status ?? null;
  const search = params?.search ?? null;

  return useQuery<StudentPaginatedResponse, Error>({
    queryKey: ['students', { page, size, classId, status, search }],
    queryFn: async () => {
      const { data } = await studentsApi.getStudentsApiStudentsGet(page, size, classId, status, search);
      return data;
    },
    placeholderData: (prev) => prev,
    staleTime: 60_000,
  });
}



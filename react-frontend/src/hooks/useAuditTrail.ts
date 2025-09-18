import { useQuery } from '@tanstack/react-query';
import { auditApi } from '../api/timetable-service/client';
import type { TimetableAuditRead } from '../api/timetable-service/api';

export function useLessonAudit(lessonId?: string) {
  return useQuery<TimetableAuditRead[], Error>({
    queryKey: ['timetable:audit', lessonId],
    enabled: !!lessonId,
    queryFn: async () => {
      const res = await auditApi.getLessonAuditLessonsLessonIdAuditGet(lessonId as string);
      return res.data;
    },
    staleTime: 30_000,
  });
}

export function useAuditTrail(params?: { skip?: number; limit?: number }) {
  const { skip = 0, limit = 100 } = params || {};
  return useQuery<TimetableAuditRead[], Error>({
    queryKey: ['timetable:audit:trail', { skip, limit }],
    queryFn: async () => {
      const res = await auditApi.getAuditTrailAuditGet(skip, limit);
      return res.data;
    },
    staleTime: 30_000,
  });
}



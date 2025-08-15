import { useQuery } from '@tanstack/react-query';
import { timetableApi } from '../api/timetable-service/client';
import { LessonRead } from '../api/timetable-service/api';

export interface UseLessonsParams {
  classId?: string | null;
  teacherId?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  skip?: number;
  limit?: number;
}

export function useLessons(params: UseLessonsParams = {}) {
  const {
    classId = undefined,
    teacherId = undefined,
    fromDate = undefined,
    toDate = undefined,
    skip = 0,
    limit = 100,
  } = params;

  return useQuery<LessonRead[], Error>({
    queryKey: ['lessons', { classId, teacherId, fromDate, toDate, skip, limit }],
    queryFn: async () => {
      const response = await timetableApi.listLessonsLessonsGet(
        classId,
        fromDate,
        toDate,
        teacherId,
        skip,
        limit
      );
      return response.data;
    },
    // Garde les données précédentes pendant le re-fetching pour une expérience plus fluide
    keepPreviousData: true,
    // Ne ré-exécute pas automatiquement la requête lorsque la fenêtre reprend le focus
    refetchOnWindowFocus: false,
  });
}

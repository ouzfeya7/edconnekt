import { useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonsApi } from '../api/timetable-service/client';
import type { LessonRead, LessonUpdate } from '../api/timetable-service/api';

interface UpdateLessonVariables {
  lessonId: string;
  update: LessonUpdate;
}

export function useUpdateLesson() {
  const queryClient = useQueryClient();
  return useMutation<LessonRead, Error, UpdateLessonVariables>({
    mutationKey: ['lesson:update'],
    mutationFn: async ({ lessonId, update }: UpdateLessonVariables) => {
      const res = await lessonsApi.updateLessonLessonsLessonIdPatch(lessonId, update);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();
  return useMutation<LessonRead, Error, string>({
    mutationKey: ['lesson:delete'],
    mutationFn: async (lessonId: string) => {
      const res = await lessonsApi.deleteLessonLessonsLessonIdDelete(lessonId);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
}

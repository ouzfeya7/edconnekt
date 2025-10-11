import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { attachLessonResources, detachLessonResource, listLessonResources } from '../api/timetable-service/resources';

export function useListLessonResources<T = unknown>(lessonId?: string, enrich = false) {
  return useQuery<T, Error>({
    queryKey: ['lesson:resources', lessonId, { enrich }],
    enabled: Boolean(lessonId),
    queryFn: async () => {
      const data = await listLessonResources<T>(lessonId as string, enrich);
      return data;
    },
    staleTime: 60_000,
  });
}

export function useAttachLessonResources(lessonId: string) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string[]>({
    mutationKey: ['lesson:resources:attach', lessonId],
    mutationFn: async (resourceIds: string[]) => {
      await attachLessonResources(lessonId, resourceIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson:resources', lessonId] });
    },
  });
}

export function useDetachLessonResource(lessonId: string) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationKey: ['lesson:resources:detach', lessonId],
    mutationFn: async (resourceId: string) => {
      await detachLessonResource(lessonId, resourceId);
    },
    onSuccess: (_data, resourceId) => {
      queryClient.invalidateQueries({ queryKey: ['lesson:resources', lessonId] });
      queryClient.invalidateQueries({ queryKey: ['lesson:resource', lessonId, resourceId] });
    },
  });
}

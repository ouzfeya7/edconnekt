import { useQuery } from '@tanstack/react-query';
import { feedApi } from '../api/timetable-service/client';

export function useIcsFeed(classId?: string) {
  return useQuery<string, Error>({
    queryKey: ['timetable:ics', classId],
    enabled: Boolean(classId),
    queryFn: async () => {
      const res = await feedApi.getIcsFeedFeedClassIdIcsGet(classId as string, { responseType: 'blob' });
      const blob = res.data as Blob;
      const text = await blob.text();
      return text;
    },
    staleTime: 60_000,
  });
}
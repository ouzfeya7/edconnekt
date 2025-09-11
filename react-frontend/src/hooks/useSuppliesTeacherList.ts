import { useQuery } from '@tanstack/react-query';
import { teacherListsApi } from '@/api/supplies-service/client';

const buildKey = (campaignId: string | undefined, classId: string | undefined) => [
  'supplies',
  'teacher-list',
  campaignId ?? 'unknown-campaign',
  classId ?? 'unknown-class',
] as const;

export function useSuppliesTeacherList(campaignId: string | undefined, classId: string | undefined) {
  return useQuery({
    queryKey: buildKey(campaignId, classId),
    enabled: Boolean(campaignId && classId),
    queryFn: async () => {
      const res = await teacherListsApi.getMyListApiCampaignsCampaignIdMyListGet(
        campaignId as string,
        classId as string,
      );
      return res.data;
    },
  });
}

export const suppliesTeacherListKey = buildKey;



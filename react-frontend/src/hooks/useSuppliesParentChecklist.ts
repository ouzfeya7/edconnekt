import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { parentChecklistApi } from '../api/supplies-service/client';
import type { ProgressResponse } from '../api/supplies-service/api';
import type { ChecklistItemUpdate } from '../api/supplies-service/api';

const checklistKey = (campaignId: string | undefined, childId: string | undefined, classId: string | undefined) => [
  'supplies',
  'checklist',
  campaignId ?? 'unknown-campaign',
  childId ?? 'unknown-child',
  classId ?? 'unknown-class',
] as const;

export function useParentChecklist(campaignId: string | undefined, childId: string | undefined, classId: string | undefined) {
  return useQuery({
    queryKey: checklistKey(campaignId, childId, classId),
    enabled: Boolean(campaignId && childId && classId),
    queryFn: async () => {
      const res = await parentChecklistApi.getChecklistApiCampaignsCampaignIdChildrenChildIdChecklistGet(
        campaignId as string,
        childId as string,
        classId as string,
      );
      return res.data;
    },
  });
}

export function useParentChecklistProgress(campaignId: string | undefined, childId: string | undefined, classId: string | undefined) {
  return useQuery({
    queryKey: ['supplies', 'checklist', 'progress', campaignId ?? 'unknown-campaign', childId ?? 'unknown-child', classId ?? 'unknown-class'],
    enabled: Boolean(campaignId && childId && classId),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    queryFn: async () => {
      const res = await parentChecklistApi.progressApiCampaignsCampaignIdChildrenChildIdProgressGet(
        campaignId as string,
        childId as string,
        classId as string,
      );
      return res.data as ProgressResponse;
    },
  });
}

export function useToggleChecklistItem(campaignId: string | undefined, childId: string | undefined, classId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { itemId: string; body: ChecklistItemUpdate }) => {
      const res = await parentChecklistApi.toggleItemApiCampaignsCampaignIdChildrenChildIdChecklistItemsItemIdPatch(
        campaignId as string,
        childId as string,
        payload.itemId,
        classId as string,
        payload.body,
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: checklistKey(campaignId, childId, classId) });
      qc.invalidateQueries({ queryKey: ['supplies', 'checklist', 'progress', campaignId ?? 'unknown-campaign', childId ?? 'unknown-child', classId ?? 'unknown-class'] });
    },
  });
}

export const suppliesChecklistKey = checklistKey;



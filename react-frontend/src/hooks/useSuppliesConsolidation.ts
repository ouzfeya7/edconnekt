import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { consolidationApi } from '@/api/supplies-service/client';
import type { ConsolidationDecision } from '@/api/supplies-service/api';

const diffKey = (campaignId: string | undefined, classId: string | undefined) => [
  'supplies',
  'consolidation',
  'diff',
  campaignId ?? 'unknown-campaign',
  classId ?? 'unknown-class',
] as const;

export function useConsolidationDiff(campaignId: string | undefined, classId: string | undefined) {
  return useQuery({
    queryKey: diffKey(campaignId, classId),
    enabled: Boolean(campaignId && classId),
    queryFn: async () => {
      const res = await consolidationApi.consolidationDiffApiCampaignsCampaignIdConsolidationDiffGet(
        campaignId as string,
        classId as string,
      );
      return res.data;
    },
  });
}

export function useConsolidationApply(campaignId: string | undefined, classId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (decisions: ConsolidationDecision[]) => {
      const res = await consolidationApi.consolidationApplyApiCampaignsCampaignIdConsolidationPut(
        campaignId as string,
        classId as string,
        decisions,
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: diffKey(campaignId, classId) });
    },
  });
}

export const suppliesConsolidationDiffKey = diffKey;



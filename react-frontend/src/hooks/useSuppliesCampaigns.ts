import { useQuery } from '@tanstack/react-query';
import { campaignsApi } from '../api/supplies-service/client';
import type { CampaignListResponse } from '../api/supplies-service/api';

export function useSuppliesCampaignDashboard(campaignId: string | undefined) {
  return useQuery({
    queryKey: ['supplies', 'campaign', 'dashboard', campaignId ?? 'unknown'],
    enabled: Boolean(campaignId),
    queryFn: async () => {
      const res = await campaignsApi.campaignDashboardApiCampaignsCampaignIdDashboardGet(campaignId as string);
      return res.data;
    },
  });
}

export function useSuppliesCampaignList(params: {
  q?: string | null;
  status?: string | null;
  order?: string | null;
  limit?: number;
  offset?: number;
}) {
  const { q = null, status = null, order = null, limit = 20, offset = 0 } = params ?? {};
  return useQuery({
    queryKey: ['supplies', 'campaign', 'list', { q, status, order, limit, offset }],
    queryFn: async () => {
      const res = await campaignsApi.listCampaignsApiCampaignsGet(q, status, order, limit, offset);
      return res.data as CampaignListResponse[];
    },
  });
}



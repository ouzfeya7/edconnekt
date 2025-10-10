import { useQuery } from '@tanstack/react-query';
import { campaignsApi } from '../api/supplies-service/client';

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
  establishmentId?: string | null;
  schoolYear?: string | null;
  classId?: string | null;
  limit?: number;
  offset?: number;
}) {
  const {
    q = null,
    status = null,
    establishmentId = null,
    schoolYear = null,
    classId = null,
    limit = 20,
    offset = 0,
  } = params ?? {};
  return useQuery({
    queryKey: ['supplies', 'campaign', 'list', { q, status, establishmentId, schoolYear, classId, limit, offset }],
    queryFn: async () => {
      // API: listCampaigns(name?, status?, establishmentId?, schoolYear?, classId?, limit?, offset?)
      const res = await campaignsApi.listCampaignsApiCampaignsGet(
        q,
        status,
        establishmentId,
        schoolYear,
        classId,
        limit,
        offset
      );
      return res.data as {
        campaigns: Array<{ id: string; name: string; status: string; created_at: string; updated_at: string }>;
        total_count: number;
        limit: number;
        offset: number;
      };
    },
  });
}



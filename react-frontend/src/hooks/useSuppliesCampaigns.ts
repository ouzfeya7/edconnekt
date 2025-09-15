import { useQuery } from '@tanstack/react-query';
import { campaignsApi } from '../api/supplies-service/client';
// List endpoint typing changed in regenerated client; keep flexible locally

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
  order?: string | null; // no longer supported server-side; ignored
  establishmentId?: string | null;
  schoolYear?: string | null;
  classId?: string | null;
  limit?: number;
  offset?: number;
}) {
  const {
    q = null,
    status = null,
    order = null,
    establishmentId = null,
    schoolYear = null,
    classId = null,
    limit = 20,
    offset = 0,
  } = params ?? {};
  return useQuery({
    queryKey: ['supplies', 'campaign', 'list', { q, status, order, establishmentId, schoolYear, classId, limit, offset }],
    queryFn: async () => {
      // New API: listCampaigns(name?, status?, establishmentId?, schoolYear?, classId?, limit?, offset?)
      const name = q;
      const res = await campaignsApi.listCampaignsApiCampaignsGet(
        name,
        status,
        establishmentId,
        schoolYear,
        classId,
        limit,
        offset
      );
      const data = res.data as unknown;
      if (Array.isArray(data)) return data as Array<{ id: string; name?: string; status?: string; created_at?: string; updated_at?: string }>;
      if (data && typeof data === 'object') {
        const obj = data as { items?: unknown } & Record<string, unknown>;
        if (Array.isArray(obj.items)) return obj.items as Array<{ id: string; name?: string; status?: string; created_at?: string; updated_at?: string }>;
      }
      return [] as Array<{ id: string; name?: string; status?: string; created_at?: string; updated_at?: string }>;
    },
  });
}



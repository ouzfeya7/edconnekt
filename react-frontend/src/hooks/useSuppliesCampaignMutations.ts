import { useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignsApi } from '../api/supplies-service/client';

type ErrorLike = unknown;

function extractErrorMessage(error: ErrorLike): string {
  if (!error) return 'Une erreur est survenue';
  if (typeof error === 'string') return error;
  if (typeof error === 'object' && error !== null) {
    const maybeAxios = error as { response?: { data?: unknown } };
    const data = maybeAxios.response?.data;
    if (data && typeof data === 'object' && 'detail' in data) {
      const detail = (data as { detail?: unknown }).detail;
      if (typeof detail === 'string') return detail;
      if (Array.isArray(detail)) return detail.map((d) => (typeof d === 'string' ? d : JSON.stringify(d))).join(', ');
      return JSON.stringify(detail);
    }
  }
  return 'Une erreur est survenue';
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; establishmentId: string; schoolYear: string; classes?: string[] }) => {
      const { name, schoolYear, classes, establishmentId } = payload;
      const body = { name, establishment_id: establishmentId, school_year: schoolYear, classes } as { name: string; establishment_id: string; school_year: string; classes?: string[] };
      const res = await campaignsApi.createCampaignApiCampaignsPost(body, { headers: { 'X-Establishment-Id': establishmentId } });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['supplies', 'campaign', 'list'] });
    },
    onError: (err) => {
      console.error(extractErrorMessage(err));
    },
  });
}

export function useOpenCampaign() {
  return useMutation({
    mutationFn: async (campaignId: string) => (await campaignsApi.openCampaignApiCampaignsCampaignIdOpenPatch(campaignId)).data,
  });
}

export function useValidateCampaign() {
  return useMutation({
    mutationFn: async (campaignId: string) => (await campaignsApi.validateCampaignApiCampaignsCampaignIdValidatePatch(campaignId)).data,
  });
}

export function usePublishCampaign() {
  return useMutation({
    mutationFn: async (campaignId: string) => (await campaignsApi.publishCampaignApiCampaignsCampaignIdPublishPatch(campaignId)).data,
  });
}

export function useCloseCampaign() {
  return useMutation({
    mutationFn: async (campaignId: string) => (await campaignsApi.closeCampaignApiCampaignsCampaignIdClosePatch(campaignId)).data,
  });
}



import { useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherListsApi, publicationApi } from '@/api/supplies-service/client';
import type { TeacherListItemPayload } from '@/api/supplies-service/api';
import { suppliesTeacherListKey } from './useSuppliesTeacherList';

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

export function useUpsertTeacherList(campaignId: string | undefined, classId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (items: TeacherListItemPayload[]) => {
      const res = await teacherListsApi.upsertMyListApiCampaignsCampaignIdMyListPut(
        campaignId as string,
        classId as string,
        items,
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: suppliesTeacherListKey(campaignId, classId) });
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error(extractErrorMessage(err));
    },
  });
}

export function useSubmitTeacherList(campaignId: string | undefined, classId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await teacherListsApi.submitMyListApiCampaignsCampaignIdMyListSubmitPost(
        campaignId as string,
        classId as string,
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: suppliesTeacherListKey(campaignId, classId) });
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error(extractErrorMessage(err));
    },
  });
}

export function usePublicList(campaignId: string | undefined, classId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await publicationApi.publicListApiCampaignsCampaignIdPublicListGet(
        campaignId as string,
        classId as string,
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['supplies', 'public-list', campaignId ?? 'unknown', classId ?? 'unknown'] });
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error(extractErrorMessage(err));
    },
  });
}



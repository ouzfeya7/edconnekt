import { useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherListsApi, publicationApi } from '../api/supplies-service/client';
import type { TeacherListItemPayload } from '../api/supplies-service/api';
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

export function useUpsertTeacherList(campaignId: string | undefined, classId: string | undefined, teacherId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (items: TeacherListItemPayload[]) => {
      const res = await teacherListsApi.upsertMyListApiCampaignsCampaignIdMyListPut(
        campaignId as string,
        classId as string,
        items,
        teacherId,
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: suppliesTeacherListKey(campaignId, classId) });
    },
    onError: (err) => {
       
      console.error(extractErrorMessage(err));
    },
  });
}

export function useSubmitTeacherList(campaignId: string | undefined, classId: string | undefined, teacherId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await teacherListsApi.submitMyListApiCampaignsCampaignIdMyListSubmitPost(
        campaignId as string,
        classId as string,
        teacherId,
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: suppliesTeacherListKey(campaignId, classId) });
    },
    onError: (err) => {
       
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
       
      console.error(extractErrorMessage(err));
    },
  });
}

export function usePublicListPdf(campaignId: string | undefined, classId: string | undefined) {
  return useMutation({
    mutationFn: async () => {
      // Récupérer le PDF en blob (forcer responseType: 'blob')
      const res = await publicationApi.publicListPdfApiCampaignsCampaignIdPublicListPdfGet(
        campaignId as string,
        classId as string,
        { responseType: 'blob' }
      );
      const blob = (res as unknown as { data: Blob }).data;
      // Déclenche un téléchargement
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `liste-publique-${campaignId}-${classId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      return true;
    },
  });
}



import { useMutation, useQueryClient } from '@tanstack/react-query';
import { admissionsApi } from '../api/admission-service/client';
import type { AdmissionCreateRequest, AdmissionResponse, AdmissionStatusUpdate, AdmissionUpdate } from '../api/admission-service/api';

function getErrorMessage(error: unknown): string {
  const maybeAxios = error as { response?: { data?: unknown } } | undefined;
  const data = maybeAxios?.response?.data as unknown;
  if (data && typeof data === 'object') {
    const anyData = data as Record<string, unknown>;
    if (typeof anyData.message === 'string') return anyData.message;
    if (typeof anyData.msg === 'string') return anyData.msg;
    if (typeof anyData.detail === 'string') return anyData.detail;
    if (Array.isArray(anyData.detail) && anyData.detail.length > 0) {
      const first = anyData.detail[0] as Record<string, unknown>;
      if (typeof first.msg === 'string') return first.msg;
    }
  }
  if (error instanceof Error && error.message) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return 'Une erreur est survenue';
  }
}

export function useCreateAdmission() {
  const queryClient = useQueryClient();
  return useMutation<AdmissionResponse, Error, AdmissionCreateRequest>({
    mutationFn: async (payload: AdmissionCreateRequest) => {
      try {
        const { data } = await admissionsApi.createAdmissionApiV1AdmissionsPost(payload);
        return data;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admission-service', 'admissions'] });
      void queryClient.invalidateQueries({ queryKey: ['admission-service', 'stats', 'summary'] });
    },
  });
}

export function useUpdateAdmission(admissionId?: number) {
  const queryClient = useQueryClient();
  return useMutation<AdmissionResponse, Error, AdmissionUpdate>({
    mutationFn: async (payload: AdmissionUpdate) => {
      if (typeof admissionId !== 'number') throw new Error('admissionId requis');
      try {
        const { data } = await admissionsApi.updateAdmissionApiV1AdmissionsAdmissionIdPut(admissionId, payload);
        return data;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admission-service', 'admissions'] });
      if (typeof admissionId === 'number') {
        void queryClient.invalidateQueries({ queryKey: ['admission-service', 'admissions', admissionId] });
      }
      void queryClient.invalidateQueries({ queryKey: ['admission-service', 'stats', 'summary'] });
    },
  });
}

export function useUpdateAdmissionStatus() {
  const queryClient = useQueryClient();
  return useMutation<AdmissionResponse, Error, { admissionId: number; update: AdmissionStatusUpdate }>({
    mutationFn: async ({ admissionId, update }) => {
      if (typeof admissionId !== 'number') throw new Error('admissionId requis');
      try {
        const { data } = await admissionsApi.updateAdmissionStatusApiV1AdmissionsAdmissionIdStatusPatch(admissionId, update);
        return data;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['admission-service', 'admissions'] });
      if (typeof variables.admissionId === 'number') {
        void queryClient.invalidateQueries({ queryKey: ['admission-service', 'admissions', variables.admissionId] });
      }
      void queryClient.invalidateQueries({ queryKey: ['admission-service', 'stats', 'summary'] });
    },
  });
}

export function useDeleteAdmission() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { admissionId: number }>({
    mutationFn: async ({ admissionId }) => {
      if (typeof admissionId !== 'number') throw new Error('admissionId requis');
      try {
        const { data } = await admissionsApi.deleteAdmissionApiV1AdmissionsAdmissionIdDelete(admissionId);
        return data;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['admission-service', 'admissions'] });
      if (typeof variables.admissionId === 'number') {
        void queryClient.invalidateQueries({ queryKey: ['admission-service', 'admissions', variables.admissionId] });
      }
      void queryClient.invalidateQueries({ queryKey: ['admission-service', 'stats', 'summary'] });
    },
  });
}



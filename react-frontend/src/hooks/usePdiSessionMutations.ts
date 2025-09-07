import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pdiDefaultApi } from '../api/pdi-service/client';
import type {
  PDISessionOut,
  PDISessionWithStudentsCreate,
  PDIStudentStatusUpdate,
  PDIStudentStatusOut,
  ReportGenerationResponse,
} from '../api/pdi-service/api';

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

export function useCreatePdiSession() {
  const queryClient = useQueryClient();
  return useMutation<PDISessionOut, Error, PDISessionWithStudentsCreate>({
    mutationFn: async (payload) => {
      try {
        const res = await pdiDefaultApi.createPdiSessionApiV1PdiSessionsPost(payload);
        return res.data;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['pdi-service', 'sessions'] });
    },
  });
}

type JsonPatchOp = Record<string, unknown>;

export function usePatchPdiSession() {
  const queryClient = useQueryClient();
  return useMutation<PDISessionOut, Error, { sessionId: string; ops: JsonPatchOp[] }>({
    mutationFn: async ({ sessionId, ops }) => {
      try {
        const res = await pdiDefaultApi.updatePdiSessionApiV1PdiSessionsSessionIdPatch(sessionId, ops);
        return res.data;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['pdi-service', 'sessions'] });
      void queryClient.invalidateQueries({ queryKey: ['pdi-service', 'sessions', variables.sessionId] });
    },
  });
}

export function useUpdateStudentStatus() {
  const queryClient = useQueryClient();
  return useMutation<PDIStudentStatusOut, Error, { sessionId: string; studentId: string; payload: PDIStudentStatusUpdate }>({
    mutationFn: async ({ sessionId, studentId, payload }) => {
      try {
        const res = await pdiDefaultApi.updateStudentStatusApiV1PdiSessionsSessionIdStudentsStudentIdPatch(
          sessionId,
          studentId,
          payload,
        );
        return res.data;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['pdi-service', 'sessions', variables.sessionId] });
    },
  });
}

export function useRequestReportGeneration() {
  const queryClient = useQueryClient();
  return useMutation<ReportGenerationResponse, Error, { sessionId: string }>({
    mutationFn: async ({ sessionId }) => {
      try {
        const res = await pdiDefaultApi.requestReportGenerationApiV1PdiSessionsSessionIdReportPost(sessionId);
        return res.data;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['pdi-service', 'sessions', variables.sessionId] });
    },
  });
}



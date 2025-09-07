import { useQuery } from '@tanstack/react-query';
import { pdiDefaultApi } from '../api/pdi-service/client';
import type {
  PDISessionOut,
  PDISessionWithStudentsOut,
  PDISessionStats,
  ReportStatusEnum,
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

export function usePdiSessions(params?: {
  schoolId?: string | null;
  classId?: string | null;
  teacherId?: string | null;
  sessionDateFrom?: string | null;
  sessionDateTo?: string | null;
  evaluationPeriod?: string | null;
  reportStatus?: ReportStatusEnum | null;
  limit?: number;
  offset?: number;
}) {
  const schoolId = params?.schoolId ?? null;
  const classId = params?.classId ?? null;
  const teacherId = params?.teacherId ?? null;
  const sessionDateFrom = params?.sessionDateFrom ?? null;
  const sessionDateTo = params?.sessionDateTo ?? null;
  const evaluationPeriod = params?.evaluationPeriod ?? null;
  const reportStatus = params?.reportStatus ?? null;
  const limit = params?.limit ?? 20;
  const offset = params?.offset ?? 0;

  return useQuery<PDISessionOut[], Error>({
    queryKey: [
      'pdi-service',
      'sessions',
      { schoolId, classId, teacherId, sessionDateFrom, sessionDateTo, evaluationPeriod, reportStatus, limit, offset },
    ],
    queryFn: async () => {
      try {
        const res = await pdiDefaultApi.listPdiSessionsApiV1PdiSessionsGet(
          schoolId,
          classId,
          teacherId,
          sessionDateFrom,
          sessionDateTo,
          evaluationPeriod,
          reportStatus ?? undefined,
          limit,
          offset,
        );
        return res.data;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function usePdiSession(sessionId?: string) {
  return useQuery<PDISessionWithStudentsOut, Error>({
    queryKey: ['pdi-service', 'sessions', sessionId],
    enabled: Boolean(sessionId),
    queryFn: async () => {
      if (!sessionId) throw new Error('sessionId requis');
      try {
        const res = await pdiDefaultApi.getPdiSessionApiV1PdiSessionsSessionIdGet(sessionId);
        return res.data;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    staleTime: 60_000,
  });
}

export function usePdiStats(params?: { teacherId?: string | null; schoolId?: string | null }) {
  const teacherId = params?.teacherId ?? null;
  const schoolId = params?.schoolId ?? null;

  return useQuery<PDISessionStats, Error>({
    queryKey: ['pdi-service', 'stats', { teacherId, schoolId }],
    queryFn: async () => {
      try {
        const res = await pdiDefaultApi.getPdiStatsApiV1PdiStatsGet(teacherId, schoolId);
        return res.data;
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err));
      }
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}



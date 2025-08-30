import { useQuery, useMutation } from '@tanstack/react-query';
import { etablissementsApi } from '../api/establishment-service/client';
import type {
  AuditListResponse,
  AuditOperationEnum,
  AuditStatistics,
  EtablissementAuditResponse,
  ManualAuditCreate,
} from '../api/establishment-service/api';

export interface UseEstablishmentAuditParams {
  establishmentId?: string;
  operation?: AuditOperationEnum | null;
  auteurId?: string | null;
  auteurNom?: string | null;
  dateFrom?: string | null; // ISO date-time
  dateTo?: string | null;   // ISO date-time
  limit?: number;
  offset?: number;
  sortBy?: string;    // date_operation, operation, auteur_nom, id
  sortOrder?: string; // asc | desc
}

export function useEstablishmentAudit(params: UseEstablishmentAuditParams) {
  const { establishmentId, operation, auteurId, auteurNom, dateFrom, dateTo, limit = 10, offset = 0, sortBy = 'date_operation', sortOrder = 'desc' } = params;
  return useQuery<AuditListResponse, Error>({
    queryKey: ['establishment-audit', { establishmentId, operation, auteurId, auteurNom, dateFrom, dateTo, limit, offset, sortBy, sortOrder }],
    enabled: Boolean(establishmentId),
    queryFn: async () => {
      if (!establishmentId) throw new Error('establishmentId requis');
      const { data } = await etablissementsApi.getEstablishmentAuditApiEtablissementsEstablishmentIdAuditGet(
        establishmentId,
        operation,
        auteurId,
        auteurNom,
        dateFrom,
        dateTo,
        limit,
        offset,
        sortBy,
        sortOrder
      );
      return data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useEstablishmentAuditStatistics(establishmentId?: string) {
  return useQuery<AuditStatistics, Error>({
    queryKey: ['establishment-audit-stats', establishmentId],
    enabled: Boolean(establishmentId),
    queryFn: async () => {
      if (!establishmentId) throw new Error('establishmentId requis');
      const { data } = await etablissementsApi.getEstablishmentAuditStatisticsApiEtablissementsEstablishmentIdAuditStatisticsGet(establishmentId);
      return data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useEstablishmentAuditSummary(establishmentId?: string, days: number = 30) {
  return useQuery<Record<string, unknown>, Error>({
    queryKey: ['establishment-audit-summary', { establishmentId, days }],
    enabled: Boolean(establishmentId),
    queryFn: async () => {
      if (!establishmentId) throw new Error('establishmentId requis');
      const { data } = await etablissementsApi.getEstablishmentAuditSummaryApiEtablissementsEstablishmentIdAuditSummaryGet(establishmentId, days);
      return data as Record<string, unknown>;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useExportEstablishmentAudit() {
  return useMutation({
    mutationFn: async (params: { establishmentId: string; dateFrom?: string | null; dateTo?: string | null; format?: 'json' | 'csv' }) => {
      const { establishmentId, dateFrom, dateTo, format = 'json' } = params;
      const res = await etablissementsApi.exportEstablishmentAuditApiEtablissementsEstablishmentIdAuditExportGet(
        establishmentId,
        dateFrom ?? null,
        dateTo ?? null,
        format,
        { responseType: 'blob' }
      );
      return { response: res, format } as { response: unknown; format: 'json' | 'csv' };
    },
    onSuccess: (payload) => {
      // Safely extract AxiosResponse-like object
      if (typeof payload === 'object' && payload !== null) {
        const p = payload as { response?: { data?: unknown; headers?: Record<string, unknown> }; format?: 'json' | 'csv' };
        const blobData = p.response?.data as unknown;
        const format = p.format || 'json';
        if (blobData instanceof Blob) {
          const contentDisposition = p.response?.headers?.['content-disposition'] as unknown;
          let filename = `audit_export.${format}`;
          if (typeof contentDisposition === 'string') {
            const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(contentDisposition);
            const found = decodeURIComponent(match?.[1] || match?.[2] || '');
            if (found) filename = found;
          }
          const url = window.URL.createObjectURL(blobData);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        }
      }
    },
  });
}

export function useCreateManualAuditEntry() {
  return useMutation({
    mutationFn: async (params: { establishmentId: string; body: ManualAuditCreate }) => {
      const { establishmentId, body } = params;
      const { data } = await etablissementsApi.createManualAuditEntryApiEtablissementsEstablishmentIdAuditManualPost(
        establishmentId,
        body
      );
      return data as EtablissementAuditResponse;
    },
  });
}



import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { batchesApi, identityDefaultApi } from '../api/identity-service/client';
import type {
  BatchRead,
  BulkImportResponse,
  IdentityListResponse,
  IdentityResponse,
  IdentityCreate,
  IdentityUpdate,
  EstablishmentLinkCreate,
} from '../api/identity-service/api';
import { identityAxios } from '../api/identity-service/http';

// Types locaux pour typer les items d'un batch et la réponse paginée
export type IdentityBatchItem = {
  domain?: string;
  establishment_id?: string;
  external_id?: string;
  target_uuid?: string;
  item_status?: string;
  message?: string;
  created_at?: string;
  updated_at?: string;
};

export type IdentityBatchItemsResult = {
  items: IdentityBatchItem[];
  total?: number;
  page?: number;
  size?: number;
  pages?: number;
};

export function useIdentityBatches(params?: { establishmentId?: string; uploadedBy?: string; page?: number; size?: number; orderBy?: string; orderDir?: 'asc' | 'desc'; }) {
  return useQuery<unknown, Error>({
    queryKey: ['identity:batches', params],
    queryFn: async () => {
      try {
        if (import.meta.env.DEV) {
          console.debug('[useIdentityBatches] primary call (header-scope)', { params });
        }
        const { data } = await batchesApi.listBatchesApiV1IdentityBatchesGet(
          undefined,
          params?.uploadedBy,
          undefined,
          undefined,
          params?.orderBy,
          params?.orderDir
        );
        return data;
      } catch {
        if (import.meta.env.DEV) {
          console.debug('[useIdentityBatches] fallback call (with query params)', { params });
        }
        const { data } = await batchesApi.listBatchesApiV1IdentityBatchesGet(
          params?.establishmentId,
          params?.uploadedBy,
          params?.page,
          params?.size,
          params?.orderBy,
          params?.orderDir
        );
        return data;
      }
    },
    placeholderData: (prev: unknown) => prev,
  });
}

export function useIdentityBatch(batchId?: string) {
  return useQuery<BatchRead, Error>({
    queryKey: ['identity:batch', batchId],
    enabled: !!batchId,
    queryFn: async () => {
      if (!batchId) throw new Error('batchId requis');
      const { data } = await batchesApi.getBatchApiV1IdentityBatchesBatchIdGet(batchId);
      return data;
    },
  });
}

export function useIdentityBatchItems(
  params: { batchId?: string; itemStatus?: string; domain?: string; page?: number; size?: number; orderBy?: string; orderDir?: 'asc' | 'desc'; },
  options?: { refetchInterval?: number | false }
) {
  return useQuery<IdentityBatchItemsResult, Error>({
    queryKey: ['identity:batch-items', params],
    enabled: !!params.batchId,
    queryFn: async () => {
      if (!params.batchId) throw new Error('batchId requis');
      const { data } = await batchesApi.getBatchItemsApiV1IdentityBatchesBatchIdItemsGet(
        params.batchId,
        params.itemStatus,
        params.domain,
        params.page,
        params.size,
        params.orderBy,
        params.orderDir
      );
      // Normaliser en structure paginée
      if (Array.isArray(data)) {
        const page = params.page ?? 0;
        const size = params.size ?? (data as unknown[]).length;
        return { items: data as IdentityBatchItem[], total: (data as unknown[]).length, page, size, pages: 1 };
      }
      const obj = data as { items?: unknown; total?: number; page?: number; size?: number; pages?: number };
      return {
        items: (Array.isArray(obj.items) ? (obj.items as IdentityBatchItem[]) : []),
        total: obj.total,
        page: obj.page,
        size: obj.size,
        pages: obj.pages,
      };
    },
    placeholderData: (prev: IdentityBatchItemsResult | undefined) => prev as IdentityBatchItemsResult | undefined,
    refetchInterval: options?.refetchInterval ?? false,
  });
}

export function useIdentityBulkImport() {
  const queryClient = useQueryClient();
  return useMutation<BulkImportResponse, Error, { file: File; establishmentId: string; sourceFileUrl?: string | null }>(
    {
      mutationKey: ['identity:bulkimport'],
      mutationFn: async ({ file, establishmentId, sourceFileUrl }) => {
        const form = new FormData();
        form.append('file', file);
        form.append('establishment_id', establishmentId);
        if (sourceFileUrl) form.append('source_file_url', sourceFileUrl);
        const { data } = await identityAxios.post<BulkImportResponse>('api/v1/identity/bulkimport', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['identity:batches'] });
      },
    }
  );
}

export function useIdentityCommitBatch() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { batchId: string }>(
    {
      mutationKey: ['identity:commit'],
      mutationFn: async ({ batchId }) => {
        const { data } = await batchesApi.commitBatchApiV1IdentityBatchesBatchIdCommitPost(batchId);
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['identity:batches'] });
        // Invalider aussi les items pour forcer un refetch immédiat
        queryClient.invalidateQueries({ queryKey: ['identity:batch-items'] });
      },
    }
  );
}

export function useIdentityAudit(params?: { userId?: string; establishmentId?: string; batchId?: string; limit?: number; }) {
  return useQuery<unknown, Error>({
    queryKey: ['identity:audit', params],
    queryFn: async () => {
      const { data } = await identityAxios.get('api/v1/identity/bulkimport/audit', {
        params: {
          user_id: params?.userId,
          establishment_id: params?.establishmentId,
          batch_id: params?.batchId,
          limit: params?.limit,
        },
      });
      return data;
    },
  });
}

// Nouveaux hooks ajoutés

export function useIdentityCancelBulkImport() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { batchId: string }>({
    mutationKey: ['identity:bulkimport:cancel'],
    mutationFn: async ({ batchId }) => {
      const { data } = await identityDefaultApi.cancelBulkImportApiV1IdentityBulkimportCancelBatchIdPost(batchId);
      return data as unknown;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['identity:batches'] });
    },
  });
}

export function useIdentityBulkProgress(batchId?: string, options?: { refetchInterval?: number | false }) {
  return useQuery<unknown, Error>({
    queryKey: ['identity:bulkimport:progress', batchId],
    enabled: !!batchId,
    queryFn: async () => {
      if (!batchId) throw new Error('batchId requis');
      const { data } = await identityDefaultApi.getBulkImportProgressApiV1IdentityBulkimportProgressBatchIdGet(batchId);
      return data as unknown;
    },
    refetchInterval: options?.refetchInterval ?? false,
  });
}

export function useIdentityCsvTemplate(domain?: string) {
  return useQuery<string | unknown, Error>({
    queryKey: ['identity:bulkimport:template', domain],
    enabled: !!domain,
    queryFn: async () => {
      if (!domain) throw new Error('domain requis');
      // Utiliser axios pour récupérer du texte brut si le backend renvoie du CSV
      const { data } = await identityAxios.get(`api/v1/identity/bulkimport/template/${encodeURIComponent(domain)}`, {
        responseType: 'text',
      });
      return data as string;
    },
  });
}

export function useIdentitySseStats() {
  return useQuery<unknown, Error>({
    queryKey: ['identity:bulkimport:sse-stats'],
    queryFn: async () => {
      const { data } = await identityDefaultApi.getSseStatsApiV1IdentityBulkimportSseStatsGet();
      return data as unknown;
    },
  });
}

export function useIdentities(params?: {
  page?: number;
  size?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  firstname?: string;
  lastname?: string;
  email?: string;
  status?: string;
  establishmentId?: string;
  role?: string;
}) {
  return useQuery<IdentityListResponse, Error>({
    queryKey: ['identity:identities', params],
    queryFn: async () => {
      const { data } = await identityDefaultApi.listIdentitiesApiV1IdentityIdentitiesGet(
        params?.page,
        params?.size,
        params?.search,
        params?.sortBy,
        params?.sortOrder,
        params?.firstname,
        params?.lastname,
        params?.email,
        params?.status,
        params?.establishmentId,
        params?.role
      );
      return data as IdentityListResponse;
    },
    placeholderData: (prev) => prev,
  });
}

export function useIdentityGet(identityId?: string) {
  return useQuery<IdentityResponse, Error>({
    queryKey: ['identity:identity', identityId],
    enabled: !!identityId,
    queryFn: async () => {
      if (!identityId) throw new Error('identityId requis');
      const { data } = await identityDefaultApi.getIdentityApiV1IdentityIdentitiesIdentityIdGet(identityId);
      return data as IdentityResponse;
    },
  });
}

export function useIdentityCreate() {
  const queryClient = useQueryClient();
  return useMutation<IdentityResponse, Error, IdentityCreate>({
    mutationKey: ['identity:create'],
    mutationFn: async (payload) => {
      const { data } = await identityDefaultApi.createIdentityApiV1IdentityIdentitiesPost(payload);
      return data as IdentityResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['identity:identities'] });
    },
  });
}

export function useIdentityUpdate(identityId?: string) {
  const queryClient = useQueryClient();
  return useMutation<IdentityResponse, Error, IdentityUpdate>({
    mutationKey: ['identity:update', identityId],
    mutationFn: async (payload) => {
      if (!identityId) throw new Error('identityId requis');
      const { data } = await identityDefaultApi.updateIdentityApiV1IdentityIdentitiesIdentityIdPut(identityId, payload);
      return data as IdentityResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['identity:identities'] });
      if (identityId) queryClient.invalidateQueries({ queryKey: ['identity:identity', identityId] });
    },
  });
}

export function useIdentityDelete() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { identityId: string }>({
    mutationKey: ['identity:delete'],
    mutationFn: async ({ identityId }) => {
      const { data } = await identityDefaultApi.deleteIdentityApiV1IdentityIdentitiesIdentityIdDelete(identityId);
      return data as unknown;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['identity:identities'] });
    },
  });
}

export function useIdentityLinkToEstablishment(identityId?: string) {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, EstablishmentLinkCreate>({
    mutationKey: ['identity:link-establishment', identityId],
    mutationFn: async (payload) => {
      if (!identityId) throw new Error('identityId requis');
      const { data } = await identityDefaultApi.linkIdentityToEstablishmentApiV1IdentityIdentitiesIdentityIdEstablishmentsPost(identityId, payload);
      return data as unknown;
    },
    onSuccess: () => {
      if (identityId) queryClient.invalidateQueries({ queryKey: ['identity:identity', identityId] });
    },
  });
}

export function useIdentityUnlinkFromEstablishment(identityId?: string) {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { establishmentId: string }>({
    mutationKey: ['identity:unlink-establishment', identityId],
    mutationFn: async ({ establishmentId }) => {
      if (!identityId) throw new Error('identityId requis');
      const { data } = await identityDefaultApi.unlinkIdentityFromEstablishmentApiV1IdentityIdentitiesIdentityIdEstablishmentsEstablishmentIdDelete(identityId, establishmentId);
      return data as unknown;
    },
    onSuccess: () => {
      if (identityId) queryClient.invalidateQueries({ queryKey: ['identity:identity', identityId] });
    },
  });
}

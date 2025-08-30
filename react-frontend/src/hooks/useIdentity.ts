import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { batchesApi } from '../api/identity-service/client';
import type { BatchRead, BulkImportResponse } from '../api/identity-service/api';
import { identityAxios } from '../api/identity-service/http';

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

export function useIdentityBatchItems(params: { batchId?: string; itemStatus?: string; domain?: string; page?: number; size?: number; orderBy?: string; orderDir?: 'asc' | 'desc'; }) {
  return useQuery<unknown, Error>({
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
      return data;
    },
    placeholderData: (prev: unknown) => prev,
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

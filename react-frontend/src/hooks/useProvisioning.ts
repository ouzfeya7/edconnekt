import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { provisioningApi, provisioningDefaultApi } from '../api/provisioning-service/client';
import type { ProvisioningBatch, ProvisioningItem } from '../api/provisioning-service/api';

export function useProvisioningBatches(params?: { skip?: number; limit?: number }) {
  return useQuery<ProvisioningBatch[], Error>({
    queryKey: ['prov:batches', params],
    queryFn: async () => {
      const { data } = await provisioningApi.listBatchesProvisioningBatchesGet(params?.skip, params?.limit);
      return data;
    },
    placeholderData: (prev: ProvisioningBatch[] | undefined) => prev,
  });
}

export function useProvisioningCreateBatch() {
  const queryClient = useQueryClient();
  return useMutation<ProvisioningBatch, Error, { sourceIdentityBatchId: string }>(
    {
      mutationKey: ['prov:create-batch'],
      mutationFn: async ({ sourceIdentityBatchId }) => {
        const { data } = await provisioningApi.createBatchProvisioningBatchesPost({ source_identity_batch_id: sourceIdentityBatchId });
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['prov:batches'] });
      },
    }
  );
}

export function useProvisioningRunBatch() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { batchId: string }>(
    {
      mutationKey: ['prov:run-batch'],
      mutationFn: async ({ batchId }) => {
        const { data } = await provisioningApi.runBatchProvisioningBatchesBatchIdRunPost(batchId);
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['prov:batches'] });
        // Invalider aussi les items pour forcer un refetch immédiat
        queryClient.invalidateQueries({ queryKey: ['prov:items'] });
      },
    }
  );
}

export function useProvisioningBatchItems(
  params: { batchId?: string; skip?: number; limit?: number },
  options?: { refetchInterval?: number | false }
) {
  return useQuery<ProvisioningItem[], Error>({
    queryKey: ['prov:items', params],
    enabled: !!params.batchId,
    queryFn: async () => {
      if (!params.batchId) throw new Error('batchId requis');
      const { data } = await provisioningApi.listBatchItemsProvisioningBatchesBatchIdItemsGet(params.batchId, params.skip, params.limit);
      return data;
    },
    placeholderData: (prev: ProvisioningItem[] | undefined) => prev,
    refetchInterval: options?.refetchInterval ?? false,
  });
}

// Hooks manquants pour les endpoints non couverts

export function useProvisioningRoot() {
  return useQuery<unknown, Error>({
    queryKey: ['prov:root'],
    queryFn: async () => {
      const { data } = await provisioningDefaultApi.rootGet();
      return data as unknown;
    },
  });
}

export function useProvisioningHealth() {
  return useQuery<unknown, Error>({
    queryKey: ['prov:health'],
    queryFn: async () => {
      const { data } = await provisioningDefaultApi.healthCheckHealthGet();
      return data as unknown;
    },
  });
}

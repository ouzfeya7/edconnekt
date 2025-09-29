import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { identityApi } from '../api/identity-service/client';
import type {
  StandardListResponse,
  StandardSingleResponse,
  StandardSuccessResponse,
  IdentityCreate,
  IdentityUpdate,
  EstablishmentLinkCreate,
  IdentityWithRoles,
  ImportResponse,
} from '../api/identity-service/api';

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

export function useIdentityBatches(params?: { page?: number; size?: number; status?: string | null }) {
  return useQuery<StandardListResponse, Error>({
    queryKey: ['identity:batches', params],
    queryFn: async () => {
      const { data } = await identityApi.listBatchesApiV1IdentityBulkimportBatchesGet(
        params?.page,
        params?.size,
        params?.status ?? undefined,
      );
      return data as StandardListResponse;
    },
    placeholderData: (prev: StandardListResponse | undefined) => prev as StandardListResponse | undefined,
  });
}

export function useIdentityBatch(batchId?: string) {
  return useQuery<unknown, Error>({
    queryKey: ['identity:batch', batchId],
    enabled: !!batchId,
    queryFn: async () => {
      if (!batchId) throw new Error('batchId requis');
      const { data } = await identityApi.getBatchDetailsApiV1IdentityBulkimportBatchesBatchIdGet(batchId);
      return data as unknown;
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
      const { data } = await identityApi.getBatchDetailsApiV1IdentityBulkimportBatchesBatchIdGet(params.batchId);
      const obj = data as any;
      const items = Array.isArray(obj?.items) ? (obj.items as IdentityBatchItem[]) : [];
      const page = obj?.page ?? params.page ?? 0;
      const size = obj?.size ?? params.size ?? items.length;
      const total = obj?.total ?? items.length;
      const pages = obj?.pages ?? undefined;
      return { items, total, page, size, pages };
    },
    placeholderData: (prev: IdentityBatchItemsResult | undefined) => prev as IdentityBatchItemsResult | undefined,
    refetchInterval: options?.refetchInterval ?? false,
  });
}

export function useIdentityBulkImport() {
  const queryClient = useQueryClient();
  return useMutation<ImportResponse, Error, { file: File; establishmentId: string; sourceFileUrl?: string | null }>(
    {
      mutationKey: ['identity:bulkimport'],
      mutationFn: async ({ file, establishmentId, sourceFileUrl }) => {
        // sourceFileUrl n'est plus supporté directement par l'API
        const { data } = await identityApi.bulkImportIdentitiesApiV1IdentityBulkimportPost(file, establishmentId);
        return data as ImportResponse;
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
        throw new Error('Commit batch non supporté par l’API actuelle');
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
      // Endpoint non disponible dans l'API actuelle
      throw new Error('Audit non supporté par l’API actuelle');
    },
  });
}

// Nouveaux hooks ajoutés

export function useIdentityCancelBulkImport() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { batchId: string }>({
    mutationKey: ['identity:bulkimport:cancel'],
    mutationFn: async ({ batchId }) => {
      // Endpoint non supporté dans l'API actuelle
      throw new Error('Annulation d\'import non supportée par l’API actuelle');
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
      // Utiliser le statut du batch comme fallback de progression
      const { data } = await identityApi.getBatchStatusApiV1IdentityBulkimportBatchesBatchIdStatusGet(batchId);
      return data as unknown;
    },
    refetchInterval: options?.refetchInterval ?? 5000,
  });
}

export function useIdentityCsvTemplate(domain?: string) {
  return useQuery<string | unknown, Error>({
    queryKey: ['identity:bulkimport:template', domain],
    enabled: !!domain,
    queryFn: async () => {
      if (!domain) throw new Error('domain requis');
      // API: role (domain) + formatType optionnel (csv/xlsx)
      const { data } = await identityApi.getImportTemplateApiV1IdentityBulkimportTemplateRoleGet(domain);
      return data as unknown;
    },
  });
}

export function useIdentitySseStats() {
  return useQuery<unknown, Error>({
    queryKey: ['identity:bulkimport:sse-stats'],
    queryFn: async () => {
      // Endpoint non disponible
      throw new Error('SSE stats non supporté par l’API actuelle');
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
  return useQuery<StandardListResponse, Error>({
    queryKey: ['identity:identities', params],
    queryFn: async () => {
      const { data } = await identityApi.listIdentitiesApiV1IdentityGet(
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
      return data as StandardListResponse;
    },
    placeholderData: (prev) => prev,
  });
}

export function useIdentityGet(identityId?: string) {
  return useQuery<IdentityWithRoles | unknown, Error>({
    queryKey: ['identity:identity', identityId],
    enabled: !!identityId,
    queryFn: async () => {
      if (!identityId) throw new Error('identityId requis');
      const { data } = await identityApi.getIdentityApiV1IdentityIdentityIdGet(identityId);
      const single = data as StandardSingleResponse;
      return (single?.data as IdentityWithRoles) ?? single?.data;
    },
  });
}

export function useIdentityCreate() {
  const queryClient = useQueryClient();
  return useMutation<StandardSuccessResponse, Error, IdentityCreate>({
    mutationKey: ['identity:create'],
    mutationFn: async (payload) => {
      const { data } = await identityApi.createIdentityApiV1IdentityPost(payload);
      return data as StandardSuccessResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['identity:identities'] });
    },
  });
}

export function useIdentityUpdate(identityId?: string) {
  const queryClient = useQueryClient();
  return useMutation<StandardSuccessResponse, Error, IdentityUpdate>({
    mutationKey: ['identity:update', identityId],
    mutationFn: async (payload) => {
      if (!identityId) throw new Error('identityId requis');
      const { data } = await identityApi.updateIdentityApiV1IdentityIdentityIdPatch(identityId, payload);
      return data as StandardSuccessResponse;
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
      const { data } = await identityApi.deleteIdentityApiV1IdentityIdentityIdDelete(identityId);
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
      const { data } = await identityApi.linkIdentityToEstablishmentApiV1IdentityIdentityIdEstablishmentsPost(identityId, payload);
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
      const { data } = await identityApi.unlinkIdentityFromEstablishmentApiV1IdentityIdentityIdEstablishmentsEstablishmentIdDelete(identityId, establishmentId);
      return data as unknown;
    },
    onSuccess: () => {
      if (identityId) queryClient.invalidateQueries({ queryKey: ['identity:identity', identityId] });
    },
  });
}

// Hooks manquants pour les endpoints non couverts

export function useIdentityRoot() {
  return useQuery<unknown, Error>({
    queryKey: ['identity:root'],
    queryFn: async () => {
      const { data } = await identityApi.rootGet();
      return data as unknown;
    },
  });
}

export function useIdentityHealth() {
  return useQuery<unknown, Error>({
    queryKey: ['identity:health'],
    queryFn: async () => {
      const { data } = await identityApi.healthCheckHealthGet();
      return data as unknown;
    },
  });
}

export function useIdentityStreamProgress(batchId?: string, timeout?: number | null) {
  return useQuery<unknown, Error>({
    queryKey: ['identity:stream-progress', batchId, timeout],
    enabled: !!batchId,
    queryFn: async () => {
      if (!batchId) throw new Error('batchId requis');
      // Fallback vers le statut périodique au lieu du SSE
      const { data } = await identityApi.getBatchStatusApiV1IdentityBulkimportBatchesBatchIdStatusGet(batchId);
      return data as unknown;
    },
  });
}

export function useIdentitySseOptions(batchId?: string) {
  return useQuery<unknown, Error>({
    queryKey: ['identity:sse-options', batchId],
    enabled: !!batchId,
    queryFn: async () => {
      // Endpoint non disponible
      throw new Error('Options SSE non supportées par l’API actuelle');
    },
  });
}

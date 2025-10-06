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
  RoleAssignmentCreate,
  RoleAssignmentResponse,
  RoleAssignmentUpdate,
} from '../api/identity-service/api';

// Types locaux pour typer les items d'un batch et la réponse paginée
export type IdentityBatchItem = {
  // Current API fields (observed)
  id?: string;
  row_number?: number;
  email?: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  role_principal?: string | null;
  role_effectif?: string | null;
  cycle_codes?: string[] | string | null | undefined; // backend may return array, string or null
  status?: string;
  processed_at?: string;
  identity_id?: string;
  error_message?: string | null;

  // Legacy/compat fields (older payloads)
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
      // Normalize response into StandardListResponse-like shape { data, total, page, size }
      const objUnknown: unknown = data;
      let list: unknown[] = [];
      let page = params?.page ?? 1;
      let size = params?.size ?? 0;
      let total = 0;

      const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

      if (Array.isArray(objUnknown)) {
        list = objUnknown as unknown[];
        size = list.length;
        total = list.length;
      } else if (isRecord(objUnknown)) {
        const o = objUnknown;
        const d = o.data;
        const items = o.items as unknown;
        const batches = o.batches as unknown;
        if (Array.isArray(d)) list = d as unknown[];
        else if (Array.isArray(items)) list = items as unknown[];
        else if (Array.isArray(batches)) list = batches as unknown[];
        page = (typeof o.page === 'number' ? o.page : page) as number;
        size = (typeof o.size === 'number' ? o.size : (list.length || size)) as number;
        total = (typeof o.total === 'number' ? o.total : (typeof (o as { count?: unknown }).count === 'number' ? (o as { count?: number }).count : list.length)) as number;
      }
      return { data: list as unknown[], page, size, total } as unknown as StandardListResponse;
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
      // Use the dedicated endpoint for items with server-side pagination/filters
      const { data } = await identityApi.getBatchItemsApiV1IdentityBulkimportBatchesBatchIdItemsGet(
        params.batchId,
        params.page ?? 1,
        params.size ?? 50,
        params.itemStatus ?? undefined,
        undefined,
      );
      const obj: unknown = data;

      // Normalisation robuste: supporte
      // - { items: [...], page, size, total, pages }
      // - { data: [...], page, size, total, pages }
      // - { data: { items: [...], page, size, total, pages } }
      // - [ ... ] (tableau brut)
      let items: IdentityBatchItem[] = [];
      let page = params.page ?? 1;
      let size = params.size ?? 50;
      let total: number | undefined = undefined;
      let pages: number | undefined = undefined;

      const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

      if (isRecord(obj) && Array.isArray((obj as { items?: unknown[] }).items)) {
        const root = obj as { items?: unknown[]; page?: number; size?: number; total?: number; count?: number; pages?: number };
        items = (root.items ?? []) as IdentityBatchItem[];
        page = (typeof root.page === 'number' ? root.page : page);
        size = (typeof root.size === 'number' ? root.size : size);
        total = (typeof root.total === 'number' ? root.total : (typeof root.count === 'number' ? root.count : items.length));
        pages = (typeof root.pages === 'number' ? root.pages : (total && size ? Math.ceil(total / size) : undefined));
      } else if (isRecord(obj) && Array.isArray((obj as { data?: unknown[] }).data)) {
        const root = obj as { data?: unknown[]; page?: number; size?: number; total?: number; count?: number; pages?: number };
        items = (root.data ?? []) as IdentityBatchItem[];
        page = (typeof root.page === 'number' ? root.page : page);
        size = (typeof root.size === 'number' ? root.size : size);
        total = (typeof root.total === 'number' ? root.total : (typeof root.count === 'number' ? root.count : items.length));
        pages = (typeof root.pages === 'number' ? root.pages : (total && size ? Math.ceil(total / size) : undefined));
      } else if (isRecord(obj) && isRecord((obj as { data?: unknown }).data) && Array.isArray(((obj as { data?: Record<string, unknown> }).data as Record<string, unknown>).items as unknown[])) {
        const root = (obj as { data?: Record<string, unknown> }).data as { items?: unknown[]; page?: number; size?: number; total?: number; count?: number; pages?: number };
        items = (root.items ?? []) as IdentityBatchItem[];
        page = (typeof root.page === 'number' ? root.page : page);
        size = (typeof root.size === 'number' ? root.size : size);
        total = (typeof root.total === 'number' ? root.total : (typeof root.count === 'number' ? root.count : items.length));
        pages = (typeof root.pages === 'number' ? root.pages : (total && size ? Math.ceil(total / size) : undefined));
      } else if (Array.isArray(obj)) {
        items = obj as IdentityBatchItem[];
        total = items.length;
        size = items.length;
        pages = 1;
      } else {
        // Dernier recours: tenter root.items d'un objet quelconque
        if (isRecord(obj)) {
          const nested = isRecord((obj as { data?: unknown }).data) ? (obj as { data?: Record<string, unknown> }).data : obj;
          if (isRecord(nested) && Array.isArray((nested as { items?: unknown[] }).items)) {
            const r = nested as { items?: unknown[]; page?: number; size?: number; total?: number; count?: number; pages?: number };
            items = (r.items ?? []) as IdentityBatchItem[];
            page = (typeof r.page === 'number' ? r.page : page);
            size = (typeof r.size === 'number' ? r.size : size);
            total = (typeof r.total === 'number' ? r.total : (typeof r.count === 'number' ? r.count : items.length));
            pages = (typeof r.pages === 'number' ? r.pages : (total && size ? Math.ceil(total / size) : undefined));
          }
        }
      }

      return { items, total, page, size, pages } as IdentityBatchItemsResult;
    },
    placeholderData: (prev: IdentityBatchItemsResult | undefined) => prev as IdentityBatchItemsResult | undefined,
    refetchInterval: options?.refetchInterval ?? false,
  });
}

export type IdentityBatchErrorsResult = {
  errors: unknown[];
  total?: number;
  page?: number;
  size?: number;
  pages?: number;
};

export function useIdentityBatchErrors(
  params: { batchId?: string; page?: number; size?: number; errorType?: string | null },
  options?: { refetchInterval?: number | false }
) {
  return useQuery<IdentityBatchErrorsResult, Error>({
    queryKey: ['identity:batch-errors', params],
    enabled: !!params.batchId,
    queryFn: async () => {
      if (!params.batchId) throw new Error('batchId requis');
      const { data } = await identityApi.getBatchErrorsApiV1IdentityBulkimportBatchesBatchIdErrorsGet(
        params.batchId,
        params.page ?? 1,
        params.size ?? 50,
        params.errorType ?? undefined,
      );
      const obj: unknown = data;
      const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
      let errors: unknown[] = [];
      let page = params.page ?? 1;
      let size = params.size ?? 50;
      let total = 0;
      let pages: number | undefined = undefined;

      if (isRecord(obj) && Array.isArray((obj as { errors?: unknown[] }).errors)) {
        const root = obj as { errors?: unknown[]; page?: number; size?: number; total?: number; count?: number; pages?: number };
        errors = root.errors ?? [];
        page = (typeof root.page === 'number' ? root.page : page);
        size = (typeof root.size === 'number' ? root.size : size);
        total = (typeof root.total === 'number' ? root.total : (typeof root.count === 'number' ? root.count : errors.length));
        pages = (typeof root.pages === 'number' ? root.pages : (total && size ? Math.ceil(total / size) : undefined));
      } else if (isRecord(obj) && isRecord((obj as { data?: unknown }).data)) {
        const d = (obj as { data?: Record<string, unknown> }).data as { errors?: unknown[]; page?: number; size?: number; total?: number; count?: number; pages?: number };
        if (Array.isArray(d?.errors)) {
          errors = d.errors;
          page = (typeof d.page === 'number' ? d.page : page);
          size = (typeof d.size === 'number' ? d.size : size);
          total = (typeof d.total === 'number' ? d.total : (typeof d.count === 'number' ? d.count : errors.length));
          pages = (typeof d.pages === 'number' ? d.pages : (total && size ? Math.ceil(total / size) : undefined));
        }
      } else if (Array.isArray(obj)) {
        errors = obj as unknown[];
        total = errors.length;
        size = errors.length;
        pages = 1;
      }

      return { errors, total, page, size, pages } as IdentityBatchErrorsResult;
    },
    placeholderData: (prev: IdentityBatchErrorsResult | undefined) => prev as IdentityBatchErrorsResult | undefined,
    refetchInterval: options?.refetchInterval ?? false,
  });
}

export function useIdentityBulkImport() {
  const queryClient = useQueryClient();
  return useMutation<StandardSingleResponse, Error, { file: File; establishmentId: string }>(
    {
      mutationKey: ['identity:bulkimport'],
      mutationFn: async ({ file, establishmentId }) => {
        // sourceFileUrl n'est plus supporté directement par l'API
        const { data } = await identityApi.bulkImportIdentitiesApiV1IdentityBulkimportPost(file, establishmentId);
        return data as StandardSingleResponse;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['identity:batches'] });
      },
    }
  );
}

export function useIdentityBulkProgress(batchId?: string, options?: { refetchInterval?: number | false }) {
  return useQuery<unknown, Error>({
    queryKey: ['identity:bulkimport:progress', batchId],
    enabled: !!batchId,
    queryFn: async () => {
      if (!batchId) throw new Error('batchId requis');
      // Utiliser le statut du batch comme fallback de progression
      const { data } = await identityApi.getBatchStatusApiV1IdentityBulkimportBatchesBatchIdStatusGet(batchId);
      const obj: unknown = data;
      const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
      const root: Record<string, unknown> | unknown = (isRecord(obj) && ('status' in obj || 'total_items' in obj || 'total' in obj))
        ? obj
        : (isRecord(obj) && isRecord((obj as { data?: unknown }).data) ? (obj as { data?: Record<string, unknown> }).data as Record<string, unknown> : obj);
      const pick = <T>(...vals: (T | undefined | null)[]): T | undefined => vals.find((v) => v !== undefined && v !== null) as T | undefined;
      const normalized = {
        status: isRecord(root) ? pick<string>(root.status as string, root.state as string, (root as { progress_status?: string }).progress_status) : undefined,
        total_items: isRecord(root) ? pick<number>(root.total_items as number, root.total as number, (root as { count?: number }).count, (root as { totalCount?: number }).totalCount) : undefined,
        new_count: isRecord(root) ? pick<number>(root.new_count as number, (root as { created_count?: number }).created_count, (root as { new?: number }).new, (root as { created?: number }).created, (root as { success_new?: number }).success_new, (root as { inserted_count?: number }).inserted_count) : undefined,
        updated_count: isRecord(root) ? pick<number>(root.updated_count as number, (root as { update_count?: number }).update_count, (root as { updated?: number }).updated) : undefined,
        skipped_count: isRecord(root) ? pick<number>(root.skipped_count as number, (root as { skip_count?: number }).skip_count, (root as { skipped?: number }).skipped) : undefined,
        invalid_count: isRecord(root) ? pick<number>(root.invalid_count as number, (root as { error_count?: number }).error_count, (root as { errors?: number }).errors, (root as { invalid?: number }).invalid) : undefined,
        raw: obj,
      };
      return normalized as unknown;
    },
    refetchInterval: options?.refetchInterval ?? 5000,
  });
}

export function useIdentityCsvTemplate(params?: { role?: string; formatType?: 'csv' | 'xlsx' }) {
  return useQuery<Blob, Error>({
    queryKey: ['identity:bulkimport:template', params?.role, params?.formatType ?? 'csv'],
    enabled: !!params?.role,
    queryFn: async () => {
      const role = params?.role;
      const format = params?.formatType ?? 'csv';
      if (!role) throw new Error('role requis');
      const resp = await identityApi.getImportTemplateApiV1IdentityBulkimportTemplateRoleGet(role, format, { responseType: 'blob' });
      return resp.data as unknown as Blob;
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
    placeholderData: (prev: StandardListResponse | undefined) => prev,
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

export function useIdentityGetFull(identityId?: string) {
  return useQuery<IdentityWithRoles | unknown, Error>({
    queryKey: ['identity:identity:full', identityId],
    enabled: !!identityId,
    queryFn: async () => {
      if (!identityId) throw new Error('identityId requis');
      const { data } = await identityApi.getIdentityWithRolesApiV1IdentityIdentitiesIdentityIdFullGet(identityId);
      return data as IdentityWithRoles;
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

export function useIdentityLastCode() {
  return useQuery<string | undefined, Error>({
    queryKey: ['identity:last-code'],
    queryFn: async () => {
      const { data } = await identityApi.getLastCodeIdentiteApiV1IdentityLastCodeGet();
      // Prefer LastCodeResponse { last_code: string }
      // Back-compat fallbacks: StandardSingleResponse { data: string | { last_code } } | raw string
      const v: unknown = data;
      const isRecord = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);
      if (isRecord(v) && typeof (v as { last_code?: unknown }).last_code === 'string') {
        return String((v as { last_code?: unknown }).last_code);
      }
      const maybeSingle = v as Partial<StandardSingleResponse> | undefined;
      const inner: unknown = (maybeSingle as { data?: unknown } | undefined)?.data;
      if (typeof inner === 'string') return inner;
      if (isRecord(inner) && typeof (inner as { last_code?: unknown }).last_code === 'string') return String((inner as { last_code?: unknown }).last_code);
      if (typeof v === 'string') return v;
      return undefined;
    },
    placeholderData: (prev: string | undefined) => prev,
  });
}

// Catalogs hooks
export function useIdentityCatalogRolesPrincipaux(params?: { page?: number; size?: number; search?: string; isActive?: boolean }) {
  return useQuery<StandardListResponse, Error>({
    queryKey: ['identity:catalog:roles-principaux', params],
    queryFn: async () => {
      const { data } = await identityApi.getRolesPrincipauxApiV1IdentityCatalogsRolesPrincipauxGet(
        params?.page,
        params?.size,
        params?.search ?? undefined,
        params?.isActive ?? undefined,
      );
      return data as StandardListResponse;
    },
    placeholderData: (prev: StandardListResponse | undefined) => prev,
  });
}

export function useIdentityCatalogRolesEffectifs(params?: { page?: number; size?: number; search?: string; groupKey?: string; isSensitive?: boolean; isActive?: boolean }) {
  return useQuery<StandardListResponse, Error>({
    queryKey: ['identity:catalog:roles-effectifs', params],
    queryFn: async () => {
      const { data } = await identityApi.getRolesEffectifsApiV1IdentityCatalogsRolesEffectifsGet(
        params?.page,
        params?.size,
        params?.search ?? undefined,
        params?.groupKey ?? undefined,
        params?.isSensitive ?? undefined,
        params?.isActive ?? undefined,
      );
      return data as StandardListResponse;
    },
    placeholderData: (prev: StandardListResponse | undefined) => prev,
  });
}

export function useIdentityCatalogRolesEffectifsMapping() {
  return useQuery<unknown, Error>({
    queryKey: ['identity:catalog:roles-effectifs:mapping'],
    queryFn: async () => {
      const { data } = await identityApi.getRolesEffectifsMappingApiV1IdentityCatalogsRolesEffectifsMappingGet();
      return data as unknown;
    },
    placeholderData: (prev: unknown) => prev,
    staleTime: 60_000,
  });
}

export function useIdentityCatalogCycles(params?: { page?: number; size?: number; search?: string; isActive?: boolean }) {
  return useQuery<StandardListResponse, Error>({
    queryKey: ['identity:catalog:cycles', params],
    queryFn: async () => {
      const { data } = await identityApi.getCyclesApiV1IdentityCatalogsCyclesGet(
        params?.page,
        params?.size,
        params?.search ?? undefined,
        params?.isActive ?? undefined,
      );
      return data as StandardListResponse;
    },
    placeholderData: (prev: StandardListResponse | undefined) => prev,
  });
}

// Role assignments hooks
export function useIdentityRoles(identityId?: string, establishmentId?: string) {
  return useQuery<RoleAssignmentResponse[], Error>({
    queryKey: ['identity:roles', identityId, establishmentId],
    enabled: !!identityId,
    queryFn: async () => {
      if (!identityId) throw new Error('identityId requis');
      const { data } = await identityApi.getIdentityRolesApiV1IdentityIdentitiesIdentityIdRolesGet(identityId, establishmentId ?? undefined);
      return (data as RoleAssignmentResponse[]) ?? [];
    },
    placeholderData: (prev: RoleAssignmentResponse[] | undefined) => prev,
  });
}

export function useIdentityRole(identityId?: string, roleId?: string) {
  return useQuery<RoleAssignmentResponse | undefined, Error>({
    queryKey: ['identity:role', identityId, roleId],
    enabled: !!identityId && !!roleId,
    queryFn: async () => {
      if (!identityId || !roleId) throw new Error('identityId et roleId requis');
      const { data } = await identityApi.getRoleAssignmentApiV1IdentityIdentitiesIdentityIdRolesRoleIdGet(identityId, roleId);
      return data as RoleAssignmentResponse;
    },
    placeholderData: (prev) => prev,
  });
}

export function useIdentityRoleCreate(identityId?: string) {
  const queryClient = useQueryClient();
  return useMutation<RoleAssignmentResponse, Error, RoleAssignmentCreate>({
    mutationKey: ['identity:role:create', identityId],
    mutationFn: async (payload) => {
      if (!identityId) throw new Error('identityId requis');
      const { data } = await identityApi.createRoleAssignmentApiV1IdentityIdentitiesIdentityIdRolesPost(identityId, payload);
      return data as RoleAssignmentResponse;
    },
    onSuccess: () => {
      if (identityId) {
        queryClient.invalidateQueries({ queryKey: ['identity:roles', identityId] });
        queryClient.invalidateQueries({ queryKey: ['identity:identity:full', identityId] });
      }
    },
  });
}

export function useIdentityRoleUpdate(identityId?: string, roleId?: string) {
  const queryClient = useQueryClient();
  return useMutation<RoleAssignmentResponse, Error, RoleAssignmentUpdate>({
    mutationKey: ['identity:role:update', identityId, roleId],
    mutationFn: async (payload) => {
      if (!identityId || !roleId) throw new Error('identityId et roleId requis');
      const { data } = await identityApi.updateRoleAssignmentApiV1IdentityIdentitiesIdentityIdRolesRoleIdPut(identityId, roleId, payload);
      return data as RoleAssignmentResponse;
    },
    onSuccess: () => {
      if (identityId) {
        queryClient.invalidateQueries({ queryKey: ['identity:roles', identityId] });
        queryClient.invalidateQueries({ queryKey: ['identity:identity:full', identityId] });
      }
    },
  });
}

export function useIdentityRoleDelete(identityId?: string) {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { roleId: string }>({
    mutationKey: ['identity:role:delete', identityId],
    mutationFn: async ({ roleId }) => {
      if (!identityId || !roleId) throw new Error('identityId et roleId requis');
      const { data } = await identityApi.deleteRoleAssignmentApiV1IdentityIdentitiesIdentityIdRolesRoleIdDelete(identityId, roleId);
      return data as unknown;
    },
    onSuccess: () => {
      if (identityId) {
        queryClient.invalidateQueries({ queryKey: ['identity:roles', identityId] });
        queryClient.invalidateQueries({ queryKey: ['identity:identity:full', identityId] });
      }
    },
  });
}

// Templates info/list
export function useIdentityTemplateInfo(role?: string) {
  return useQuery<unknown, Error>({
    queryKey: ['identity:bulkimport:template-info', role],
    enabled: !!role,
    queryFn: async () => {
      if (!role) throw new Error('role requis');
      const { data } = await identityApi.getTemplateInfoApiV1IdentityBulkimportTemplateRoleInfoGet(role);
      return data as unknown;
    },
    placeholderData: (prev: unknown) => prev,
  });
}

export function useIdentityTemplatesList() {
  return useQuery<unknown, Error>({
    queryKey: ['identity:bulkimport:templates'],
    queryFn: async () => {
      const { data } = await identityApi.listAvailableTemplatesApiV1IdentityBulkimportTemplatesGet();
      return data as unknown;
    },
    placeholderData: (prev: unknown) => prev,
  });
}

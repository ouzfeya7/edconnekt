import { useQuery } from '@tanstack/react-query';
import { competenceReferentialsApi } from '../../api/competence-service/client';
import type { ReferentialListResponse, ReferentialResponse, ReferentialTree } from '../../api/competence-service/api';

export interface UseReferentialsParams {
  page?: number;
  size?: number;
  cycle?: string | null;
  state?: string | null;
  visibility?: string | null;
  q?: string | null;
}

export function useReferentials(params: UseReferentialsParams = {}) {
  const { page = 1, size = 20, cycle = null, state = null, visibility = null, q = null } = params;

  return useQuery<ReferentialListResponse, Error>({
    queryKey: ['competence:referentials', { page, size, cycle, state, visibility, q }],
    queryFn: async () => {
      const { data } = await competenceReferentialsApi.listReferentialsApiV1ReferentialsGet(
        page,
        size,
        cycle ?? undefined,
        state ?? undefined,
        visibility ?? undefined,
        q ?? undefined
      );
      return data;
    },
    placeholderData: (prev: ReferentialListResponse | undefined) => prev,
    staleTime: 60_000,
  });
}

export function useReferential(referentialId: string, versionNumber?: number, includeTree: boolean = false) {
  return useQuery<ReferentialResponse | ReferentialTree, Error>({
    queryKey: ['competence:referential', { referentialId, versionNumber, includeTree }],
    queryFn: async () => {
      const { data } = await competenceReferentialsApi.getReferentialApiV1ReferentialsReferentialIdGet(
        referentialId,
        versionNumber ?? undefined,
        includeTree
      );
      return data;
    },
    enabled: !!referentialId,
    staleTime: 60_000,
  });
}

export function useReferentialTree(referentialId: string, versionNumber?: number) {
  return useQuery<ReferentialTree, Error>({
    queryKey: ['competence:referential:tree', { referentialId, versionNumber }],
    queryFn: async () => {
      const { data } = await competenceReferentialsApi.getReferentialApiV1ReferentialsReferentialIdGet(
        referentialId,
        versionNumber ?? undefined,
        true
      );
      return data as ReferentialTree;
    },
    enabled: !!referentialId,
    staleTime: 60_000,
  });
}



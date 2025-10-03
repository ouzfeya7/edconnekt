import { useQuery } from '@tanstack/react-query';
import { identityMeApi } from '../api/identity-service/client';
import { unwrapList } from '../api/identity-service/adapters';
import type { StandardListResponse, RoleAssignmentResponse } from '../api/identity-service/api';

export function useMyRolesDetailed(etabId?: string, options?: { enabled?: boolean }) {
  return useQuery<RoleAssignmentResponse[], Error>({
    queryKey: ['identity:me:roles:detailed', etabId],
    enabled: (options?.enabled ?? true) && !!etabId,
    queryFn: async () => {
      if (!etabId) throw new Error('etab requis');
      const { data } = await identityMeApi.getUserRolesApiV1IdentityMeRolesGet(etabId);
      return unwrapList<RoleAssignmentResponse>(data as unknown as StandardListResponse);
    },
    placeholderData: (prev) => prev,
    staleTime: 60_000,
  });
}



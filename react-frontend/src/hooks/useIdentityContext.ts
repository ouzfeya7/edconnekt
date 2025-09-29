import { useQuery } from '@tanstack/react-query';
import { identityMeApi } from '../api/identity-service/client';
import type { StandardListResponse } from '../api/identity-service/api';

/**
 * Hook: liste des établissements de l'utilisateur connecté
 * GET /api/v1/identity/me/establishments
 */
export function useIdentityMyEstablishments(options?: { enabled?: boolean }) {
  return useQuery<StandardListResponse, Error>({
    queryKey: ['identity:me:establishments'],
    enabled: options?.enabled ?? true,
    queryFn: async () => {
      const { data } = await identityMeApi.getUserEstablishmentsApiV1IdentityMeEstablishmentsGet();
      return data as StandardListResponse;
    },
    placeholderData: (prev) => prev,
  });
}

/**
 * Hook: rôles de l'utilisateur dans un établissement
 * GET /api/v1/identity/me/roles?etab=<UUID>
 */
export function useIdentityMyRoles(etab?: string, options?: { enabled?: boolean }) {
  return useQuery<StandardListResponse, Error>({
    queryKey: ['identity:me:roles', etab],
    enabled: (options?.enabled ?? true) && !!etab,
    queryFn: async () => {
      if (!etab) throw new Error('etab requis');
      const { data } = await identityMeApi.getUserRolesApiV1IdentityMeRolesGet(etab);
      return data as StandardListResponse;
    },
    placeholderData: (prev) => prev,
  });
}

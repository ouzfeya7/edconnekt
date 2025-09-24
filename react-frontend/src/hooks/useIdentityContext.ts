import { useQuery } from '@tanstack/react-query';
import { identityDefaultApi } from '../api/identity-service/client';
import type {
  UserEstablishmentsResponse,
  UserRolesResponse,
} from '../api/identity-service/api';

/**
 * Hook: liste des établissements de l'utilisateur connecté
 * GET /api/v1/identity/me/establishments
 */
export function useIdentityMyEstablishments(options?: { enabled?: boolean }) {
  return useQuery<UserEstablishmentsResponse, Error>({
    queryKey: ['identity:me:establishments'],
    enabled: options?.enabled ?? true,
    queryFn: async () => {
      const { data } = await identityDefaultApi.getUserEstablishmentsApiV1IdentityMeEstablishmentsGet();
      return data as UserEstablishmentsResponse;
    },
    placeholderData: (prev) => prev,
  });
}

/**
 * Hook: rôles de l'utilisateur dans un établissement
 * GET /api/v1/identity/me/roles?etab=<UUID>
 */
export function useIdentityMyRoles(etab?: string, options?: { enabled?: boolean }) {
  return useQuery<UserRolesResponse, Error>({
    queryKey: ['identity:me:roles', etab],
    enabled: (options?.enabled ?? true) && !!etab,
    queryFn: async () => {
      if (!etab) throw new Error('etab requis');
      const { data } = await identityDefaultApi.getUserRolesInEstablishmentApiV1IdentityMeRolesGet(etab);
      return data as UserRolesResponse;
    },
    placeholderData: (prev) => prev,
  });
}

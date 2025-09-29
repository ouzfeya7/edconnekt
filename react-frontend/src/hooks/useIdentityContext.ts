import { useQuery } from '@tanstack/react-query';
import { identityMeApi } from '../api/identity-service/client';
import { unwrapList } from '../api/identity-service/adapters';
import type { EstablishmentRole } from '../api/identity-service/types';

/**
 * Hook: liste des établissements de l'utilisateur connecté
 * GET /api/v1/identity/me/establishments
 */
export function useIdentityMyEstablishments(options?: { enabled?: boolean }) {
  return useQuery<string[], Error>({
    queryKey: ['identity:me:establishments'],
    enabled: options?.enabled ?? true,
    queryFn: async () => {
      const { data } = await identityMeApi.getUserEstablishmentsApiV1IdentityMeEstablishmentsGet();
      return unwrapList<string>(data as any);
    },
    placeholderData: (prev) => prev,
  });
}

/**
 * Hook: rôles de l'utilisateur dans un établissement
 * GET /api/v1/identity/me/roles?etab=<UUID>
 */
export function useIdentityMyRoles(etab?: string, options?: { enabled?: boolean }) {
  return useQuery<EstablishmentRole[], Error>({
    queryKey: ['identity:me:roles', etab],
    enabled: (options?.enabled ?? true) && !!etab,
    queryFn: async () => {
      if (!etab) throw new Error('etab requis');
      const { data } = await identityMeApi.getUserRolesApiV1IdentityMeRolesGet(etab);
      return unwrapList<EstablishmentRole>(data as any);
    },
    placeholderData: (prev) => prev,
  });
}

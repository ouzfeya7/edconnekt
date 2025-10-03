import { useQuery } from '@tanstack/react-query';
import { identityMeApi } from '../api/identity-service/client';
import { unwrapList } from '../api/identity-service/adapters';
import type { EstablishmentRole } from '../api/identity-service/types';
import type { StandardListResponse } from '../api/identity-service/api';

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
      const raw = unwrapList<unknown>(data as unknown as StandardListResponse);
      const ids = Array.isArray(raw)
        ? raw
            .map((item) => (typeof item === 'string' ? item : (item as { id?: string }).id))
            .filter((v): v is string => typeof v === 'string' && !!v)
        : [];
      return ids;
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
      const raw = unwrapList<unknown>(data as unknown as StandardListResponse) as Array<unknown>;
      const codes = Array.isArray(raw)
        ? raw
            .map((it) => {
              const obj = it as { role_principal?: { code?: string } } | undefined;
              return obj?.role_principal?.code as (EstablishmentRole | string | undefined);
            })
            .filter((code): code is EstablishmentRole => code === 'teacher' || code === 'admin_staff' || code === 'student' || code === 'parent')
        : [];
      return codes;
    },
    placeholderData: (prev) => prev,
  });
}

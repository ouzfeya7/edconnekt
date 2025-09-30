import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useIdentityMyEstablishments } from './useIdentityContext';
import type { EstablishmentRole } from '../api/identity-service/types';
import { identityMeApi } from '../api/identity-service/client';
import { unwrapList } from '../api/identity-service/adapters';

export type ResolvePrincipalResult = {
  etabId: string | null;
  loading: boolean;
  error: string | null;
};

function scoreRoles(roles: EstablishmentRole[] | undefined): number {
  if (!roles || roles.length === 0) return 0;
  // Priorisation simple: admin_staff > teacher > parent > student
  const order: EstablishmentRole[] = ['admin_staff', 'teacher', 'parent', 'student'];
  let best = 0;
  for (const r of roles) {
    const idx = order.indexOf(r as EstablishmentRole);
    if (idx >= 0) {
      const val = order.length - idx;
      if (val > best) best = val;
    }
  }
  return best;
}

export function useResolvePrincipalEtab(options?: { enabled?: boolean; maxProbe?: number }): ResolvePrincipalResult {
  const { data: myEstabs, isLoading: estabsLoading, isError: estabsError } = useIdentityMyEstablishments({ enabled: options?.enabled ?? true });
  const list = Array.isArray(myEstabs) ? myEstabs : [];
  const maxProbe = options?.maxProbe ?? 5;
  const probeIds = useMemo(() => list.slice(0, Math.min(maxProbe, list.length)), [list, maxProbe]);

  const { data: bestId, isLoading: rolesLoading, isError: rolesError } = useQuery<string | null, Error>({
    queryKey: ['identity:me:principal', probeIds],
    enabled: (options?.enabled ?? true) && probeIds.length > 0,
    queryFn: async () => {
      let best: { id: string; score: number } | null = null;
      for (const etabId of probeIds) {
        const { data } = await identityMeApi.getUserRolesApiV1IdentityMeRolesGet(etabId);
        const roles = unwrapList<EstablishmentRole>(data as any);
        const s = scoreRoles(roles);
        if (!best || s > best.score) best = { id: etabId, score: s };
      }
      return best?.id ?? (list[0] ?? null);
    },
    staleTime: 60_000,
  });

  const loading = estabsLoading || rolesLoading;
  const error = estabsError ? 'Impossible de récupérer vos établissements' : (rolesError ? 'Impossible de récupérer vos rôles' : null);

  return { etabId: bestId ?? (list[0] ?? null), loading, error };
}

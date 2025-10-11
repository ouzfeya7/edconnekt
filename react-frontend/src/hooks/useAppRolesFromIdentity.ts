import { useMemo } from 'react';
import { useIdentityContextOptional } from '../contexts/IdentityContext';
import { useIdentityMyRoles } from './useIdentityContext';
import { mapIdentityRoleToAppRole, computeCapabilitiesFromIdentityRole } from '../utils/roles';
import type { EstablishmentRole } from '../utils/contextStorage';

interface UseAppRolesResult {
  loading: boolean;
  error?: string;
  etabId: string | null;
  identityRole: EstablishmentRole | null; // source de vérité (identity-service)
  appRoles: string[]; // mapping UI (compatibilité avec l'ancien modèle)
  capabilities: ReturnType<typeof computeCapabilitiesFromIdentityRole>;
}

// Ce hook déduit le rôle actif côté application à partir d'identity-service.
// Il ne force pas la sélection: si pas de contexte actif, il retourne un état neutre.
export function useAppRolesFromIdentity(): UseAppRolesResult {
  const ctx = useIdentityContextOptional();
  const activeEtabId = ctx?.activeEtabId ?? null;
  const activeRole = ctx?.activeRole ?? null;

  // Si un etab est sélectionné dans le modal/page, on peut aussi charger la liste des rôles.
  // Cependant, pour l'UI, le rôle actif sélectionné dans le contexte suffit comme source de vérité.
  const { isLoading, isError } = useIdentityMyRoles(activeEtabId ?? undefined, { enabled: !!activeEtabId });

  const identityRole: EstablishmentRole | null = activeRole ?? null;
  const appRoles = useMemo(() => {
    return identityRole ? [mapIdentityRoleToAppRole(identityRole)] : [];
  }, [identityRole]);

  const capabilities = useMemo(() => computeCapabilitiesFromIdentityRole(identityRole), [identityRole]);

  return {
    loading: isLoading,
    error: isError ? 'Impossible de récupérer vos rôles' : undefined,
    etabId: activeEtabId ?? null,
    identityRole,
    appRoles,
    capabilities,
  };
}



import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../pages/authentification/useAuth';
import { getActiveContext, setActiveContext, clearActiveContext, type EstablishmentRole } from '../utils/contextStorage';
import { IdentityContext, type IdentityContextState } from './IdentityContext';
import { useIdentityMyEstablishments, useIdentityMyRoles } from '../hooks/useIdentityContext';
import ContextSelectModal from '../components/context/ContextSelectModal';
import { identityMeApi } from '../api/identity-service/client';

// Legacy constant removed: gating is now handled via dedicated route

const IdentityContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isAuthenticated, roles } = useAuth();
  const isAdmin = Array.isArray(roles) && roles.includes('administrateur');

  const initial = getActiveContext();
  const [activeEtabId, setActiveEtabId] = useState<string | null>(initial.etabId ?? null);
  const [activeRole, setActiveRole] = useState<EstablishmentRole | null>((initial.role as EstablishmentRole | null) ?? null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEtabId, setSelectedEtabId] = useState<string | null>(null);
  const [selectionError, setSelectionError] = useState<string | undefined>(undefined);

  // Load my establishments when needed (skip for administrators):
  // either no context yet or user opened the modal to change context
  const enableEstabQuery = isAuthenticated && !isAdmin && (((!activeEtabId || !activeRole)) || modalOpen);
  const { data: myEstabs, isLoading: estabsLoading, isError: estabsError } = useIdentityMyEstablishments({ enabled: enableEstabQuery });

  // Load roles for selected etab in modal
  const { data: rolesResp, isLoading: rolesLoading } = useIdentityMyRoles(selectedEtabId ?? undefined, { enabled: !!selectedEtabId && modalOpen });
  const rolesForSelected: EstablishmentRole[] = Array.isArray(rolesResp) ? rolesResp : [];

  const openContextSelector = useCallback(() => {
    setSelectionError(undefined);
    // Pré-sélectionner l'établissement courant si un contexte actif existe
    setSelectedEtabId(activeEtabId ?? null);
    setModalOpen(true);
  }, [activeEtabId]);

  // Lorsque le modal est ouvert et qu'il n'y a qu'un seul établissement, pré-sélectionner
  React.useEffect(() => {
    const list = Array.isArray(myEstabs) ? myEstabs : [];
    if (modalOpen && !selectedEtabId && list.length === 1) {
      setSelectedEtabId(list[0] as string);
    }
  }, [modalOpen, myEstabs, selectedEtabId]);

  const handleConfirm = useCallback(async (etabId: string, role: EstablishmentRole) => {
    try {
      setSelectionError(undefined);
      await identityMeApi.selectContextApiV1IdentityMeContextSelectPost({ etab_id: etabId, role });
      // Persist locally after backend validation succeeds
      setActiveContext(etabId, role);
      setActiveEtabId(etabId);
      setActiveRole(role);
      setModalOpen(false);
      // Invalidate identity-related queries so data refreshes under new context
      queryClient.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && String(q.queryKey[0]).startsWith('identity:') });
      // Redirect to home after context selection from modal
      navigate('/', { replace: true });
    } catch (e: unknown) {
      // Surface a user-friendly error
      const msg = (e as { response?: { data?: { message?: string } } }).response?.data?.message || 'Sélection non autorisée pour cet établissement/rôle';
      setSelectionError(String(msg));
    }
  }, [queryClient, navigate]);

  const handleClear = useCallback(() => {
    clearActiveContext();
    setActiveEtabId(null);
    setActiveRole(null);
    // Optionally invalidate after clear
    queryClient.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && String(q.queryKey[0]).startsWith('identity:') });
  }, [queryClient]);

  const selectContext = useCallback(async (etabId: string, role: EstablishmentRole) => {
    await handleConfirm(etabId, role);
  }, [handleConfirm]);

  // No auto-modal flow at login; the selection is handled by a dedicated page. The modal is only for manual changes.

  const contextValue = useMemo<IdentityContextState>(() => ({
    activeEtabId,
    activeRole,
    openContextSelector,
    selectContext,
    clearContext: handleClear,
  }), [activeEtabId, activeRole, openContextSelector, selectContext, handleClear]);

  // Compute establishments list for modal (API returns list of UUID strings)
  const establishments: string[] = Array.isArray(myEstabs) ? myEstabs : [];

  return (
    <IdentityContext.Provider value={contextValue}>
      {children}
      {isAuthenticated && modalOpen && (
        <ContextSelectModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); }}
          establishments={establishments}
          selectedEtabId={selectedEtabId}
          onSelectEtab={(id) => setSelectedEtabId(id)}
          roles={rolesForSelected}
          rolesLoading={rolesLoading}
          onConfirm={(role) => {
            const etab = selectedEtabId || (establishments[0] ?? '');
            if (etab && role) handleConfirm(etab, role);
          }}
          zeroEstabs={establishments.length === 0}
          loading={estabsLoading}
          error={[
            estabsError ? 'Impossible de récupérer vos établissements' : undefined,
            selectionError,
          ].filter(Boolean).join('\n') || undefined}
          activeEtabId={activeEtabId}
          activeRole={activeRole}
        />
      )}
    </IdentityContext.Provider>
  );
};

export default IdentityContextProvider;

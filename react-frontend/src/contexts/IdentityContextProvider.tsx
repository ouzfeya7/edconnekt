import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../pages/authentification/useAuth';
import { getActiveContext, setActiveContext, clearActiveContext, type EstablishmentRole } from '../utils/contextStorage';
import { useIdentityMyEstablishments, useIdentityMyRoles } from '../hooks/useIdentityContext';
import ContextSelectModal from '../components/context/ContextSelectModal';
import { identityMeApi } from '../api/identity-service/client';

interface IdentityContextState {
  activeEtabId: string | null;
  activeRole: EstablishmentRole | null;
  openContextSelector: () => void;
  selectContext: (etabId: string, role: EstablishmentRole) => void;
  clearContext: () => void;
}

const IdentityContext = createContext<IdentityContextState | undefined>(undefined);

export const useIdentityContext = (): IdentityContextState => {
  const ctx = useContext(IdentityContext);
  if (!ctx) throw new Error('useIdentityContext must be used within IdentityContextProvider');
  return ctx;
};

// Legacy constant removed: gating is now handled via dedicated route

const IdentityContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const initial = getActiveContext();
  const [activeEtabId, setActiveEtabId] = useState<string | null>(initial.etabId ?? null);
  const [activeRole, setActiveRole] = useState<EstablishmentRole | null>((initial.role as EstablishmentRole | null) ?? null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEtabId, setSelectedEtabId] = useState<string | null>(null);
  const [selectionError, setSelectionError] = useState<string | undefined>(undefined);

  // Load my establishments when needed: either no context yet or user opened the modal to change context
  const enableEstabQuery = isAuthenticated && (((!activeEtabId || !activeRole)) || modalOpen);
  const { data: myEstabs, isLoading: estabsLoading, isError: estabsError } = useIdentityMyEstablishments({ enabled: enableEstabQuery });

  // Load roles for selected etab in modal
  const { data: rolesResp, isLoading: rolesLoading } = useIdentityMyRoles(selectedEtabId ?? undefined, { enabled: !!selectedEtabId && modalOpen });
  const rolesForSelected = (Array.isArray(rolesResp?.data) ? (rolesResp?.data as EstablishmentRole[]) : []) ?? [];

  const openContextSelector = useCallback(() => {
    setSelectionError(undefined);
    setModalOpen(true);
  }, []);

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
    } catch (e: any) {
      // Surface a user-friendly error
      const msg = e?.response?.data?.message || 'Sélection non autorisée pour cet établissement/rôle';
      setSelectionError(String(msg));
    }
  }, [queryClient]);

  const handleClear = useCallback(() => {
    clearActiveContext();
    setActiveEtabId(null);
    setActiveRole(null);
    // Optionally invalidate after clear
    queryClient.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && String(q.queryKey[0]).startsWith('identity:') });
  }, [queryClient]);

  const selectContext = useCallback((etabId: string, role: EstablishmentRole) => {
    handleConfirm(etabId, role);
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
  const establishments = (Array.isArray(myEstabs?.data) ? (myEstabs?.data as string[]) : []);

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
        />
      )}
    </IdentityContext.Provider>
  );
};

export default IdentityContextProvider;

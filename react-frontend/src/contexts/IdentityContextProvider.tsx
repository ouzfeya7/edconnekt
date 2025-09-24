import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../pages/authentification/useAuth';
import { getActiveContext, setActiveContext, clearActiveContext, type EstablishmentRole } from '../utils/contextStorage';
import { useIdentityMyEstablishments, useIdentityMyRoles } from '../hooks/useIdentityContext';
import type { UserEstablishmentResponse } from '../api/identity-service/api';
import ContextSelectModal from '../components/context/ContextSelectModal';

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

  // Load my establishments when needed: either no context yet or user opened the modal to change context
  const enableEstabQuery = isAuthenticated && (((!activeEtabId || !activeRole)) || modalOpen);
  const { data: myEstabs, isLoading: estabsLoading, isError: estabsError } = useIdentityMyEstablishments({ enabled: enableEstabQuery });

  // Load roles for selected etab in modal
  const { data: rolesResp, isLoading: rolesLoading } = useIdentityMyRoles(selectedEtabId ?? undefined, { enabled: !!selectedEtabId && modalOpen });
  const rolesForSelected = (rolesResp as unknown as { roles?: EstablishmentRole[] })?.roles ?? [];

  const openContextSelector = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleConfirm = useCallback((etabId: string, role: EstablishmentRole) => {
    setActiveContext(etabId, role);
    setActiveEtabId(etabId);
    setActiveRole(role);
    setModalOpen(false);
    // Invalidate identity-related queries so data refreshes under new context
    queryClient.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && String(q.queryKey[0]).startsWith('identity:') });
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

  // Compute establishments list for modal
  const establishments = (myEstabs?.establishments ?? []) as UserEstablishmentResponse[];

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
            const etab = selectedEtabId || (establishments[0]?.establishment_id ?? '');
            if (etab && role) handleConfirm(etab, role);
          }}
          zeroEstabs={establishments.length === 0}
          loading={estabsLoading}
          error={estabsError ? 'Impossible de récupérer vos établissements' : undefined}
        />
      )}
    </IdentityContext.Provider>
  );
};

export default IdentityContextProvider;

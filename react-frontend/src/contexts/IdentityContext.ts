import { createContext, useContext } from 'react';

import type { EstablishmentRole } from '../utils/contextStorage';

export interface IdentityContextState {
  activeEtabId: string | null;
  activeRole: EstablishmentRole | null;
  openContextSelector: () => void;
  selectContext: (etabId: string, role: EstablishmentRole) => Promise<void>;
  clearContext: () => void;
}

export const IdentityContext = createContext<IdentityContextState | undefined>(undefined);

export const useIdentityContext = (): IdentityContextState => {
  const ctx = useContext(IdentityContext);
  if (!ctx) throw new Error('useIdentityContext must be used within IdentityContextProvider');
  return ctx;
};

// Variante sûre: ne jette pas d'erreur si le Provider n'est pas dans l'arbre (retourne undefined)
export const useIdentityContextOptional = (): IdentityContextState | undefined => {
  return useContext(IdentityContext);
};



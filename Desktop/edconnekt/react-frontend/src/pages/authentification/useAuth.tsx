import { useAuthContext } from './AuthContext';

// Ce hook est maintenant une simple façade pour notre contexte.
// Cela permet de ne pas avoir à changer tous les composants qui l'utilisaient déjà.
export const useAuth = () => {
  return useAuthContext();
};

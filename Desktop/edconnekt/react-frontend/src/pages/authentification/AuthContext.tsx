import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import keycloak from './keycloak'; // Nous utiliserons l'instance existante de keycloak
import { KeycloakProfile } from 'keycloak-js';

// Définir le type pour les informations de l'utilisateur
type AuthUser = KeycloakProfile | null;

// Définir le type pour la valeur du contexte
interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser;
  roles: string[];
  login: () => void;
  logout: () => void;
}

// Créer le contexte avec une valeur par défaut
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- CONFIGURATION DU MODE MOCK ---
// Mettre à `true` pour utiliser des données factices sans Keycloak.
// Mettre à `false` pour activer l'authentification réelle avec Keycloak.
const MOCK_AUTH = true;

// Créer le fournisseur de contexte
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Si le mode MOCK est activé, on simule l'authentification.
    if (MOCK_AUTH) {
      const mockUser: KeycloakProfile = {
        username: 'test.user',
        firstName: 'Utilisateur',
        lastName: 'Test',
        email: 'test.user@example.com',
        emailVerified: true,
      };

      setUser(mockUser);
      // ----> MODIFIEZ ICI LE RÔLE POUR VOS TESTS <----
      // Mettez ['enseignant'] pour tester la vue enseignant
      // Mettez ['eleve'] pour tester la vue élève
      setRoles(['enseignant']);
      setIsAuthenticated(true);
      return; // On arrête l'exécution ici pour ne pas appeler Keycloak
    }

    // Sinon, on utilise la logique Keycloak existante.
    const initAuth = async () => {
      try {
        const authenticated = await keycloak.init({ onLoad: 'check-sso' });
        setIsAuthenticated(authenticated);

        if (authenticated) {
          const profile = await keycloak.loadUserProfile();
          setUser(profile);
          setRoles(keycloak.tokenParsed?.realm_access?.roles || []);
        }
      } catch (error) {
        console.error("Erreur d'initialisation de Keycloak", error);
        setIsAuthenticated(false);
      }
    };

    initAuth();

    keycloak.onAuthSuccess = () => {
        setIsAuthenticated(true);
        keycloak.loadUserProfile().then(setUser);
        setRoles(keycloak.tokenParsed?.realm_access?.roles || []);
    };
    
    keycloak.onAuthError = () => {
        setIsAuthenticated(false);
        setUser(null);
        setRoles([]);
    };

    keycloak.onAuthLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setRoles([]);
    };

  }, []);

  const login = () => {
    if (!MOCK_AUTH) {
      keycloak.login();
    } else {
      console.log("Connexion simulée en mode mock.");
    }
  };

  const logout = () => {
    if (!MOCK_AUTH) {
      keycloak.logout();
    } else {
      // On simule une déconnexion en réinitialisant l'état
      setIsAuthenticated(false);
      setUser(null);
      setRoles([]);
      console.log("Déconnexion simulée en mode mock.");
    }
  };

  const value = {
    isAuthenticated,
    user,
    roles,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}; 
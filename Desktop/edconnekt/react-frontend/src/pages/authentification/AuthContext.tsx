import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import keycloak from './keycloak';
import { KeycloakProfile } from 'keycloak-js';

type AuthUser = KeycloakProfile | null;

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser;
  roles: string[];
  login: () => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_AUTH = false;

const transformRoles = (keycloakRoles: string[]): string[] => {
  const roleMapping: { [key: string]: string } = {
    'ROLE_ENSEIGNANT': 'enseignant',
    'ROLE_DIRECTEUR': 'directeur',
    'ROLE_ELEVE': 'eleve',
    'ROLE_PARENT': 'parent',
    'ROLE_ADMIN_SYSTEME': 'administrateur',
    'ROLE_ADMIN_FONCTIONNEL': 'administrateur',
    'ROLE_ESPACE_FAMILLE': 'espaceFamille',
  };

  const appRoles = keycloakRoles.map(role => roleMapping[role]).filter(Boolean);
  return [...new Set(appRoles)];
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (MOCK_AUTH) {
      const mockUser: KeycloakProfile = {
        username: 'test.user',
        firstName: 'Utilisateur',
        lastName: 'Test',
        email: 'test.user@example.com',
        emailVerified: true,
      };
      setUser(mockUser);
      setRoles(['enseignant']);
      setIsAuthenticated(true);
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        const authenticated = await keycloak.init({
          onLoad: 'login-required',
          redirectUri: 'http://localhost:5173/login',
          pkceMethod: 'S256',
          responseMode: 'fragment',
          scope: 'openid',
        });
        setIsAuthenticated(authenticated);

        if (authenticated) {
          const profile = await keycloak.loadUserProfile();
          setUser(profile);
          const keycloakRoles = keycloak.tokenParsed?.realm_access?.roles || [];
          setRoles(transformRoles(keycloakRoles));
          if (keycloak.token) {
            sessionStorage.setItem('keycloak-token', keycloak.token);
          }
        }
      } catch (error) {
        console.error("Erreur d'initialisation de Keycloak", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Éviter la redondance dans les callbacks
    keycloak.onAuthSuccess = () => {
      setIsAuthenticated(true);
    };

    keycloak.onAuthError = () => {
      setIsAuthenticated(false);
      setUser(null);
      setRoles([]);
      sessionStorage.removeItem('keycloak-token');
    };

    keycloak.onAuthLogout = () => {
      setIsAuthenticated(false);
      setUser(null);
      setRoles([]);
      sessionStorage.removeItem('keycloak-token');
    };

    // Actualiser le token périodiquement
    keycloak.onTokenExpired = () => {
      keycloak.updateToken(30).catch(() => {
        console.error('Échec du rafraîchissement du token');
        logout();
      });
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
      keycloak.logout({ redirectUri: 'http://localhost:5173' });
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setRoles([]);
      sessionStorage.removeItem('keycloak-token');
      console.log("Déconnexion simulée en mode mock.");
    }
  };

  const value = {
    isAuthenticated,
    user,
    roles,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
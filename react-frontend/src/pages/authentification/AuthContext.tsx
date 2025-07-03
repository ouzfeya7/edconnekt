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
  const appRoles: string[] = [];
  keycloakRoles.forEach(role => {
    switch (role) {
      case 'ROLE_ENSEIGNANT':
        appRoles.push('enseignant');
        break;
      case 'ROLE_DIRECTEUR':
        appRoles.push('directeur');
        break;
      case 'ROLE_ELEVE':
        appRoles.push('eleve');
        break;
      case 'ROLE_PARENT':
        appRoles.push('parent');
        break;
      case 'ROLE_ADMIN_SYSTEME':
      case 'ROLE_ADMIN_FONCTIONNEL':
        appRoles.push('administrateur');
        break;
      case 'ROLE_ESPACE_FAMILLE':
        appRoles.push('espaceFamille');
        break;
      default:
        break;
    }
  });
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
      setRoles(['eleve']);
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
          scope: 'openid profile email roles',
        });
        setIsAuthenticated(authenticated);

        if (authenticated) {
          const profile = await keycloak.loadUserProfile();
          setUser(profile);
          const keycloakRoles = keycloak.tokenParsed?.realm_access?.roles || [];
          console.log("[DEBUG] Rôles bruts reçus de Keycloak:", keycloakRoles);
          const appRoles = transformRoles(keycloakRoles);
          console.log("[DEBUG] Rôles transformés pour l'application:", appRoles);
          setRoles(appRoles);
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
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import keycloak from './keycloak';
import { clearActiveContext, getActiveContext } from '../../utils/contextStorage';
import { KeycloakProfile } from 'keycloak-js';
import { mapIdentityRoleToAppRole } from '../../utils/roles';

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

// Les rôles métiers sont désormais issus d'identity-service via le contexte actif.
// On conserve uniquement un éventuel flag administrateur provenant de Keycloak.

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdminKc, setIsAdminKc] = useState<boolean>(false);

  useEffect(() => {
    if (MOCK_AUTH) {
      const mockUser: KeycloakProfile = {
        username: 'adama.keita',
        firstName: 'Adama',
        lastName: 'Keïta',
        email: 'adama.keita@gmail.com',
        emailVerified: true,
      };
      setUser(mockUser);
      setRoles(['directeur']);
      setIsAuthenticated(true);
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        const isPublicRoute = window.location.pathname === '/admission';
        const authenticated = await keycloak.init({
          onLoad: isPublicRoute ? 'check-sso' : 'login-required',
          redirectUri: window.location.href,
          pkceMethod: 'S256',
          responseMode: 'fragment',
          scope: 'profile email roles resource-service.access timetable-service.access classe-service.access establishment-service.access identity-service.access provisioning-service.access competence-service.access student-service.access event-service.access pdi-service.access admission-service.access message-service.access supplies-service.access',
        });
        setIsAuthenticated(authenticated);

        if (authenticated) {
          const profile = await keycloak.loadUserProfile();
          setUser(profile);
          const kcRealmRoles: string[] = keycloak.tokenParsed?.realm_access?.roles || [];
          const admin = kcRealmRoles.includes('ROLE_ADMIN');
          setIsAdminKc(admin);
          // Compose rôles applicatifs depuis identity-service (contexte actif)
          const { role } = getActiveContext();
          const roleFromIdentity = role ? mapIdentityRoleToAppRole(role) : null;
          const nextRoles = [
            ...(roleFromIdentity ? [roleFromIdentity] : []),
            ...(admin ? ['administrateur'] : []),
          ];
          setRoles([...new Set(nextRoles)]);
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
      keycloak
        .updateToken(30)
        .then(() => {
          if (keycloak.token) {
            sessionStorage.setItem('keycloak-token', keycloak.token);
          }
          if (keycloak.refreshToken) {
            sessionStorage.setItem('keycloak-refresh-token', keycloak.refreshToken);
          }
        })
        .catch(() => {
          console.error('Échec du rafraîchissement du token');
          logout();
        });
    };

  }, []);

  // Écoute les changements de contexte (sélection établissement/rôle) pour recalculer les rôles applicatifs
  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as { role?: string | null } | undefined;
        const roleKey = detail?.role as (Parameters<typeof mapIdentityRoleToAppRole>[0] | null | undefined);
        const fromIdentity = roleKey ? mapIdentityRoleToAppRole(roleKey) : null;
        const next = [
          ...(fromIdentity ? [fromIdentity] : []),
          ...(isAdminKc ? ['administrateur'] : []),
        ];
        setRoles([...new Set(next)]);
      } catch {
        // no-op
      }
    };
    window.addEventListener('edc:context:changed', handler as EventListener);
    return () => {
      window.removeEventListener('edc:context:changed', handler as EventListener);
    };
  }, [isAdminKc]);

  const login = () => {
    if (!MOCK_AUTH) {
      keycloak.login();
    } else {
      console.log("Connexion simulée en mode mock.");
    }
  };

  const logout = () => {
    if (!MOCK_AUTH) {
      // Nettoyage local avant redirection
      try {
        sessionStorage.removeItem('keycloak-token');
        sessionStorage.removeItem('keycloak-refresh-token');
        clearActiveContext();
      } catch (error) {
        console.error("Erreur lors de la déconnexion", error);
      }
      keycloak.logout({ redirectUri: 'http://localhost:8000/' });
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setRoles([]);
      sessionStorage.removeItem('keycloak-token');
      sessionStorage.removeItem('keycloak-refresh-token');
      clearActiveContext();
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
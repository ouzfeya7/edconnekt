/* eslint-disable react-refresh/only-export-components */
/**
 * AuthContext.tsx - Contexte d'authentification EdConnekt
 * 
 * Ce fichier gère l'authentification centralisée de l'application via Keycloak.
 * Il fournit un contexte React pour l'état d'authentification, les rôles utilisateur,
 * et les méthodes de connexion/déconnexion.
 * 
 * Architecture:
 * - Utilise Keycloak pour l'authentification OAuth2/OIDC
 * - Gère les tokens JWT avec refresh automatique
 * - Intègre les rôles métiers depuis identity-service
 * - Support du mode mock pour le développement
 * 
 * @author Équipe EdConnekt Frontend
 * @version 1.0.0
 */
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import keycloak from './keycloak';
import { clearActiveContext, getActiveContext } from '../../utils/contextStorage';
import { KeycloakProfile } from 'keycloak-js';
import { mapIdentityRoleToAppRole } from '../../utils/roles';

/**
 * Type représentant un utilisateur authentifié
 * Basé sur le profil Keycloak ou null si non connecté
 */
type AuthUser = KeycloakProfile | null;

/**
 * Interface du contexte d'authentification
 * Expose l'état d'authentification et les méthodes de gestion
 */
interface AuthContextType {
  /** État de connexion de l'utilisateur */
  isAuthenticated: boolean;
  /** Profil utilisateur Keycloak (nom, email, etc.) */
  user: AuthUser;
  /** Liste des rôles applicatifs de l'utilisateur */
  roles: string[];
  /** Méthode pour déclencher la connexion */
  login: () => void;
  /** Méthode pour déclencher la déconnexion */
  logout: () => void;
  /** État de chargement pendant l'initialisation */
  loading: boolean;
}

/**
 * Contexte React pour l'authentification
 * Utilisé par le hook useAuthContext() dans toute l'application
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Flag pour activer le mode mock (développement)
 * Permet de simuler une authentification sans Keycloak
 * ⚠️ À garder à false en production
 */
const MOCK_AUTH = false;

/**
 * ARCHITECTURE DES RÔLES:
 * 
 * Les rôles métiers proviennent de deux sources:
 * 1. Identity Service: Rôles contextuels (directeur, enseignant, parent, etc.)
 * 2. Keycloak: Flag administrateur système (ROLE_ADMIN)
 * 
 * Le système combine ces deux sources pour créer la liste finale des rôles applicatifs.
 */

/**
 * Provider du contexte d'authentification
 * 
 * Responsabilités:
 * - Initialise Keycloak au montage du composant
 * - Gère le cycle de vie des tokens (refresh automatique)
 * - Écoute les changements de contexte utilisateur
 * - Fournit l'état d'authentification à toute l'application
 * 
 * @param children Composants enfants qui auront accès au contexte
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // État utilisateur (profil Keycloak)
  const [user, setUser] = useState<AuthUser>(null);
  
  // Rôles applicatifs combinés (identity-service + Keycloak)
  const [roles, setRoles] = useState<string[]>([]);
  
  // État de connexion
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // État de chargement pendant l'initialisation
  const [loading, setLoading] = useState<boolean>(true);
  
  // Flag administrateur système depuis Keycloak
  const [isAdminKc, setIsAdminKc] = useState<boolean>(false);

  /**
   * Effect d'initialisation de l'authentification
   * Exécuté une seule fois au montage du composant
   */
  useEffect(() => {
    // Mode mock pour le développement
    if (MOCK_AUTH) {
      console.warn('🔧 Mode MOCK activé - Authentification simulée');
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

    /**
     * Initialisation de Keycloak
     * Configure l'authentification OAuth2/OIDC avec tous les scopes nécessaires
     */
    const initAuth = async () => {
      try {
        // Route publique : ne force pas la connexion
        const isPublicRoute = window.location.pathname === '/admission';
        
        const authenticated = await keycloak.init({
          // Stratégie de connexion selon le type de route
          onLoad: isPublicRoute ? 'check-sso' : 'login-required',
          redirectUri: window.location.href,
          // PKCE pour la sécurité OAuth2
          pkceMethod: 'S256',
          responseMode: 'fragment',
          // Scopes pour tous les services API EdConnekt
          scope: 'profile email roles resource-service.access timetable-service.access classe-service.access establishment-service.access identity-service.access provisioning-service.access competence-service.access student-service.access event-service.access pdi-service.access admission-service.access message-service.access supplies-service.access',
        });
        setIsAuthenticated(authenticated);

        if (authenticated) {
          // Chargement du profil utilisateur
          const profile = await keycloak.loadUserProfile();
          setUser(profile);
          
          // Extraction des rôles Keycloak
          const kcRealmRoles: string[] = keycloak.tokenParsed?.realm_access?.roles || [];
          const admin = kcRealmRoles.includes('ROLE_ADMIN');
          setIsAdminKc(admin);
          
          // Composition des rôles applicatifs
          // 1. Rôle métier depuis identity-service (contexte actif)
          const { role } = getActiveContext();
          const roleFromIdentity = role ? mapIdentityRoleToAppRole(role) : null;
          
          // 2. Combinaison des rôles (identity + Keycloak)
          const nextRoles = [
            ...(roleFromIdentity ? [roleFromIdentity] : []),
            ...(admin ? ['administrateur'] : []),
          ];
          setRoles([...new Set(nextRoles)]); // Suppression des doublons
          
          // Sauvegarde du token pour les appels API
          if (keycloak.token) {
            sessionStorage.setItem('keycloak-token', keycloak.token);
          }
        }
      } catch (error) {
        console.error("❌ Erreur d'initialisation de Keycloak", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    // Lancement de l'initialisation
    initAuth();

    /**
     * Gestion automatique du refresh des tokens
     * Keycloak rafraîchit automatiquement les tokens expirés
     */
    keycloak.onTokenExpired = () => {
      console.log('🔄 Token expiré, tentative de rafraîchissement...');
      keycloak
        .updateToken(30) // Rafraîchit si expiration dans moins de 30s
        .then(() => {
          console.log('✅ Token rafraîchi avec succès');
          // Mise à jour des tokens en sessionStorage
          if (keycloak.token) {
            sessionStorage.setItem('keycloak-token', keycloak.token);
          }
          if (keycloak.refreshToken) {
            sessionStorage.setItem('keycloak-refresh-token', keycloak.refreshToken);
          }
        })
        .catch(() => {
          console.error('❌ Échec du rafraîchissement du token - Déconnexion forcée');
          logout();
        });
    };

  }, []);

  /**
   * Effect pour écouter les changements de contexte utilisateur
   * 
   * Quand l'utilisateur change d'établissement ou de rôle via l'interface,
   * cet effect recalcule automatiquement les rôles applicatifs.
   * 
   * Event écouté: 'edc:context:changed' (émis par contextStorage.ts)
   */
  useEffect(() => {
    const handler = (e: Event) => {
      try {
        console.log('🔄 Changement de contexte détecté');
        const detail = (e as CustomEvent).detail as { role?: string | null } | undefined;
        const roleKey = detail?.role as (Parameters<typeof mapIdentityRoleToAppRole>[0] | null | undefined);
        
        // Mapping du rôle identity-service vers rôle applicatif
        const fromIdentity = roleKey ? mapIdentityRoleToAppRole(roleKey) : null;
        
        // Recomposition des rôles
        const next = [
          ...(fromIdentity ? [fromIdentity] : []),
          ...(isAdminKc ? ['administrateur'] : []),
        ];
        setRoles([...new Set(next)]);
        console.log('✅ Rôles mis à jour:', next);
      } catch (error) {
        console.warn('⚠️ Erreur lors du changement de contexte:', error);
      }
    };
    
    // Écoute de l'événement global
    window.addEventListener('edc:context:changed', handler as EventListener);
    
    // Nettoyage à la destruction du composant
    return () => {
      window.removeEventListener('edc:context:changed', handler as EventListener);
    };
  }, [isAdminKc]);

  /**
   * Méthode de connexion
   * Redirige vers Keycloak ou simule en mode mock
   */
  const login = () => {
    if (!MOCK_AUTH) {
      console.log('🔐 Redirection vers Keycloak pour connexion');
      keycloak.login();
    } else {
      console.log("🔧 Connexion simulée en mode mock");
    }
  };

  /**
   * Méthode de déconnexion
   * 
   * Effectue le nettoyage complet:
   * 1. Suppression des tokens en sessionStorage
   * 2. Nettoyage du contexte utilisateur actif
   * 3. Redirection vers Keycloak pour déconnexion SSO
   */
  const logout = () => {
    if (!MOCK_AUTH) {
      console.log('🚪 Déconnexion en cours...');
      
      // Nettoyage local avant redirection Keycloak
      try {
        sessionStorage.removeItem('keycloak-token');
        sessionStorage.removeItem('keycloak-refresh-token');
        clearActiveContext(); // Nettoyage du contexte établissement/rôle
        console.log('✅ Nettoyage local terminé');
      } catch (error) {
        console.error("❌ Erreur lors du nettoyage local", error);
      }
      
      // Redirection vers Keycloak pour déconnexion SSO
      keycloak.logout({ redirectUri: 'http://localhost:8000/' });
    } else {
      // Mode mock : simulation de déconnexion
      console.log("🔧 Déconnexion simulée en mode mock");
      setIsAuthenticated(false);
      setUser(null);
      setRoles([]);
      sessionStorage.removeItem('keycloak-token');
      sessionStorage.removeItem('keycloak-refresh-token');
      clearActiveContext();
    }
  };

  /**
   * Valeur du contexte exposée à toute l'application
   * Contient l'état d'authentification et les méthodes de gestion
   */
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

/**
 * Hook personnalisé pour accéder au contexte d'authentification
 * 
 * Usage dans les composants:
 * ```tsx
 * const { isAuthenticated, user, roles, login, logout } = useAuthContext();
 * ```
 * 
 * ⚠️ Ce hook doit être utilisé uniquement dans des composants
 * qui sont des enfants du AuthProvider
 * 
 * @returns L'état d'authentification et les méthodes de gestion
 * @throws Erreur si utilisé en dehors du AuthProvider
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      '❌ useAuthContext must be used within an AuthProvider. ' +
      'Vérifiez que votre composant est bien enveloppé dans <AuthProvider>.'
    );
  }
  return context;
};
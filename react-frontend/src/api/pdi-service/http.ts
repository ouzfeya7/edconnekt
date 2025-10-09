import axios from 'axios';
import { getActiveContext, setActiveContext, type EstablishmentRole } from '../../utils/contextStorage';
import { attachAuthRefresh } from '../httpAuth';

// Base URL par défaut (inclut le slash final)
export const DEFAULT_BASE_URL = 'https://api.uat1-engy-partners.com/pdi/';

// Base URL via Vite env ou fallback
const RAW_BASE_URL = import.meta.env.VITE_PDI_API_BASE_URL || DEFAULT_BASE_URL;

// Normalisation: garantir un unique slash final
export const PDI_API_BASE_URL = RAW_BASE_URL.endsWith('/') ? RAW_BASE_URL : `${RAW_BASE_URL}/`;

// Instance Axios dédiée au microservice Pdi service
export const axiosInstance = axios.create({
  baseURL: PDI_API_BASE_URL,
});

// Intercepteur: normalise l'URL relative et ajoute le token Keycloak
axiosInstance.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith('/')) {
    config.url = config.url.replace(/^\//, '');
  }

  const token = sessionStorage.getItem('keycloak-token');
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  // Multi-tenant: en-têtes de contexte
  const { etabId: activeEtabId, role: activeRole } = getActiveContext();
  if (activeEtabId) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)['X-Etab'] = activeEtabId;
  }
  if (activeRole) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)['X-Roles'] = activeRole;
  }
  return config;
});

// Log de contrôle
// Attendu étape 5: "[service-api] baseURL = https://api.uat1-engy-partners.com/pdi/"
console.log(`[pdi-api] baseURL = ${PDI_API_BASE_URL}`);

export default axiosInstance;

// Persistance du contexte confirmé par le Gateway
axiosInstance.interceptors.response.use(
  (response) => {
    try {
      const xEtab = response.headers?.['x-etab'] as string | undefined;
      const xRoles = response.headers?.['x-roles'] as string | undefined;
      const xRole = (xRoles?.split(',')[0]?.trim() || (response.headers?.['x-role'] as string | undefined)) as string | undefined;
      if (xEtab && xRole) setActiveContext(xEtab, xRole as EstablishmentRole);
    } catch { /* no-op */ }
    return response;
  },
  (error) => Promise.reject(error)
);

// Attach centralized auth refresh interceptor (last added -> first run on errors)
attachAuthRefresh(axiosInstance);



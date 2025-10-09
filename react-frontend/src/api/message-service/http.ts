import axios from 'axios';
import { getActiveContext, setActiveContext, type EstablishmentRole } from '../../utils/contextStorage';
import { attachAuthRefresh } from '../httpAuth';

// Étape 1 — http.ts pour Message Service
// Exigences: baseURL issue des envs, normalisation des URLs, interceptor Keycloak, log explicite

export const DEFAULT_BASE_URL = 'https://api.uat1-engy-partners.com/message/';
const RAW_BASE_URL = (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_MESSAGE_API_BASE_URL || DEFAULT_BASE_URL;
const BASE_URL = RAW_BASE_URL.endsWith('/') ? RAW_BASE_URL : `${RAW_BASE_URL}/`;
export const MESSAGE_API_BASE_URL = BASE_URL;

export const messageAxios = axios.create({
  baseURL: BASE_URL,
});

messageAxios.interceptors.request.use((config) => {
  // Normaliser pour éviter de casser le préfixe du baseURL
  if (config.url && config.url.startsWith('/')) {
    config.url = config.url.replace(/^\//, '');
  }

  const token = sessionStorage.getItem('keycloak-token');
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  // Multi-tenant: en-têtes de contexte (envoi côté client, confirmation par Gateway)
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

if ((import.meta as unknown as { env?: Record<string, string | undefined> }).env?.DEV) {
   
  console.info('[message-api] baseURL =', messageAxios.defaults.baseURL);
}

// Log utile pour 401/403 afin de diagnostiquer les rôles/permissions
messageAxios.interceptors.response.use(
  (response) => {
    try {
      const xEtab = response.headers?.['x-etab'] as string | undefined;
      const xRoles = response.headers?.['x-roles'] as string | undefined;
      const xRole = (xRoles?.split(',')[0]?.trim() || (response.headers?.['x-role'] as string | undefined)) as string | undefined;
      if (xEtab && xRole) setActiveContext(xEtab, xRole as EstablishmentRole);
    } catch { /* no-op */ }
    return response;
  },
  (error) => {
    const status = (error as { response?: { status?: number; data?: unknown } }).response?.status;
    if (status === 401 || status === 403) {
       
      console.warn('[message-api] Auth/RBAC', status, (error as { response?: { data?: unknown } })?.response?.data);
    }
    return Promise.reject(error);
  }
);
// Attach centralized auth refresh interceptor (last added -> first run on errors)
attachAuthRefresh(messageAxios);

export default messageAxios;



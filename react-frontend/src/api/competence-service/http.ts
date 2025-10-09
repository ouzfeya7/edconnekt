import axios from 'axios';
import { getActiveContext, setActiveContext, EstablishmentRole } from '../../utils/contextStorage';
import { attachAuthRefresh } from '../httpAuth';

const DEFAULT_BASE_URL = 'https://api.uat1-engy-partners.com/competence';
const RAW_BASE_URL = import.meta.env.VITE_COMPETENCE_API_BASE_URL ?? DEFAULT_BASE_URL;
const BASE_URL = RAW_BASE_URL.endsWith('/') ? RAW_BASE_URL : `${RAW_BASE_URL}/`;
export const COMPETENCE_API_BASE_URL = BASE_URL;

if (!import.meta.env.VITE_COMPETENCE_API_BASE_URL && import.meta.env.DEV) {
  console.warn('[competence-api] VITE_COMPETENCE_API_BASE_URL non défini. Fallback utilisé:', BASE_URL);
}

export const competenceAxios = axios.create({ baseURL: BASE_URL });

competenceAxios.interceptors.request.use((config) => {
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
  if (import.meta.env.DEV) {
    const headers = { ...(config.headers as Record<string, unknown>) };
    if (headers && 'Authorization' in headers) (headers as unknown as Record<string, string>).Authorization = '[REDACTED]';
    console.debug('[competence-api][request]', {
      method: (config.method || 'GET').toUpperCase(),
      url: `${config.baseURL || ''}${config.url || ''}`,
      params: config.params,
      headers,
    });
  }
  return config;
});

competenceAxios.interceptors.response.use(
  (response) => {
    const xEtab = response.headers?.['x-etab'] as string | undefined;
    const xRoles = response.headers?.['x-roles'] as string | undefined;
    const xRole = (xRoles?.split(',')[0]?.trim() || (response.headers?.['x-role'] as string | undefined)) as string | undefined;
    const allowedRoles = new Set<EstablishmentRole>(['student', 'parent', 'teacher', 'admin_staff']);
    if (xEtab && xRole && allowedRoles.has(xRole as EstablishmentRole)) {
      setActiveContext(xEtab, xRole as EstablishmentRole);
    }
    if (import.meta.env.DEV) {
      console.debug('[competence-api][response]', {
        status: response.status,
        url: response.config?.url,
      });
    }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      const status = error?.response?.status;
      const data = error?.response?.data;
      const url = `${error?.config?.baseURL || ''}${error?.config?.url || ''}`;
      console.error('[competence-api][error]', { status, url, data });
    }
    return Promise.reject(error);
  }
);

if (import.meta.env.DEV) {
  console.info('[competence-api] baseURL =', competenceAxios.defaults.baseURL);
}

// Attach centralized auth refresh interceptor (last added -> first run on errors)
attachAuthRefresh(competenceAxios);

export default competenceAxios;



import axios from 'axios';
import { getActiveContext, setActiveContext } from '../../utils/contextStorage';
import { attachAuthRefresh } from '../httpAuth';

const DEFAULT_BASE_URL = 'https://api.uat1-engy-partners.com/identity';
const RAW_BASE_URL = import.meta.env.VITE_IDENTITY_API_BASE_URL ?? DEFAULT_BASE_URL;
const BASE_URL = RAW_BASE_URL.endsWith('/') ? RAW_BASE_URL : `${RAW_BASE_URL}/`;
export const IDENTITY_API_BASE_URL = BASE_URL;

if (!import.meta.env.VITE_IDENTITY_API_BASE_URL && import.meta.env.DEV) {
  console.warn('[identity-api] VITE_IDENTITY_API_BASE_URL non défini. Fallback utilisé:', BASE_URL);
}

export const identityAxios = axios.create({ baseURL: BASE_URL });

identityAxios.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith('/')) {
    config.url = config.url.replace(/^\//, '');
  }
  const token = sessionStorage.getItem('keycloak-token');
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  // Context selection headers (Gateway will confirm and inject X-Etab/X-Role)
  const { etabId: activeEtabId, role: activeRole } = getActiveContext();
  if (activeEtabId) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)['X-Etab-Select'] = activeEtabId;
  }
  if (activeRole) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)['X-Role-Select'] = activeRole;
  }
  if (import.meta.env.DEV) {
    const headers = { ...(config.headers as Record<string, unknown>) };
    if (headers && 'Authorization' in headers) headers.Authorization = '[REDACTED]';
    // Axios may store params on config.params or in URL; log both
    console.debug('[identity-api][request]', {
      method: (config.method || 'GET').toUpperCase(),
      url: `${config.baseURL || ''}${config.url || ''}`,
      params: config.params,
      headers,
    });
  }
  return config;
});

identityAxios.interceptors.response.use(
  (response) => {
    // Persist confirmed context from Gateway if present
    try {
      const xEtab = response.headers?.['x-etab'] as string | undefined;
      const xRole = response.headers?.['x-role'] as string | undefined;
      if (xEtab && xRole) {
        setActiveContext(xEtab, xRole as any);
      }
    } catch {}
    if (import.meta.env.DEV) {
      console.debug('[identity-api][response]', {
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
      console.error('[identity-api][error]', { status, url, data });
    }
    return Promise.reject(error);
  }
);

// Attach centralized auth refresh interceptor
attachAuthRefresh(identityAxios);

if (import.meta.env.DEV) {
  console.info('[identity-api] baseURL =', identityAxios.defaults.baseURL);
}

export default identityAxios;

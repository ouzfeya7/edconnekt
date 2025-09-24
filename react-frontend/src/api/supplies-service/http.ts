import axios from 'axios';
import { getActiveContext, setActiveContext } from '../../utils/contextStorage';
import { attachAuthRefresh } from '../httpAuth';

export const DEFAULT_BASE_URL = 'https://api.uat1-engy-partners.com/supplies/';

const RAW_BASE_URL = (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_SUPPLIES_API_BASE_URL || DEFAULT_BASE_URL;
const BASE_URL = RAW_BASE_URL.endsWith('/') ? RAW_BASE_URL : `${RAW_BASE_URL}/`;

export const SUPPLIES_API_BASE_URL = BASE_URL;

export const suppliesAxios = axios.create({
  baseURL: BASE_URL,
});

suppliesAxios.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith('/')) {
    config.url = config.url.replace(/^\//, '');
  }

  const token = sessionStorage.getItem('keycloak-token');
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  // Multi-tenant: en-têtes de sélection
  const { etabId: activeEtabId, role: activeRole } = getActiveContext();
  if (activeEtabId) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)['X-Etab-Select'] = activeEtabId;
  }
  if (activeRole) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)['X-Role-Select'] = activeRole;
  }

  return config;
});

suppliesAxios.interceptors.response.use(
  (response) => {
    try {
      const xEtab = response.headers?.['x-etab'] as string | undefined;
      const xRole = response.headers?.['x-role'] as string | undefined;
      if (xEtab && xRole) setActiveContext(xEtab, xRole as any);
    } catch {}
    return response;
  },
  (error) => Promise.reject(error)
);

if ((import.meta as unknown as { env?: Record<string, string | undefined> }).env?.DEV) {
  console.info('[supplies-api] baseURL =', suppliesAxios.defaults.baseURL);
}

// Attach centralized auth refresh interceptor (last added -> first run on errors)
attachAuthRefresh(suppliesAxios);

export default suppliesAxios;



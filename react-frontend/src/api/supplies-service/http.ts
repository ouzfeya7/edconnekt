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

suppliesAxios.interceptors.response.use(
  (response) => {
    try {
      const xEtab = response.headers?.['x-etab'] as string | undefined;
      const xRoles = response.headers?.['x-roles'] as string | undefined;
      const xRole = (xRoles?.split(',')[0]?.trim() || (response.headers?.['x-role'] as string | undefined)) as string | undefined;
      // Ne pas appeler setActiveContext si le rôle ne matche pas notre enum
      const allowedRoles = new Set(['student', 'parent', 'teacher', 'admin_staff']);
      if (xEtab && xRole && allowedRoles.has(xRole)) setActiveContext(xEtab, xRole as 'student' | 'parent' | 'teacher' | 'admin_staff');
    } catch {
      // no-op
    }
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



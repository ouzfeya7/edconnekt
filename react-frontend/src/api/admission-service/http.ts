import axios from 'axios';
import { getActiveContext, setActiveContext } from '../../utils/contextStorage';
import { attachAuthRefresh } from '../httpAuth';

// Base URL configurable via Vite env, avec fallback par défaut (slash final obligatoire)
export const DEFAULT_BASE_URL = 'https://api.uat1-engy-partners.com/admission/';
const RAW_BASE_URL = import.meta.env.VITE_ADMISSION_API_BASE_URL ?? DEFAULT_BASE_URL;
const BASE_URL = RAW_BASE_URL.endsWith('/') ? RAW_BASE_URL : `${RAW_BASE_URL}/`;
export const ADMISSION_API_BASE_URL = BASE_URL;

if (!import.meta.env.VITE_ADMISSION_API_BASE_URL && import.meta.env.DEV) {
  console.warn('[admission-api] VITE_ADMISSION_API_BASE_URL non défini. Fallback utilisé:', BASE_URL);
}

export const admissionAxios = axios.create({ baseURL: BASE_URL });

admissionAxios.interceptors.request.use((config) => {
  // Normaliser l'URL pour éviter de perdre le préfixe baseURL et éviter les doubles slashes
  if (config.url && config.url.startsWith('/')) {
    config.url = config.url.replace(/^\//, '');
  }
  const token = sessionStorage.getItem('keycloak-token');
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  // Multi-tenant: en-têtes de sélection (le Gateway confirmera via X-Etab/X-Role)
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

admissionAxios.interceptors.response.use(
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

if (import.meta.env.DEV) {
  console.info('[admission-api] baseURL =', admissionAxios.defaults.baseURL);
}

// Attach centralized auth refresh interceptor (last added -> first run on errors)
attachAuthRefresh(admissionAxios);

export default admissionAxios;


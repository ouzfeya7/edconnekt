import axios from 'axios';
import { getActiveContext, setActiveContext, type EstablishmentRole } from '../../utils/contextStorage';
import { attachAuthRefresh } from '../httpAuth';

// Base URL configurable via Vite env, avec fallback par défaut
const DEFAULT_BASE_URL = 'https://api.uat1-engy-partners.com/timetable';
const RAW_BASE_URL = import.meta.env.VITE_TIMETABLE_API_BASE_URL ?? DEFAULT_BASE_URL;
const BASE_URL = RAW_BASE_URL.endsWith('/') ? RAW_BASE_URL : `${RAW_BASE_URL}/`;
export const TIMETABLE_API_BASE_URL = BASE_URL;

if (!import.meta.env.VITE_TIMETABLE_API_BASE_URL && import.meta.env.DEV) {
  console.warn('[timetable-api] VITE_TIMETABLE_API_BASE_URL non défini. Fallback utilisé:', BASE_URL);
}

export const timetableAxios = axios.create({
  baseURL: BASE_URL,
});

timetableAxios.interceptors.request.use((config) => {
  // Normalise l'URL pour rester relative au baseURL (évite de perdre le préfixe /timetable)
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
    (config.headers as Record<string, string>)['X-Roles-Select'] = activeRole;
  }
  return config;
});

if (import.meta.env.DEV) {
  console.info('[timetable-api] baseURL =', timetableAxios.defaults.baseURL);
}

export default timetableAxios;

// Persistance du contexte confirmé par le Gateway
timetableAxios.interceptors.response.use(
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
attachAuthRefresh(timetableAxios);

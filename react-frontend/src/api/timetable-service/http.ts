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
  // Multi-tenant: en-têtes (le Gateway confirmera via X-Etab/X-Roles)
  const { etabId: activeEtabId, role: activeRole } = getActiveContext();
  const hdrs = (config.headers = config.headers ?? {});
  // Respect d'un override explicite si déjà présent
  const hasXEtabOverride = 'X-Etab' in (hdrs as Record<string, unknown>) || 'x-etab' in (hdrs as Record<string, unknown>);
  if (activeEtabId && !hasXEtabOverride) {
    (hdrs as Record<string, string>)['X-Etab'] = activeEtabId;
  }
  const hasXRolesOverride = 'X-Roles' in (hdrs as Record<string, unknown>) || 'x-roles' in (hdrs as Record<string, unknown>);
  if (activeRole && !hasXRolesOverride) {
    (hdrs as Record<string, string>)['X-Roles'] = activeRole;
  }

  // Log de debug en DEV (Authorization masqué)
  if (import.meta.env.DEV) {
    const headers = { ...(config.headers as Record<string, unknown>) };
    if (headers && 'Authorization' in headers) (headers as unknown as Record<string, string>).Authorization = '[REDACTED]';
    console.debug('[timetable-api][request]', {
      method: (config.method || 'GET').toUpperCase(),
      url: `${config.baseURL || ''}${config.url || ''}`,
      params: config.params,
      headers,
    });
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


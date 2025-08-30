import axios from 'axios';

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
  // Mapping établissement temporaire (en attendant Identity Service)
  const viteEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  const etabId = localStorage.getItem('current-etab-id') || viteEnv?.VITE_DEFAULT_ETAB_ID;
  if (etabId) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)['X-Establishment-Id'] = etabId;
  }
  return config;
});

if (import.meta.env.DEV) {
  console.info('[timetable-api] baseURL =', timetableAxios.defaults.baseURL);
}

export default timetableAxios;

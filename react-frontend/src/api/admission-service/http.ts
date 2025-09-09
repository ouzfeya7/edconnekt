import axios from 'axios';

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
  // Header d'établissement si disponible
  const viteEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  const etabId = localStorage.getItem('current-etab-id') || viteEnv?.VITE_DEFAULT_ETAB_ID;
  if (etabId) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)['X-Establishment-Id'] = etabId;
  }
  return config;
});

if (import.meta.env.DEV) {
  console.info('[admission-api] baseURL =', admissionAxios.defaults.baseURL);
}

export default admissionAxios;


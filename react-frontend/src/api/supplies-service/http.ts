import axios from 'axios';

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

  const viteEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  const etabId = localStorage.getItem('current-etab-id') || viteEnv?.VITE_DEFAULT_ETAB_ID;
  if (etabId) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)['X-Establishment-Id'] = etabId;
  }

  return config;
});

if ((import.meta as unknown as { env?: Record<string, string | undefined> }).env?.DEV) {
  console.info('[supplies-api] baseURL =', suppliesAxios.defaults.baseURL);
}

export default suppliesAxios;



import axios from 'axios';

const DEFAULT_BASE_URL = 'https://api.uat1-engy-partners.com';
const RAW_BASE_URL = import.meta.env.VITE_PROVISIONING_API_BASE_URL ?? DEFAULT_BASE_URL;
const BASE_URL = RAW_BASE_URL.endsWith('/') ? RAW_BASE_URL : `${RAW_BASE_URL}/`;
export const PROVISIONING_API_BASE_URL = BASE_URL;

if (!import.meta.env.VITE_PROVISIONING_API_BASE_URL && import.meta.env.DEV) {
  console.warn('[provisioning-api] VITE_PROVISIONING_API_BASE_URL non défini. Fallback utilisé:', BASE_URL);
}

export const provisioningAxios = axios.create({ baseURL: BASE_URL });

provisioningAxios.interceptors.request.use((config) => {
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
  if (import.meta.env.DEV) {
    const headers = { ...(config.headers as Record<string, unknown>) };
    if (headers && 'Authorization' in headers) headers.Authorization = '[REDACTED]';
    // Axios may store params on config.params or in URL; log both
    console.debug('[provisioning-api][request]', {
      method: (config.method || 'GET').toUpperCase(),
      url: `${config.baseURL || ''}${config.url || ''}`,
      params: config.params,
      headers,
    });
  }
  return config;
});

provisioningAxios.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.debug('[provisioning-api][response]', {
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
      console.error('[provisioning-api][error]', { status, url, data });
    }
    return Promise.reject(error);
  }
);

if (import.meta.env.DEV) {
  console.info('[provisioning-api] baseURL =', provisioningAxios.defaults.baseURL);
}

export default provisioningAxios;

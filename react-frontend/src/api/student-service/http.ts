/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

// Base URL configurable via Vite env, avec fallback par défaut
const DEFAULT_BASE_URL = 'https://api.uat1-engy-partners.com/student';
const RAW_BASE_URL = (import.meta as any)?.env?.VITE_STUDENT_API_BASE_URL ?? DEFAULT_BASE_URL;
const BASE_URL = RAW_BASE_URL.endsWith('/') ? RAW_BASE_URL : `${RAW_BASE_URL}/`;
export const STUDENT_API_BASE_URL = BASE_URL;

if (!((import.meta as any)?.env?.VITE_STUDENT_API_BASE_URL) && (import.meta as any)?.env?.DEV) {
  console.warn('[student-api] VITE_STUDENT_API_BASE_URL non défini. Fallback utilisé:', BASE_URL);
}

// Instance Axios dédiée au microservice Student Service
export const studentAxios = axios.create({
  baseURL: BASE_URL,
});

// Intercepteur: normalise l'URL, injecte le token et l'établissement
studentAxios.interceptors.request.use((config) => {
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
  if ((import.meta as any)?.env?.DEV) {
    const headers = { ...(config.headers as Record<string, unknown>) };
    if (headers && 'Authorization' in headers) headers.Authorization = '[REDACTED]';
    console.debug('[student-api][request]', {
      method: (config.method || 'GET').toUpperCase(),
      url: `${config.baseURL || ''}${config.url || ''}`,
      params: config.params,
      headers,
    });
  }
  return config;
});

studentAxios.interceptors.response.use(
  (response) => {
    if ((import.meta as any)?.env?.DEV) {
      console.debug('[student-api][response]', {
        status: response.status,
        url: response.config?.url,
      });
    }
    return response;
  },
  (error) => {
    if ((import.meta as any)?.env?.DEV) {
      const status = error?.response?.status;
      const data = error?.response?.data;
      const url = `${error?.config?.baseURL || ''}${error?.config?.url || ''}`;
      console.error('[student-api][error]', { status, url, data });
    }
    return Promise.reject(error);
  }
);

if ((import.meta as any)?.env?.DEV) {
  console.info('[student-api] baseURL =', studentAxios.defaults.baseURL);
}

export default studentAxios;



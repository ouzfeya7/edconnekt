/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { getActiveContext, setActiveContext, type EstablishmentRole } from '../../utils/contextStorage';
import { attachAuthRefresh } from '../httpAuth';

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

// Déprécié: ancien scoping par service (supprimé car non utilisé)

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
  // Multi-tenant: en-têtes de contexte (le contexte global prévaut)
  const { etabId: activeEtabId, role: activeRole } = getActiveContext();
  if (activeEtabId) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)['X-Etab'] = activeEtabId;
  }
  if (activeRole) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)['X-Roles'] = activeRole;
  }
  if ((import.meta as any)?.env?.DEV) {
    const headers = { ...(config.headers as Record<string, unknown>) };
    if (headers && 'Authorization' in headers) headers.Authorization = '[REDACTED]';
    console.debug('[student-api][request]', {
      url: `${config.baseURL || ''}${config.url || ''}`,
      params: config.params,
      headers,
    });
  }
  return config;
});

studentAxios.interceptors.response.use(
  (response) => {
    try {
      const xEtab = response.headers?.['x-etab'] as string | undefined;
      const xRoles = response.headers?.['x-roles'] as string | undefined;
      const xRole = (xRoles?.split(',')[0]?.trim() || (response.headers?.['x-role'] as string | undefined)) as string | undefined;
      if (xEtab && xRole) setActiveContext(xEtab, xRole as EstablishmentRole);
    } catch { /* no-op */ }
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

// Attach centralized auth refresh interceptor (last added -> first run on errors)
attachAuthRefresh(studentAxios);

export default studentAxios;



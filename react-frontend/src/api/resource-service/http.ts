/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { getActiveContext, setActiveContext } from '../../utils/contextStorage';
import { attachAuthRefresh } from '../httpAuth';

// Base URL configurable via Vite env, fallback par défaut
const DEFAULT_BASE_URL = 'https://api.uat1-engy-partners.com/resource';
const RAW_BASE_URL = (import.meta as any)?.env?.VITE_RESOURCE_API_BASE_URL ?? DEFAULT_BASE_URL;
const BASE_URL = RAW_BASE_URL.endsWith('/') ? RAW_BASE_URL : `${RAW_BASE_URL}/`;
export const RESOURCE_API_BASE_URL = BASE_URL;

// Instance Axios dédiée au microservice Resource Service
export const resourceAxios = axios.create({
  baseURL: BASE_URL,
});

// Log en dev pour valider l'URL effective
if ((import.meta as any)?.env?.DEV) {
  console.info('[resource-api] baseURL =', BASE_URL);
}

// Intercepteur: normalise l'URL (évite de casser le path de base quand l'URL commence par '/')
resourceAxios.interceptors.request.use((config) => {
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

// Persistance du contexte confirmé par le Gateway
resourceAxios.interceptors.response.use(
  (response) => {
    try {
      const xEtab = response.headers?.['x-etab'] as string | undefined;
      const xRoles = response.headers?.['x-roles'] as string | undefined;
      const xRole = (xRoles?.split(',')[0]?.trim() || (response.headers?.['x-role'] as string | undefined)) as string | undefined;
      if (xEtab && xRole) setActiveContext(xEtab, xRole as import('../../utils/contextStorage').EstablishmentRole);
    } catch { /* no-op */ }
    return response;
  },
  (error) => Promise.reject(error)
);

// Attach centralized auth refresh interceptor (last added -> first run on errors)
attachAuthRefresh(resourceAxios);

export default resourceAxios;
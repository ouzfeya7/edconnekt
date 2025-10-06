/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { getActiveContext, setActiveContext, type EstablishmentRole } from '../../utils/contextStorage';
import { attachAuthRefresh } from '../httpAuth';

// Base URL configurable via Vite env, avec fallback par défaut
const DEFAULT_BASE_URL = 'https://api.uat1-engy-partners.com/classe';
const RAW_BASE_URL = (import.meta as any)?.env?.VITE_CLASSE_API_BASE_URL ?? DEFAULT_BASE_URL;
const BASE_URL = RAW_BASE_URL.endsWith('/') ? RAW_BASE_URL : `${RAW_BASE_URL}/`;
export const CLASSE_API_BASE_URL = BASE_URL;

if (!((import.meta as any)?.env?.VITE_CLASSE_API_BASE_URL) && (import.meta as any)?.env?.DEV) {
	console.warn('[classe-api] VITE_CLASSE_API_BASE_URL non défini. Fallback utilisé:', BASE_URL);
}

// Instance Axios dédiée au microservice Classe Service
export const classeAxios = axios.create({
	baseURL: BASE_URL,
});

// Intercepteur: normalise l'URL et ajoute le token Keycloak
classeAxios.interceptors.request.use((config) => {
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

// Log en dev pour valider l'URL effective
if ((import.meta as any)?.env?.DEV) {
	console.info('[classe-api] baseURL =', classeAxios.defaults.baseURL);
}

export default classeAxios;

// Persistance du contexte confirmé par le Gateway
classeAxios.interceptors.response.use(
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

// Attach centralized auth refresh interceptor (added last so it runs first on response errors)
attachAuthRefresh(classeAxios);



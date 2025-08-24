/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

// Base URL configurable via Vite env, avec fallback par défaut
const DEFAULT_BASE_URL = 'https://api.uat1-engy-partners.com/establishment';
const RAW_BASE_URL = (import.meta as any)?.env?.VITE_ESTABLISHMENT_API_BASE_URL ?? DEFAULT_BASE_URL;
const BASE_URL = RAW_BASE_URL.endsWith('/') ? RAW_BASE_URL : `${RAW_BASE_URL}/`;
export const ESTABLISHMENT_API_BASE_URL = BASE_URL;

if (!((import.meta as any)?.env?.VITE_ESTABLISHMENT_API_BASE_URL) && (import.meta as any)?.env?.DEV) {
	console.warn('[establishment-api] VITE_ESTABLISHMENT_API_BASE_URL non défini. Fallback utilisé:', BASE_URL);
}

// Instance Axios dédiée au microservice Establishment Service
export const establishmentAxios = axios.create({
	baseURL: BASE_URL,
});

// Intercepteur: normalise l'URL et ajoute le token Keycloak
establishmentAxios.interceptors.request.use((config) => {
	if (config.url && config.url.startsWith('/')) {
		config.url = config.url.replace(/^\//, '');
	}
	const token = sessionStorage.getItem('keycloak-token');
	if (token) {
		config.headers = config.headers ?? {};
		(config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
	}
	return config;
});

// Log en dev pour valider l'URL effective
if ((import.meta as any)?.env?.DEV) {
	console.info('[establishment-api] baseURL =', establishmentAxios.defaults.baseURL);
}

export default establishmentAxios;
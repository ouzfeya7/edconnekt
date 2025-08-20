/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

// Base URL configurable via Vite env
const RAW_BASE_URL = (import.meta as any)?.env?.VITE_CLASSE_API_BASE_URL;
const BASE_URL = RAW_BASE_URL ? (RAW_BASE_URL.endsWith('/') ? RAW_BASE_URL : `${RAW_BASE_URL}/`) : undefined;
export const CLASSE_API_BASE_URL = BASE_URL;

if (!RAW_BASE_URL && (import.meta as any)?.env?.DEV) {
	console.warn("[classe-api] VITE_CLASSE_API_BASE_URL n'est pas défini. Le service Classe peut ne pas fonctionner correctement.");
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
	return config;
});

// Log en dev pour valider l'URL effective
if ((import.meta as any)?.env?.DEV) {
	console.info('[classe-api] baseURL =', classeAxios.defaults.baseURL);
}

export default classeAxios;



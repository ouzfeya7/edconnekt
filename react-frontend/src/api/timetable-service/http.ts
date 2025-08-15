import axios from 'axios';

const BASE_URL = import.meta.env.VITE_TIMETABLE_API_BASE_URL;

if (!BASE_URL) {
  console.warn(
    'La variable d\'environnement VITE_TIMETABLE_API_BASE_URL n\'est pas définie. Le service Timetable ne fonctionnera pas correctement.'
  );
}

export const timetableAxios = axios.create({
  baseURL: BASE_URL,
});

timetableAxios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('keycloak-token');
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

if (import.meta.env.DEV) {
  console.log(`[timetable-api] baseURL = ${timetableAxios.defaults.baseURL}`);
}

export default timetableAxios;

import axiosInstance, { PDI_API_BASE_URL } from './http';
import { Configuration } from './configuration';
import { DefaultApi } from './api';

// Configuration: on s'appuie sur axiosInstance (baseURL déjà défini)
const configuration = new Configuration({
  // basePath optionnel: axiosInstance gère la baseURL
});

export const pdiDefaultApi = new DefaultApi(configuration, undefined, axiosInstance);

// Export utilitaire du baseURL si besoin
export const pdiApiBaseUrl = PDI_API_BASE_URL;



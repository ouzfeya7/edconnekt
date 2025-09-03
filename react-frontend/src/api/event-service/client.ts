import axiosInstance, { EVENT_API_BASE_URL } from './http';
import { Configuration } from './configuration';
import { DefaultApi, EventsApi } from './api';

// Configuration optionnelle: on s'appuie principalement sur l'axios avec baseURL
const configuration = new Configuration({
  // basePath est facultatif car axiosInstance possède déjà baseURL
});

export const eventDefaultApi = new DefaultApi(configuration, undefined, axiosInstance);
export const eventsApi = new EventsApi(configuration, undefined, axiosInstance);

// Export utilitaire du baseURL si nécessaire ailleurs
export const eventApiBaseUrl = EVENT_API_BASE_URL;



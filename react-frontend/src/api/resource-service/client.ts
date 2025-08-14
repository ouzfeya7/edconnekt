import resourceAxios, { RESOURCE_API_BASE_URL } from './http';
import { Configuration } from './configuration';
import { DefaultApi, ResourcesApi } from './api';

// Configuration optionnelle (peut servir pour basePath si besoin supplémentaire)
const configuration = new Configuration({
	// basePath peut rester vide car on utilise l'instance axios avec baseURL
});

// Instances d'API prêtes à l'usage avec l'axios configuré
export const defaultApi = new DefaultApi(configuration, undefined, resourceAxios);
export const resourcesApi = new ResourcesApi(configuration, undefined, resourceAxios);
export const resourceApiBaseUrl = RESOURCE_API_BASE_URL;



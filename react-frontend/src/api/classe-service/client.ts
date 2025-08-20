import { Configuration } from './configuration';
import { ClassesApi, HealthApi, DefaultApi } from './api';
import classeAxios, { CLASSE_API_BASE_URL } from './http';

const configuration = new Configuration({
	// basePath laissé vide, on utilise l'instance axios avec baseURL
});

export const classesApi = new ClassesApi(configuration, undefined, classeAxios);
export const healthApi = new HealthApi(configuration, undefined, classeAxios);
export const defaultApi = new DefaultApi(configuration, undefined, classeAxios);

export const classeApiBaseUrl = CLASSE_API_BASE_URL;



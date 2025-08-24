import { Configuration } from './configuration';
import { EstablishmentsApi, HealthApi, DefaultApi } from './api';
import establishmentAxios, { ESTABLISHMENT_API_BASE_URL } from './http';

const configuration = new Configuration({});

export const etablissementsApi = new EstablishmentsApi(configuration, undefined, establishmentAxios);
export const establishmentHealthApi = new HealthApi(configuration, undefined, establishmentAxios);
export const establishmentDefaultApi = new DefaultApi(configuration, undefined, establishmentAxios);

export const establishmentApiBaseUrl = ESTABLISHMENT_API_BASE_URL;

import { Configuration } from './configuration';
import { DefaultApi, MeContexteUtilisateurApi } from './api';
import { identityAxios } from './http';

const configuration = new Configuration();

// Primary API clients
export const identityApi = new DefaultApi(configuration, undefined, identityAxios);
export const identityMeApi = new MeContexteUtilisateurApi(configuration, undefined, identityAxios);

// Backward-compatibility alias (to be deprecated):
export const identityDefaultApi = new DefaultApi(configuration, undefined, identityAxios);

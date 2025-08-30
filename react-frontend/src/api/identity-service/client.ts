import { Configuration } from './configuration';
import { BatchesApi, DefaultApi } from './api';
import { identityAxios } from './http';

const configuration = new Configuration();

export const batchesApi = new BatchesApi(configuration, undefined, identityAxios);
export const identityDefaultApi = new DefaultApi(configuration, undefined, identityAxios);

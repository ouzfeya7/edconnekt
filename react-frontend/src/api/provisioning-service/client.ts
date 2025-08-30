import { Configuration } from './configuration';
import { DefaultApi, ProvisioningApi } from './api';
import { provisioningAxios } from './http';

const configuration = new Configuration();

export const provisioningApi = new ProvisioningApi(configuration, undefined, provisioningAxios);
export const provisioningDefaultApi = new DefaultApi(configuration, undefined, provisioningAxios);

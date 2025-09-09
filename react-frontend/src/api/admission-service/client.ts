import { Configuration } from './configuration';
import { AdmissionsApi, DefaultApi } from './api';
import { admissionAxios, ADMISSION_API_BASE_URL } from './http';

const configuration = new Configuration({ basePath: ADMISSION_API_BASE_URL });

export const admissionsApi = new AdmissionsApi(configuration, undefined, admissionAxios);
export const admissionDefaultApi = new DefaultApi(configuration, undefined, admissionAxios);



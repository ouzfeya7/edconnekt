import { Configuration } from './configuration';
import { DefaultApi, HealthApi, StudentsApi } from './api';
import studentAxios, { STUDENT_API_BASE_URL } from './http';

const configuration = new Configuration({
  // basePath laissé vide, on utilise l'instance axios avec baseURL
});

export const studentsApi = new StudentsApi(configuration, undefined, studentAxios);
export const studentHealthApi = new HealthApi(configuration, undefined, studentAxios);
export const studentDefaultApi = new DefaultApi(configuration, undefined, studentAxios);

export const studentApiBaseUrl = STUDENT_API_BASE_URL;



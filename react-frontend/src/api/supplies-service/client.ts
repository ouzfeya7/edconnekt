import { Configuration } from './configuration';
import {
  CampaignsApi,
  ConsolidationApi,
  DefaultApi,
  ParentChecklistApi,
  PublicationApi,
  TeacherListsApi,
} from './api';
import { suppliesAxios } from './http';

const configuration = new Configuration();

export const campaignsApi = new CampaignsApi(configuration, undefined, suppliesAxios);
export const consolidationApi = new ConsolidationApi(configuration, undefined, suppliesAxios);
export const defaultApi = new DefaultApi(configuration, undefined, suppliesAxios);
export const parentChecklistApi = new ParentChecklistApi(configuration, undefined, suppliesAxios);
export const publicationApi = new PublicationApi(configuration, undefined, suppliesAxios);
export const teacherListsApi = new TeacherListsApi(configuration, undefined, suppliesAxios);



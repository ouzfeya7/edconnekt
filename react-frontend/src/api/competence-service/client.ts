import { Configuration } from './configuration';
import { DefaultApi, PublicApi, ReferentialsApi, EventsApi } from './api';
import competenceAxios from './http';

const configuration = new Configuration();

export const competenceDefaultApi = new DefaultApi(configuration, undefined, competenceAxios);
export const competencePublicApi = new PublicApi(configuration, undefined, competenceAxios);
export const competenceReferentialsApi = new ReferentialsApi(configuration, undefined, competenceAxios);
export const competenceEventsApi = new EventsApi(configuration, undefined, competenceAxios);



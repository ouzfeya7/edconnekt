import { Configuration } from './configuration';
import {
    AbsencesApi,
    AuditApi,
    FeedApi,
    HealthApi,
    LessonsApi,
    ReplacementsApi,
    RoomsApi,
    TimeslotsApi
} from './api';
import { timetableAxios } from './http';

const configuration = new Configuration();

export const absencesApi = new AbsencesApi(configuration, undefined, timetableAxios);
export const auditApi = new AuditApi(configuration, undefined, timetableAxios);
export const feedApi = new FeedApi(configuration, undefined, timetableAxios);
export const healthApi = new HealthApi(configuration, undefined, timetableAxios);
export const lessonsApi = new LessonsApi(configuration, undefined, timetableAxios);
export const replacementsApi = new ReplacementsApi(configuration, undefined, timetableAxios);
export const roomsApi = new RoomsApi(configuration, undefined, timetableAxios);
export const timeslotsApi = new TimeslotsApi(configuration, undefined, timetableAxios);

// Pour la compatibilité avec le code déjà écrit, nous pouvons créer un alias
export const timetableApi = lessonsApi;

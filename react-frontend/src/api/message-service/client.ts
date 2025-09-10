import { Configuration } from './configuration';
import { ConversationsApi, MessagesApi, UploadsApi, DefaultApi } from './api';
import { messageAxios } from './http';

const configuration = new Configuration();

export const conversationsApi = new ConversationsApi(configuration, undefined, messageAxios);
export const messagesApi = new MessagesApi(configuration, undefined, messageAxios);
export const uploadsApi = new UploadsApi(configuration, undefined, messageAxios);
export const defaultApi = new DefaultApi(configuration, undefined, messageAxios);



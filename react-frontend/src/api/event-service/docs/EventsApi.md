# EventsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**cancelRegistrationApiV1EventsEventIdRegisterRegistrationIdDelete**](#cancelregistrationapiv1eventseventidregisterregistrationiddelete) | **DELETE** /api/v1/events/{event_id}/register/{registration_id} | Cancel Registration|
|[**createEventApiV1EventsPost**](#createeventapiv1eventspost) | **POST** /api/v1/events/ | Create Event|
|[**exportAttendanceApiV1EventsEventIdExportGet**](#exportattendanceapiv1eventseventidexportget) | **GET** /api/v1/events/{event_id}/export | Export Attendance|
|[**getEventByIdApiV1EventsEventIdGet**](#geteventbyidapiv1eventseventidget) | **GET** /api/v1/events/{event_id} | Get Event By Id|
|[**getParticipantsApiV1EventsEventIdParticipantsGet**](#getparticipantsapiv1eventseventidparticipantsget) | **GET** /api/v1/events/{event_id}/participants | Get Participants|
|[**listEventsApiV1EventsGet**](#listeventsapiv1eventsget) | **GET** /api/v1/events/ | List Events|
|[**publishEventApiV1EventsEventIdPublishPost**](#publisheventapiv1eventseventidpublishpost) | **POST** /api/v1/events/{event_id}/publish | Publish Event|
|[**registerParticipantApiV1EventsEventIdRegisterPost**](#registerparticipantapiv1eventseventidregisterpost) | **POST** /api/v1/events/{event_id}/register | Register Participant|
|[**updateEventApiV1EventsEventIdPatch**](#updateeventapiv1eventseventidpatch) | **PATCH** /api/v1/events/{event_id} | Update Event|

# **cancelRegistrationApiV1EventsEventIdRegisterRegistrationIdDelete**
> CancellationResponse cancelRegistrationApiV1EventsEventIdRegisterRegistrationIdDelete()

Annuler une inscription à un événement (ROLE_ELEVE, ROLE_PARENT, ROLE_DIRECTEUR)

### Example

```typescript
import {
    EventsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EventsApi(configuration);

let eventId: string; // (default to undefined)
let registrationId: string; // (default to undefined)

const { status, data } = await apiInstance.cancelRegistrationApiV1EventsEventIdRegisterRegistrationIdDelete(
    eventId,
    registrationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **eventId** | [**string**] |  | defaults to undefined|
| **registrationId** | [**string**] |  | defaults to undefined|


### Return type

**CancellationResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createEventApiV1EventsPost**
> EventOut createEventApiV1EventsPost(eventCreate)

Créer un nouvel événement (ROLE_DIRECTEUR, ROLE_ADMIN uniquement)

### Example

```typescript
import {
    EventsApi,
    Configuration,
    EventCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new EventsApi(configuration);

let eventCreate: EventCreate; //

const { status, data } = await apiInstance.createEventApiV1EventsPost(
    eventCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **eventCreate** | **EventCreate**|  | |


### Return type

**EventOut**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **exportAttendanceApiV1EventsEventIdExportGet**
> any exportAttendanceApiV1EventsEventIdExportGet()

Télécharger la feuille de présence d\'un événement (ROLE_DIRECTEUR, ROLE_ADMIN uniquement)

### Example

```typescript
import {
    EventsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EventsApi(configuration);

let eventId: string; // (default to undefined)
let format: string; //Format d\'export (pdf ou csv) (optional) (default to 'pdf')

const { status, data } = await apiInstance.exportAttendanceApiV1EventsEventIdExportGet(
    eventId,
    format
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **eventId** | [**string**] |  | defaults to undefined|
| **format** | [**string**] | Format d\&#39;export (pdf ou csv) | (optional) defaults to 'pdf'|


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getEventByIdApiV1EventsEventIdGet**
> EventOut getEventByIdApiV1EventsEventIdGet()

Récupérer un événement spécifique par ID (accès public)

### Example

```typescript
import {
    EventsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EventsApi(configuration);

let eventId: string; // (default to undefined)

const { status, data } = await apiInstance.getEventByIdApiV1EventsEventIdGet(
    eventId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **eventId** | [**string**] |  | defaults to undefined|


### Return type

**EventOut**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getParticipantsApiV1EventsEventIdParticipantsGet**
> object getParticipantsApiV1EventsEventIdParticipantsGet()

Récupère tous les participants à un événement (ROLE_DIRECTEUR, ROLE_ADMIN uniquement)

### Example

```typescript
import {
    EventsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EventsApi(configuration);

let eventId: string; // (default to undefined)

const { status, data } = await apiInstance.getParticipantsApiV1EventsEventIdParticipantsGet(
    eventId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **eventId** | [**string**] |  | defaults to undefined|


### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listEventsApiV1EventsGet**
> object listEventsApiV1EventsGet()

Lister tous les événements avec pagination et filtrage (accès public)

### Example

```typescript
import {
    EventsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EventsApi(configuration);

let page: number; //Page number (minimum 1) (optional) (default to 1)
let size: number; //Items per page (1-100) (optional) (default to 20)
let category: string; //Filter by event category (optional) (default to undefined)
let startDate: string; //Filter events starting after this date (optional) (default to undefined)
let endDate: string; //Filter events ending before this date (optional) (default to undefined)
let etablissementId: string; //Filter by establishment ID (optional) (default to undefined)

const { status, data } = await apiInstance.listEventsApiV1EventsGet(
    page,
    size,
    category,
    startDate,
    endDate,
    etablissementId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Page number (minimum 1) | (optional) defaults to 1|
| **size** | [**number**] | Items per page (1-100) | (optional) defaults to 20|
| **category** | [**string**] | Filter by event category | (optional) defaults to undefined|
| **startDate** | [**string**] | Filter events starting after this date | (optional) defaults to undefined|
| **endDate** | [**string**] | Filter events ending before this date | (optional) defaults to undefined|
| **etablissementId** | [**string**] | Filter by establishment ID | (optional) defaults to undefined|


### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **publishEventApiV1EventsEventIdPublishPost**
> EventOut publishEventApiV1EventsEventIdPublishPost()

Publier un événement (ROLE_DIRECTEUR, ROLE_ADMIN uniquement)

### Example

```typescript
import {
    EventsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EventsApi(configuration);

let eventId: string; // (default to undefined)

const { status, data } = await apiInstance.publishEventApiV1EventsEventIdPublishPost(
    eventId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **eventId** | [**string**] |  | defaults to undefined|


### Return type

**EventOut**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **registerParticipantApiV1EventsEventIdRegisterPost**
> RegistrationResponse registerParticipantApiV1EventsEventIdRegisterPost(registrationRequest)

S\'inscrire à un événement (ROLE_ELEVE, ROLE_PARENT, ROLE_DIRECTEUR)

### Example

```typescript
import {
    EventsApi,
    Configuration,
    RegistrationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new EventsApi(configuration);

let eventId: string; // (default to undefined)
let registrationRequest: RegistrationRequest; //

const { status, data } = await apiInstance.registerParticipantApiV1EventsEventIdRegisterPost(
    eventId,
    registrationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **registrationRequest** | **RegistrationRequest**|  | |
| **eventId** | [**string**] |  | defaults to undefined|


### Return type

**RegistrationResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateEventApiV1EventsEventIdPatch**
> EventOut updateEventApiV1EventsEventIdPatch(eventUpdate)

Modifier un événement existant (ROLE_DIRECTEUR, ROLE_ADMIN uniquement)

### Example

```typescript
import {
    EventsApi,
    Configuration,
    EventUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new EventsApi(configuration);

let eventId: string; // (default to undefined)
let eventUpdate: EventUpdate; //

const { status, data } = await apiInstance.updateEventApiV1EventsEventIdPatch(
    eventId,
    eventUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **eventUpdate** | **EventUpdate**|  | |
| **eventId** | [**string**] |  | defaults to undefined|


### Return type

**EventOut**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


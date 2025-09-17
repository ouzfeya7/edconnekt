# TimeslotsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createTimeslotTimeslotsPost**](#createtimeslottimeslotspost) | **POST** /timeslots/ | Create Timeslot|
|[**deleteTimeslotTimeslotsTimeslotIdDelete**](#deletetimeslottimeslotstimeslotiddelete) | **DELETE** /timeslots/{timeslot_id} | Delete Timeslot|
|[**getTimeslotTimeslotsTimeslotIdGet**](#gettimeslottimeslotstimeslotidget) | **GET** /timeslots/{timeslot_id} | Get Timeslot|
|[**listTimeslotsTimeslotsGet**](#listtimeslotstimeslotsget) | **GET** /timeslots/ | List Timeslots|
|[**updateTimeslotTimeslotsTimeslotIdPatch**](#updatetimeslottimeslotstimeslotidpatch) | **PATCH** /timeslots/{timeslot_id} | Update Timeslot|

# **createTimeslotTimeslotsPost**
> TimeslotRead createTimeslotTimeslotsPost(timeslotCreate)

Créer un créneau horaire. Rôles: ADMIN, COORDONNATEUR

### Example

```typescript
import {
    TimeslotsApi,
    Configuration,
    TimeslotCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new TimeslotsApi(configuration);

let timeslotCreate: TimeslotCreate; //

const { status, data } = await apiInstance.createTimeslotTimeslotsPost(
    timeslotCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **timeslotCreate** | **TimeslotCreate**|  | |


### Return type

**TimeslotRead**

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

# **deleteTimeslotTimeslotsTimeslotIdDelete**
> TimeslotRead deleteTimeslotTimeslotsTimeslotIdDelete()

Supprimer un créneau horaire. Rôles: ADMIN, COORDONNATEUR

### Example

```typescript
import {
    TimeslotsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TimeslotsApi(configuration);

let timeslotId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteTimeslotTimeslotsTimeslotIdDelete(
    timeslotId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **timeslotId** | [**string**] |  | defaults to undefined|


### Return type

**TimeslotRead**

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

# **getTimeslotTimeslotsTimeslotIdGet**
> TimeslotRead getTimeslotTimeslotsTimeslotIdGet()

Récupérer un créneau horaire par ID.

### Example

```typescript
import {
    TimeslotsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TimeslotsApi(configuration);

let timeslotId: string; // (default to undefined)

const { status, data } = await apiInstance.getTimeslotTimeslotsTimeslotIdGet(
    timeslotId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **timeslotId** | [**string**] |  | defaults to undefined|


### Return type

**TimeslotRead**

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

# **listTimeslotsTimeslotsGet**
> Array<TimeslotRead> listTimeslotsTimeslotsGet()

Lister les créneaux horaires (optionnellement filtrés par établissement).

### Example

```typescript
import {
    TimeslotsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TimeslotsApi(configuration);

let skip: number; // (optional) (default to 0)
let limit: number; // (optional) (default to 100)
let establishmentId: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.listTimeslotsTimeslotsGet(
    skip,
    limit,
    establishmentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **skip** | [**number**] |  | (optional) defaults to 0|
| **limit** | [**number**] |  | (optional) defaults to 100|
| **establishmentId** | [**string**] |  | (optional) defaults to undefined|


### Return type

**Array<TimeslotRead>**

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

# **updateTimeslotTimeslotsTimeslotIdPatch**
> TimeslotRead updateTimeslotTimeslotsTimeslotIdPatch(timeslotUpdate)

Mettre à jour un créneau horaire. Rôles: ADMIN, COORDONNATEUR

### Example

```typescript
import {
    TimeslotsApi,
    Configuration,
    TimeslotUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new TimeslotsApi(configuration);

let timeslotId: string; // (default to undefined)
let timeslotUpdate: TimeslotUpdate; //

const { status, data } = await apiInstance.updateTimeslotTimeslotsTimeslotIdPatch(
    timeslotId,
    timeslotUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **timeslotUpdate** | **TimeslotUpdate**|  | |
| **timeslotId** | [**string**] |  | defaults to undefined|


### Return type

**TimeslotRead**

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


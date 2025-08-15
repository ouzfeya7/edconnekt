# RoomsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createRoomRoomsPost**](#createroomroomspost) | **POST** /rooms/ | Create Room|
|[**listRoomsRoomsGet**](#listroomsroomsget) | **GET** /rooms/ | List Rooms|

# **createRoomRoomsPost**
> RoomRead createRoomRoomsPost(roomCreate)

Créer une salle. Rôles: ADMIN, COORDONNATEUR

### Example

```typescript
import {
    RoomsApi,
    Configuration,
    RoomCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomsApi(configuration);

let roomCreate: RoomCreate; //

const { status, data } = await apiInstance.createRoomRoomsPost(
    roomCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomCreate** | **RoomCreate**|  | |


### Return type

**RoomRead**

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

# **listRoomsRoomsGet**
> Array<RoomRead> listRoomsRoomsGet()

Lister les salles.

### Example

```typescript
import {
    RoomsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomsApi(configuration);

let skip: number; // (optional) (default to 0)
let limit: number; // (optional) (default to 100)

const { status, data } = await apiInstance.listRoomsRoomsGet(
    skip,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **skip** | [**number**] |  | (optional) defaults to 0|
| **limit** | [**number**] |  | (optional) defaults to 100|


### Return type

**Array<RoomRead>**

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


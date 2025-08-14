# ResourcesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createResourceResourcesPost**](#createresourceresourcespost) | **POST** /resources | Create Resource|
|[**deleteResourceResourcesResourceIdDelete**](#deleteresourceresourcesresourceiddelete) | **DELETE** /resources/{resource_id} | Delete Resource|
|[**getResourceAuditLogResourcesResourceIdAuditGet**](#getresourceauditlogresourcesresourceidauditget) | **GET** /resources/{resource_id}/audit | Get Resource Audit Log|
|[**getResourceResourcesResourceIdGet**](#getresourceresourcesresourceidget) | **GET** /resources/{resource_id} | Get Resource|
|[**listResourcesResourcesGet**](#listresourcesresourcesget) | **GET** /resources | List Resources|
|[**updateResourceResourcesResourceIdPatch**](#updateresourceresourcesresourceidpatch) | **PATCH** /resources/{resource_id} | Update Resource|

# **createResourceResourcesPost**
> ResourceOut createResourceResourcesPost()


### Example

```typescript
import {
    ResourcesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ResourcesApi(configuration);

let title: string; // (default to undefined)
let visibility: Visibility; // (default to undefined)
let subjectId: number; // (default to undefined)
let competenceId: number; // (default to undefined)
let file: File; // (default to undefined)
let description: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.createResourceResourcesPost(
    title,
    visibility,
    subjectId,
    competenceId,
    file,
    description
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **title** | [**string**] |  | defaults to undefined|
| **visibility** | **Visibility** |  | defaults to undefined|
| **subjectId** | [**number**] |  | defaults to undefined|
| **competenceId** | [**number**] |  | defaults to undefined|
| **file** | [**File**] |  | defaults to undefined|
| **description** | [**string**] |  | (optional) defaults to undefined|


### Return type

**ResourceOut**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteResourceResourcesResourceIdDelete**
> deleteResourceResourcesResourceIdDelete()


### Example

```typescript
import {
    ResourcesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ResourcesApi(configuration);

let resourceId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteResourceResourcesResourceIdDelete(
    resourceId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **resourceId** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getResourceAuditLogResourcesResourceIdAuditGet**
> Array<AuditOut> getResourceAuditLogResourcesResourceIdAuditGet()


### Example

```typescript
import {
    ResourcesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ResourcesApi(configuration);

let resourceId: string; // (default to undefined)
let limit: number; // (optional) (default to 10)
let offset: number; // (optional) (default to 0)

const { status, data } = await apiInstance.getResourceAuditLogResourcesResourceIdAuditGet(
    resourceId,
    limit,
    offset
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **resourceId** | [**string**] |  | defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to 10|
| **offset** | [**number**] |  | (optional) defaults to 0|


### Return type

**Array<AuditOut>**

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

# **getResourceResourcesResourceIdGet**
> ResourceOut getResourceResourcesResourceIdGet()


### Example

```typescript
import {
    ResourcesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ResourcesApi(configuration);

let resourceId: string; // (default to undefined)

const { status, data } = await apiInstance.getResourceResourcesResourceIdGet(
    resourceId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **resourceId** | [**string**] |  | defaults to undefined|


### Return type

**ResourceOut**

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

# **listResourcesResourcesGet**
> Array<ResourceOut> listResourcesResourcesGet()


### Example

```typescript
import {
    ResourcesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ResourcesApi(configuration);

let authorUserId: string; // (optional) (default to undefined)
let visibility: Visibility; // (optional) (default to undefined)
let subjectId: number; // (optional) (default to undefined)
let competenceId: number; // (optional) (default to undefined)
let status: ResourceStatus; // (optional) (default to undefined)
let limit: number; // (optional) (default to 10)
let offset: number; // (optional) (default to 0)

const { status, data } = await apiInstance.listResourcesResourcesGet(
    authorUserId,
    visibility,
    subjectId,
    competenceId,
    status,
    limit,
    offset
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **authorUserId** | [**string**] |  | (optional) defaults to undefined|
| **visibility** | **Visibility** |  | (optional) defaults to undefined|
| **subjectId** | [**number**] |  | (optional) defaults to undefined|
| **competenceId** | [**number**] |  | (optional) defaults to undefined|
| **status** | **ResourceStatus** |  | (optional) defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to 10|
| **offset** | [**number**] |  | (optional) defaults to 0|


### Return type

**Array<ResourceOut>**

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

# **updateResourceResourcesResourceIdPatch**
> ResourceOut updateResourceResourcesResourceIdPatch()


### Example

```typescript
import {
    ResourcesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ResourcesApi(configuration);

let resourceId: string; // (default to undefined)
let title: string; // (optional) (default to undefined)
let description: string; // (optional) (default to undefined)
let visibility: Visibility; // (optional) (default to undefined)
let subjectId: number; // (optional) (default to undefined)
let competenceId: number; // (optional) (default to undefined)
let status: ResourceStatus; // (optional) (default to undefined)
let file: File; // (optional) (default to undefined)

const { status, data } = await apiInstance.updateResourceResourcesResourceIdPatch(
    resourceId,
    title,
    description,
    visibility,
    subjectId,
    competenceId,
    status,
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **resourceId** | [**string**] |  | defaults to undefined|
| **title** | [**string**] |  | (optional) defaults to undefined|
| **description** | [**string**] |  | (optional) defaults to undefined|
| **visibility** | **Visibility** |  | (optional) defaults to undefined|
| **subjectId** | [**number**] |  | (optional) defaults to undefined|
| **competenceId** | [**number**] |  | (optional) defaults to undefined|
| **status** | **ResourceStatus** |  | (optional) defaults to undefined|
| **file** | [**File**] |  | (optional) defaults to undefined|


### Return type

**ResourceOut**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


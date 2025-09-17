# AuditApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAuditTrailAuditGet**](#getaudittrailauditget) | **GET** /audit/ | Get Audit Trail|
|[**getLessonAuditLessonsLessonIdAuditGet**](#getlessonauditlessonslessonidauditget) | **GET** /lessons/{lesson_id}/audit | Get Lesson Audit|

# **getAuditTrailAuditGet**
> Array<TimetableAuditRead> getAuditTrailAuditGet()

Journal d\'audit complet. Rôle: DIRECTION, ADMIN

### Example

```typescript
import {
    AuditApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuditApi(configuration);

let skip: number; // (optional) (default to 0)
let limit: number; // (optional) (default to 100)

const { status, data } = await apiInstance.getAuditTrailAuditGet(
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

**Array<TimetableAuditRead>**

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

# **getLessonAuditLessonsLessonIdAuditGet**
> Array<TimetableAuditRead> getLessonAuditLessonsLessonIdAuditGet()

Journal d\'audit pour un cours. Rôle: DIRECTION

### Example

```typescript
import {
    AuditApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuditApi(configuration);

let lessonId: string; // (default to undefined)

const { status, data } = await apiInstance.getLessonAuditLessonsLessonIdAuditGet(
    lessonId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **lessonId** | [**string**] |  | defaults to undefined|


### Return type

**Array<TimetableAuditRead>**

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


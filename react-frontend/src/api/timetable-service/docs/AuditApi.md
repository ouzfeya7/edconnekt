# AuditApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getLessonAuditLessonsLessonIdAuditGet**](#getlessonauditlessonslessonidauditget) | **GET** /lessons/{lesson_id}/audit | Get Lesson Audit|

# **getLessonAuditLessonsLessonIdAuditGet**
> Array<TimetableAuditRead> getLessonAuditLessonsLessonIdAuditGet()

Journal d\'audit pour un cours. Rôle: DIRECTEUR

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


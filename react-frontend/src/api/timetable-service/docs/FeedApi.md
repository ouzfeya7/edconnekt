# FeedApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getIcsFeedFeedClassIdIcsGet**](#geticsfeedfeedclassidicsget) | **GET** /feed/{class_id}.ics | Get Ics Feed|

# **getIcsFeedFeedClassIdIcsGet**
> any getIcsFeedFeedClassIdIcsGet()

Flux iCalendar pour une classe.

### Example

```typescript
import {
    FeedApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FeedApi(configuration);

let classId: string; // (default to undefined)

const { status, data } = await apiInstance.getIcsFeedFeedClassIdIcsGet(
    classId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classId** | [**string**] |  | defaults to undefined|


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


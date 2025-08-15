# TestApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getMessageMessageGet**](#getmessagemessageget) | **GET** /message | Get Message|

# **getMessageMessageGet**
> any getMessageMessageGet()

Point de terminaison de test pour démontrer la récupération des en-têtes selon le guide de l\'équipe Infrastructure

### Example

```typescript
import {
    TestApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TestApi(configuration);

const { status, data } = await apiInstance.getMessageMessageGet();
```

### Parameters
This endpoint does not have any parameters.


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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


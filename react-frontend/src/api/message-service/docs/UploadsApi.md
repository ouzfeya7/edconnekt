# UploadsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createUploadKeyMessagesUploadPost**](#createuploadkeymessagesuploadpost) | **POST** /messages/upload | Create Upload Key|
|[**getFileFilesKeyGet**](#getfilefileskeyget) | **GET** /files/{key} | Get File|
|[**uploadFileUploadsKeyPut**](#uploadfileuploadskeyput) | **PUT** /uploads/{key} | Upload File|

# **createUploadKeyMessagesUploadPost**
> any createUploadKeyMessagesUploadPost()


### Example

```typescript
import {
    UploadsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UploadsApi(configuration);

let filename: string; // (optional) (default to undefined)
let contentType: string; // (optional) (default to undefined)
let size: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.createUploadKeyMessagesUploadPost(
    filename,
    contentType,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **filename** | [**string**] |  | (optional) defaults to undefined|
| **contentType** | [**string**] |  | (optional) defaults to undefined|
| **size** | [**number**] |  | (optional) defaults to undefined|


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

# **getFileFilesKeyGet**
> any getFileFilesKeyGet()


### Example

```typescript
import {
    UploadsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UploadsApi(configuration);

let key: string; // (default to undefined)

const { status, data } = await apiInstance.getFileFilesKeyGet(
    key
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **key** | [**string**] |  | defaults to undefined|


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

# **uploadFileUploadsKeyPut**
> any uploadFileUploadsKeyPut()


### Example

```typescript
import {
    UploadsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UploadsApi(configuration);

let key: string; // (default to undefined)
let file: File; // (default to undefined)

const { status, data } = await apiInstance.uploadFileUploadsKeyPut(
    key,
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **key** | [**string**] |  | defaults to undefined|
| **file** | [**File**] |  | defaults to undefined|


### Return type

**any**

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


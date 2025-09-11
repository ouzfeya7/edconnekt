# TeacherListsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getMyListApiCampaignsCampaignIdMyListGet**](#getmylistapicampaignscampaignidmylistget) | **GET** /api/campaigns/{campaign_id}/my-list | Get My List|
|[**submitMyListApiCampaignsCampaignIdMyListSubmitPost**](#submitmylistapicampaignscampaignidmylistsubmitpost) | **POST** /api/campaigns/{campaign_id}/my-list/submit | Submit My List|
|[**upsertMyListApiCampaignsCampaignIdMyListPut**](#upsertmylistapicampaignscampaignidmylistput) | **PUT** /api/campaigns/{campaign_id}/my-list | Upsert My List|

# **getMyListApiCampaignsCampaignIdMyListGet**
> TeacherListResponse getMyListApiCampaignsCampaignIdMyListGet()


### Example

```typescript
import {
    TeacherListsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TeacherListsApi(configuration);

let campaignId: string; // (default to undefined)
let classId: string; // (default to undefined)

const { status, data } = await apiInstance.getMyListApiCampaignsCampaignIdMyListGet(
    campaignId,
    classId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **campaignId** | [**string**] |  | defaults to undefined|
| **classId** | [**string**] |  | defaults to undefined|


### Return type

**TeacherListResponse**

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

# **submitMyListApiCampaignsCampaignIdMyListSubmitPost**
> TeacherListResponse submitMyListApiCampaignsCampaignIdMyListSubmitPost()


### Example

```typescript
import {
    TeacherListsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TeacherListsApi(configuration);

let campaignId: string; // (default to undefined)
let classId: string; // (default to undefined)

const { status, data } = await apiInstance.submitMyListApiCampaignsCampaignIdMyListSubmitPost(
    campaignId,
    classId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **campaignId** | [**string**] |  | defaults to undefined|
| **classId** | [**string**] |  | defaults to undefined|


### Return type

**TeacherListResponse**

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

# **upsertMyListApiCampaignsCampaignIdMyListPut**
> TeacherListResponse upsertMyListApiCampaignsCampaignIdMyListPut(teacherListItemPayload)


### Example

```typescript
import {
    TeacherListsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TeacherListsApi(configuration);

let campaignId: string; // (default to undefined)
let classId: string; // (default to undefined)
let teacherListItemPayload: Array<TeacherListItemPayload>; //

const { status, data } = await apiInstance.upsertMyListApiCampaignsCampaignIdMyListPut(
    campaignId,
    classId,
    teacherListItemPayload
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teacherListItemPayload** | **Array<TeacherListItemPayload>**|  | |
| **campaignId** | [**string**] |  | defaults to undefined|
| **classId** | [**string**] |  | defaults to undefined|


### Return type

**TeacherListResponse**

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


# PublicationApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**publicListApiCampaignsCampaignIdPublicListGet**](#publiclistapicampaignscampaignidpubliclistget) | **GET** /api/campaigns/{campaign_id}/public-list | Public List|
|[**publicListPdfApiCampaignsCampaignIdPublicListPdfGet**](#publiclistpdfapicampaignscampaignidpubliclistpdfget) | **GET** /api/campaigns/{campaign_id}/public-list.pdf | Public List Pdf|

# **publicListApiCampaignsCampaignIdPublicListGet**
> PublicListResponse publicListApiCampaignsCampaignIdPublicListGet()


### Example

```typescript
import {
    PublicationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PublicationApi(configuration);

let campaignId: string; // (default to undefined)
let classId: string; // (default to undefined)

const { status, data } = await apiInstance.publicListApiCampaignsCampaignIdPublicListGet(
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

**PublicListResponse**

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

# **publicListPdfApiCampaignsCampaignIdPublicListPdfGet**
> any publicListPdfApiCampaignsCampaignIdPublicListPdfGet()


### Example

```typescript
import {
    PublicationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PublicationApi(configuration);

let campaignId: string; // (default to undefined)
let classId: string; // (default to undefined)

const { status, data } = await apiInstance.publicListPdfApiCampaignsCampaignIdPublicListPdfGet(
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


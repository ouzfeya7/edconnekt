# ParentChecklistApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getChecklistApiCampaignsCampaignIdChildrenChildIdChecklistGet**](#getchecklistapicampaignscampaignidchildrenchildidchecklistget) | **GET** /api/campaigns/{campaign_id}/children/{child_id}/checklist | Get Checklist|
|[**progressApiCampaignsCampaignIdChildrenChildIdProgressGet**](#progressapicampaignscampaignidchildrenchildidprogressget) | **GET** /api/campaigns/{campaign_id}/children/{child_id}/progress | Progress|
|[**toggleItemApiCampaignsCampaignIdChildrenChildIdChecklistItemsItemIdPatch**](#toggleitemapicampaignscampaignidchildrenchildidchecklistitemsitemidpatch) | **PATCH** /api/campaigns/{campaign_id}/children/{child_id}/checklist/items/{item_id} | Toggle Item|

# **getChecklistApiCampaignsCampaignIdChildrenChildIdChecklistGet**
> ChecklistResponse getChecklistApiCampaignsCampaignIdChildrenChildIdChecklistGet()


### Example

```typescript
import {
    ParentChecklistApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ParentChecklistApi(configuration);

let campaignId: string; // (default to undefined)
let childId: string; // (default to undefined)
let classId: string; // (default to undefined)

const { status, data } = await apiInstance.getChecklistApiCampaignsCampaignIdChildrenChildIdChecklistGet(
    campaignId,
    childId,
    classId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **campaignId** | [**string**] |  | defaults to undefined|
| **childId** | [**string**] |  | defaults to undefined|
| **classId** | [**string**] |  | defaults to undefined|


### Return type

**ChecklistResponse**

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

# **progressApiCampaignsCampaignIdChildrenChildIdProgressGet**
> ProgressResponse progressApiCampaignsCampaignIdChildrenChildIdProgressGet()


### Example

```typescript
import {
    ParentChecklistApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ParentChecklistApi(configuration);

let campaignId: string; // (default to undefined)
let childId: string; // (default to undefined)
let classId: string; // (default to undefined)

const { status, data } = await apiInstance.progressApiCampaignsCampaignIdChildrenChildIdProgressGet(
    campaignId,
    childId,
    classId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **campaignId** | [**string**] |  | defaults to undefined|
| **childId** | [**string**] |  | defaults to undefined|
| **classId** | [**string**] |  | defaults to undefined|


### Return type

**ProgressResponse**

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

# **toggleItemApiCampaignsCampaignIdChildrenChildIdChecklistItemsItemIdPatch**
> ChecklistResponse toggleItemApiCampaignsCampaignIdChildrenChildIdChecklistItemsItemIdPatch(checklistItemUpdate)


### Example

```typescript
import {
    ParentChecklistApi,
    Configuration,
    ChecklistItemUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new ParentChecklistApi(configuration);

let campaignId: string; // (default to undefined)
let childId: string; // (default to undefined)
let itemId: string; // (default to undefined)
let classId: string; // (default to undefined)
let checklistItemUpdate: ChecklistItemUpdate; //

const { status, data } = await apiInstance.toggleItemApiCampaignsCampaignIdChildrenChildIdChecklistItemsItemIdPatch(
    campaignId,
    childId,
    itemId,
    classId,
    checklistItemUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **checklistItemUpdate** | **ChecklistItemUpdate**|  | |
| **campaignId** | [**string**] |  | defaults to undefined|
| **childId** | [**string**] |  | defaults to undefined|
| **itemId** | [**string**] |  | defaults to undefined|
| **classId** | [**string**] |  | defaults to undefined|


### Return type

**ChecklistResponse**

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


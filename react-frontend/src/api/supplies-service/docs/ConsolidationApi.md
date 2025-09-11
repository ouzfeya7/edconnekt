# ConsolidationApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**consolidationApplyApiCampaignsCampaignIdConsolidationPut**](#consolidationapplyapicampaignscampaignidconsolidationput) | **PUT** /api/campaigns/{campaign_id}/consolidation | Consolidation Apply|
|[**consolidationDiffApiCampaignsCampaignIdConsolidationDiffGet**](#consolidationdiffapicampaignscampaignidconsolidationdiffget) | **GET** /api/campaigns/{campaign_id}/consolidation/diff | Consolidation Diff|

# **consolidationApplyApiCampaignsCampaignIdConsolidationPut**
> any consolidationApplyApiCampaignsCampaignIdConsolidationPut(consolidationDecision)


### Example

```typescript
import {
    ConsolidationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ConsolidationApi(configuration);

let campaignId: string; // (default to undefined)
let classId: string; // (default to undefined)
let consolidationDecision: Array<ConsolidationDecision>; //

const { status, data } = await apiInstance.consolidationApplyApiCampaignsCampaignIdConsolidationPut(
    campaignId,
    classId,
    consolidationDecision
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **consolidationDecision** | **Array<ConsolidationDecision>**|  | |
| **campaignId** | [**string**] |  | defaults to undefined|
| **classId** | [**string**] |  | defaults to undefined|


### Return type

**any**

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

# **consolidationDiffApiCampaignsCampaignIdConsolidationDiffGet**
> any consolidationDiffApiCampaignsCampaignIdConsolidationDiffGet()


### Example

```typescript
import {
    ConsolidationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ConsolidationApi(configuration);

let campaignId: string; // (default to undefined)
let classId: string; // (default to undefined)

const { status, data } = await apiInstance.consolidationDiffApiCampaignsCampaignIdConsolidationDiffGet(
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


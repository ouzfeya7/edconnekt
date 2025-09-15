# CampaignsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**campaignDashboardApiCampaignsCampaignIdDashboardGet**](#campaigndashboardapicampaignscampaigniddashboardget) | **GET** /api/campaigns/{campaign_id}/dashboard | Campaign Dashboard|
|[**closeCampaignApiCampaignsCampaignIdClosePatch**](#closecampaignapicampaignscampaignidclosepatch) | **PATCH** /api/campaigns/{campaign_id}/close | Close Campaign|
|[**createCampaignApiCampaignsPost**](#createcampaignapicampaignspost) | **POST** /api/campaigns/ | Create Campaign|
|[**listCampaignsApiCampaignsGet**](#listcampaignsapicampaignsget) | **GET** /api/campaigns/ | List Campaigns|
|[**openCampaignApiCampaignsCampaignIdOpenPatch**](#opencampaignapicampaignscampaignidopenpatch) | **PATCH** /api/campaigns/{campaign_id}/open | Open Campaign|
|[**publishCampaignApiCampaignsCampaignIdPublishPatch**](#publishcampaignapicampaignscampaignidpublishpatch) | **PATCH** /api/campaigns/{campaign_id}/publish | Publish Campaign|
|[**validateCampaignApiCampaignsCampaignIdValidatePatch**](#validatecampaignapicampaignscampaignidvalidatepatch) | **PATCH** /api/campaigns/{campaign_id}/validate | Validate Campaign|

# **campaignDashboardApiCampaignsCampaignIdDashboardGet**
> CampaignDashboard campaignDashboardApiCampaignsCampaignIdDashboardGet()


### Example

```typescript
import {
    CampaignsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CampaignsApi(configuration);

let campaignId: string; // (default to undefined)

const { status, data } = await apiInstance.campaignDashboardApiCampaignsCampaignIdDashboardGet(
    campaignId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **campaignId** | [**string**] |  | defaults to undefined|


### Return type

**CampaignDashboard**

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

# **closeCampaignApiCampaignsCampaignIdClosePatch**
> CampaignResponse closeCampaignApiCampaignsCampaignIdClosePatch()


### Example

```typescript
import {
    CampaignsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CampaignsApi(configuration);

let campaignId: string; // (default to undefined)

const { status, data } = await apiInstance.closeCampaignApiCampaignsCampaignIdClosePatch(
    campaignId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **campaignId** | [**string**] |  | defaults to undefined|


### Return type

**CampaignResponse**

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

# **createCampaignApiCampaignsPost**
> CampaignResponse createCampaignApiCampaignsPost(campaignCreate)


### Example

```typescript
import {
    CampaignsApi,
    Configuration,
    CampaignCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new CampaignsApi(configuration);

let campaignCreate: CampaignCreate; //

const { status, data } = await apiInstance.createCampaignApiCampaignsPost(
    campaignCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **campaignCreate** | **CampaignCreate**|  | |


### Return type

**CampaignResponse**

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

# **listCampaignsApiCampaignsGet**
> { [key: string]: any; } listCampaignsApiCampaignsGet()


### Example

```typescript
import {
    CampaignsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CampaignsApi(configuration);

let name: string; //Filtrer par nom de campagne (optional) (default to undefined)
let status: string; //Filtrer par statut (optional) (default to undefined)
let establishmentId: string; //Filtrer par établissement (optional) (default to undefined)
let schoolYear: string; //Filtrer par année scolaire (optional) (default to undefined)
let classId: string; //Filtrer par classe (optional) (default to undefined)
let limit: number; //Nombre de résultats par page (optional) (default to 50)
let offset: number; //Décalage pour la pagination (optional) (default to 0)

const { status, data } = await apiInstance.listCampaignsApiCampaignsGet(
    name,
    status,
    establishmentId,
    schoolYear,
    classId,
    limit,
    offset
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | [**string**] | Filtrer par nom de campagne | (optional) defaults to undefined|
| **status** | [**string**] | Filtrer par statut | (optional) defaults to undefined|
| **establishmentId** | [**string**] | Filtrer par établissement | (optional) defaults to undefined|
| **schoolYear** | [**string**] | Filtrer par année scolaire | (optional) defaults to undefined|
| **classId** | [**string**] | Filtrer par classe | (optional) defaults to undefined|
| **limit** | [**number**] | Nombre de résultats par page | (optional) defaults to 50|
| **offset** | [**number**] | Décalage pour la pagination | (optional) defaults to 0|


### Return type

**{ [key: string]: any; }**

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

# **openCampaignApiCampaignsCampaignIdOpenPatch**
> CampaignResponse openCampaignApiCampaignsCampaignIdOpenPatch()


### Example

```typescript
import {
    CampaignsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CampaignsApi(configuration);

let campaignId: string; // (default to undefined)

const { status, data } = await apiInstance.openCampaignApiCampaignsCampaignIdOpenPatch(
    campaignId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **campaignId** | [**string**] |  | defaults to undefined|


### Return type

**CampaignResponse**

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

# **publishCampaignApiCampaignsCampaignIdPublishPatch**
> CampaignResponse publishCampaignApiCampaignsCampaignIdPublishPatch()


### Example

```typescript
import {
    CampaignsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CampaignsApi(configuration);

let campaignId: string; // (default to undefined)

const { status, data } = await apiInstance.publishCampaignApiCampaignsCampaignIdPublishPatch(
    campaignId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **campaignId** | [**string**] |  | defaults to undefined|


### Return type

**CampaignResponse**

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

# **validateCampaignApiCampaignsCampaignIdValidatePatch**
> CampaignResponse validateCampaignApiCampaignsCampaignIdValidatePatch()


### Example

```typescript
import {
    CampaignsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CampaignsApi(configuration);

let campaignId: string; // (default to undefined)

const { status, data } = await apiInstance.validateCampaignApiCampaignsCampaignIdValidatePatch(
    campaignId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **campaignId** | [**string**] |  | defaults to undefined|


### Return type

**CampaignResponse**

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


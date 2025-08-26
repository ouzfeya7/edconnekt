# ReplacementsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createReplacementReplacementsPost**](#createreplacementreplacementspost) | **POST** /replacements/ | Create Replacement|
|[**deleteReplacementReplacementsReplacementIdDelete**](#deletereplacementreplacementsreplacementiddelete) | **DELETE** /replacements/{replacement_id} | Delete Replacement|

# **createReplacementReplacementsPost**
> ReplacementRead createReplacementReplacementsPost(replacementCreate)

Créer un remplacement (status=REPLACED). Rôles: COORDONNATEUR, DIRECTEUR, ADMIN

### Example

```typescript
import {
    ReplacementsApi,
    Configuration,
    ReplacementCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new ReplacementsApi(configuration);

let replacementCreate: ReplacementCreate; //

const { status, data } = await apiInstance.createReplacementReplacementsPost(
    replacementCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **replacementCreate** | **ReplacementCreate**|  | |


### Return type

**ReplacementRead**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteReplacementReplacementsReplacementIdDelete**
> ReplacementRead deleteReplacementReplacementsReplacementIdDelete()

Supprimer un remplacement. Rôles: COORDONNATEUR, ADMIN

### Example

```typescript
import {
    ReplacementsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReplacementsApi(configuration);

let replacementId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteReplacementReplacementsReplacementIdDelete(
    replacementId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **replacementId** | [**string**] |  | defaults to undefined|


### Return type

**ReplacementRead**

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


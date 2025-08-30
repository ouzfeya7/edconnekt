# BatchesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**commitBatchApiV1IdentityBatchesBatchIdCommitPost**](#commitbatchapiv1identitybatchesbatchidcommitpost) | **POST** /api/v1/identity/batches/{batch_id}/commit | Commit Batch|
|[**getBatchApiV1IdentityBatchesBatchIdGet**](#getbatchapiv1identitybatchesbatchidget) | **GET** /api/v1/identity/batches/{batch_id} | Get Batch|
|[**getBatchItemsApiV1IdentityBatchesBatchIdItemsGet**](#getbatchitemsapiv1identitybatchesbatchiditemsget) | **GET** /api/v1/identity/batches/{batch_id}/items | Get Batch Items|
|[**listBatchesApiV1IdentityBatchesGet**](#listbatchesapiv1identitybatchesget) | **GET** /api/v1/identity/batches | List Batches|

# **commitBatchApiV1IdentityBatchesBatchIdCommitPost**
> any commitBatchApiV1IdentityBatchesBatchIdCommitPost()

Marquer un batch comme COMMITTED (optionnel).  Args:     batch_id: ID du batch     identity_service: Service d\'identité     current_user: Utilisateur authentifié  Returns:     dict: Message de confirmation  Raises:     404: Batch non trouvé     400: Erreur lors du commit

### Example

```typescript
import {
    BatchesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BatchesApi(configuration);

let batchId: string; // (default to undefined)

const { status, data } = await apiInstance.commitBatchApiV1IdentityBatchesBatchIdCommitPost(
    batchId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchId** | [**string**] |  | defaults to undefined|


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

# **getBatchApiV1IdentityBatchesBatchIdGet**
> BatchRead getBatchApiV1IdentityBatchesBatchIdGet()

Récupérer un batch par son ID.  Args:     batch_id: ID du batch     batch_service: Service de gestion des batches     current_user: Utilisateur authentifié  Returns:     BatchRead: Détails du batch  Raises:     404: Batch non trouvé

### Example

```typescript
import {
    BatchesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BatchesApi(configuration);

let batchId: string; // (default to undefined)

const { status, data } = await apiInstance.getBatchApiV1IdentityBatchesBatchIdGet(
    batchId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchId** | [**string**] |  | defaults to undefined|


### Return type

**BatchRead**

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

# **getBatchItemsApiV1IdentityBatchesBatchIdItemsGet**
> any getBatchItemsApiV1IdentityBatchesBatchIdItemsGet()

Lister les items d\'un batch avec pagination et filtres.  Args:     batch_id: ID du batch     item_status: Statut des items pour filtrer (NEW, UPDATED, SKIPPED, INVALID)     domain: Domaine des items pour filtrer (student, parent, teacher, admin_staff)     pagination: Paramètres de pagination et tri     identity_service: Service d\'identité     current_user: Utilisateur authentifié  Returns:     dict: Liste paginée des items du batch  Raises:     404: Batch non trouvé

### Example

```typescript
import {
    BatchesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BatchesApi(configuration);

let batchId: string; // (default to undefined)
let itemStatus: string; // (optional) (default to undefined)
let domain: string; // (optional) (default to undefined)
let page: number; //Numéro de page (optional) (default to 1)
let size: number; //Taille de page (optional) (default to 10)
let orderBy: string; //Colonne de tri (optional) (default to undefined)
let orderDir: string; //Sens de tri (asc/desc) (optional) (default to 'desc')

const { status, data } = await apiInstance.getBatchItemsApiV1IdentityBatchesBatchIdItemsGet(
    batchId,
    itemStatus,
    domain,
    page,
    size,
    orderBy,
    orderDir
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchId** | [**string**] |  | defaults to undefined|
| **itemStatus** | [**string**] |  | (optional) defaults to undefined|
| **domain** | [**string**] |  | (optional) defaults to undefined|
| **page** | [**number**] | Numéro de page | (optional) defaults to 1|
| **size** | [**number**] | Taille de page | (optional) defaults to 10|
| **orderBy** | [**string**] | Colonne de tri | (optional) defaults to undefined|
| **orderDir** | [**string**] | Sens de tri (asc/desc) | (optional) defaults to 'desc'|


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

# **listBatchesApiV1IdentityBatchesGet**
> any listBatchesApiV1IdentityBatchesGet()

Lister les batches d\'identités avec pagination et filtres.  Args:     establishment_id: ID de l\'établissement pour filtrer     uploaded_by: ID de l\'uploader pour filtrer     pagination: Paramètres de pagination et tri     batch_service: Service de gestion des batches     current_user: Utilisateur authentifié  Returns:     dict: Liste paginée des batches

### Example

```typescript
import {
    BatchesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BatchesApi(configuration);

let establishmentId: string; // (optional) (default to undefined)
let uploadedBy: string; // (optional) (default to undefined)
let page: number; //Numéro de page (optional) (default to 1)
let size: number; //Taille de page (optional) (default to 10)
let orderBy: string; //Colonne de tri (optional) (default to undefined)
let orderDir: string; //Sens de tri (asc/desc) (optional) (default to 'desc')

const { status, data } = await apiInstance.listBatchesApiV1IdentityBatchesGet(
    establishmentId,
    uploadedBy,
    page,
    size,
    orderBy,
    orderDir
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **establishmentId** | [**string**] |  | (optional) defaults to undefined|
| **uploadedBy** | [**string**] |  | (optional) defaults to undefined|
| **page** | [**number**] | Numéro de page | (optional) defaults to 1|
| **size** | [**number**] | Taille de page | (optional) defaults to 10|
| **orderBy** | [**string**] | Colonne de tri | (optional) defaults to undefined|
| **orderDir** | [**string**] | Sens de tri (asc/desc) | (optional) defaults to 'desc'|


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


# ProvisioningApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createBatchProvisioningBatchesPost**](#createbatchprovisioningbatchespost) | **POST** /provisioning/batches | Create Batch|
|[**createBatchProvisioningBatchesPost_0**](#createbatchprovisioningbatchespost_0) | **POST** /provisioning/batches | Create Batch|
|[**createTestItemProvisioningBatchesBatchIdTestItemsPost**](#createtestitemprovisioningbatchesbatchidtestitemspost) | **POST** /provisioning/batches/{batch_id}/test-items | Create Test Item|
|[**createTestItemProvisioningBatchesBatchIdTestItemsPost_0**](#createtestitemprovisioningbatchesbatchidtestitemspost_0) | **POST** /provisioning/batches/{batch_id}/test-items | Create Test Item|
|[**generateUsernameProvisioningGenerateUsernamePost**](#generateusernameprovisioninggenerateusernamepost) | **POST** /provisioning/generate-username | Generate Username|
|[**generateUsernameProvisioningGenerateUsernamePost_0**](#generateusernameprovisioninggenerateusernamepost_0) | **POST** /provisioning/generate-username | Generate Username|
|[**listBatchItemsProvisioningBatchesBatchIdItemsGet**](#listbatchitemsprovisioningbatchesbatchiditemsget) | **GET** /provisioning/batches/{batch_id}/items | List Batch Items|
|[**listBatchItemsProvisioningBatchesBatchIdItemsGet_0**](#listbatchitemsprovisioningbatchesbatchiditemsget_0) | **GET** /provisioning/batches/{batch_id}/items | List Batch Items|
|[**listBatchesProvisioningBatchesGet**](#listbatchesprovisioningbatchesget) | **GET** /provisioning/batches | List Batches|
|[**listBatchesProvisioningBatchesGet_0**](#listbatchesprovisioningbatchesget_0) | **GET** /provisioning/batches | List Batches|
|[**runBatchProvisioningBatchesBatchIdRunPost**](#runbatchprovisioningbatchesbatchidrunpost) | **POST** /provisioning/batches/{batch_id}/run | Run Batch|
|[**runBatchProvisioningBatchesBatchIdRunPost_0**](#runbatchprovisioningbatchesbatchidrunpost_0) | **POST** /provisioning/batches/{batch_id}/run | Run Batch|

# **createBatchProvisioningBatchesPost**
> ProvisioningBatch createBatchProvisioningBatchesPost(batchCreateRequest)


### Example

```typescript
import {
    ProvisioningApi,
    Configuration,
    BatchCreateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ProvisioningApi(configuration);

let batchCreateRequest: BatchCreateRequest; //

const { status, data } = await apiInstance.createBatchProvisioningBatchesPost(
    batchCreateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchCreateRequest** | **BatchCreateRequest**|  | |


### Return type

**ProvisioningBatch**

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

# **createBatchProvisioningBatchesPost_0**
> ProvisioningBatch createBatchProvisioningBatchesPost_0(batchCreateRequest)


### Example

```typescript
import {
    ProvisioningApi,
    Configuration,
    BatchCreateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ProvisioningApi(configuration);

let batchCreateRequest: BatchCreateRequest; //

const { status, data } = await apiInstance.createBatchProvisioningBatchesPost_0(
    batchCreateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchCreateRequest** | **BatchCreateRequest**|  | |


### Return type

**ProvisioningBatch**

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

# **createTestItemProvisioningBatchesBatchIdTestItemsPost**
> any createTestItemProvisioningBatchesBatchIdTestItemsPost(requestBody)

Crée un item de test pour un batch (pour les tests uniquement).  Args:     batch_id: ID du batch     item_data: Données de l\'item avec les clés:         - identity_id: UUID de l\'identité         - firstname: Prénom         - lastname: Nom         - email: Email         - role_principal_code: Rôle principal         - establishment_id: ID de l\'établissement (optionnel)

### Example

```typescript
import {
    ProvisioningApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProvisioningApi(configuration);

let batchId: string; // (default to undefined)
let requestBody: { [key: string]: any; }; //

const { status, data } = await apiInstance.createTestItemProvisioningBatchesBatchIdTestItemsPost(
    batchId,
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **{ [key: string]: any; }**|  | |
| **batchId** | [**string**] |  | defaults to undefined|


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

# **createTestItemProvisioningBatchesBatchIdTestItemsPost_0**
> any createTestItemProvisioningBatchesBatchIdTestItemsPost_0(requestBody)

Crée un item de test pour un batch (pour les tests uniquement).  Args:     batch_id: ID du batch     item_data: Données de l\'item avec les clés:         - identity_id: UUID de l\'identité         - firstname: Prénom         - lastname: Nom         - email: Email         - role_principal_code: Rôle principal         - establishment_id: ID de l\'établissement (optionnel)

### Example

```typescript
import {
    ProvisioningApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProvisioningApi(configuration);

let batchId: string; // (default to undefined)
let requestBody: { [key: string]: any; }; //

const { status, data } = await apiInstance.createTestItemProvisioningBatchesBatchIdTestItemsPost_0(
    batchId,
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **{ [key: string]: any; }**|  | |
| **batchId** | [**string**] |  | defaults to undefined|


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

# **generateUsernameProvisioningGenerateUsernamePost**
> any generateUsernameProvisioningGenerateUsernamePost()

Génère un username unique au format firstname.lastname001.  Args:     firstname: Prénom de l\'utilisateur     lastname: Nom de famille de l\'utilisateur     email: Email de l\'utilisateur (optionnel, utilisé comme fallback)  Returns:     dict: Username généré

### Example

```typescript
import {
    ProvisioningApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProvisioningApi(configuration);

let firstname: string; // (default to undefined)
let lastname: string; // (default to undefined)
let email: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.generateUsernameProvisioningGenerateUsernamePost(
    firstname,
    lastname,
    email
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **firstname** | [**string**] |  | defaults to undefined|
| **lastname** | [**string**] |  | defaults to undefined|
| **email** | [**string**] |  | (optional) defaults to undefined|


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

# **generateUsernameProvisioningGenerateUsernamePost_0**
> any generateUsernameProvisioningGenerateUsernamePost_0()

Génère un username unique au format firstname.lastname001.  Args:     firstname: Prénom de l\'utilisateur     lastname: Nom de famille de l\'utilisateur     email: Email de l\'utilisateur (optionnel, utilisé comme fallback)  Returns:     dict: Username généré

### Example

```typescript
import {
    ProvisioningApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProvisioningApi(configuration);

let firstname: string; // (default to undefined)
let lastname: string; // (default to undefined)
let email: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.generateUsernameProvisioningGenerateUsernamePost_0(
    firstname,
    lastname,
    email
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **firstname** | [**string**] |  | defaults to undefined|
| **lastname** | [**string**] |  | defaults to undefined|
| **email** | [**string**] |  | (optional) defaults to undefined|


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

# **listBatchItemsProvisioningBatchesBatchIdItemsGet**
> Array<ProvisioningItem> listBatchItemsProvisioningBatchesBatchIdItemsGet()


### Example

```typescript
import {
    ProvisioningApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProvisioningApi(configuration);

let batchId: string; // (default to undefined)
let skip: number; // (optional) (default to 0)
let limit: number; // (optional) (default to 100)

const { status, data } = await apiInstance.listBatchItemsProvisioningBatchesBatchIdItemsGet(
    batchId,
    skip,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchId** | [**string**] |  | defaults to undefined|
| **skip** | [**number**] |  | (optional) defaults to 0|
| **limit** | [**number**] |  | (optional) defaults to 100|


### Return type

**Array<ProvisioningItem>**

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

# **listBatchItemsProvisioningBatchesBatchIdItemsGet_0**
> Array<ProvisioningItem> listBatchItemsProvisioningBatchesBatchIdItemsGet_0()


### Example

```typescript
import {
    ProvisioningApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProvisioningApi(configuration);

let batchId: string; // (default to undefined)
let skip: number; // (optional) (default to 0)
let limit: number; // (optional) (default to 100)

const { status, data } = await apiInstance.listBatchItemsProvisioningBatchesBatchIdItemsGet_0(
    batchId,
    skip,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchId** | [**string**] |  | defaults to undefined|
| **skip** | [**number**] |  | (optional) defaults to 0|
| **limit** | [**number**] |  | (optional) defaults to 100|


### Return type

**Array<ProvisioningItem>**

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

# **listBatchesProvisioningBatchesGet**
> Array<ProvisioningBatch> listBatchesProvisioningBatchesGet()


### Example

```typescript
import {
    ProvisioningApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProvisioningApi(configuration);

let skip: number; // (optional) (default to 0)
let limit: number; // (optional) (default to 100)

const { status, data } = await apiInstance.listBatchesProvisioningBatchesGet(
    skip,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **skip** | [**number**] |  | (optional) defaults to 0|
| **limit** | [**number**] |  | (optional) defaults to 100|


### Return type

**Array<ProvisioningBatch>**

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

# **listBatchesProvisioningBatchesGet_0**
> Array<ProvisioningBatch> listBatchesProvisioningBatchesGet_0()


### Example

```typescript
import {
    ProvisioningApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProvisioningApi(configuration);

let skip: number; // (optional) (default to 0)
let limit: number; // (optional) (default to 100)

const { status, data } = await apiInstance.listBatchesProvisioningBatchesGet_0(
    skip,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **skip** | [**number**] |  | (optional) defaults to 0|
| **limit** | [**number**] |  | (optional) defaults to 100|


### Return type

**Array<ProvisioningBatch>**

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

# **runBatchProvisioningBatchesBatchIdRunPost**
> any runBatchProvisioningBatchesBatchIdRunPost()


### Example

```typescript
import {
    ProvisioningApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProvisioningApi(configuration);

let batchId: string; // (default to undefined)

const { status, data } = await apiInstance.runBatchProvisioningBatchesBatchIdRunPost(
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

# **runBatchProvisioningBatchesBatchIdRunPost_0**
> any runBatchProvisioningBatchesBatchIdRunPost_0()


### Example

```typescript
import {
    ProvisioningApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProvisioningApi(configuration);

let batchId: string; // (default to undefined)

const { status, data } = await apiInstance.runBatchProvisioningBatchesBatchIdRunPost_0(
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


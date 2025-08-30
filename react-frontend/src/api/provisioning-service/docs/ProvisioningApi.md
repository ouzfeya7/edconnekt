# ProvisioningApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createBatchProvisioningBatchesPost**](#createbatchprovisioningbatchespost) | **POST** /provisioning/batches | Create Batch|
|[**listBatchItemsProvisioningBatchesBatchIdItemsGet**](#listbatchitemsprovisioningbatchesbatchiditemsget) | **GET** /provisioning/batches/{batch_id}/items | List Batch Items|
|[**listBatchesProvisioningBatchesGet**](#listbatchesprovisioningbatchesget) | **GET** /provisioning/batches | List Batches|
|[**runBatchProvisioningBatchesBatchIdRunPost**](#runbatchprovisioningbatchesbatchidrunpost) | **POST** /provisioning/batches/{batch_id}/run | Run Batch|

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


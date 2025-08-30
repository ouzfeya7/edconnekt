# HealthApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**healthCheckApiHealthGet**](#healthcheckapihealthget) | **GET** /api/health/ | Health Check|
|[**messagingHealthApiMessagingGet**](#messaginghealthapimessagingget) | **GET** /api/messaging/ | Messaging Health|
|[**rootApiGet**](#rootapiget) | **GET** /api/ | Root|
|[**schedulerHealthApiSchedulerGet**](#schedulerhealthapischedulerget) | **GET** /api/scheduler/ | Scheduler Health|

# **healthCheckApiHealthGet**
> object healthCheckApiHealthGet()

Endpoint de santé pour vérifier l\'état du service.  Args:     request: Requête FastAPI      Returns:     Dict[str, Any]: Informations sur l\'état du service

### Example

```typescript
import {
    HealthApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HealthApi(configuration);

const { status, data } = await apiInstance.healthCheckApiHealthGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **messagingHealthApiMessagingGet**
> object messagingHealthApiMessagingGet()

Endpoint de santé du messaging.  Args:     request: Requête FastAPI      Returns:     Dict[str, Any]: Informations sur l\'état du messaging

### Example

```typescript
import {
    HealthApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HealthApi(configuration);

const { status, data } = await apiInstance.messagingHealthApiMessagingGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **rootApiGet**
> object rootApiGet()

Endpoint racine du service.  Args:     request: Requête FastAPI      Returns:     Dict[str, Any]: Informations de base sur le service

### Example

```typescript
import {
    HealthApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HealthApi(configuration);

const { status, data } = await apiInstance.rootApiGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **schedulerHealthApiSchedulerGet**
> object schedulerHealthApiSchedulerGet()

Endpoint de santé du scheduler.  Args:     request: Requête FastAPI      Returns:     Dict[str, Any]: Informations sur l\'état du scheduler

### Example

```typescript
import {
    HealthApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HealthApi(configuration);

const { status, data } = await apiInstance.schedulerHealthApiSchedulerGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


# EventsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**listOutboxEventsApiCompetenceEventsEventsGet**](#listoutboxeventsapicompetenceeventseventsget) | **GET** /api/competence/events/events | List Outbox Events|
|[**replayEventsApiCompetenceEventsEventsReplayPost**](#replayeventsapicompetenceeventseventsreplaypost) | **POST** /api/competence/events/events/replay | Replay Events|

# **listOutboxEventsApiCompetenceEventsEventsGet**
> Array<OutboxEventResponse> listOutboxEventsApiCompetenceEventsEventsGet()

List outbox events with filters and pagination

### Example

```typescript
import {
    EventsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EventsApi(configuration);

let eventType: string; //Filter by event type (optional) (default to undefined)
let aggregateType: string; //Filter by aggregate type (optional) (default to undefined)
let aggregateId: string; //Filter by aggregate ID (optional) (default to undefined)
let status: string; //Filter by status (PENDING, PROCESSED, FAILED) (optional) (default to undefined)
let startDate: string; //Filter by creation start date (optional) (default to undefined)
let endDate: string; //Filter by creation end date (optional) (default to undefined)
let page: number; //Page number (optional) (default to 1)
let size: number; //Page size (optional) (default to 20)

const { status, data } = await apiInstance.listOutboxEventsApiCompetenceEventsEventsGet(
    eventType,
    aggregateType,
    aggregateId,
    status,
    startDate,
    endDate,
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **eventType** | [**string**] | Filter by event type | (optional) defaults to undefined|
| **aggregateType** | [**string**] | Filter by aggregate type | (optional) defaults to undefined|
| **aggregateId** | [**string**] | Filter by aggregate ID | (optional) defaults to undefined|
| **status** | [**string**] | Filter by status (PENDING, PROCESSED, FAILED) | (optional) defaults to undefined|
| **startDate** | [**string**] | Filter by creation start date | (optional) defaults to undefined|
| **endDate** | [**string**] | Filter by creation end date | (optional) defaults to undefined|
| **page** | [**number**] | Page number | (optional) defaults to 1|
| **size** | [**number**] | Page size | (optional) defaults to 20|


### Return type

**Array<OutboxEventResponse>**

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

# **replayEventsApiCompetenceEventsEventsReplayPost**
> replayEventsApiCompetenceEventsEventsReplayPost()

Manually trigger processing of pending outbox events

### Example

```typescript
import {
    EventsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EventsApi(configuration);

const { status, data } = await apiInstance.replayEventsApiCompetenceEventsEventsReplayPost();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


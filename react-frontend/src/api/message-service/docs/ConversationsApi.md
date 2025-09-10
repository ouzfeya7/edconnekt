# ConversationsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createConversationConversationsPost**](#createconversationconversationspost) | **POST** /conversations | Create Conversation|
|[**listConversationsConversationsGet**](#listconversationsconversationsget) | **GET** /conversations | List Conversations|

# **createConversationConversationsPost**
> ConversationOut createConversationConversationsPost(conversationCreate)


### Example

```typescript
import {
    ConversationsApi,
    Configuration,
    ConversationCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

let conversationCreate: ConversationCreate; //

const { status, data } = await apiInstance.createConversationConversationsPost(
    conversationCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **conversationCreate** | **ConversationCreate**|  | |


### Return type

**ConversationOut**

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

# **listConversationsConversationsGet**
> Array<ConversationOut> listConversationsConversationsGet()


### Example

```typescript
import {
    ConversationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ConversationsApi(configuration);

const { status, data } = await apiInstance.listConversationsConversationsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<ConversationOut>**

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


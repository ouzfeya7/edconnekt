# MessagesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteMessageConversationsMessagesMessageIdDeletePost**](#deletemessageconversationsmessagesmessageiddeletepost) | **POST** /conversations/messages/{message_id}/delete | Delete Message|
|[**editMessageConversationsMessagesMessageIdEditPost**](#editmessageconversationsmessagesmessageideditpost) | **POST** /conversations/messages/{message_id}/edit | Edit Message|
|[**listMessagesConversationsConversationIdMessagesGet**](#listmessagesconversationsconversationidmessagesget) | **GET** /conversations/{conversation_id}/messages | List Messages|
|[**sendMessageConversationsConversationIdMessagesPost**](#sendmessageconversationsconversationidmessagespost) | **POST** /conversations/{conversation_id}/messages | Send Message|

# **deleteMessageConversationsMessagesMessageIdDeletePost**
> any deleteMessageConversationsMessagesMessageIdDeletePost()


### Example

```typescript
import {
    MessagesApi,
    Configuration,
    MessageDelete
} from './api';

const configuration = new Configuration();
const apiInstance = new MessagesApi(configuration);

let messageId: string; // (default to undefined)
let messageDelete: MessageDelete; // (optional)

const { status, data } = await apiInstance.deleteMessageConversationsMessagesMessageIdDeletePost(
    messageId,
    messageDelete
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **messageDelete** | **MessageDelete**|  | |
| **messageId** | [**string**] |  | defaults to undefined|


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

# **editMessageConversationsMessagesMessageIdEditPost**
> MessageOut editMessageConversationsMessagesMessageIdEditPost(messageEdit)


### Example

```typescript
import {
    MessagesApi,
    Configuration,
    MessageEdit
} from './api';

const configuration = new Configuration();
const apiInstance = new MessagesApi(configuration);

let messageId: string; // (default to undefined)
let messageEdit: MessageEdit; //

const { status, data } = await apiInstance.editMessageConversationsMessagesMessageIdEditPost(
    messageId,
    messageEdit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **messageEdit** | **MessageEdit**|  | |
| **messageId** | [**string**] |  | defaults to undefined|


### Return type

**MessageOut**

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

# **listMessagesConversationsConversationIdMessagesGet**
> Array<MessageOut> listMessagesConversationsConversationIdMessagesGet()


### Example

```typescript
import {
    MessagesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MessagesApi(configuration);

let conversationId: string; // (default to undefined)
let limit: number; // (optional) (default to 50)
let after: string; // (optional) (default to undefined)
let before: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.listMessagesConversationsConversationIdMessagesGet(
    conversationId,
    limit,
    after,
    before
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **conversationId** | [**string**] |  | defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to 50|
| **after** | [**string**] |  | (optional) defaults to undefined|
| **before** | [**string**] |  | (optional) defaults to undefined|


### Return type

**Array<MessageOut>**

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

# **sendMessageConversationsConversationIdMessagesPost**
> MessageOut sendMessageConversationsConversationIdMessagesPost(messageCreate)


### Example

```typescript
import {
    MessagesApi,
    Configuration,
    MessageCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new MessagesApi(configuration);

let conversationId: string; // (default to undefined)
let messageCreate: MessageCreate; //

const { status, data } = await apiInstance.sendMessageConversationsConversationIdMessagesPost(
    conversationId,
    messageCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **messageCreate** | **MessageCreate**|  | |
| **conversationId** | [**string**] |  | defaults to undefined|


### Return type

**MessageOut**

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


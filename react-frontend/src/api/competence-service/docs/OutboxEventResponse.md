# OutboxEventResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**event_type** | **string** | Type of the event | [default to undefined]
**aggregate_type** | **string** | Type of the aggregate (e.g., Referential, Subject) | [default to undefined]
**aggregate_id** | **string** | ID of the aggregate instance | [default to undefined]
**payload** | **object** | Event payload as a dictionary | [default to undefined]
**tenant_id** | **string** | Tenant ID associated with the event | [default to undefined]
**id** | **string** |  | [default to undefined]
**created_at** | **string** |  | [default to undefined]
**processed_at** | **string** |  | [optional] [default to undefined]
**status** | **string** | Processing status (PENDING, PROCESSED, FAILED) | [optional] [default to 'PENDING']

## Example

```typescript
import { OutboxEventResponse } from './api';

const instance: OutboxEventResponse = {
    event_type,
    aggregate_type,
    aggregate_id,
    payload,
    tenant_id,
    id,
    created_at,
    processed_at,
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

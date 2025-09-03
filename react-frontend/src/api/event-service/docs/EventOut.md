# EventOut

Schema for event response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **string** | Event title | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**category** | **string** | Event category | [default to undefined]
**start_time** | **string** | Event start time | [default to undefined]
**end_time** | **string** | Event end time | [default to undefined]
**location** | **string** |  | [optional] [default to undefined]
**capacity** | **number** |  | [optional] [default to undefined]
**id** | **string** | Event ID | [default to undefined]
**status** | **string** | Event status | [default to undefined]
**created_at** | **string** | Creation timestamp | [default to undefined]
**updated_at** | **string** | Last update timestamp | [default to undefined]

## Example

```typescript
import { EventOut } from './api';

const instance: EventOut = {
    title,
    description,
    category,
    start_time,
    end_time,
    location,
    capacity,
    id,
    status,
    created_at,
    updated_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

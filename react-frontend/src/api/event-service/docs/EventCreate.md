# EventCreate

Schema for creating a new event

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
**etablissement_id** | **string** | ID de l\&#39;établissement | [default to undefined]

## Example

```typescript
import { EventCreate } from './api';

const instance: EventCreate = {
    title,
    description,
    category,
    start_time,
    end_time,
    location,
    capacity,
    etablissement_id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

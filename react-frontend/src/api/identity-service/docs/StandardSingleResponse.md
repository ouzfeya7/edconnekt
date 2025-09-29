# StandardSingleResponse

Format standardisé pour les réponses contenant un seul élément.  Utilisé pour : GET /identities/{id}, GET /roles/{id}, etc.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **boolean** | Indique si l\&#39;opération a réussi | [optional] [default to true]
**data** | **any** |  | [default to undefined]
**message** | **string** |  | [optional] [default to undefined]
**timestamp** | **string** | Horodatage de la réponse | [optional] [default to undefined]

## Example

```typescript
import { StandardSingleResponse } from './api';

const instance: StandardSingleResponse = {
    success,
    data,
    message,
    timestamp,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

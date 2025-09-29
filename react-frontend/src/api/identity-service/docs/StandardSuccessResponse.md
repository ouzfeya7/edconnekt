# StandardSuccessResponse

Format standardisé pour les réponses de succès (opérations de création/modification).  Utilisé pour : POST /identities, PUT /identities/{id}, DELETE /identities/{id}, etc.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **boolean** | Indique que l\&#39;opération a réussi | [optional] [default to true]
**message** | **string** | Message de succès | [default to undefined]
**data** | [****](.md) | Données optionnelles de la réponse | [optional] [default to undefined]
**timestamp** | **string** | Horodatage de la réponse | [optional] [default to undefined]

## Example

```typescript
import { StandardSuccessResponse } from './api';

const instance: StandardSuccessResponse = {
    success,
    message,
    data,
    timestamp,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

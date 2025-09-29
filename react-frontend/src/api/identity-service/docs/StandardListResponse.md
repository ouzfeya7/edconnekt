# StandardListResponse

Format standardisé pour les réponses contenant une liste d\'éléments.  Utilisé pour : GET /identities, GET /catalogs/_*, GET /me/roles, etc.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **boolean** | Indique si l\&#39;opération a réussi | [optional] [default to true]
**data** | **Array&lt;any&gt;** | Liste des données | [default to undefined]
**total** | **number** | Nombre total d\&#39;éléments | [default to undefined]
**page** | **number** |  | [optional] [default to undefined]
**page_size** | **number** |  | [optional] [default to undefined]
**pages** | **number** |  | [optional] [default to undefined]
**message** | **string** |  | [optional] [default to undefined]
**timestamp** | **string** | Horodatage de la réponse | [optional] [default to undefined]

## Example

```typescript
import { StandardListResponse } from './api';

const instance: StandardListResponse = {
    success,
    data,
    total,
    page,
    page_size,
    pages,
    message,
    timestamp,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

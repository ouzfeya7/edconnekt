# EstablishmentLinkCreate

Schéma pour la création d\'un lien avec un établissement.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**establishment_id** | **string** | ID de l\&#39;établissement | [default to undefined]
**role** | [**EstablishmentRole**](EstablishmentRole.md) | Rôle dans l\&#39;établissement | [default to undefined]

## Example

```typescript
import { EstablishmentLinkCreate } from './api';

const instance: EstablishmentLinkCreate = {
    establishment_id,
    role,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# UserRolesResponse

Schéma de réponse pour les rôles d\'un utilisateur dans un établissement.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**establishment_id** | **string** | ID de l\&#39;établissement | [default to undefined]
**roles** | [**Array&lt;EstablishmentRole&gt;**](EstablishmentRole.md) | Rôles de l\&#39;utilisateur dans cet établissement | [default to undefined]

## Example

```typescript
import { UserRolesResponse } from './api';

const instance: UserRolesResponse = {
    establishment_id,
    roles,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

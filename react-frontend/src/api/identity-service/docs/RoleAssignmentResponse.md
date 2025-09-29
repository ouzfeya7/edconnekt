# RoleAssignmentResponse

Schéma pour la réponse d\'un rôle complexe.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | ID du rôle | [default to undefined]
**identity_establishment_id** | **string** | ID du lien identité-établissement | [default to undefined]
**role_principal** | [**RolePrincipalInfo**](RolePrincipalInfo.md) | Rôle principal | [default to undefined]
**role_effectif** | [**RoleEffectifInfo**](RoleEffectifInfo.md) |  | [optional] [default to undefined]
**function_display** | **string** |  | [optional] [default to undefined]
**cycles** | [**Array&lt;CycleInfo&gt;**](CycleInfo.md) | Cycles assignés | [optional] [default to undefined]
**subjects** | [**Array&lt;SubjectInfo&gt;**](SubjectInfo.md) | Matières assignées | [optional] [default to undefined]
**created_at** | **string** | Date de création | [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { RoleAssignmentResponse } from './api';

const instance: RoleAssignmentResponse = {
    id,
    identity_establishment_id,
    role_principal,
    role_effectif,
    function_display,
    cycles,
    subjects,
    created_at,
    updated_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

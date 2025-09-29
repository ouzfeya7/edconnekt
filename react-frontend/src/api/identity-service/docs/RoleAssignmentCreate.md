# RoleAssignmentCreate

Schéma pour la création d\'un rôle complexe.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**establishment_id** | **string** | ID de l\&#39;établissement | [default to undefined]
**role_principal_code** | **string** | Code du rôle principal | [default to undefined]
**role_effectif_code** | **string** |  | [optional] [default to undefined]
**function_display** | **string** |  | [optional] [default to undefined]
**cycle_codes** | **Array&lt;string&gt;** | Codes des cycles | [optional] [default to undefined]
**subject_codes** | **Array&lt;string&gt;** | Codes des matières | [optional] [default to undefined]

## Example

```typescript
import { RoleAssignmentCreate } from './api';

const instance: RoleAssignmentCreate = {
    establishment_id,
    role_principal_code,
    role_effectif_code,
    function_display,
    cycle_codes,
    subject_codes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# IdentityWithRoles

Schéma pour une identité avec ses rôles complexes.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | ID de l\&#39;identité | [default to undefined]
**firstname** | **string** | Prénom | [default to undefined]
**lastname** | **string** | Nom de famille | [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**phone** | **string** |  | [optional] [default to undefined]
**status** | **string** | Statut de l\&#39;identité | [default to undefined]
**external_id** | **string** |  | [optional] [default to undefined]
**created_at** | **string** | Date de création | [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]
**role_assignments** | [**Array&lt;RoleAssignmentResponse&gt;**](RoleAssignmentResponse.md) | Rôles complexes de l\&#39;identité | [optional] [default to undefined]

## Example

```typescript
import { IdentityWithRoles } from './api';

const instance: IdentityWithRoles = {
    id,
    firstname,
    lastname,
    email,
    phone,
    status,
    external_id,
    created_at,
    updated_at,
    role_assignments,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

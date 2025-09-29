# IdentityUpdate

Schéma pour la modification partielle d\'une identité avec rôles.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**firstname** | **string** |  | [optional] [default to undefined]
**lastname** | **string** |  | [optional] [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**phone** | **string** |  | [optional] [default to undefined]
**status** | [**IdentityStatus**](IdentityStatus.md) |  | [optional] [default to undefined]
**account_required** | **string** |  | [optional] [default to undefined]
**establishment_id** | **string** |  | [optional] [default to undefined]
**role_principal_code** | **string** |  | [optional] [default to undefined]
**role_effectif_code** | **string** |  | [optional] [default to undefined]
**function_display** | **string** |  | [optional] [default to undefined]
**cycle_codes** | **Array&lt;string&gt;** |  | [optional] [default to undefined]

## Example

```typescript
import { IdentityUpdate } from './api';

const instance: IdentityUpdate = {
    firstname,
    lastname,
    email,
    phone,
    status,
    account_required,
    establishment_id,
    role_principal_code,
    role_effectif_code,
    function_display,
    cycle_codes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

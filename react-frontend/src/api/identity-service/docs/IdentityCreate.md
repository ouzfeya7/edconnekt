# IdentityCreate

Schéma pour la création d\'une identité avec code fourni.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**firstname** | **string** | Prénom | [default to undefined]
**lastname** | **string** | Nom de famille | [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**phone** | **string** |  | [optional] [default to undefined]
**status** | [**IdentityStatus**](IdentityStatus.md) | Statut de l\&#39;identité | [optional] [default to undefined]
**account_required** | **string** |  | [optional] [default to undefined]
**code_identite** | **string** | Code d\&#39;identité fourni par le client | [default to undefined]
**external_id** | **string** |  | [optional] [default to undefined]
**establishment_id** | **string** |  | [optional] [default to undefined]
**role_principal_code** | **string** |  | [optional] [default to undefined]
**role_effectif_code** | **string** |  | [optional] [default to undefined]
**function_display** | **string** |  | [optional] [default to undefined]
**cycle_codes** | **Array&lt;string&gt;** |  | [optional] [default to undefined]

## Example

```typescript
import { IdentityCreate } from './api';

const instance: IdentityCreate = {
    firstname,
    lastname,
    email,
    phone,
    status,
    account_required,
    code_identite,
    external_id,
    establishment_id,
    role_principal_code,
    role_effectif_code,
    function_display,
    cycle_codes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

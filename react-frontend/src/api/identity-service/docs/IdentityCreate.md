# IdentityCreate

Schéma pour la création d\'une identité.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**firstname** | **string** | Prénom | [default to undefined]
**lastname** | **string** | Nom de famille | [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**phone** | **string** |  | [optional] [default to undefined]
**status** | [**IdentityStatus**](IdentityStatus.md) | Statut de l\&#39;identité | [optional] [default to undefined]
**external_id** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { IdentityCreate } from './api';

const instance: IdentityCreate = {
    firstname,
    lastname,
    email,
    phone,
    status,
    external_id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

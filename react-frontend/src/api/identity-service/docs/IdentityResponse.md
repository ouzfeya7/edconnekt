# IdentityResponse

Schéma pour la réponse d\'une identité.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**firstname** | **string** | Prénom | [default to undefined]
**lastname** | **string** | Nom de famille | [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**phone** | **string** |  | [optional] [default to undefined]
**status** | [**IdentityStatus**](IdentityStatus.md) | Statut de l\&#39;identité | [optional] [default to undefined]
**id** | **string** | ID unique de l\&#39;identité | [default to undefined]
**external_id** | **string** |  | [optional] [default to undefined]
**created_at** | **string** | Date de création | [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { IdentityResponse } from './api';

const instance: IdentityResponse = {
    firstname,
    lastname,
    email,
    phone,
    status,
    id,
    external_id,
    created_at,
    updated_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

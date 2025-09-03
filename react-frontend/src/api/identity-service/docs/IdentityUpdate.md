# IdentityUpdate

Schéma pour la modification d\'une identité.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**firstname** | **string** |  | [optional] [default to undefined]
**lastname** | **string** |  | [optional] [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**phone** | **string** |  | [optional] [default to undefined]
**status** | [**IdentityStatus**](IdentityStatus.md) |  | [optional] [default to undefined]

## Example

```typescript
import { IdentityUpdate } from './api';

const instance: IdentityUpdate = {
    firstname,
    lastname,
    email,
    phone,
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

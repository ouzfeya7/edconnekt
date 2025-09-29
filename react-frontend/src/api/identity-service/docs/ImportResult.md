# ImportResult

Résultat d\'import pour une identité.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**email** | **string** | Email de l\&#39;identité | [default to undefined]
**status** | **string** | Statut de l\&#39;import (SUCCESS, ERROR, SKIPPED) | [default to undefined]
**message** | **string** |  | [optional] [default to undefined]
**identity_id** | **string** |  | [optional] [default to undefined]
**is_new** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { ImportResult } from './api';

const instance: ImportResult = {
    email,
    status,
    message,
    identity_id,
    is_new,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

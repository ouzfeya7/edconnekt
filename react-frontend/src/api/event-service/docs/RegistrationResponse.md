# RegistrationResponse

Schema for registration response

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**message** | **string** | Registration status message | [default to undefined]
**registration_id** | **string** | Registration ID | [default to undefined]
**status** | **string** | Registration status (CONFIRMED or WAITING) | [default to undefined]
**event_id** | **string** | Event ID | [default to undefined]

## Example

```typescript
import { RegistrationResponse } from './api';

const instance: RegistrationResponse = {
    message,
    registration_id,
    status,
    event_id,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

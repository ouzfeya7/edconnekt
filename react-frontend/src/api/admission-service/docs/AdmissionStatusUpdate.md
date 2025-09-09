# AdmissionStatusUpdate

Schéma pour la mise à jour du statut uniquement

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | [**AdmissionStatus**](AdmissionStatus.md) | Nouveau statut de l\&#39;admission | [default to undefined]
**admin_notes** | **string** |  | [optional] [default to undefined]
**reviewed_by** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { AdmissionStatusUpdate } from './api';

const instance: AdmissionStatusUpdate = {
    status,
    admin_notes,
    reviewed_by,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

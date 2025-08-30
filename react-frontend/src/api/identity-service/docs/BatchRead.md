# BatchRead

Schéma pour lire un batch d\'identités.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | ID du batch | [default to undefined]
**establishment_id** | **string** | ID de l\&#39;établissement | [default to undefined]
**uploaded_by** | **string** | ID de l\&#39;uploader | [default to undefined]
**source_file_url** | **string** | URL du fichier source | [default to undefined]
**created_at** | **string** | Date de création | [default to undefined]

## Example

```typescript
import { BatchRead } from './api';

const instance: BatchRead = {
    id,
    establishment_id,
    uploaded_by,
    source_file_url,
    created_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

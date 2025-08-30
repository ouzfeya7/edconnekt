# BulkImportResponse

Schéma pour la réponse de bulk import.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**batch_id** | **string** | ID du batch créé | [default to undefined]
**status** | **string** | Statut de l\&#39;import | [default to undefined]
**message** | **string** | Message d\&#39;information | [default to undefined]
**total_items** | **number** | Nombre total d\&#39;éléments traités | [default to undefined]
**new_count** | **number** | Nombre d\&#39;éléments créés | [default to undefined]
**updated_count** | **number** | Nombre d\&#39;éléments mis à jour | [default to undefined]
**skipped_count** | **number** | Nombre d\&#39;éléments ignorés | [default to undefined]
**invalid_count** | **number** | Nombre d\&#39;éléments invalides | [default to undefined]

## Example

```typescript
import { BulkImportResponse } from './api';

const instance: BulkImportResponse = {
    batch_id,
    status,
    message,
    total_items,
    new_count,
    updated_count,
    skipped_count,
    invalid_count,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

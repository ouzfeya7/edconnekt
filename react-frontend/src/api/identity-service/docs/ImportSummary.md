# ImportSummary

Résumé de l\'import.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**total_processed** | **number** | Nombre total d\&#39;identités traitées | [default to undefined]
**success_count** | **number** | Nombre d\&#39;imports réussis | [default to undefined]
**error_count** | **number** | Nombre d\&#39;erreurs | [default to undefined]
**skipped_count** | **number** | Nombre d\&#39;identités ignorées | [default to undefined]
**new_identities** | **number** | Nombre de nouvelles identités créées | [default to undefined]
**updated_identities** | **number** | Nombre d\&#39;identités mises à jour | [default to undefined]

## Example

```typescript
import { ImportSummary } from './api';

const instance: ImportSummary = {
    total_processed,
    success_count,
    error_count,
    skipped_count,
    new_identities,
    updated_identities,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

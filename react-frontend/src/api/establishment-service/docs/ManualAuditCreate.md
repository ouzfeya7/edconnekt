# ManualAuditCreate

Schéma pour la création manuelle d\'une entrée d\'audit (sans etablissement_id)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**operation** | **string** | Type d\&#39;opération effectuée | [default to undefined]
**motif** | **string** |  | [optional] [default to undefined]
**auteur_id** | **string** |  | [optional] [default to undefined]
**auteur_nom** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { ManualAuditCreate } from './api';

const instance: ManualAuditCreate = {
    operation,
    motif,
    auteur_id,
    auteur_nom,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

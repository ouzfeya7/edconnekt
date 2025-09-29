# ContextSelectRequest

Requête pour la sélection de contexte.  Utilisée par le frontend pour valider le contexte choisi avant que auth-service injecte les en-têtes.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**etab_id** | **string** | UUID de l\&#39;établissement | [default to undefined]
**role** | **string** | Code du rôle principal | [default to undefined]

## Example

```typescript
import { ContextSelectRequest } from './api';

const instance: ContextSelectRequest = {
    etab_id,
    role,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

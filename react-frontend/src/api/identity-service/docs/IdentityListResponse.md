# IdentityListResponse

Schéma pour la liste des identités.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**items** | [**Array&lt;IdentityResponse&gt;**](IdentityResponse.md) | Liste des identités | [default to undefined]
**total** | **number** | Nombre total d\&#39;identités | [default to undefined]
**page** | **number** | Page actuelle | [default to undefined]
**size** | **number** | Taille de la page | [default to undefined]
**pages** | **number** | Nombre total de pages | [default to undefined]

## Example

```typescript
import { IdentityListResponse } from './api';

const instance: IdentityListResponse = {
    items,
    total,
    page,
    size,
    pages,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

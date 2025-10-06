# ResourceListResponse

Schéma de réponse pour la liste paginée des ressources. Inclut les métadonnées de pagination nécessaires au frontend.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**items** | [**Array&lt;ResourceOut&gt;**](ResourceOut.md) | Liste des ressources | [default to undefined]
**total** | **number** | Nombre total de ressources correspondant aux filtres | [default to undefined]
**page** | **number** | Numéro de page actuelle (basé sur offset/limit) | [default to undefined]
**size** | **number** | Nombre d\&#39;éléments par page | [default to undefined]

## Example

```typescript
import { ResourceListResponse } from './api';

const instance: ResourceListResponse = {
    items,
    total,
    page,
    size,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

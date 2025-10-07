# RoomCreate


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**code_salle** | **string** | Code unique de la salle (unique par bâtiment) | [default to undefined]
**nom** | **string** | Nom de la salle | [default to undefined]
**capacite** | **number** |  | [optional] [default to undefined]
**etage** | **number** |  | [optional] [default to undefined]
**type_salle** | [**RoomType**](RoomType.md) |  | [optional] [default to undefined]
**active** | **boolean** |  | [optional] [default to true]

## Example

```typescript
import { RoomCreate } from './api';

const instance: RoomCreate = {
    code_salle,
    nom,
    capacite,
    etage,
    type_salle,
    active,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

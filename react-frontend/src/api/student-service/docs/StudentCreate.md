# StudentCreate

Schéma pour la création d\'un élève avec lien parent + classe

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**firstname** | **string** | Prénom de l\&#39;élève | [default to undefined]
**lastname** | **string** | Nom de famille de l\&#39;élève | [default to undefined]
**birth_date** | **string** |  | [optional] [default to undefined]
**gender** | **string** |  | [optional] [default to undefined]
**photo_url** | **string** |  | [optional] [default to undefined]
**status** | [**StudentStatusEnum**](StudentStatusEnum.md) | Statut de l\&#39;élève | [optional] [default to undefined]
**parent_id** | **string** | ID du parent à lier | [default to undefined]
**parent_relation** | [**ParentRelationEnum**](ParentRelationEnum.md) | Type de relation avec le parent | [default to undefined]
**class_id** | **string** | ID de la classe d\&#39;affectation | [default to undefined]
**school_year** | **string** | Année scolaire | [default to undefined]

## Example

```typescript
import { StudentCreate } from './api';

const instance: StudentCreate = {
    firstname,
    lastname,
    birth_date,
    gender,
    photo_url,
    status,
    parent_id,
    parent_relation,
    class_id,
    school_year,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# StudentResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**firstname** | **string** | Prénom de l\&#39;élève | [default to undefined]
**lastname** | **string** | Nom de famille de l\&#39;élève | [default to undefined]
**birth_date** | **string** |  | [optional] [default to undefined]
**gender** | **string** |  | [optional] [default to undefined]
**photo_url** | **string** |  | [optional] [default to undefined]
**status** | [**StudentStatusEnum**](StudentStatusEnum.md) | Statut de l\&#39;élève | [optional] [default to undefined]
**id** | **string** |  | [default to undefined]
**code_identite** | **string** |  | [optional] [default to undefined]
**created_at** | **string** |  | [default to undefined]

## Example

```typescript
import { StudentResponse } from './api';

const instance: StudentResponse = {
    firstname,
    lastname,
    birth_date,
    gender,
    photo_url,
    status,
    id,
    code_identite,
    created_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

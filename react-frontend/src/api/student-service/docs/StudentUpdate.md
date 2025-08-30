# StudentUpdate

Schéma pour la mise à jour d\'un élève (photo, status uniquement)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**photo_url** | **string** |  | [optional] [default to undefined]
**status** | [**StudentStatusEnum**](StudentStatusEnum.md) |  | [optional] [default to undefined]

## Example

```typescript
import { StudentUpdate } from './api';

const instance: StudentUpdate = {
    photo_url,
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

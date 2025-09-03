# ReferentialCloneFromGlobalRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**global_referential_id** | **string** | ID du référentiel global à cloner | [default to undefined]
**new_name** | **string** | Nouveau nom pour le référentiel cloné | [default to undefined]
**cycle** | [**CycleEnum**](CycleEnum.md) | Cycle d\&#39;enseignement | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { ReferentialCloneFromGlobalRequest } from './api';

const instance: ReferentialCloneFromGlobalRequest = {
    global_referential_id,
    new_name,
    cycle,
    description,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

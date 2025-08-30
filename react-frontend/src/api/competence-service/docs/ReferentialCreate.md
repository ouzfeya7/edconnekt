# ReferentialCreate


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Nom du référentiel | [default to undefined]
**cycle** | [**CycleEnum**](CycleEnum.md) | Cycle d\&#39;enseignement | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**visibility** | [**VisibilityEnum**](VisibilityEnum.md) | Visibilité du référentiel | [optional] [default to undefined]

## Example

```typescript
import { ReferentialCreate } from './api';

const instance: ReferentialCreate = {
    name,
    cycle,
    description,
    visibility,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

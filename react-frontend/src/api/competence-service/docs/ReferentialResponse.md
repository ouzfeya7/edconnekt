# ReferentialResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Nom du référentiel | [default to undefined]
**cycle** | [**CycleEnum**](CycleEnum.md) | Cycle d\&#39;enseignement | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**visibility** | [**VisibilityEnum**](VisibilityEnum.md) | Visibilité du référentiel | [optional] [default to undefined]
**id** | **string** |  | [default to undefined]
**tenant_id** | **string** |  | [default to undefined]
**version_number** | **number** |  | [default to undefined]
**state** | [**RefStateEnum**](RefStateEnum.md) |  | [default to undefined]
**created_by** | **string** |  | [default to undefined]
**updated_by** | **string** |  | [default to undefined]
**created_at** | **string** |  | [default to undefined]
**updated_at** | **string** |  | [default to undefined]
**published_at** | **string** |  | [default to undefined]

## Example

```typescript
import { ReferentialResponse } from './api';

const instance: ReferentialResponse = {
    name,
    cycle,
    description,
    visibility,
    id,
    tenant_id,
    version_number,
    state,
    created_by,
    updated_by,
    created_at,
    updated_at,
    published_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

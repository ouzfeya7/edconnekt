# ReferentialTree


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**name** | **string** |  | [default to undefined]
**cycle** | [**CycleEnum**](CycleEnum.md) |  | [default to undefined]
**version_number** | **number** |  | [default to undefined]
**state** | [**RefStateEnum**](RefStateEnum.md) |  | [default to undefined]
**visibility** | [**VisibilityEnum**](VisibilityEnum.md) |  | [default to undefined]
**description** | **string** |  | [default to undefined]
**domains** | [**Array&lt;DomainTree&gt;**](DomainTree.md) |  | [default to undefined]

## Example

```typescript
import { ReferentialTree } from './api';

const instance: ReferentialTree = {
    id,
    name,
    cycle,
    version_number,
    state,
    visibility,
    description,
    domains,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

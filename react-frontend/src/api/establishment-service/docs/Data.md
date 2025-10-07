# Data


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**nom** | **string** |  | [default to undefined]
**adresse** | **string** |  | [default to undefined]
**email** | **string** |  | [default to undefined]
**telephone** | **string** |  | [default to undefined]
**ville** | **string** |  | [optional] [default to undefined]
**pays** | **string** |  | [optional] [default to undefined]
**code_etablissement** | **string** |  | [default to undefined]
**plan** | [**PlanEnum**](PlanEnum.md) |  | [optional] [default to undefined]
**status** | [**StatusEnum**](StatusEnum.md) |  | [optional] [default to undefined]
**active** | **boolean** |  | [optional] [default to true]

## Example

```typescript
import { Data } from './api';

const instance: Data = {
    nom,
    adresse,
    email,
    telephone,
    ville,
    pays,
    code_etablissement,
    plan,
    status,
    active,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

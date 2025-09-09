# AdmissionListResponse

Schéma de réponse pour la liste des admissions avec pagination

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**items** | [**Array&lt;AdmissionResponse&gt;**](AdmissionResponse.md) |  | [default to undefined]
**total** | **number** |  | [default to undefined]
**page** | **number** |  | [default to undefined]
**limit** | **number** |  | [default to undefined]
**pages** | **number** |  | [default to undefined]

## Example

```typescript
import { AdmissionListResponse } from './api';

const instance: AdmissionListResponse = {
    items,
    total,
    page,
    limit,
    pages,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

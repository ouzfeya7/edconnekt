# StudentAuditResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**student_id** | **string** | ID de l\&#39;élève | [default to undefined]
**action** | [**AuditActionEnum**](AuditActionEnum.md) | Type d\&#39;action | [default to undefined]
**actor_id** | **string** | ID de l\&#39;acteur | [default to undefined]
**actor_role** | **string** | Rôle de l\&#39;acteur | [default to undefined]
**diff** | **object** |  | [optional] [default to undefined]
**id** | **string** |  | [default to undefined]
**created_at** | **string** |  | [default to undefined]

## Example

```typescript
import { StudentAuditResponse } from './api';

const instance: StudentAuditResponse = {
    student_id,
    action,
    actor_id,
    actor_role,
    diff,
    id,
    created_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

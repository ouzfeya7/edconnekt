# AuditStatistics


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**total_operations** | **number** |  | [default to undefined]
**operations_by_type** | **{ [key: string]: number; }** |  | [default to undefined]
**last_operation_date** | **string** |  | [optional] [default to undefined]
**most_active_user** | **string** |  | [optional] [default to undefined]
**operations_this_month** | **number** |  | [default to undefined]

## Example

```typescript
import { AuditStatistics } from './api';

const instance: AuditStatistics = {
    total_operations,
    operations_by_type,
    last_operation_date,
    most_active_user,
    operations_this_month,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

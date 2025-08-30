# AuditStatistics

Statistiques d\'audit pour un établissement

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**total_operations** | **number** | Nombre total d\&#39;opérations | [default to undefined]
**operations_by_type** | **{ [key: string]: number; }** | Nombre d\&#39;opérations par type | [default to undefined]
**last_operation_date** | **string** |  | [optional] [default to undefined]
**most_active_user** | **string** |  | [optional] [default to undefined]
**operations_this_month** | **number** | Nombre d\&#39;opérations ce mois-ci | [default to undefined]

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

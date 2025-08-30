# AuditListResponse

Réponse pour la liste des audits avec pagination

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**items** | [**Array&lt;EtablissementAuditResponse&gt;**](EtablissementAuditResponse.md) | Liste des audits | [default to undefined]
**total** | **number** | Nombre total d\&#39;audits | [default to undefined]
**limit** | **number** | Limite utilisée | [default to undefined]
**offset** | **number** | Offset utilisé | [default to undefined]
**has_more** | **boolean** | Y a-t-il plus d\&#39;éléments ? | [default to undefined]

## Example

```typescript
import { AuditListResponse } from './api';

const instance: AuditListResponse = {
    items,
    total,
    limit,
    offset,
    has_more,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# TemplateInfo

Informations sur un template.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**role** | **string** | Rôle du template | [default to undefined]
**format** | **string** | Format du template (csv ou xlsx) | [default to undefined]
**columns** | **Array&lt;string&gt;** | Colonnes du template | [default to undefined]
**example_data** | **Array&lt;{ [key: string]: any; }&gt;** | Données d\&#39;exemple | [default to undefined]
**role_mapping** | **{ [key: string]: any; }** |  | [optional] [default to undefined]

## Example

```typescript
import { TemplateInfo } from './api';

const instance: TemplateInfo = {
    role,
    format,
    columns,
    example_data,
    role_mapping,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

# TemplateResponse

Réponse pour l\'export de template.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **boolean** | True si l\&#39;export s\&#39;est bien déroulé | [default to undefined]
**message** | **string** | Message de l\&#39;export | [default to undefined]
**template_info** | [**TemplateInfo**](TemplateInfo.md) | Informations sur le template | [default to undefined]
**download_url** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { TemplateResponse } from './api';

const instance: TemplateResponse = {
    success,
    message,
    template_info,
    download_url,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

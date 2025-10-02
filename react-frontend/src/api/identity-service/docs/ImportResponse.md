# ImportResponse

Réponse de l\'import en masse.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **boolean** | True si l\&#39;import s\&#39;est bien déroulé | [default to undefined]
**message** | **string** | Message global de l\&#39;import | [default to undefined]
**batch_id** | **string** | ID du batch créé pour suivre l\&#39;import | [default to undefined]
**summary** | [**ImportSummary**](ImportSummary.md) | Résumé de l\&#39;import | [default to undefined]
**results** | [**Array&lt;ImportResult&gt;**](ImportResult.md) | Détails par identité | [default to undefined]
**file_info** | **{ [key: string]: any; }** | Informations sur le fichier traité | [default to undefined]
**processed_at** | **string** | Date/heure de traitement | [optional] [default to undefined]

## Example

```typescript
import { ImportResponse } from './api';

const instance: ImportResponse = {
    success,
    message,
    batch_id,
    summary,
    results,
    file_info,
    processed_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

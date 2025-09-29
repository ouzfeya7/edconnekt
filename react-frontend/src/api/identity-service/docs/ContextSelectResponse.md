# ContextSelectResponse

Réponse pour la sélection de contexte.  Confirme que le contexte est valide et peut être utilisé.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **boolean** | Contexte validé avec succès | [optional] [default to true]
**message** | **string** | Message de confirmation | [optional] [default to 'Contexte validé']

## Example

```typescript
import { ContextSelectResponse } from './api';

const instance: ContextSelectResponse = {
    success,
    message,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

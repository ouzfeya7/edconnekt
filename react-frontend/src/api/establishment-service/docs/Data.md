# Data

Un établissement unique ou une liste d\'établissements à créer

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**nom** | **string** | Nom de l\&#39;établissement | [default to undefined]
**adresse** | **string** | Adresse de l\&#39;établissement | [default to undefined]
**email** | **string** | Email de contact | [default to undefined]
**telephone** | **string** | Numéro de téléphone | [default to undefined]
**ville** | **string** |  | [optional] [default to undefined]
**pays** | **string** |  | [optional] [default to undefined]
**plan** | [**PlanEnum**](PlanEnum.md) |  | [optional] [default to undefined]
**status** | [**StatusEnum**](StatusEnum.md) |  | [optional] [default to undefined]

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
    plan,
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

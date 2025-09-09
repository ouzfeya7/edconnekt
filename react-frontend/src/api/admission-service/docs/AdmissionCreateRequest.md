# AdmissionCreateRequest

Schéma pour la requête de création d\'une admission (avec CAPTCHA)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**student_name** | **string** | Nom complet de l\&#39;élève | [default to undefined]
**student_birthdate** | **string** | Date de naissance de l\&#39;élève | [default to undefined]
**class_requested** | **string** | Classe demandée | [default to undefined]
**parent_name** | **string** | Nom du parent/tuteur | [default to undefined]
**parent_contact** | **string** | Contact du parent (email ou téléphone) | [default to undefined]
**student_email** | **string** |  | [optional] [default to undefined]
**student_phone** | **string** |  | [optional] [default to undefined]
**parent_email** | **string** |  | [optional] [default to undefined]
**parent_phone** | **string** |  | [optional] [default to undefined]
**notes** | **string** |  | [optional] [default to undefined]
**attachments** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**captcha_token** | **string** | Token reCAPTCHA v3 pour validation anti-spam | [default to undefined]

## Example

```typescript
import { AdmissionCreateRequest } from './api';

const instance: AdmissionCreateRequest = {
    student_name,
    student_birthdate,
    class_requested,
    parent_name,
    parent_contact,
    student_email,
    student_phone,
    parent_email,
    parent_phone,
    notes,
    attachments,
    captcha_token,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

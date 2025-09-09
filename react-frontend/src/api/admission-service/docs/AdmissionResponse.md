# AdmissionResponse

Schéma de réponse pour une admission

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
**id** | **number** |  | [default to undefined]
**status** | [**AdmissionStatus**](AdmissionStatus.md) |  | [default to undefined]
**created_at** | **string** |  | [default to undefined]
**updated_at** | **string** |  | [default to undefined]
**admin_notes** | **string** |  | [optional] [default to undefined]
**reviewed_by** | **string** |  | [optional] [default to undefined]
**reviewed_at** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { AdmissionResponse } from './api';

const instance: AdmissionResponse = {
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
    id,
    status,
    created_at,
    updated_at,
    admin_notes,
    reviewed_by,
    reviewed_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

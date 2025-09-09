# AdmissionUpdate

Schéma pour la mise à jour d\'une admission

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**student_name** | **string** |  | [optional] [default to undefined]
**student_birthdate** | **string** |  | [optional] [default to undefined]
**class_requested** | **string** |  | [optional] [default to undefined]
**parent_name** | **string** |  | [optional] [default to undefined]
**parent_contact** | **string** |  | [optional] [default to undefined]
**student_email** | **string** |  | [optional] [default to undefined]
**student_phone** | **string** |  | [optional] [default to undefined]
**parent_email** | **string** |  | [optional] [default to undefined]
**parent_phone** | **string** |  | [optional] [default to undefined]
**notes** | **string** |  | [optional] [default to undefined]
**attachments** | **Array&lt;string&gt;** |  | [optional] [default to undefined]

## Example

```typescript
import { AdmissionUpdate } from './api';

const instance: AdmissionUpdate = {
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
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

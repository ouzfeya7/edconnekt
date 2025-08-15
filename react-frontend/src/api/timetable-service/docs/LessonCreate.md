# LessonCreate


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**class_id** | **string** |  | [default to undefined]
**subject_id** | **string** |  | [default to undefined]
**teacher_id** | **string** |  | [default to undefined]
**date** | **string** |  | [default to undefined]
**timeslot_id** | **string** |  | [default to undefined]
**room_id** | **string** |  | [default to undefined]
**status** | [**LessonStatus**](LessonStatus.md) |  | [optional] [default to undefined]
**repeatweekly** | **number** |  | [optional] [default to 1]

## Example

```typescript
import { LessonCreate } from './api';

const instance: LessonCreate = {
    class_id,
    subject_id,
    teacher_id,
    date,
    timeslot_id,
    room_id,
    status,
    repeatweekly,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

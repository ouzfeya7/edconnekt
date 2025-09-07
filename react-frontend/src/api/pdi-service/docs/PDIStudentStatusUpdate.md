# PDIStudentStatusUpdate


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**score_global** | **number** |  | [optional] [default to undefined]
**comp_scores** | **{ [key: string]: any; }** |  | [optional] [default to undefined]
**assistance_level** | [**AssistanceLevelEnum**](AssistanceLevelEnum.md) |  | [optional] [default to undefined]
**presence_status** | [**PresenceStatusEnum**](PresenceStatusEnum.md) |  | [optional] [default to undefined]
**comment** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { PDIStudentStatusUpdate } from './api';

const instance: PDIStudentStatusUpdate = {
    score_global,
    comp_scores,
    assistance_level,
    presence_status,
    comment,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)

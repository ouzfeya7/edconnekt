# LessonsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createLessonsLessonsPost**](#createlessonslessonspost) | **POST** /lessons/ | Create Lessons|
|[**deleteLessonLessonsLessonIdDelete**](#deletelessonlessonslessoniddelete) | **DELETE** /lessons/{lesson_id} | Delete Lesson|
|[**listLessonsLessonsGet**](#listlessonslessonsget) | **GET** /lessons/ | List Lessons|
|[**updateLessonLessonsLessonIdPatch**](#updatelessonlessonslessonidpatch) | **PATCH** /lessons/{lesson_id} | Update Lesson|

# **createLessonsLessonsPost**
> LessonRead createLessonsLessonsPost(lessonCreate)

Créer un cours ou une série (repeatweekly). Rôles: ENSEIGNANT, COORDONNATEUR, ADMIN

### Example

```typescript
import {
    LessonsApi,
    Configuration,
    LessonCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new LessonsApi(configuration);

let lessonCreate: LessonCreate; //

const { status, data } = await apiInstance.createLessonsLessonsPost(
    lessonCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **lessonCreate** | **LessonCreate**|  | |


### Return type

**LessonRead**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteLessonLessonsLessonIdDelete**
> LessonRead deleteLessonLessonsLessonIdDelete()

Supprimer un cours. Rôles: COORDONNATEUR, ADMIN

### Example

```typescript
import {
    LessonsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LessonsApi(configuration);

let lessonId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteLessonLessonsLessonIdDelete(
    lessonId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **lessonId** | [**string**] |  | defaults to undefined|


### Return type

**LessonRead**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **listLessonsLessonsGet**
> Array<LessonRead> listLessonsLessonsGet()

Lister les cours (filtres: classe, prof, dates). Rôles: tous. PARENT: accès restreint.

### Example

```typescript
import {
    LessonsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LessonsApi(configuration);

let classId: string; // (optional) (default to undefined)
let fromDate: string; // (optional) (default to undefined)
let toDate: string; // (optional) (default to undefined)
let teacherId: string; // (optional) (default to undefined)
let skip: number; // (optional) (default to 0)
let limit: number; // (optional) (default to 100)

const { status, data } = await apiInstance.listLessonsLessonsGet(
    classId,
    fromDate,
    toDate,
    teacherId,
    skip,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classId** | [**string**] |  | (optional) defaults to undefined|
| **fromDate** | [**string**] |  | (optional) defaults to undefined|
| **toDate** | [**string**] |  | (optional) defaults to undefined|
| **teacherId** | [**string**] |  | (optional) defaults to undefined|
| **skip** | [**number**] |  | (optional) defaults to 0|
| **limit** | [**number**] |  | (optional) defaults to 100|


### Return type

**Array<LessonRead>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateLessonLessonsLessonIdPatch**
> LessonRead updateLessonLessonsLessonIdPatch(lessonUpdate)

Mettre à jour salle/timeslot. Vérifie conflit. Rôles: ENSEIGNANT, COORDONNATEUR, ADMIN

### Example

```typescript
import {
    LessonsApi,
    Configuration,
    LessonUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new LessonsApi(configuration);

let lessonId: string; // (default to undefined)
let lessonUpdate: LessonUpdate; //

const { status, data } = await apiInstance.updateLessonLessonsLessonIdPatch(
    lessonId,
    lessonUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **lessonUpdate** | **LessonUpdate**|  | |
| **lessonId** | [**string**] |  | defaults to undefined|


### Return type

**LessonRead**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


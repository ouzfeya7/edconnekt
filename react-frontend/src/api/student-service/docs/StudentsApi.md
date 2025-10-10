# StudentsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createStudentApiStudentsPost**](#createstudentapistudentspost) | **POST** /api/students/ | Create Student|
|[**deleteStudentApiStudentsStudentIdDelete**](#deletestudentapistudentsstudentiddelete) | **DELETE** /api/students/{student_id} | Delete Student|
|[**getParentRelationsTemplateApiStudentsParentRelationsTemplateGet**](#getparentrelationstemplateapistudentsparentrelationstemplateget) | **GET** /api/students/parent-relations/template | Get Parent Relations Template|
|[**getStudentApiStudentsStudentIdGet**](#getstudentapistudentsstudentidget) | **GET** /api/students/{student_id} | Get Student|
|[**getStudentAuditApiStudentsStudentIdAuditGet**](#getstudentauditapistudentsstudentidauditget) | **GET** /api/students/{student_id}/audit | Get Student Audit|
|[**getStudentsApiStudentsGet**](#getstudentsapistudentsget) | **GET** /api/students/ | Get Students|
|[**importParentRelationsApiStudentsParentRelationsImportPost**](#importparentrelationsapistudentsparentrelationsimportpost) | **POST** /api/students/parent-relations/import | Import Parent Relations|
|[**linkParentToStudentApiStudentsStudentIdParentsPost**](#linkparenttostudentapistudentsstudentidparentspost) | **POST** /api/students/{student_id}/parents | Link Parent To Student|
|[**transferStudentClassApiStudentsStudentIdClassPatch**](#transferstudentclassapistudentsstudentidclasspatch) | **PATCH** /api/students/{student_id}/class | Transfer Student Class|
|[**unlinkParentFromStudentApiStudentsStudentIdParentsParentIdDelete**](#unlinkparentfromstudentapistudentsstudentidparentsparentiddelete) | **DELETE** /api/students/{student_id}/parents/{parent_id} | Unlink Parent From Student|
|[**updateStudentApiStudentsStudentIdPatch**](#updatestudentapistudentsstudentidpatch) | **PATCH** /api/students/{student_id} | Update Student|

# **createStudentApiStudentsPost**
> StudentResponse createStudentApiStudentsPost(studentCreate)

Créer un nouvel élève avec lien parent et classe.

### Example

```typescript
import {
    StudentsApi,
    Configuration,
    StudentCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentsApi(configuration);

let studentCreate: StudentCreate; //

const { status, data } = await apiInstance.createStudentApiStudentsPost(
    studentCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentCreate** | **StudentCreate**|  | |


### Return type

**StudentResponse**

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

# **deleteStudentApiStudentsStudentIdDelete**
> deleteStudentApiStudentsStudentIdDelete()

Suppression logique (archivage, soft delete).

### Example

```typescript
import {
    StudentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentsApi(configuration);

let studentId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteStudentApiStudentsStudentIdDelete(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getParentRelationsTemplateApiStudentsParentRelationsTemplateGet**
> any getParentRelationsTemplateApiStudentsParentRelationsTemplateGet()

Télécharger un template CSV pour l\'import des relations Parent-Élève.

### Example

```typescript
import {
    StudentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentsApi(configuration);

const { status, data } = await apiInstance.getParentRelationsTemplateApiStudentsParentRelationsTemplateGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getStudentApiStudentsStudentIdGet**
> StudentResponse getStudentApiStudentsStudentIdGet()

Récupérer un élève par son ID.

### Example

```typescript
import {
    StudentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentsApi(configuration);

let studentId: string; // (default to undefined)

const { status, data } = await apiInstance.getStudentApiStudentsStudentIdGet(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**string**] |  | defaults to undefined|


### Return type

**StudentResponse**

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

# **getStudentAuditApiStudentsStudentIdAuditGet**
> Array<StudentAuditResponse> getStudentAuditApiStudentsStudentIdAuditGet()

Récupérer le journal des modifications d\'un élève.

### Example

```typescript
import {
    StudentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentsApi(configuration);

let studentId: string; // (default to undefined)

const { status, data } = await apiInstance.getStudentAuditApiStudentsStudentIdAuditGet(
    studentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**string**] |  | defaults to undefined|


### Return type

**Array<StudentAuditResponse>**

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

# **getStudentsApiStudentsGet**
> StudentPaginatedResponse getStudentsApiStudentsGet()

Récupérer tous les élèves avec pagination et filtres selon le contexte tenant.

### Example

```typescript
import {
    StudentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentsApi(configuration);

let page: number; //Numéro de page (optional) (default to 1)
let size: number; //Taille de la page (optional) (default to 100)
let classId: string; //Filtrer par classe (optional) (default to undefined)
let status: StudentStatusEnum; //Filtrer par statut (optional) (default to undefined)
let search: string; //Recherche par nom/prénom (optional) (default to undefined)

const { status, data } = await apiInstance.getStudentsApiStudentsGet(
    page,
    size,
    classId,
    status,
    search
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Numéro de page | (optional) defaults to 1|
| **size** | [**number**] | Taille de la page | (optional) defaults to 100|
| **classId** | [**string**] | Filtrer par classe | (optional) defaults to undefined|
| **status** | **StudentStatusEnum** | Filtrer par statut | (optional) defaults to undefined|
| **search** | [**string**] | Recherche par nom/prénom | (optional) defaults to undefined|


### Return type

**StudentPaginatedResponse**

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

# **importParentRelationsApiStudentsParentRelationsImportPost**
> ParentImportResponse importParentRelationsApiStudentsParentRelationsImportPost()

Importer en masse des relations Parent-Élève via CSV.  Colonnes attendues (FR/EN): - code_identite_enfant | child_code_identite | child_code - code_identite_parent | parent_code_identite | parent_code - relation (mother|father|tutor)

### Example

```typescript
import {
    StudentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentsApi(configuration);

let file: File; //Fichier CSV des relations parent-élève (default to undefined)

const { status, data } = await apiInstance.importParentRelationsApiStudentsParentRelationsImportPost(
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **file** | [**File**] | Fichier CSV des relations parent-élève | defaults to undefined|


### Return type

**ParentImportResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **linkParentToStudentApiStudentsStudentIdParentsPost**
> StudentParentResponse linkParentToStudentApiStudentsStudentIdParentsPost(studentParentCreate)

Lier un parent à un élève.

### Example

```typescript
import {
    StudentsApi,
    Configuration,
    StudentParentCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentsApi(configuration);

let studentId: string; // (default to undefined)
let studentParentCreate: StudentParentCreate; //

const { status, data } = await apiInstance.linkParentToStudentApiStudentsStudentIdParentsPost(
    studentId,
    studentParentCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentParentCreate** | **StudentParentCreate**|  | |
| **studentId** | [**string**] |  | defaults to undefined|


### Return type

**StudentParentResponse**

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

# **transferStudentClassApiStudentsStudentIdClassPatch**
> ClassMembershipResponse transferStudentClassApiStudentsStudentIdClassPatch(classMembershipUpdate)

Transférer un élève vers une nouvelle classe.

### Example

```typescript
import {
    StudentsApi,
    Configuration,
    ClassMembershipUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentsApi(configuration);

let studentId: string; // (default to undefined)
let classMembershipUpdate: ClassMembershipUpdate; //

const { status, data } = await apiInstance.transferStudentClassApiStudentsStudentIdClassPatch(
    studentId,
    classMembershipUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classMembershipUpdate** | **ClassMembershipUpdate**|  | |
| **studentId** | [**string**] |  | defaults to undefined|


### Return type

**ClassMembershipResponse**

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

# **unlinkParentFromStudentApiStudentsStudentIdParentsParentIdDelete**
> unlinkParentFromStudentApiStudentsStudentIdParentsParentIdDelete()

Délier un parent d\'un élève.

### Example

```typescript
import {
    StudentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentsApi(configuration);

let studentId: string; // (default to undefined)
let parentId: string; // (default to undefined)

const { status, data } = await apiInstance.unlinkParentFromStudentApiStudentsStudentIdParentsParentIdDelete(
    studentId,
    parentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentId** | [**string**] |  | defaults to undefined|
| **parentId** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateStudentApiStudentsStudentIdPatch**
> StudentResponse updateStudentApiStudentsStudentIdPatch(studentUpdate)

Mettre à jour un élève (photo, status uniquement).

### Example

```typescript
import {
    StudentsApi,
    Configuration,
    StudentUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new StudentsApi(configuration);

let studentId: string; // (default to undefined)
let studentUpdate: StudentUpdate; //

const { status, data } = await apiInstance.updateStudentApiStudentsStudentIdPatch(
    studentId,
    studentUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **studentUpdate** | **StudentUpdate**|  | |
| **studentId** | [**string**] |  | defaults to undefined|


### Return type

**StudentResponse**

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


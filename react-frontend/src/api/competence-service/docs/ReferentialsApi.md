# ReferentialsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**cloneFromGlobalReferentialApiV1GlobalReferentialsGlobalReferentialIdClonePost**](#clonefromglobalreferentialapiv1globalreferentialsglobalreferentialidclonepost) | **POST** /api/v1/global/referentials/{global_referential_id}/clone | Clone From Global Referential|
|[**cloneReferentialApiV1ReferentialsReferentialIdClonePost**](#clonereferentialapiv1referentialsreferentialidclonepost) | **POST** /api/v1/referentials/{referential_id}/clone | Clone Referential|
|[**createAssignmentApiV1ReferentialsReferentialIdAssignmentsPost**](#createassignmentapiv1referentialsreferentialidassignmentspost) | **POST** /api/v1/referentials/{referential_id}/assignments | Create Assignment|
|[**createCompetencyApiV1ReferentialsReferentialIdCompetenciesPost**](#createcompetencyapiv1referentialsreferentialidcompetenciespost) | **POST** /api/v1/referentials/{referential_id}/competencies | Create Competency|
|[**createDomainApiV1ReferentialsReferentialIdDomainsPost**](#createdomainapiv1referentialsreferentialiddomainspost) | **POST** /api/v1/referentials/{referential_id}/domains | Create Domain|
|[**createReferentialApiV1ReferentialsPost**](#createreferentialapiv1referentialspost) | **POST** /api/v1/referentials | Create Referential|
|[**createSubjectApiV1ReferentialsReferentialIdSubjectsPost**](#createsubjectapiv1referentialsreferentialidsubjectspost) | **POST** /api/v1/referentials/{referential_id}/subjects | Create Subject|
|[**deleteAssignmentApiV1AssignmentsAssignmentIdDelete**](#deleteassignmentapiv1assignmentsassignmentiddelete) | **DELETE** /api/v1/assignments/{assignment_id} | Delete Assignment|
|[**deleteCompetencyApiV1CompetenciesCompetencyIdDelete**](#deletecompetencyapiv1competenciescompetencyiddelete) | **DELETE** /api/v1/competencies/{competency_id} | Delete Competency|
|[**deleteDomainApiV1DomainsDomainIdDelete**](#deletedomainapiv1domainsdomainiddelete) | **DELETE** /api/v1/domains/{domain_id} | Delete Domain|
|[**deleteReferentialApiV1ReferentialsReferentialIdDelete**](#deletereferentialapiv1referentialsreferentialiddelete) | **DELETE** /api/v1/referentials/{referential_id} | Delete Referential|
|[**deleteSubjectApiV1SubjectsSubjectIdDelete**](#deletesubjectapiv1subjectssubjectiddelete) | **DELETE** /api/v1/subjects/{subject_id} | Delete Subject|
|[**getAssignmentApiV1AssignmentsAssignmentIdGet**](#getassignmentapiv1assignmentsassignmentidget) | **GET** /api/v1/assignments/{assignment_id} | Get Assignment|
|[**getCompetencyApiV1CompetenciesCompetencyIdGet**](#getcompetencyapiv1competenciescompetencyidget) | **GET** /api/v1/competencies/{competency_id} | Get Competency|
|[**getDomainApiV1DomainsDomainIdGet**](#getdomainapiv1domainsdomainidget) | **GET** /api/v1/domains/{domain_id} | Get Domain|
|[**getReferentialApiV1ReferentialsReferentialIdGet**](#getreferentialapiv1referentialsreferentialidget) | **GET** /api/v1/referentials/{referential_id} | Get Referential|
|[**getSubjectApiV1SubjectsSubjectIdGet**](#getsubjectapiv1subjectssubjectidget) | **GET** /api/v1/subjects/{subject_id} | Get Subject|
|[**listAssignmentsApiV1ReferentialsReferentialIdAssignmentsGet**](#listassignmentsapiv1referentialsreferentialidassignmentsget) | **GET** /api/v1/referentials/{referential_id}/assignments | List Assignments|
|[**listCompetenciesApiV1ReferentialsReferentialIdCompetenciesGet**](#listcompetenciesapiv1referentialsreferentialidcompetenciesget) | **GET** /api/v1/referentials/{referential_id}/competencies | List Competencies|
|[**listDomainsApiV1ReferentialsReferentialIdDomainsGet**](#listdomainsapiv1referentialsreferentialiddomainsget) | **GET** /api/v1/referentials/{referential_id}/domains | List Domains|
|[**listGlobalReferentialsApiV1GlobalReferentialsGet**](#listglobalreferentialsapiv1globalreferentialsget) | **GET** /api/v1/global/referentials | List Global Referentials|
|[**listReferentialsApiV1ReferentialsGet**](#listreferentialsapiv1referentialsget) | **GET** /api/v1/referentials | List Referentials|
|[**listSubjectsApiV1ReferentialsReferentialIdSubjectsGet**](#listsubjectsapiv1referentialsreferentialidsubjectsget) | **GET** /api/v1/referentials/{referential_id}/subjects | List Subjects|
|[**publishReferentialApiV1ReferentialsReferentialIdPublishPost**](#publishreferentialapiv1referentialsreferentialidpublishpost) | **POST** /api/v1/referentials/{referential_id}/publish | Publish Referential|
|[**updateCompetencyApiV1CompetenciesCompetencyIdPatch**](#updatecompetencyapiv1competenciescompetencyidpatch) | **PATCH** /api/v1/competencies/{competency_id} | Update Competency|
|[**updateDomainApiV1DomainsDomainIdPatch**](#updatedomainapiv1domainsdomainidpatch) | **PATCH** /api/v1/domains/{domain_id} | Update Domain|
|[**updateReferentialApiV1ReferentialsReferentialIdPatch**](#updatereferentialapiv1referentialsreferentialidpatch) | **PATCH** /api/v1/referentials/{referential_id} | Update Referential|
|[**updateSubjectApiV1SubjectsSubjectIdPatch**](#updatesubjectapiv1subjectssubjectidpatch) | **PATCH** /api/v1/subjects/{subject_id} | Update Subject|

# **cloneFromGlobalReferentialApiV1GlobalReferentialsGlobalReferentialIdClonePost**
> ReferentialResponse cloneFromGlobalReferentialApiV1GlobalReferentialsGlobalReferentialIdClonePost(referentialCloneFromGlobalRequest)

Cloner un référentiel global dans le tenant courant

### Example

```typescript
import {
    ReferentialsApi,
    Configuration,
    ReferentialCloneFromGlobalRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let globalReferentialId: string; //ID du référentiel global à cloner (default to undefined)
let referentialCloneFromGlobalRequest: ReferentialCloneFromGlobalRequest; //

const { status, data } = await apiInstance.cloneFromGlobalReferentialApiV1GlobalReferentialsGlobalReferentialIdClonePost(
    globalReferentialId,
    referentialCloneFromGlobalRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **referentialCloneFromGlobalRequest** | **ReferentialCloneFromGlobalRequest**|  | |
| **globalReferentialId** | [**string**] | ID du référentiel global à cloner | defaults to undefined|


### Return type

**ReferentialResponse**

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

# **cloneReferentialApiV1ReferentialsReferentialIdClonePost**
> ReferentialResponse cloneReferentialApiV1ReferentialsReferentialIdClonePost(referentialCloneRequest)

Cloner un référentiel en nouvelle version

### Example

```typescript
import {
    ReferentialsApi,
    Configuration,
    ReferentialCloneRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let referentialId: string; //ID du référentiel à cloner (default to undefined)
let referentialCloneRequest: ReferentialCloneRequest; //

const { status, data } = await apiInstance.cloneReferentialApiV1ReferentialsReferentialIdClonePost(
    referentialId,
    referentialCloneRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **referentialCloneRequest** | **ReferentialCloneRequest**|  | |
| **referentialId** | [**string**] | ID du référentiel à cloner | defaults to undefined|


### Return type

**ReferentialResponse**

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

# **createAssignmentApiV1ReferentialsReferentialIdAssignmentsPost**
> AssignmentResponse createAssignmentApiV1ReferentialsReferentialIdAssignmentsPost(assignmentCreate)

Créer une nouvelle affectation

### Example

```typescript
import {
    ReferentialsApi,
    Configuration,
    AssignmentCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let referentialId: string; //ID du référentiel (default to undefined)
let versionNumber: number; //Numéro de version (default to undefined)
let assignmentCreate: AssignmentCreate; //

const { status, data } = await apiInstance.createAssignmentApiV1ReferentialsReferentialIdAssignmentsPost(
    referentialId,
    versionNumber,
    assignmentCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **assignmentCreate** | **AssignmentCreate**|  | |
| **referentialId** | [**string**] | ID du référentiel | defaults to undefined|
| **versionNumber** | [**number**] | Numéro de version | defaults to undefined|


### Return type

**AssignmentResponse**

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

# **createCompetencyApiV1ReferentialsReferentialIdCompetenciesPost**
> CompetencyResponse createCompetencyApiV1ReferentialsReferentialIdCompetenciesPost(competencyCreate)

Créer une nouvelle compétence

### Example

```typescript
import {
    ReferentialsApi,
    Configuration,
    CompetencyCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let referentialId: string; //ID du référentiel (default to undefined)
let versionNumber: number; //Numéro de version (default to undefined)
let competencyCreate: CompetencyCreate; //

const { status, data } = await apiInstance.createCompetencyApiV1ReferentialsReferentialIdCompetenciesPost(
    referentialId,
    versionNumber,
    competencyCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **competencyCreate** | **CompetencyCreate**|  | |
| **referentialId** | [**string**] | ID du référentiel | defaults to undefined|
| **versionNumber** | [**number**] | Numéro de version | defaults to undefined|


### Return type

**CompetencyResponse**

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

# **createDomainApiV1ReferentialsReferentialIdDomainsPost**
> DomainResponse createDomainApiV1ReferentialsReferentialIdDomainsPost(domainCreate)

Créer un nouveau domaine

### Example

```typescript
import {
    ReferentialsApi,
    Configuration,
    DomainCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let referentialId: string; //ID du référentiel (default to undefined)
let versionNumber: number; //Numéro de version (default to undefined)
let domainCreate: DomainCreate; //

const { status, data } = await apiInstance.createDomainApiV1ReferentialsReferentialIdDomainsPost(
    referentialId,
    versionNumber,
    domainCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **domainCreate** | **DomainCreate**|  | |
| **referentialId** | [**string**] | ID du référentiel | defaults to undefined|
| **versionNumber** | [**number**] | Numéro de version | defaults to undefined|


### Return type

**DomainResponse**

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

# **createReferentialApiV1ReferentialsPost**
> ReferentialResponse createReferentialApiV1ReferentialsPost(referentialCreate)

Créer un nouveau référentiel

### Example

```typescript
import {
    ReferentialsApi,
    Configuration,
    ReferentialCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let referentialCreate: ReferentialCreate; //

const { status, data } = await apiInstance.createReferentialApiV1ReferentialsPost(
    referentialCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **referentialCreate** | **ReferentialCreate**|  | |


### Return type

**ReferentialResponse**

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

# **createSubjectApiV1ReferentialsReferentialIdSubjectsPost**
> SubjectResponse createSubjectApiV1ReferentialsReferentialIdSubjectsPost(subjectCreate)

Créer une nouvelle matière

### Example

```typescript
import {
    ReferentialsApi,
    Configuration,
    SubjectCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let referentialId: string; //ID du référentiel (default to undefined)
let versionNumber: number; //Numéro de version (default to undefined)
let subjectCreate: SubjectCreate; //

const { status, data } = await apiInstance.createSubjectApiV1ReferentialsReferentialIdSubjectsPost(
    referentialId,
    versionNumber,
    subjectCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **subjectCreate** | **SubjectCreate**|  | |
| **referentialId** | [**string**] | ID du référentiel | defaults to undefined|
| **versionNumber** | [**number**] | Numéro de version | defaults to undefined|


### Return type

**SubjectResponse**

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

# **deleteAssignmentApiV1AssignmentsAssignmentIdDelete**
> deleteAssignmentApiV1AssignmentsAssignmentIdDelete()

Supprimer une affectation

### Example

```typescript
import {
    ReferentialsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let assignmentId: string; //ID de l\'affectation (default to undefined)

const { status, data } = await apiInstance.deleteAssignmentApiV1AssignmentsAssignmentIdDelete(
    assignmentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **assignmentId** | [**string**] | ID de l\&#39;affectation | defaults to undefined|


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

# **deleteCompetencyApiV1CompetenciesCompetencyIdDelete**
> deleteCompetencyApiV1CompetenciesCompetencyIdDelete()

Supprimer une compétence

### Example

```typescript
import {
    ReferentialsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let competencyId: string; //ID de la compétence (default to undefined)

const { status, data } = await apiInstance.deleteCompetencyApiV1CompetenciesCompetencyIdDelete(
    competencyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **competencyId** | [**string**] | ID de la compétence | defaults to undefined|


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

# **deleteDomainApiV1DomainsDomainIdDelete**
> deleteDomainApiV1DomainsDomainIdDelete()

Supprimer un domaine

### Example

```typescript
import {
    ReferentialsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let domainId: string; //ID du domaine (default to undefined)

const { status, data } = await apiInstance.deleteDomainApiV1DomainsDomainIdDelete(
    domainId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **domainId** | [**string**] | ID du domaine | defaults to undefined|


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

# **deleteReferentialApiV1ReferentialsReferentialIdDelete**
> deleteReferentialApiV1ReferentialsReferentialIdDelete()

Supprimer un référentiel

### Example

```typescript
import {
    ReferentialsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let referentialId: string; //ID du référentiel (default to undefined)
let versionNumber: number; //Numéro de version (default to undefined)

const { status, data } = await apiInstance.deleteReferentialApiV1ReferentialsReferentialIdDelete(
    referentialId,
    versionNumber
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **referentialId** | [**string**] | ID du référentiel | defaults to undefined|
| **versionNumber** | [**number**] | Numéro de version | defaults to undefined|


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

# **deleteSubjectApiV1SubjectsSubjectIdDelete**
> deleteSubjectApiV1SubjectsSubjectIdDelete()

Supprimer une matière

### Example

```typescript
import {
    ReferentialsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let subjectId: string; //ID de la matière (default to undefined)

const { status, data } = await apiInstance.deleteSubjectApiV1SubjectsSubjectIdDelete(
    subjectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **subjectId** | [**string**] | ID de la matière | defaults to undefined|


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

# **getAssignmentApiV1AssignmentsAssignmentIdGet**
> AssignmentResponse getAssignmentApiV1AssignmentsAssignmentIdGet()

Récupérer une affectation par ID

### Example

```typescript
import {
    ReferentialsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let assignmentId: string; //ID de l\'affectation (default to undefined)

const { status, data } = await apiInstance.getAssignmentApiV1AssignmentsAssignmentIdGet(
    assignmentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **assignmentId** | [**string**] | ID de l\&#39;affectation | defaults to undefined|


### Return type

**AssignmentResponse**

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

# **getCompetencyApiV1CompetenciesCompetencyIdGet**
> CompetencyResponse getCompetencyApiV1CompetenciesCompetencyIdGet()

Récupérer une compétence par ID

### Example

```typescript
import {
    ReferentialsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let competencyId: string; //ID de la compétence (default to undefined)

const { status, data } = await apiInstance.getCompetencyApiV1CompetenciesCompetencyIdGet(
    competencyId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **competencyId** | [**string**] | ID de la compétence | defaults to undefined|


### Return type

**CompetencyResponse**

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

# **getDomainApiV1DomainsDomainIdGet**
> DomainResponse getDomainApiV1DomainsDomainIdGet()

Récupérer un domaine par ID

### Example

```typescript
import {
    ReferentialsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let domainId: string; //ID du domaine (default to undefined)

const { status, data } = await apiInstance.getDomainApiV1DomainsDomainIdGet(
    domainId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **domainId** | [**string**] | ID du domaine | defaults to undefined|


### Return type

**DomainResponse**

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

# **getReferentialApiV1ReferentialsReferentialIdGet**
> ResponseGetReferentialApiV1ReferentialsReferentialIdGet getReferentialApiV1ReferentialsReferentialIdGet()

Récupérer un référentiel par ID et version

### Example

```typescript
import {
    ReferentialsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let referentialId: string; //ID du référentiel (default to undefined)
let versionNumber: number; //Numéro de version (optional) (default to undefined)
let includeTree: boolean; //Inclure l\'arborescence complète (domaines, matières, compétences) (optional) (default to false)

const { status, data } = await apiInstance.getReferentialApiV1ReferentialsReferentialIdGet(
    referentialId,
    versionNumber,
    includeTree
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **referentialId** | [**string**] | ID du référentiel | defaults to undefined|
| **versionNumber** | [**number**] | Numéro de version | (optional) defaults to undefined|
| **includeTree** | [**boolean**] | Inclure l\&#39;arborescence complète (domaines, matières, compétences) | (optional) defaults to false|


### Return type

**ResponseGetReferentialApiV1ReferentialsReferentialIdGet**

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

# **getSubjectApiV1SubjectsSubjectIdGet**
> SubjectResponse getSubjectApiV1SubjectsSubjectIdGet()

Récupérer une matière par ID

### Example

```typescript
import {
    ReferentialsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let subjectId: string; //ID de la matière (default to undefined)

const { status, data } = await apiInstance.getSubjectApiV1SubjectsSubjectIdGet(
    subjectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **subjectId** | [**string**] | ID de la matière | defaults to undefined|


### Return type

**SubjectResponse**

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

# **listAssignmentsApiV1ReferentialsReferentialIdAssignmentsGet**
> AssignmentListResponse listAssignmentsApiV1ReferentialsReferentialIdAssignmentsGet()

Lister les affectations d\'un référentiel

### Example

```typescript
import {
    ReferentialsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let referentialId: string; //ID du référentiel (default to undefined)
let versionNumber: number; //Numéro de version (default to undefined)

const { status, data } = await apiInstance.listAssignmentsApiV1ReferentialsReferentialIdAssignmentsGet(
    referentialId,
    versionNumber
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **referentialId** | [**string**] | ID du référentiel | defaults to undefined|
| **versionNumber** | [**number**] | Numéro de version | defaults to undefined|


### Return type

**AssignmentListResponse**

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

# **listCompetenciesApiV1ReferentialsReferentialIdCompetenciesGet**
> CompetencyListResponse listCompetenciesApiV1ReferentialsReferentialIdCompetenciesGet()

Lister les compétences d\'un référentiel avec filtres

### Example

```typescript
import {
    ReferentialsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let referentialId: string; //ID du référentiel (default to undefined)
let versionNumber: number; //Numéro de version (default to undefined)
let page: number; //Numéro de page (optional) (default to 1)
let size: number; //Taille de page (optional) (default to 20)
let subjectId: string; //Filtrer par matière (optional) (default to undefined)
let q: string; //Recherche textuelle (optional) (default to undefined)

const { status, data } = await apiInstance.listCompetenciesApiV1ReferentialsReferentialIdCompetenciesGet(
    referentialId,
    versionNumber,
    page,
    size,
    subjectId,
    q
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **referentialId** | [**string**] | ID du référentiel | defaults to undefined|
| **versionNumber** | [**number**] | Numéro de version | defaults to undefined|
| **page** | [**number**] | Numéro de page | (optional) defaults to 1|
| **size** | [**number**] | Taille de page | (optional) defaults to 20|
| **subjectId** | [**string**] | Filtrer par matière | (optional) defaults to undefined|
| **q** | [**string**] | Recherche textuelle | (optional) defaults to undefined|


### Return type

**CompetencyListResponse**

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

# **listDomainsApiV1ReferentialsReferentialIdDomainsGet**
> DomainListResponse listDomainsApiV1ReferentialsReferentialIdDomainsGet()

Lister les domaines d\'un référentiel

### Example

```typescript
import {
    ReferentialsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let referentialId: string; //ID du référentiel (default to undefined)
let versionNumber: number; //Numéro de version (default to undefined)

const { status, data } = await apiInstance.listDomainsApiV1ReferentialsReferentialIdDomainsGet(
    referentialId,
    versionNumber
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **referentialId** | [**string**] | ID du référentiel | defaults to undefined|
| **versionNumber** | [**number**] | Numéro de version | defaults to undefined|


### Return type

**DomainListResponse**

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

# **listGlobalReferentialsApiV1GlobalReferentialsGet**
> GlobalReferentialListResponse listGlobalReferentialsApiV1GlobalReferentialsGet()

Lister les référentiels globaux (catalogue EdConnect)

### Example

```typescript
import {
    ReferentialsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let page: number; //Numéro de page (optional) (default to 1)
let size: number; //Taille de page (optional) (default to 20)
let cycle: string; //Filtrer par cycle (optional) (default to undefined)
let q: string; //Recherche textuelle (optional) (default to undefined)

const { status, data } = await apiInstance.listGlobalReferentialsApiV1GlobalReferentialsGet(
    page,
    size,
    cycle,
    q
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Numéro de page | (optional) defaults to 1|
| **size** | [**number**] | Taille de page | (optional) defaults to 20|
| **cycle** | [**string**] | Filtrer par cycle | (optional) defaults to undefined|
| **q** | [**string**] | Recherche textuelle | (optional) defaults to undefined|


### Return type

**GlobalReferentialListResponse**

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

# **listReferentialsApiV1ReferentialsGet**
> ReferentialListResponse listReferentialsApiV1ReferentialsGet()

Lister les référentiels avec filtres et pagination

### Example

```typescript
import {
    ReferentialsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let page: number; //Numéro de page (optional) (default to 1)
let size: number; //Taille de page (optional) (default to 20)
let cycle: string; //Filtrer par cycle (optional) (default to undefined)
let state: string; //Filtrer par état (optional) (default to undefined)
let visibility: string; //Filtrer par visibilité (optional) (default to undefined)
let q: string; //Recherche textuelle (optional) (default to undefined)

const { status, data } = await apiInstance.listReferentialsApiV1ReferentialsGet(
    page,
    size,
    cycle,
    state,
    visibility,
    q
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Numéro de page | (optional) defaults to 1|
| **size** | [**number**] | Taille de page | (optional) defaults to 20|
| **cycle** | [**string**] | Filtrer par cycle | (optional) defaults to undefined|
| **state** | [**string**] | Filtrer par état | (optional) defaults to undefined|
| **visibility** | [**string**] | Filtrer par visibilité | (optional) defaults to undefined|
| **q** | [**string**] | Recherche textuelle | (optional) defaults to undefined|


### Return type

**ReferentialListResponse**

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

# **listSubjectsApiV1ReferentialsReferentialIdSubjectsGet**
> SubjectListResponse listSubjectsApiV1ReferentialsReferentialIdSubjectsGet()

Lister les matières d\'un référentiel avec filtres

### Example

```typescript
import {
    ReferentialsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let referentialId: string; //ID du référentiel (default to undefined)
let versionNumber: number; //Numéro de version (default to undefined)
let page: number; //Numéro de page (optional) (default to 1)
let size: number; //Taille de page (optional) (default to 20)
let domainId: string; //Filtrer par domaine (optional) (default to undefined)
let q: string; //Recherche textuelle (optional) (default to undefined)

const { status, data } = await apiInstance.listSubjectsApiV1ReferentialsReferentialIdSubjectsGet(
    referentialId,
    versionNumber,
    page,
    size,
    domainId,
    q
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **referentialId** | [**string**] | ID du référentiel | defaults to undefined|
| **versionNumber** | [**number**] | Numéro de version | defaults to undefined|
| **page** | [**number**] | Numéro de page | (optional) defaults to 1|
| **size** | [**number**] | Taille de page | (optional) defaults to 20|
| **domainId** | [**string**] | Filtrer par domaine | (optional) defaults to undefined|
| **q** | [**string**] | Recherche textuelle | (optional) defaults to undefined|


### Return type

**SubjectListResponse**

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

# **publishReferentialApiV1ReferentialsReferentialIdPublishPost**
> any publishReferentialApiV1ReferentialsReferentialIdPublishPost()

Publier un référentiel

### Example

```typescript
import {
    ReferentialsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let referentialId: string; //ID du référentiel (default to undefined)
let versionNumber: number; //Numéro de version (default to undefined)

const { status, data } = await apiInstance.publishReferentialApiV1ReferentialsReferentialIdPublishPost(
    referentialId,
    versionNumber
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **referentialId** | [**string**] | ID du référentiel | defaults to undefined|
| **versionNumber** | [**number**] | Numéro de version | defaults to undefined|


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
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateCompetencyApiV1CompetenciesCompetencyIdPatch**
> CompetencyResponse updateCompetencyApiV1CompetenciesCompetencyIdPatch(competencyUpdate)

Mettre à jour une compétence

### Example

```typescript
import {
    ReferentialsApi,
    Configuration,
    CompetencyUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let competencyId: string; //ID de la compétence (default to undefined)
let competencyUpdate: CompetencyUpdate; //

const { status, data } = await apiInstance.updateCompetencyApiV1CompetenciesCompetencyIdPatch(
    competencyId,
    competencyUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **competencyUpdate** | **CompetencyUpdate**|  | |
| **competencyId** | [**string**] | ID de la compétence | defaults to undefined|


### Return type

**CompetencyResponse**

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

# **updateDomainApiV1DomainsDomainIdPatch**
> DomainResponse updateDomainApiV1DomainsDomainIdPatch(domainUpdate)

Mettre à jour un domaine

### Example

```typescript
import {
    ReferentialsApi,
    Configuration,
    DomainUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let domainId: string; //ID du domaine (default to undefined)
let domainUpdate: DomainUpdate; //

const { status, data } = await apiInstance.updateDomainApiV1DomainsDomainIdPatch(
    domainId,
    domainUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **domainUpdate** | **DomainUpdate**|  | |
| **domainId** | [**string**] | ID du domaine | defaults to undefined|


### Return type

**DomainResponse**

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

# **updateReferentialApiV1ReferentialsReferentialIdPatch**
> ReferentialResponse updateReferentialApiV1ReferentialsReferentialIdPatch(referentialUpdate)

Mettre à jour un référentiel

### Example

```typescript
import {
    ReferentialsApi,
    Configuration,
    ReferentialUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let referentialId: string; //ID du référentiel (default to undefined)
let versionNumber: number; //Numéro de version (default to undefined)
let referentialUpdate: ReferentialUpdate; //

const { status, data } = await apiInstance.updateReferentialApiV1ReferentialsReferentialIdPatch(
    referentialId,
    versionNumber,
    referentialUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **referentialUpdate** | **ReferentialUpdate**|  | |
| **referentialId** | [**string**] | ID du référentiel | defaults to undefined|
| **versionNumber** | [**number**] | Numéro de version | defaults to undefined|


### Return type

**ReferentialResponse**

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

# **updateSubjectApiV1SubjectsSubjectIdPatch**
> SubjectResponse updateSubjectApiV1SubjectsSubjectIdPatch(subjectUpdate)

Mettre à jour une matière

### Example

```typescript
import {
    ReferentialsApi,
    Configuration,
    SubjectUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new ReferentialsApi(configuration);

let subjectId: string; //ID de la matière (default to undefined)
let subjectUpdate: SubjectUpdate; //

const { status, data } = await apiInstance.updateSubjectApiV1SubjectsSubjectIdPatch(
    subjectId,
    subjectUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **subjectUpdate** | **SubjectUpdate**|  | |
| **subjectId** | [**string**] | ID de la matière | defaults to undefined|


### Return type

**SubjectResponse**

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


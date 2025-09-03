# ReferentialsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**cloneFromGlobalReferentialApiCompetenceGlobalReferentialsGlobalReferentialIdClonePost**](#clonefromglobalreferentialapicompetenceglobalreferentialsglobalreferentialidclonepost) | **POST** /api/competence/global/referentials/{global_referential_id}/clone | Clone From Global Referential|
|[**cloneReferentialApiCompetenceReferentialsReferentialIdClonePost**](#clonereferentialapicompetencereferentialsreferentialidclonepost) | **POST** /api/competence/referentials/{referential_id}/clone | Clone Referential|
|[**createAssignmentApiCompetenceAssignmentsPost**](#createassignmentapicompetenceassignmentspost) | **POST** /api/competence/assignments | Create Assignment|
|[**createCompetencyApiCompetenceReferentialsReferentialIdCompetenciesPost**](#createcompetencyapicompetencereferentialsreferentialidcompetenciespost) | **POST** /api/competence/referentials/{referential_id}/competencies | Create Competency|
|[**createDomainApiCompetenceReferentialsReferentialIdDomainsPost**](#createdomainapicompetencereferentialsreferentialiddomainspost) | **POST** /api/competence/referentials/{referential_id}/domains | Create Domain|
|[**createReferentialApiCompetenceReferentialsPost**](#createreferentialapicompetencereferentialspost) | **POST** /api/competence/referentials | Create Referential|
|[**createSubjectApiCompetenceReferentialsReferentialIdSubjectsPost**](#createsubjectapicompetencereferentialsreferentialidsubjectspost) | **POST** /api/competence/referentials/{referential_id}/subjects | Create Subject|
|[**deleteAssignmentApiCompetenceAssignmentsAssignmentIdDelete**](#deleteassignmentapicompetenceassignmentsassignmentiddelete) | **DELETE** /api/competence/assignments/{assignment_id} | Delete Assignment|
|[**deleteCompetencyApiCompetenceCompetenciesCompetencyIdDelete**](#deletecompetencyapicompetencecompetenciescompetencyiddelete) | **DELETE** /api/competence/competencies/{competency_id} | Delete Competency|
|[**deleteDomainApiCompetenceDomainsDomainIdDelete**](#deletedomainapicompetencedomainsdomainiddelete) | **DELETE** /api/competence/domains/{domain_id} | Delete Domain|
|[**deleteReferentialApiCompetenceReferentialsReferentialIdDelete**](#deletereferentialapicompetencereferentialsreferentialiddelete) | **DELETE** /api/competence/referentials/{referential_id} | Delete Referential|
|[**deleteSubjectApiCompetenceSubjectsSubjectIdDelete**](#deletesubjectapicompetencesubjectssubjectiddelete) | **DELETE** /api/competence/subjects/{subject_id} | Delete Subject|
|[**getAssignmentApiCompetenceAssignmentsAssignmentIdGet**](#getassignmentapicompetenceassignmentsassignmentidget) | **GET** /api/competence/assignments/{assignment_id} | Get Assignment|
|[**getCompetencyApiCompetenceCompetenciesCompetencyIdGet**](#getcompetencyapicompetencecompetenciescompetencyidget) | **GET** /api/competence/competencies/{competency_id} | Get Competency|
|[**getDomainApiCompetenceDomainsDomainIdGet**](#getdomainapicompetencedomainsdomainidget) | **GET** /api/competence/domains/{domain_id} | Get Domain|
|[**getReferentialApiCompetenceReferentialsReferentialIdGet**](#getreferentialapicompetencereferentialsreferentialidget) | **GET** /api/competence/referentials/{referential_id} | Get Referential|
|[**getSubjectApiCompetenceSubjectsSubjectIdGet**](#getsubjectapicompetencesubjectssubjectidget) | **GET** /api/competence/subjects/{subject_id} | Get Subject|
|[**listAssignmentsApiCompetenceAssignmentsGet**](#listassignmentsapicompetenceassignmentsget) | **GET** /api/competence/assignments | List Assignments|
|[**listCompetenciesApiCompetenceReferentialsReferentialIdCompetenciesGet**](#listcompetenciesapicompetencereferentialsreferentialidcompetenciesget) | **GET** /api/competence/referentials/{referential_id}/competencies | List Competencies|
|[**listDomainsApiCompetenceReferentialsReferentialIdDomainsGet**](#listdomainsapicompetencereferentialsreferentialiddomainsget) | **GET** /api/competence/referentials/{referential_id}/domains | List Domains|
|[**listGlobalReferentialsApiCompetenceGlobalReferentialsGet**](#listglobalreferentialsapicompetenceglobalreferentialsget) | **GET** /api/competence/global/referentials | List Global Referentials|
|[**listReferentialsApiCompetenceReferentialsGet**](#listreferentialsapicompetencereferentialsget) | **GET** /api/competence/referentials | List Referentials|
|[**listSubjectsApiCompetenceReferentialsReferentialIdSubjectsGet**](#listsubjectsapicompetencereferentialsreferentialidsubjectsget) | **GET** /api/competence/referentials/{referential_id}/subjects | List Subjects|
|[**publishReferentialApiCompetenceReferentialsReferentialIdPublishPost**](#publishreferentialapicompetencereferentialsreferentialidpublishpost) | **POST** /api/competence/referentials/{referential_id}/publish | Publish Referential|
|[**updateCompetencyApiCompetenceCompetenciesCompetencyIdPut**](#updatecompetencyapicompetencecompetenciescompetencyidput) | **PUT** /api/competence/competencies/{competency_id} | Update Competency|
|[**updateDomainApiCompetenceDomainsDomainIdPut**](#updatedomainapicompetencedomainsdomainidput) | **PUT** /api/competence/domains/{domain_id} | Update Domain|
|[**updateReferentialApiCompetenceReferentialsReferentialIdPut**](#updatereferentialapicompetencereferentialsreferentialidput) | **PUT** /api/competence/referentials/{referential_id} | Update Referential|
|[**updateSubjectApiCompetenceSubjectsSubjectIdPut**](#updatesubjectapicompetencesubjectssubjectidput) | **PUT** /api/competence/subjects/{subject_id} | Update Subject|

# **cloneFromGlobalReferentialApiCompetenceGlobalReferentialsGlobalReferentialIdClonePost**
> ReferentialResponse cloneFromGlobalReferentialApiCompetenceGlobalReferentialsGlobalReferentialIdClonePost(referentialCloneFromGlobalRequest)

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

const { status, data } = await apiInstance.cloneFromGlobalReferentialApiCompetenceGlobalReferentialsGlobalReferentialIdClonePost(
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

# **cloneReferentialApiCompetenceReferentialsReferentialIdClonePost**
> ReferentialResponse cloneReferentialApiCompetenceReferentialsReferentialIdClonePost(referentialCloneRequest)

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

const { status, data } = await apiInstance.cloneReferentialApiCompetenceReferentialsReferentialIdClonePost(
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

# **createAssignmentApiCompetenceAssignmentsPost**
> Array<AssignmentResponse> createAssignmentApiCompetenceAssignmentsPost(assignmentCreate)

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

let assignmentCreate: AssignmentCreate; //

const { status, data } = await apiInstance.createAssignmentApiCompetenceAssignmentsPost(
    assignmentCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **assignmentCreate** | **AssignmentCreate**|  | |


### Return type

**Array<AssignmentResponse>**

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

# **createCompetencyApiCompetenceReferentialsReferentialIdCompetenciesPost**
> CompetencyResponse createCompetencyApiCompetenceReferentialsReferentialIdCompetenciesPost(competencyCreate)

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

const { status, data } = await apiInstance.createCompetencyApiCompetenceReferentialsReferentialIdCompetenciesPost(
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

# **createDomainApiCompetenceReferentialsReferentialIdDomainsPost**
> DomainResponse createDomainApiCompetenceReferentialsReferentialIdDomainsPost(domainCreate)

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

const { status, data } = await apiInstance.createDomainApiCompetenceReferentialsReferentialIdDomainsPost(
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

# **createReferentialApiCompetenceReferentialsPost**
> ReferentialResponse createReferentialApiCompetenceReferentialsPost(referentialCreate)

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

const { status, data } = await apiInstance.createReferentialApiCompetenceReferentialsPost(
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

# **createSubjectApiCompetenceReferentialsReferentialIdSubjectsPost**
> SubjectResponse createSubjectApiCompetenceReferentialsReferentialIdSubjectsPost(subjectCreate)

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

const { status, data } = await apiInstance.createSubjectApiCompetenceReferentialsReferentialIdSubjectsPost(
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

# **deleteAssignmentApiCompetenceAssignmentsAssignmentIdDelete**
> deleteAssignmentApiCompetenceAssignmentsAssignmentIdDelete()

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

const { status, data } = await apiInstance.deleteAssignmentApiCompetenceAssignmentsAssignmentIdDelete(
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

# **deleteCompetencyApiCompetenceCompetenciesCompetencyIdDelete**
> deleteCompetencyApiCompetenceCompetenciesCompetencyIdDelete()

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

const { status, data } = await apiInstance.deleteCompetencyApiCompetenceCompetenciesCompetencyIdDelete(
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

# **deleteDomainApiCompetenceDomainsDomainIdDelete**
> deleteDomainApiCompetenceDomainsDomainIdDelete()

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

const { status, data } = await apiInstance.deleteDomainApiCompetenceDomainsDomainIdDelete(
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

# **deleteReferentialApiCompetenceReferentialsReferentialIdDelete**
> deleteReferentialApiCompetenceReferentialsReferentialIdDelete()

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

const { status, data } = await apiInstance.deleteReferentialApiCompetenceReferentialsReferentialIdDelete(
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

# **deleteSubjectApiCompetenceSubjectsSubjectIdDelete**
> deleteSubjectApiCompetenceSubjectsSubjectIdDelete()

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

const { status, data } = await apiInstance.deleteSubjectApiCompetenceSubjectsSubjectIdDelete(
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

# **getAssignmentApiCompetenceAssignmentsAssignmentIdGet**
> AssignmentResponse getAssignmentApiCompetenceAssignmentsAssignmentIdGet()

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

const { status, data } = await apiInstance.getAssignmentApiCompetenceAssignmentsAssignmentIdGet(
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

# **getCompetencyApiCompetenceCompetenciesCompetencyIdGet**
> CompetencyResponse getCompetencyApiCompetenceCompetenciesCompetencyIdGet()

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

const { status, data } = await apiInstance.getCompetencyApiCompetenceCompetenciesCompetencyIdGet(
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

# **getDomainApiCompetenceDomainsDomainIdGet**
> DomainResponse getDomainApiCompetenceDomainsDomainIdGet()

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

const { status, data } = await apiInstance.getDomainApiCompetenceDomainsDomainIdGet(
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

# **getReferentialApiCompetenceReferentialsReferentialIdGet**
> ResponseGetReferentialApiCompetenceReferentialsReferentialIdGet getReferentialApiCompetenceReferentialsReferentialIdGet()

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

const { status, data } = await apiInstance.getReferentialApiCompetenceReferentialsReferentialIdGet(
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

**ResponseGetReferentialApiCompetenceReferentialsReferentialIdGet**

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

# **getSubjectApiCompetenceSubjectsSubjectIdGet**
> SubjectResponse getSubjectApiCompetenceSubjectsSubjectIdGet()

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

const { status, data } = await apiInstance.getSubjectApiCompetenceSubjectsSubjectIdGet(
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

# **listAssignmentsApiCompetenceAssignmentsGet**
> Array<AssignmentResponse> listAssignmentsApiCompetenceAssignmentsGet()

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

const { status, data } = await apiInstance.listAssignmentsApiCompetenceAssignmentsGet(
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

**Array<AssignmentResponse>**

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

# **listCompetenciesApiCompetenceReferentialsReferentialIdCompetenciesGet**
> CompetencyListResponse listCompetenciesApiCompetenceReferentialsReferentialIdCompetenciesGet()

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

const { status, data } = await apiInstance.listCompetenciesApiCompetenceReferentialsReferentialIdCompetenciesGet(
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

# **listDomainsApiCompetenceReferentialsReferentialIdDomainsGet**
> Array<DomainResponse> listDomainsApiCompetenceReferentialsReferentialIdDomainsGet()

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

const { status, data } = await apiInstance.listDomainsApiCompetenceReferentialsReferentialIdDomainsGet(
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

**Array<DomainResponse>**

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

# **listGlobalReferentialsApiCompetenceGlobalReferentialsGet**
> GlobalReferentialListResponse listGlobalReferentialsApiCompetenceGlobalReferentialsGet()

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

const { status, data } = await apiInstance.listGlobalReferentialsApiCompetenceGlobalReferentialsGet(
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

# **listReferentialsApiCompetenceReferentialsGet**
> ReferentialListResponse listReferentialsApiCompetenceReferentialsGet()

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

const { status, data } = await apiInstance.listReferentialsApiCompetenceReferentialsGet(
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

# **listSubjectsApiCompetenceReferentialsReferentialIdSubjectsGet**
> SubjectListResponse listSubjectsApiCompetenceReferentialsReferentialIdSubjectsGet()

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

const { status, data } = await apiInstance.listSubjectsApiCompetenceReferentialsReferentialIdSubjectsGet(
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

# **publishReferentialApiCompetenceReferentialsReferentialIdPublishPost**
> any publishReferentialApiCompetenceReferentialsReferentialIdPublishPost()

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

const { status, data } = await apiInstance.publishReferentialApiCompetenceReferentialsReferentialIdPublishPost(
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

# **updateCompetencyApiCompetenceCompetenciesCompetencyIdPut**
> CompetencyResponse updateCompetencyApiCompetenceCompetenciesCompetencyIdPut(competencyUpdate)

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

const { status, data } = await apiInstance.updateCompetencyApiCompetenceCompetenciesCompetencyIdPut(
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

# **updateDomainApiCompetenceDomainsDomainIdPut**
> DomainResponse updateDomainApiCompetenceDomainsDomainIdPut(domainUpdate)

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

const { status, data } = await apiInstance.updateDomainApiCompetenceDomainsDomainIdPut(
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

# **updateReferentialApiCompetenceReferentialsReferentialIdPut**
> ReferentialResponse updateReferentialApiCompetenceReferentialsReferentialIdPut(referentialUpdate)

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

const { status, data } = await apiInstance.updateReferentialApiCompetenceReferentialsReferentialIdPut(
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

# **updateSubjectApiCompetenceSubjectsSubjectIdPut**
> SubjectResponse updateSubjectApiCompetenceSubjectsSubjectIdPut(subjectUpdate)

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

const { status, data } = await apiInstance.updateSubjectApiCompetenceSubjectsSubjectIdPut(
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


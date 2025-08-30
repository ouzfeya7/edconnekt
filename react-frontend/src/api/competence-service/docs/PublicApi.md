# PublicApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getCompetenciesForSubjectApiCompetencePublicSubjectsSubjectIdCompetenciesGet**](#getcompetenciesforsubjectapicompetencepublicsubjectssubjectidcompetenciesget) | **GET** /api/competence/public/subjects/{subject_id}/competencies | Get Competencies For Subject|
|[**getReferentialTreeApiCompetencePublicReferentialsReferentialIdTreeGet**](#getreferentialtreeapicompetencepublicreferentialsreferentialidtreeget) | **GET** /api/competence/public/referentials/{referential_id}/tree | Get Referential Tree|
|[**listSubjectsByScopeApiCompetencePublicSubjectsGet**](#listsubjectsbyscopeapicompetencepublicsubjectsget) | **GET** /api/competence/public/subjects | List Subjects By Scope|
|[**lookupCompetencyByCodeApiCompetencePublicCompetenciesByCodeCodeGet**](#lookupcompetencybycodeapicompetencepubliccompetenciesbycodecodeget) | **GET** /api/competence/public/competencies/by-code/{code} | Lookup Competency By Code|

# **getCompetenciesForSubjectApiCompetencePublicSubjectsSubjectIdCompetenciesGet**
> Array<CompetencyResponse> getCompetenciesForSubjectApiCompetencePublicSubjectsSubjectIdCompetenciesGet()

Récupérer les compétences d\'une matière (pour les référentiels publiés)

### Example

```typescript
import {
    PublicApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PublicApi(configuration);

let subjectId: string; //ID de la matière (default to undefined)

const { status, data } = await apiInstance.getCompetenciesForSubjectApiCompetencePublicSubjectsSubjectIdCompetenciesGet(
    subjectId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **subjectId** | [**string**] | ID de la matière | defaults to undefined|


### Return type

**Array<CompetencyResponse>**

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

# **getReferentialTreeApiCompetencePublicReferentialsReferentialIdTreeGet**
> ReferentialTree getReferentialTreeApiCompetencePublicReferentialsReferentialIdTreeGet()

Récupérer l\'arborescence complète d\'un référentiel publié

### Example

```typescript
import {
    PublicApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PublicApi(configuration);

let referentialId: string; //ID du référentiel (default to undefined)
let version: number; //Numéro de version (default to undefined)

const { status, data } = await apiInstance.getReferentialTreeApiCompetencePublicReferentialsReferentialIdTreeGet(
    referentialId,
    version
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **referentialId** | [**string**] | ID du référentiel | defaults to undefined|
| **version** | [**number**] | Numéro de version | defaults to undefined|


### Return type

**ReferentialTree**

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

# **listSubjectsByScopeApiCompetencePublicSubjectsGet**
> Array<SubjectResponse> listSubjectsByScopeApiCompetencePublicSubjectsGet()

Lister les matières par cycle et niveau (pour les référentiels publiés)

### Example

```typescript
import {
    PublicApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PublicApi(configuration);

let cycle: CycleEnum; //Filtrer par cycle (default to undefined)
let level: string; //Filtrer par niveau (default to undefined)

const { status, data } = await apiInstance.listSubjectsByScopeApiCompetencePublicSubjectsGet(
    cycle,
    level
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **cycle** | **CycleEnum** | Filtrer par cycle | defaults to undefined|
| **level** | [**string**] | Filtrer par niveau | defaults to undefined|


### Return type

**Array<SubjectResponse>**

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

# **lookupCompetencyByCodeApiCompetencePublicCompetenciesByCodeCodeGet**
> CompetencyResponse lookupCompetencyByCodeApiCompetencePublicCompetenciesByCodeCodeGet()

Rechercher une compétence par son code (pour les référentiels publiés)

### Example

```typescript
import {
    PublicApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PublicApi(configuration);

let code: string; //Code de la compétence (default to undefined)
let referentialId: string; //ID du référentiel (optional) (default to undefined)
let version: number; //Numéro de version (optional) (default to undefined)

const { status, data } = await apiInstance.lookupCompetencyByCodeApiCompetencePublicCompetenciesByCodeCodeGet(
    code,
    referentialId,
    version
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **code** | [**string**] | Code de la compétence | defaults to undefined|
| **referentialId** | [**string**] | ID du référentiel | (optional) defaults to undefined|
| **version** | [**number**] | Numéro de version | (optional) defaults to undefined|


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


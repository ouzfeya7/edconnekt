# DefaultApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createPdiSessionApiV1PdiSessionsPost**](#createpdisessionapiv1pdisessionspost) | **POST** /api/v1/pdi/sessions | Create Pdi Session|
|[**getPdiSessionApiV1PdiSessionsSessionIdGet**](#getpdisessionapiv1pdisessionssessionidget) | **GET** /api/v1/pdi/sessions/{session_id} | Get Pdi Session|
|[**getPdiStatsApiV1PdiStatsGet**](#getpdistatsapiv1pdistatsget) | **GET** /api/v1/pdi/stats | Get Pdi Stats|
|[**healthCheckDbHealthDbGet**](#healthcheckdbhealthdbget) | **GET** /health/db | Health Check Db|
|[**healthCheckHealthGet**](#healthcheckhealthget) | **GET** /health | Health Check|
|[**listPdiSessionsApiV1PdiSessionsGet**](#listpdisessionsapiv1pdisessionsget) | **GET** /api/v1/pdi/sessions | List Pdi Sessions|
|[**requestReportGenerationApiV1PdiSessionsSessionIdReportPost**](#requestreportgenerationapiv1pdisessionssessionidreportpost) | **POST** /api/v1/pdi/sessions/{session_id}/report | Request Report Generation|
|[**updatePdiSessionApiV1PdiSessionsSessionIdPatch**](#updatepdisessionapiv1pdisessionssessionidpatch) | **PATCH** /api/v1/pdi/sessions/{session_id} | Update Pdi Session|
|[**updateStudentStatusApiV1PdiSessionsSessionIdStudentsStudentIdPatch**](#updatestudentstatusapiv1pdisessionssessionidstudentsstudentidpatch) | **PATCH** /api/v1/pdi/sessions/{session_id}/students/{student_id} | Update Student Status|

# **createPdiSessionApiV1PdiSessionsPost**
> PDISessionOut createPdiSessionApiV1PdiSessionsPost(pDISessionWithStudentsCreate)

Créer une nouvelle séance PDI avec les statuts des élèves

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    PDISessionWithStudentsCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let pDISessionWithStudentsCreate: PDISessionWithStudentsCreate; //

const { status, data } = await apiInstance.createPdiSessionApiV1PdiSessionsPost(
    pDISessionWithStudentsCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pDISessionWithStudentsCreate** | **PDISessionWithStudentsCreate**|  | |


### Return type

**PDISessionOut**

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

# **getPdiSessionApiV1PdiSessionsSessionIdGet**
> PDISessionWithStudentsOut getPdiSessionApiV1PdiSessionsSessionIdGet()

Récupérer une séance PDI par son ID

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let sessionId: string; // (default to undefined)

const { status, data } = await apiInstance.getPdiSessionApiV1PdiSessionsSessionIdGet(
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sessionId** | [**string**] |  | defaults to undefined|


### Return type

**PDISessionWithStudentsOut**

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

# **getPdiStatsApiV1PdiStatsGet**
> PDISessionStats getPdiStatsApiV1PdiStatsGet()

Récupérer les statistiques des séances PDI

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let teacherId: string; //ID de l\'enseignant (optional) (default to undefined)
let schoolId: string; //ID de l\'établissement (optional) (default to undefined)

const { status, data } = await apiInstance.getPdiStatsApiV1PdiStatsGet(
    teacherId,
    schoolId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teacherId** | [**string**] | ID de l\&#39;enseignant | (optional) defaults to undefined|
| **schoolId** | [**string**] | ID de l\&#39;établissement | (optional) defaults to undefined|


### Return type

**PDISessionStats**

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

# **healthCheckDbHealthDbGet**
> any healthCheckDbHealthDbGet()

Vérification de la base de données

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.healthCheckDbHealthDbGet();
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

# **healthCheckHealthGet**
> any healthCheckHealthGet()

Vérification de l\'état du service

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.healthCheckHealthGet();
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

# **listPdiSessionsApiV1PdiSessionsGet**
> Array<PDISessionOut> listPdiSessionsApiV1PdiSessionsGet()

Lister les séances PDI avec filtres

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let schoolId: string; //ID de l\'établissement (optional) (default to undefined)
let classId: string; //ID de la classe (optional) (default to undefined)
let teacherId: string; //ID de l\'enseignant (optional) (default to undefined)
let sessionDateFrom: string; //Date de début (optional) (default to undefined)
let sessionDateTo: string; //Date de fin (optional) (default to undefined)
let evaluationPeriod: string; //Période d\'évaluation (optional) (default to undefined)
let reportStatus: ReportStatusEnum; //Statut du rapport (optional) (default to undefined)
let limit: number; //Nombre maximum de résultats (optional) (default to 50)
let offset: number; //Offset pour la pagination (optional) (default to 0)

const { status, data } = await apiInstance.listPdiSessionsApiV1PdiSessionsGet(
    schoolId,
    classId,
    teacherId,
    sessionDateFrom,
    sessionDateTo,
    evaluationPeriod,
    reportStatus,
    limit,
    offset
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **schoolId** | [**string**] | ID de l\&#39;établissement | (optional) defaults to undefined|
| **classId** | [**string**] | ID de la classe | (optional) defaults to undefined|
| **teacherId** | [**string**] | ID de l\&#39;enseignant | (optional) defaults to undefined|
| **sessionDateFrom** | [**string**] | Date de début | (optional) defaults to undefined|
| **sessionDateTo** | [**string**] | Date de fin | (optional) defaults to undefined|
| **evaluationPeriod** | [**string**] | Période d\&#39;évaluation | (optional) defaults to undefined|
| **reportStatus** | **ReportStatusEnum** | Statut du rapport | (optional) defaults to undefined|
| **limit** | [**number**] | Nombre maximum de résultats | (optional) defaults to 50|
| **offset** | [**number**] | Offset pour la pagination | (optional) defaults to 0|


### Return type

**Array<PDISessionOut>**

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

# **requestReportGenerationApiV1PdiSessionsSessionIdReportPost**
> ReportGenerationResponse requestReportGenerationApiV1PdiSessionsSessionIdReportPost()

Demander la génération d\'un rapport pour une séance PDI

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let sessionId: string; // (default to undefined)

const { status, data } = await apiInstance.requestReportGenerationApiV1PdiSessionsSessionIdReportPost(
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sessionId** | [**string**] |  | defaults to undefined|


### Return type

**ReportGenerationResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**202** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updatePdiSessionApiV1PdiSessionsSessionIdPatch**
> PDISessionOut updatePdiSessionApiV1PdiSessionsSessionIdPatch(requestBody)

Mettre à jour une séance PDI en utilisant JSON-Patch (RFC 6902)

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let sessionId: string; // (default to undefined)
let requestBody: Array<{ [key: string]: any; }>; //

const { status, data } = await apiInstance.updatePdiSessionApiV1PdiSessionsSessionIdPatch(
    sessionId,
    requestBody
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **requestBody** | **Array<{ [key: string]: any; }>**|  | |
| **sessionId** | [**string**] |  | defaults to undefined|


### Return type

**PDISessionOut**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json-patch+json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateStudentStatusApiV1PdiSessionsSessionIdStudentsStudentIdPatch**
> PDIStudentStatusOut updateStudentStatusApiV1PdiSessionsSessionIdStudentsStudentIdPatch(pDIStudentStatusUpdate)

Mettre à jour le statut d\'un élève pour une séance PDI

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    PDIStudentStatusUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let sessionId: string; // (default to undefined)
let studentId: string; // (default to undefined)
let pDIStudentStatusUpdate: PDIStudentStatusUpdate; //

const { status, data } = await apiInstance.updateStudentStatusApiV1PdiSessionsSessionIdStudentsStudentIdPatch(
    sessionId,
    studentId,
    pDIStudentStatusUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pDIStudentStatusUpdate** | **PDIStudentStatusUpdate**|  | |
| **sessionId** | [**string**] |  | defaults to undefined|
| **studentId** | [**string**] |  | defaults to undefined|


### Return type

**PDIStudentStatusOut**

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


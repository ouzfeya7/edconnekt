# ClassesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**archiveClasseApiV1ClassesClasseIdDelete**](#archiveclasseapiv1classesclasseiddelete) | **DELETE** /api/v1/classes/{classe_id} | Archive Classe|
|[**assignEleveApiV1ClassesElevesPost**](#assigneleveapiv1classeselevespost) | **POST** /api/v1/classes/eleves | Assign Eleve|
|[**assignEnseignantApiV1ClassesEnseignantsPost**](#assignenseignantapiv1classesenseignantspost) | **POST** /api/v1/classes/enseignants | Assign Enseignant|
|[**createClasseApiV1ClassesPost**](#createclasseapiv1classespost) | **POST** /api/v1/classes/ | Create Classe|
|[**getAuditsApiV1ClassesClasseIdAuditsGet**](#getauditsapiv1classesclasseidauditsget) | **GET** /api/v1/classes/{classe_id}/audits | Get Audits|
|[**getClasseApiV1ClassesClasseIdGet**](#getclasseapiv1classesclasseidget) | **GET** /api/v1/classes/{classe_id} | Get Classe|
|[**getClassesApiV1ClassesGet**](#getclassesapiv1classesget) | **GET** /api/v1/classes/ | Get Classes|
|[**getElevesApiV1ClassesClasseIdElevesGet**](#getelevesapiv1classesclasseidelevesget) | **GET** /api/v1/classes/{classe_id}/eleves | Get Eleves|
|[**getEnseignantsApiV1ClassesClasseIdEnseignantsGet**](#getenseignantsapiv1classesclasseidenseignantsget) | **GET** /api/v1/classes/{classe_id}/enseignants | Get Enseignants|
|[**getHistoryApiV1ClassesClasseIdHistoryGet**](#gethistoryapiv1classesclasseidhistoryget) | **GET** /api/v1/classes/{classe_id}/history | Get History|
|[**getStatisticsApiV1ClassesClasseIdStatisticsGet**](#getstatisticsapiv1classesclasseidstatisticsget) | **GET** /api/v1/classes/{classe_id}/statistics | Get Statistics|
|[**updateClasseApiV1ClassesClasseIdPatch**](#updateclasseapiv1classesclasseidpatch) | **PATCH** /api/v1/classes/{classe_id} | Update Classe|

# **archiveClasseApiV1ClassesClasseIdDelete**
> any archiveClasseApiV1ClassesClasseIdDelete()

Archive une classe (soft delete).

### Example

```typescript
import {
    ClassesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassesApi(configuration);

let classeId: string; // (default to undefined)

const { status, data } = await apiInstance.archiveClasseApiV1ClassesClasseIdDelete(
    classeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classeId** | [**string**] |  | defaults to undefined|


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

# **assignEleveApiV1ClassesElevesPost**
> ClasseEleveOut assignEleveApiV1ClassesElevesPost(classeEleveCreate)

Affecte un élève à une classe.

### Example

```typescript
import {
    ClassesApi,
    Configuration,
    ClasseEleveCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassesApi(configuration);

let classeEleveCreate: ClasseEleveCreate; //

const { status, data } = await apiInstance.assignEleveApiV1ClassesElevesPost(
    classeEleveCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classeEleveCreate** | **ClasseEleveCreate**|  | |


### Return type

**ClasseEleveOut**

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

# **assignEnseignantApiV1ClassesEnseignantsPost**
> ClasseEnseignantOut assignEnseignantApiV1ClassesEnseignantsPost(classeEnseignantCreate)

Affecte un enseignant à une classe.

### Example

```typescript
import {
    ClassesApi,
    Configuration,
    ClasseEnseignantCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassesApi(configuration);

let classeEnseignantCreate: ClasseEnseignantCreate; //

const { status, data } = await apiInstance.assignEnseignantApiV1ClassesEnseignantsPost(
    classeEnseignantCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classeEnseignantCreate** | **ClasseEnseignantCreate**|  | |


### Return type

**ClasseEnseignantOut**

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

# **createClasseApiV1ClassesPost**
> any createClasseApiV1ClassesPost(classeCreateFlexible)

Crée une ou plusieurs classes  Accepte soit une classe unique, soit une liste de classes. En cas d\'erreur sur une seule classe, toutes sont annulées (rollback complet).

### Example

```typescript
import {
    ClassesApi,
    Configuration,
    ClasseCreateFlexible
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassesApi(configuration);

let classeCreateFlexible: ClasseCreateFlexible; //

const { status, data } = await apiInstance.createClasseApiV1ClassesPost(
    classeCreateFlexible
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classeCreateFlexible** | **ClasseCreateFlexible**|  | |


### Return type

**any**

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

# **getAuditsApiV1ClassesClasseIdAuditsGet**
> Array<ClasseAuditOut> getAuditsApiV1ClassesClasseIdAuditsGet()

Récupère l\'historique d\'audit d\'une classe.

### Example

```typescript
import {
    ClassesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassesApi(configuration);

let classeId: string; // (default to undefined)

const { status, data } = await apiInstance.getAuditsApiV1ClassesClasseIdAuditsGet(
    classeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classeId** | [**string**] |  | defaults to undefined|


### Return type

**Array<ClasseAuditOut>**

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

# **getClasseApiV1ClassesClasseIdGet**
> ClasseOut getClasseApiV1ClassesClasseIdGet()

Récupère une classe par son ID.

### Example

```typescript
import {
    ClassesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassesApi(configuration);

let classeId: string; // (default to undefined)

const { status, data } = await apiInstance.getClasseApiV1ClassesClasseIdGet(
    classeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classeId** | [**string**] |  | defaults to undefined|


### Return type

**ClasseOut**

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

# **getClassesApiV1ClassesGet**
> StandardResponseListClasseOut getClassesApiV1ClassesGet()

Liste les classes avec filtres et pagination.

### Example

```typescript
import {
    ClassesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassesApi(configuration);

let etablissementId: string; // (default to undefined)
let skip: number; // (optional) (default to 0)
let limit: number; // (optional) (default to 100)
let nom: string; // (optional) (default to undefined)
let niveau: string; // (optional) (default to undefined)
let isArchived: boolean; // (optional) (default to false)
let status: string; //Filtrer par status: actif, inactif, archive (optional) (default to undefined)

const { status, data } = await apiInstance.getClassesApiV1ClassesGet(
    etablissementId,
    skip,
    limit,
    nom,
    niveau,
    isArchived,
    status
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **etablissementId** | [**string**] |  | defaults to undefined|
| **skip** | [**number**] |  | (optional) defaults to 0|
| **limit** | [**number**] |  | (optional) defaults to 100|
| **nom** | [**string**] |  | (optional) defaults to undefined|
| **niveau** | [**string**] |  | (optional) defaults to undefined|
| **isArchived** | [**boolean**] |  | (optional) defaults to false|
| **status** | [**string**] | Filtrer par status: actif, inactif, archive | (optional) defaults to undefined|


### Return type

**StandardResponseListClasseOut**

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

# **getElevesApiV1ClassesClasseIdElevesGet**
> Array<ClasseEleveOut> getElevesApiV1ClassesClasseIdElevesGet()

Récupère tous les élèves d\'une classe.

### Example

```typescript
import {
    ClassesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassesApi(configuration);

let classeId: string; // (default to undefined)

const { status, data } = await apiInstance.getElevesApiV1ClassesClasseIdElevesGet(
    classeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classeId** | [**string**] |  | defaults to undefined|


### Return type

**Array<ClasseEleveOut>**

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

# **getEnseignantsApiV1ClassesClasseIdEnseignantsGet**
> Array<ClasseEnseignantOut> getEnseignantsApiV1ClassesClasseIdEnseignantsGet()

Récupère tous les enseignants d\'une classe.

### Example

```typescript
import {
    ClassesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassesApi(configuration);

let classeId: string; // (default to undefined)

const { status, data } = await apiInstance.getEnseignantsApiV1ClassesClasseIdEnseignantsGet(
    classeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classeId** | [**string**] |  | defaults to undefined|


### Return type

**Array<ClasseEnseignantOut>**

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

# **getHistoryApiV1ClassesClasseIdHistoryGet**
> Array<ClasseHistoryOut> getHistoryApiV1ClassesClasseIdHistoryGet()

Récupère l\'historique complet d\'une classe.

### Example

```typescript
import {
    ClassesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassesApi(configuration);

let classeId: string; // (default to undefined)

const { status, data } = await apiInstance.getHistoryApiV1ClassesClasseIdHistoryGet(
    classeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classeId** | [**string**] |  | defaults to undefined|


### Return type

**Array<ClasseHistoryOut>**

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

# **getStatisticsApiV1ClassesClasseIdStatisticsGet**
> StandardResponseClasseStatistics getStatisticsApiV1ClassesClasseIdStatisticsGet()

Récupère les statistiques d\'une classe.

### Example

```typescript
import {
    ClassesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassesApi(configuration);

let classeId: string; // (default to undefined)

const { status, data } = await apiInstance.getStatisticsApiV1ClassesClasseIdStatisticsGet(
    classeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classeId** | [**string**] |  | defaults to undefined|


### Return type

**StandardResponseClasseStatistics**

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

# **updateClasseApiV1ClassesClasseIdPatch**
> ClasseOut updateClasseApiV1ClassesClasseIdPatch(classeUpdate)

Met à jour une classe.

### Example

```typescript
import {
    ClassesApi,
    Configuration,
    ClasseUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new ClassesApi(configuration);

let classeId: string; // (default to undefined)
let classeUpdate: ClasseUpdate; //

const { status, data } = await apiInstance.updateClasseApiV1ClassesClasseIdPatch(
    classeId,
    classeUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **classeUpdate** | **ClasseUpdate**|  | |
| **classeId** | [**string**] |  | defaults to undefined|


### Return type

**ClasseOut**

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


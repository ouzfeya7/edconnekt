# AdmissionsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createAdmissionApiV1AdmissionsPost**](#createadmissionapiv1admissionspost) | **POST** /api/v1/admissions/ | Create Admission|
|[**deleteAdmissionApiV1AdmissionsAdmissionIdDelete**](#deleteadmissionapiv1admissionsadmissioniddelete) | **DELETE** /api/v1/admissions/{admission_id} | Delete Admission|
|[**getAdmissionApiV1AdmissionsAdmissionIdGet**](#getadmissionapiv1admissionsadmissionidget) | **GET** /api/v1/admissions/{admission_id} | Get Admission|
|[**getAdmissionStatsApiV1AdmissionsStatsSummaryGet**](#getadmissionstatsapiv1admissionsstatssummaryget) | **GET** /api/v1/admissions/stats/summary | Get Admission Stats|
|[**getAdmissionsApiV1AdmissionsGet**](#getadmissionsapiv1admissionsget) | **GET** /api/v1/admissions/ | Get Admissions|
|[**updateAdmissionApiV1AdmissionsAdmissionIdPut**](#updateadmissionapiv1admissionsadmissionidput) | **PUT** /api/v1/admissions/{admission_id} | Update Admission|
|[**updateAdmissionStatusApiV1AdmissionsAdmissionIdStatusPatch**](#updateadmissionstatusapiv1admissionsadmissionidstatuspatch) | **PATCH** /api/v1/admissions/{admission_id}/status | Update Admission Status|

# **createAdmissionApiV1AdmissionsPost**
> AdmissionResponse createAdmissionApiV1AdmissionsPost(admissionCreateRequest)

Créer une nouvelle admission.  **Authentification requise** : Headers X-User, X-Roles, X-Etab obligatoires.  - **student_name**: Nom complet de l\'élève (requis) - **student_birthdate**: Date de naissance de l\'élève (requis) - **class_requested**: Classe demandée (requis) - **parent_name**: Nom du parent/tuteur (requis) - **parent_contact**: Contact du parent (email ou téléphone) (requis) - **student_email**: Email de l\'élève (optionnel) - **student_phone**: Téléphone de l\'élève (optionnel) - **parent_email**: Email du parent (optionnel) - **parent_phone**: Téléphone du parent (optionnel) - **notes**: Notes additionnelles (optionnel) - **attachments**: Liste des chemins des fichiers joints (optionnel) - **captcha_token**: Token reCAPTCHA v3 pour validation anti-spam (requis)  Le statut sera automatiquement défini sur \'PENDING\'. L\'admission sera automatiquement associée à l\'établissement (tenant_id) de l\'utilisateur.

### Example

```typescript
import {
    AdmissionsApi,
    Configuration,
    AdmissionCreateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdmissionsApi(configuration);

let admissionCreateRequest: AdmissionCreateRequest; //

const { status, data } = await apiInstance.createAdmissionApiV1AdmissionsPost(
    admissionCreateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **admissionCreateRequest** | **AdmissionCreateRequest**|  | |


### Return type

**AdmissionResponse**

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

# **deleteAdmissionApiV1AdmissionsAdmissionIdDelete**
> deleteAdmissionApiV1AdmissionsAdmissionIdDelete()

Supprimer une admission.  - **admission_id**: ID de l\'admission à supprimer  Retourne une erreur 404 si l\'admission n\'existe pas.

### Example

```typescript
import {
    AdmissionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdmissionsApi(configuration);

let admissionId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteAdmissionApiV1AdmissionsAdmissionIdDelete(
    admissionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **admissionId** | [**number**] |  | defaults to undefined|


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

# **getAdmissionApiV1AdmissionsAdmissionIdGet**
> AdmissionResponse getAdmissionApiV1AdmissionsAdmissionIdGet()

Récupérer les détails d\'une admission spécifique.  - **admission_id**: ID de l\'admission à récupérer  Retourne une erreur 404 si l\'admission n\'existe pas.

### Example

```typescript
import {
    AdmissionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdmissionsApi(configuration);

let admissionId: number; // (default to undefined)

const { status, data } = await apiInstance.getAdmissionApiV1AdmissionsAdmissionIdGet(
    admissionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **admissionId** | [**number**] |  | defaults to undefined|


### Return type

**AdmissionResponse**

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

# **getAdmissionStatsApiV1AdmissionsStatsSummaryGet**
> object getAdmissionStatsApiV1AdmissionsStatsSummaryGet()

Récupérer les statistiques des admissions (filtrées par établissement).  Retourne le nombre total d\'admissions et la répartition par statut pour l\'établissement de l\'utilisateur connecté.

### Example

```typescript
import {
    AdmissionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdmissionsApi(configuration);

const { status, data } = await apiInstance.getAdmissionStatsApiV1AdmissionsStatsSummaryGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**object**

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

# **getAdmissionsApiV1AdmissionsGet**
> AdmissionListResponse getAdmissionsApiV1AdmissionsGet()

Récupérer la liste des admissions avec pagination et filtres.  - **page**: Numéro de page (défaut: 1) - **limit**: Nombre d\'éléments par page (défaut: 10, max: 100) - **status**: Filtrer par statut (PENDING, ACCEPTED, REJECTED, WAITLIST) - **class_requested**: Filtrer par classe demandée - **student_name**: Filtrer par nom d\'élève - **parent_name**: Filtrer par nom de parent  Les résultats sont filtrés par établissement (tenant_id) automatiquement. Les résultats sont triés par date de création (plus récent en premier).

### Example

```typescript
import {
    AdmissionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdmissionsApi(configuration);

let page: number; //Numéro de page (optional) (default to 1)
let limit: number; //Nombre d\'éléments par page (optional) (default to 10)
let statusFilter: AdmissionStatus; //Filtrer par statut (optional) (default to undefined)
let classRequested: string; //Filtrer par classe demandée (optional) (default to undefined)
let studentName: string; //Filtrer par nom d\'élève (optional) (default to undefined)
let parentName: string; //Filtrer par nom de parent (optional) (default to undefined)

const { status, data } = await apiInstance.getAdmissionsApiV1AdmissionsGet(
    page,
    limit,
    statusFilter,
    classRequested,
    studentName,
    parentName
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Numéro de page | (optional) defaults to 1|
| **limit** | [**number**] | Nombre d\&#39;éléments par page | (optional) defaults to 10|
| **statusFilter** | **AdmissionStatus** | Filtrer par statut | (optional) defaults to undefined|
| **classRequested** | [**string**] | Filtrer par classe demandée | (optional) defaults to undefined|
| **studentName** | [**string**] | Filtrer par nom d\&#39;élève | (optional) defaults to undefined|
| **parentName** | [**string**] | Filtrer par nom de parent | (optional) defaults to undefined|


### Return type

**AdmissionListResponse**

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

# **updateAdmissionApiV1AdmissionsAdmissionIdPut**
> AdmissionResponse updateAdmissionApiV1AdmissionsAdmissionIdPut(admissionUpdate)

Mettre à jour une admission complète.  - **admission_id**: ID de l\'admission à mettre à jour - Tous les champs de l\'admission peuvent être mis à jour  Met automatiquement à jour le champ `updated_at`.

### Example

```typescript
import {
    AdmissionsApi,
    Configuration,
    AdmissionUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new AdmissionsApi(configuration);

let admissionId: number; // (default to undefined)
let admissionUpdate: AdmissionUpdate; //

const { status, data } = await apiInstance.updateAdmissionApiV1AdmissionsAdmissionIdPut(
    admissionId,
    admissionUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **admissionUpdate** | **AdmissionUpdate**|  | |
| **admissionId** | [**number**] |  | defaults to undefined|


### Return type

**AdmissionResponse**

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

# **updateAdmissionStatusApiV1AdmissionsAdmissionIdStatusPatch**
> AdmissionResponse updateAdmissionStatusApiV1AdmissionsAdmissionIdStatusPatch(admissionStatusUpdate)

Mettre à jour le statut d\'une admission.  - **admission_id**: ID de l\'admission à mettre à jour - **status**: Nouveau statut (ACCEPTED, REJECTED, WAITLIST) - **admin_notes**: Notes de l\'administrateur (optionnel) - **reviewed_by**: Nom de l\'administrateur (optionnel)  Met automatiquement à jour les champs `reviewed_at` et `updated_at`.

### Example

```typescript
import {
    AdmissionsApi,
    Configuration,
    AdmissionStatusUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new AdmissionsApi(configuration);

let admissionId: number; // (default to undefined)
let admissionStatusUpdate: AdmissionStatusUpdate; //

const { status, data } = await apiInstance.updateAdmissionStatusApiV1AdmissionsAdmissionIdStatusPatch(
    admissionId,
    admissionStatusUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **admissionStatusUpdate** | **AdmissionStatusUpdate**|  | |
| **admissionId** | [**number**] |  | defaults to undefined|


### Return type

**AdmissionResponse**

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


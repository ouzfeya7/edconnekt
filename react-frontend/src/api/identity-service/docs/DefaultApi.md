# DefaultApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**bulkImportIdentitiesApiV1IdentityBulkimportPost**](#bulkimportidentitiesapiv1identitybulkimportpost) | **POST** /api/v1/identity/bulkimport | Bulk Import Identities|
|[**cancelBulkImportApiV1IdentityBulkimportCancelBatchIdPost**](#cancelbulkimportapiv1identitybulkimportcancelbatchidpost) | **POST** /api/v1/identity/bulkimport/cancel/{batch_id} | Cancel Bulk Import|
|[**createIdentityApiV1IdentityIdentitiesPost**](#createidentityapiv1identityidentitiespost) | **POST** /api/v1/identity/identities | Create Identity|
|[**deleteIdentityApiV1IdentityIdentitiesIdentityIdDelete**](#deleteidentityapiv1identityidentitiesidentityiddelete) | **DELETE** /api/v1/identity/identities/{identity_id} | Delete Identity|
|[**getAuditHistoryApiV1IdentityBulkimportAuditGet**](#getaudithistoryapiv1identitybulkimportauditget) | **GET** /api/v1/identity/bulkimport/audit | Get Audit History|
|[**getBulkImportProgressApiV1IdentityBulkimportProgressBatchIdGet**](#getbulkimportprogressapiv1identitybulkimportprogressbatchidget) | **GET** /api/v1/identity/bulkimport/progress/{batch_id} | Get Bulk Import Progress|
|[**getCsvTemplateApiV1IdentityBulkimportTemplateDomainGet**](#getcsvtemplateapiv1identitybulkimporttemplatedomainget) | **GET** /api/v1/identity/bulkimport/template/{domain} | Get Csv Template|
|[**getIdentityApiV1IdentityIdentitiesIdentityIdGet**](#getidentityapiv1identityidentitiesidentityidget) | **GET** /api/v1/identity/identities/{identity_id} | Get Identity|
|[**getSseStatsApiV1IdentityBulkimportSseStatsGet**](#getssestatsapiv1identitybulkimportssestatsget) | **GET** /api/v1/identity/bulkimport/sse/stats | Get Sse Stats|
|[**getUserEstablishmentsApiV1IdentityMeEstablishmentsGet**](#getuserestablishmentsapiv1identitymeestablishmentsget) | **GET** /api/v1/identity/me/establishments | Get User Establishments|
|[**getUserRolesInEstablishmentApiV1IdentityMeRolesGet**](#getuserrolesinestablishmentapiv1identitymerolesget) | **GET** /api/v1/identity/me/roles | Get User Roles In Establishment|
|[**healthCheckHealthGet**](#healthcheckhealthget) | **GET** /health | Health Check|
|[**linkIdentityToEstablishmentApiV1IdentityIdentitiesIdentityIdEstablishmentsPost**](#linkidentitytoestablishmentapiv1identityidentitiesidentityidestablishmentspost) | **POST** /api/v1/identity/identities/{identity_id}/establishments | Link Identity To Establishment|
|[**listIdentitiesApiV1IdentityIdentitiesGet**](#listidentitiesapiv1identityidentitiesget) | **GET** /api/v1/identity/identities | List Identities|
|[**rootGet**](#rootget) | **GET** / | Root|
|[**sseOptionsApiV1IdentityBulkimportStreamBatchIdOptions**](#sseoptionsapiv1identitybulkimportstreambatchidoptions) | **OPTIONS** /api/v1/identity/bulkimport/stream/{batch_id} | Sse Options|
|[**streamBatchProgressApiV1IdentityBulkimportStreamBatchIdGet**](#streambatchprogressapiv1identitybulkimportstreambatchidget) | **GET** /api/v1/identity/bulkimport/stream/{batch_id} | Stream Batch Progress|
|[**unlinkIdentityFromEstablishmentApiV1IdentityIdentitiesIdentityIdEstablishmentsEstablishmentIdDelete**](#unlinkidentityfromestablishmentapiv1identityidentitiesidentityidestablishmentsestablishmentiddelete) | **DELETE** /api/v1/identity/identities/{identity_id}/establishments/{establishment_id} | Unlink Identity From Establishment|
|[**updateIdentityApiV1IdentityIdentitiesIdentityIdPut**](#updateidentityapiv1identityidentitiesidentityidput) | **PUT** /api/v1/identity/identities/{identity_id} | Update Identity|

# **bulkImportIdentitiesApiV1IdentityBulkimportPost**
> BulkImportResponse bulkImportIdentitiesApiV1IdentityBulkimportPost()

Import en masse d\'identités via fichier CSV.  Accepte les formats CSV avec les schémas suivants : - **students.csv** : establishment_id;firstname;lastname;birth_date;gender;level;account_required;email;phone - **parents.csv** : establishment_id;firstname;lastname;email;phone - **teachers.csv** : establishment_id;firstname;lastname;email;phone;subject;hire_date - **admin_staff.csv** : establishment_id;firstname;lastname;email;phone;position;hire_date  Note: L\'external_id (ID Keycloak) sera automatiquement généré lors de la création du compte.  Le domaine est automatiquement détecté à partir des en-têtes du CSV.

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let file: File; //Fichier CSV à importer (default to undefined)
let establishmentId: string; //ID de l\\\'établissement (default to undefined)
let sourceFileUrl: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.bulkImportIdentitiesApiV1IdentityBulkimportPost(
    file,
    establishmentId,
    sourceFileUrl
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **file** | [**File**] | Fichier CSV à importer | defaults to undefined|
| **establishmentId** | [**string**] | ID de l\\\&#39;établissement | defaults to undefined|
| **sourceFileUrl** | [**string**] |  | (optional) defaults to undefined|


### Return type

**BulkImportResponse**

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

# **cancelBulkImportApiV1IdentityBulkimportCancelBatchIdPost**
> any cancelBulkImportApiV1IdentityBulkimportCancelBatchIdPost()

Annule un batch d\'import en cours.  Args:     batch_id: ID du batch

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let batchId: string; // (default to undefined)

const { status, data } = await apiInstance.cancelBulkImportApiV1IdentityBulkimportCancelBatchIdPost(
    batchId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchId** | [**string**] |  | defaults to undefined|


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

# **createIdentityApiV1IdentityIdentitiesPost**
> IdentityResponse createIdentityApiV1IdentityIdentitiesPost(identityCreate)

Crée une nouvelle identité.  Args:     identity_data: Données de l\'identité à créer     request: Requête HTTP     identity_crud_service: Service CRUD des identités      Returns:     IdentityResponse: Identité créée

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    IdentityCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let identityCreate: IdentityCreate; //

const { status, data } = await apiInstance.createIdentityApiV1IdentityIdentitiesPost(
    identityCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **identityCreate** | **IdentityCreate**|  | |


### Return type

**IdentityResponse**

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

# **deleteIdentityApiV1IdentityIdentitiesIdentityIdDelete**
> any deleteIdentityApiV1IdentityIdentitiesIdentityIdDelete()

Supprime une identité.  Args:     identity_id: ID de l\'identité à supprimer     request: Requête HTTP     identity_crud_service: Service CRUD des identités      Returns:     Dict: Message de confirmation

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let identityId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteIdentityApiV1IdentityIdentitiesIdentityIdDelete(
    identityId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **identityId** | [**string**] |  | defaults to undefined|


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

# **getAuditHistoryApiV1IdentityBulkimportAuditGet**
> any getAuditHistoryApiV1IdentityBulkimportAuditGet()

Récupère l\'historique d\'audit des opérations de bulk import.  Args:     user_id: Filtrer par utilisateur     establishment_id: Filtrer par établissement     batch_id: Filtrer par batch     limit: Limite du nombre de résultats

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userId: string; // (optional) (default to undefined)
let establishmentId: string; // (optional) (default to undefined)
let batchId: string; // (optional) (default to undefined)
let limit: number; // (optional) (default to 100)

const { status, data } = await apiInstance.getAuditHistoryApiV1IdentityBulkimportAuditGet(
    userId,
    establishmentId,
    batchId,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] |  | (optional) defaults to undefined|
| **establishmentId** | [**string**] |  | (optional) defaults to undefined|
| **batchId** | [**string**] |  | (optional) defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to 100|


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

# **getBulkImportProgressApiV1IdentityBulkimportProgressBatchIdGet**
> any getBulkImportProgressApiV1IdentityBulkimportProgressBatchIdGet()

Récupère la progression d\'un batch d\'import.  Args:     batch_id: ID du batch

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let batchId: string; // (default to undefined)

const { status, data } = await apiInstance.getBulkImportProgressApiV1IdentityBulkimportProgressBatchIdGet(
    batchId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchId** | [**string**] |  | defaults to undefined|


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

# **getCsvTemplateApiV1IdentityBulkimportTemplateDomainGet**
> any getCsvTemplateApiV1IdentityBulkimportTemplateDomainGet()

Récupère un template CSV pour un domaine donné.  Args:     domain: Domaine (student, parent, teacher, admin_staff)

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let domain: string; // (default to undefined)

const { status, data } = await apiInstance.getCsvTemplateApiV1IdentityBulkimportTemplateDomainGet(
    domain
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **domain** | [**string**] |  | defaults to undefined|


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

# **getIdentityApiV1IdentityIdentitiesIdentityIdGet**
> IdentityResponse getIdentityApiV1IdentityIdentitiesIdentityIdGet()

Récupère une identité par son ID.  Args:     identity_id: ID de l\'identité     request: Requête HTTP     identity_crud_service: Service CRUD des identités      Returns:     IdentityResponse: Identité trouvée

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let identityId: string; // (default to undefined)

const { status, data } = await apiInstance.getIdentityApiV1IdentityIdentitiesIdentityIdGet(
    identityId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **identityId** | [**string**] |  | defaults to undefined|


### Return type

**IdentityResponse**

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

# **getSseStatsApiV1IdentityBulkimportSseStatsGet**
> any getSseStatsApiV1IdentityBulkimportSseStatsGet()

Récupère les statistiques des connexions SSE.  Returns:     Dict: Statistiques des connexions

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.getSseStatsApiV1IdentityBulkimportSseStatsGet();
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

# **getUserEstablishmentsApiV1IdentityMeEstablishmentsGet**
> UserEstablishmentsResponse getUserEstablishmentsApiV1IdentityMeEstablishmentsGet()

Récupère la liste des établissements de l\'utilisateur connecté.  Source: identity_establishment(identity_id, establishment_id) Retourne 403 si aucun rattachement.  Args:     current_user: Utilisateur connecté     identity_crud_service: Service CRUD des identités      Returns:     UserEstablishmentsResponse: Liste des établissements avec leurs rôles

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.getUserEstablishmentsApiV1IdentityMeEstablishmentsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UserEstablishmentsResponse**

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

# **getUserRolesInEstablishmentApiV1IdentityMeRolesGet**
> UserRolesResponse getUserRolesInEstablishmentApiV1IdentityMeRolesGet()

Récupère les rôles de l\'utilisateur dans un établissement spécifique.  Source: identity_establishment.role (ENUM: student|parent|teacher|admin_staff) Retourne 403 si l\'utilisateur n\'est pas rattaché à l\'établissement.  Args:     etab: UUID de l\'établissement     current_user: Utilisateur connecté     identity_crud_service: Service CRUD des identités      Returns:     UserRolesResponse: Rôles de l\'utilisateur dans l\'établissement

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let etab: string; //UUID de l\'établissement (default to undefined)

const { status, data } = await apiInstance.getUserRolesInEstablishmentApiV1IdentityMeRolesGet(
    etab
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **etab** | [**string**] | UUID de l\&#39;établissement | defaults to undefined|


### Return type

**UserRolesResponse**

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

# **healthCheckHealthGet**
> any healthCheckHealthGet()

Endpoint de vérification de santé du service.

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

# **linkIdentityToEstablishmentApiV1IdentityIdentitiesIdentityIdEstablishmentsPost**
> any linkIdentityToEstablishmentApiV1IdentityIdentitiesIdentityIdEstablishmentsPost(establishmentLinkCreate)

Lie une identité à un établissement.  Args:     identity_id: ID de l\'identité     link_data: Données du lien     request: Requête HTTP     identity_crud_service: Service CRUD des identités      Returns:     Dict: Message de confirmation

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    EstablishmentLinkCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let identityId: string; // (default to undefined)
let establishmentLinkCreate: EstablishmentLinkCreate; //

const { status, data } = await apiInstance.linkIdentityToEstablishmentApiV1IdentityIdentitiesIdentityIdEstablishmentsPost(
    identityId,
    establishmentLinkCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **establishmentLinkCreate** | **EstablishmentLinkCreate**|  | |
| **identityId** | [**string**] |  | defaults to undefined|


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

# **listIdentitiesApiV1IdentityIdentitiesGet**
> IdentityListResponse listIdentitiesApiV1IdentityIdentitiesGet()

Liste les identités avec pagination et filtres.  Args:     page: Numéro de page     size: Taille de la page     search: Terme de recherche global     sort_by: Champ de tri     sort_order: Ordre de tri     firstname: Filtre par prénom     lastname: Filtre par nom     email: Filtre par email     status: Filtre par statut     establishment_id: Filtre par établissement     role: Filtre par rôle     request: Requête HTTP     identity_crud_service: Service CRUD des identités      Returns:     IdentityListResponse: Liste paginée des identités

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //Numéro de page (optional) (default to 1)
let size: number; //Taille de la page (optional) (default to 10)
let search: string; //Terme de recherche global (optional) (default to undefined)
let sortBy: string; //Champ de tri (optional) (default to undefined)
let sortOrder: string; //Ordre de tri (optional) (default to undefined)
let firstname: string; //Filtrer par prénom (optional) (default to undefined)
let lastname: string; //Filtrer par nom (optional) (default to undefined)
let email: string; //Filtrer par email (optional) (default to undefined)
let status: string; //Filtrer par statut (optional) (default to undefined)
let establishmentId: string; //Filtrer par établissement (optional) (default to undefined)
let role: string; //Filtrer par rôle (optional) (default to undefined)

const { status, data } = await apiInstance.listIdentitiesApiV1IdentityIdentitiesGet(
    page,
    size,
    search,
    sortBy,
    sortOrder,
    firstname,
    lastname,
    email,
    status,
    establishmentId,
    role
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Numéro de page | (optional) defaults to 1|
| **size** | [**number**] | Taille de la page | (optional) defaults to 10|
| **search** | [**string**] | Terme de recherche global | (optional) defaults to undefined|
| **sortBy** | [**string**] | Champ de tri | (optional) defaults to undefined|
| **sortOrder** | [**string**] | Ordre de tri | (optional) defaults to undefined|
| **firstname** | [**string**] | Filtrer par prénom | (optional) defaults to undefined|
| **lastname** | [**string**] | Filtrer par nom | (optional) defaults to undefined|
| **email** | [**string**] | Filtrer par email | (optional) defaults to undefined|
| **status** | [**string**] | Filtrer par statut | (optional) defaults to undefined|
| **establishmentId** | [**string**] | Filtrer par établissement | (optional) defaults to undefined|
| **role** | [**string**] | Filtrer par rôle | (optional) defaults to undefined|


### Return type

**IdentityListResponse**

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

# **rootGet**
> any rootGet()

Endpoint racine pour vérifier que le service fonctionne.

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.rootGet();
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

# **sseOptionsApiV1IdentityBulkimportStreamBatchIdOptions**
> any sseOptionsApiV1IdentityBulkimportStreamBatchIdOptions()

Gestion des requêtes OPTIONS pour CORS.  Args:     batch_id: ID du batch      Returns:     Response: Headers CORS

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let batchId: string; // (default to undefined)

const { status, data } = await apiInstance.sseOptionsApiV1IdentityBulkimportStreamBatchIdOptions(
    batchId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchId** | [**string**] |  | defaults to undefined|


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

# **streamBatchProgressApiV1IdentityBulkimportStreamBatchIdGet**
> any streamBatchProgressApiV1IdentityBulkimportStreamBatchIdGet()

Stream Server-Sent Events pour la progression d\'un batch.  Args:     batch_id: ID du batch à suivre     timeout: Timeout en secondes (5 minutes par défaut)     request: Requête HTTP     bulk_import_service: Service de bulk import      Returns:     StreamingResponse: Flux SSE de la progression

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let batchId: string; // (default to undefined)
let timeout: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.streamBatchProgressApiV1IdentityBulkimportStreamBatchIdGet(
    batchId,
    timeout
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchId** | [**string**] |  | defaults to undefined|
| **timeout** | [**number**] |  | (optional) defaults to undefined|


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

# **unlinkIdentityFromEstablishmentApiV1IdentityIdentitiesIdentityIdEstablishmentsEstablishmentIdDelete**
> any unlinkIdentityFromEstablishmentApiV1IdentityIdentitiesIdentityIdEstablishmentsEstablishmentIdDelete()

Supprime le lien entre une identité et un établissement.  Args:     identity_id: ID de l\'identité     establishment_id: ID de l\'établissement     request: Requête HTTP     identity_crud_service: Service CRUD des identités      Returns:     Dict: Message de confirmation

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let identityId: string; // (default to undefined)
let establishmentId: string; // (default to undefined)

const { status, data } = await apiInstance.unlinkIdentityFromEstablishmentApiV1IdentityIdentitiesIdentityIdEstablishmentsEstablishmentIdDelete(
    identityId,
    establishmentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **identityId** | [**string**] |  | defaults to undefined|
| **establishmentId** | [**string**] |  | defaults to undefined|


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

# **updateIdentityApiV1IdentityIdentitiesIdentityIdPut**
> IdentityResponse updateIdentityApiV1IdentityIdentitiesIdentityIdPut(identityUpdate)

Met à jour une identité.  Args:     identity_id: ID de l\'identité à mettre à jour     identity_data: Nouvelles données     request: Requête HTTP     identity_crud_service: Service CRUD des identités      Returns:     IdentityResponse: Identité mise à jour

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    IdentityUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let identityId: string; // (default to undefined)
let identityUpdate: IdentityUpdate; //

const { status, data } = await apiInstance.updateIdentityApiV1IdentityIdentitiesIdentityIdPut(
    identityId,
    identityUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **identityUpdate** | **IdentityUpdate**|  | |
| **identityId** | [**string**] |  | defaults to undefined|


### Return type

**IdentityResponse**

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


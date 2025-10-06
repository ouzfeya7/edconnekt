# DefaultApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**bulkImportIdentitiesApiV1IdentityBulkimportPost**](#bulkimportidentitiesapiv1identitybulkimportpost) | **POST** /api/v1/identity/bulkimport | Bulk Import Identities|
|[**createIdentityApiV1IdentityPost**](#createidentityapiv1identitypost) | **POST** /api/v1/identity/ | Create Identity|
|[**createRoleAssignmentApiV1IdentityIdentitiesIdentityIdRolesPost**](#createroleassignmentapiv1identityidentitiesidentityidrolespost) | **POST** /api/v1/identity/identities/{identity_id}/roles | Create Role Assignment|
|[**deleteIdentityApiV1IdentityIdentityIdDelete**](#deleteidentityapiv1identityidentityiddelete) | **DELETE** /api/v1/identity/{identity_id} | Delete Identity|
|[**deleteRoleAssignmentApiV1IdentityIdentitiesIdentityIdRolesRoleIdDelete**](#deleteroleassignmentapiv1identityidentitiesidentityidrolesroleiddelete) | **DELETE** /api/v1/identity/identities/{identity_id}/roles/{role_id} | Delete Role Assignment|
|[**getBatchDetailsApiV1IdentityBulkimportBatchesBatchIdGet**](#getbatchdetailsapiv1identitybulkimportbatchesbatchidget) | **GET** /api/v1/identity/bulkimport/batches/{batch_id} | Get Batch Details|
|[**getBatchErrorsApiV1IdentityBulkimportBatchesBatchIdErrorsGet**](#getbatcherrorsapiv1identitybulkimportbatchesbatchiderrorsget) | **GET** /api/v1/identity/bulkimport/batches/{batch_id}/errors | Get Batch Errors|
|[**getBatchItemsApiV1IdentityBulkimportBatchesBatchIdItemsGet**](#getbatchitemsapiv1identitybulkimportbatchesbatchiditemsget) | **GET** /api/v1/identity/bulkimport/batches/{batch_id}/items | Get Batch Items|
|[**getBatchStatusApiV1IdentityBulkimportBatchesBatchIdStatusGet**](#getbatchstatusapiv1identitybulkimportbatchesbatchidstatusget) | **GET** /api/v1/identity/bulkimport/batches/{batch_id}/status | Get Batch Status|
|[**getCyclesApiV1IdentityCatalogsCycleGet**](#getcyclesapiv1identitycatalogscycleget) | **GET** /api/v1/identity/catalogs/cycle | Get Cycles|
|[**getCyclesApiV1IdentityCatalogsCyclesGet**](#getcyclesapiv1identitycatalogscyclesget) | **GET** /api/v1/identity/catalogs/cycles | Get Cycles|
|[**getIdentityApiV1IdentityIdentityIdGet**](#getidentityapiv1identityidentityidget) | **GET** /api/v1/identity/{identity_id} | Get Identity|
|[**getIdentityRolesApiV1IdentityIdentitiesIdentityIdRolesGet**](#getidentityrolesapiv1identityidentitiesidentityidrolesget) | **GET** /api/v1/identity/identities/{identity_id}/roles | Get Identity Roles|
|[**getIdentityWithRolesApiV1IdentityIdentitiesIdentityIdFullGet**](#getidentitywithrolesapiv1identityidentitiesidentityidfullget) | **GET** /api/v1/identity/identities/{identity_id}/full | Get Identity With Roles|
|[**getImportTemplateApiV1IdentityBulkimportTemplateRoleGet**](#getimporttemplateapiv1identitybulkimporttemplateroleget) | **GET** /api/v1/identity/bulkimport/template/{role} | Get Import Template|
|[**getLastCodeIdentiteApiV1IdentityLastCodeGet**](#getlastcodeidentiteapiv1identitylastcodeget) | **GET** /api/v1/identity/last-code | Get Last Code Identite|
|[**getRoleAssignmentApiV1IdentityIdentitiesIdentityIdRolesRoleIdGet**](#getroleassignmentapiv1identityidentitiesidentityidrolesroleidget) | **GET** /api/v1/identity/identities/{identity_id}/roles/{role_id} | Get Role Assignment|
|[**getRolesEffectifsApiV1IdentityCatalogsRolesEffectifsGet**](#getroleseffectifsapiv1identitycatalogsroleseffectifsget) | **GET** /api/v1/identity/catalogs/roles-effectifs | Get Roles Effectifs|
|[**getRolesEffectifsMappingApiV1IdentityCatalogsRolesEffectifsMappingGet**](#getroleseffectifsmappingapiv1identitycatalogsroleseffectifsmappingget) | **GET** /api/v1/identity/catalogs/roles-effectifs/mapping | Get Roles Effectifs Mapping|
|[**getRolesPrincipauxApiV1IdentityCatalogsRolePrincipalGet**](#getrolesprincipauxapiv1identitycatalogsroleprincipalget) | **GET** /api/v1/identity/catalogs/role-principal | Get Roles Principaux|
|[**getRolesPrincipauxApiV1IdentityCatalogsRolesPrincipauxGet**](#getrolesprincipauxapiv1identitycatalogsrolesprincipauxget) | **GET** /api/v1/identity/catalogs/roles-principaux | Get Roles Principaux|
|[**getTemplateInfoApiV1IdentityBulkimportTemplateRoleInfoGet**](#gettemplateinfoapiv1identitybulkimporttemplateroleinfoget) | **GET** /api/v1/identity/bulkimport/template/{role}/info | Get Template Info|
|[**healthCheckHealthGet**](#healthcheckhealthget) | **GET** /health | Health Check|
|[**linkIdentityToEstablishmentApiV1IdentityIdentityIdEstablishmentsPost**](#linkidentitytoestablishmentapiv1identityidentityidestablishmentspost) | **POST** /api/v1/identity/{identity_id}/establishments | Link Identity To Establishment|
|[**listAvailableTemplatesApiV1IdentityBulkimportTemplatesGet**](#listavailabletemplatesapiv1identitybulkimporttemplatesget) | **GET** /api/v1/identity/bulkimport/templates | List Available Templates|
|[**listBatchesApiV1IdentityBulkimportBatchesGet**](#listbatchesapiv1identitybulkimportbatchesget) | **GET** /api/v1/identity/bulkimport/batches | List Batches|
|[**listIdentitiesApiV1IdentityGet**](#listidentitiesapiv1identityget) | **GET** /api/v1/identity/ | List Identities|
|[**rootGet**](#rootget) | **GET** / | Root|
|[**streamImportProgressApiV1IdentityBulkimportSseBatchIdGet**](#streamimportprogressapiv1identitybulkimportssebatchidget) | **GET** /api/v1/identity/bulkimport/sse/{batch_id} | Stream Import Progress|
|[**unlinkIdentityFromEstablishmentApiV1IdentityIdentityIdEstablishmentsEstablishmentIdDelete**](#unlinkidentityfromestablishmentapiv1identityidentityidestablishmentsestablishmentiddelete) | **DELETE** /api/v1/identity/{identity_id}/establishments/{establishment_id} | Unlink Identity From Establishment|
|[**updateIdentityApiV1IdentityIdentityIdPatch**](#updateidentityapiv1identityidentityidpatch) | **PATCH** /api/v1/identity/{identity_id} | Update Identity|
|[**updateRoleAssignmentApiV1IdentityIdentitiesIdentityIdRolesRoleIdPut**](#updateroleassignmentapiv1identityidentitiesidentityidrolesroleidput) | **PUT** /api/v1/identity/identities/{identity_id}/roles/{role_id} | Update Role Assignment|

# **bulkImportIdentitiesApiV1IdentityBulkimportPost**
> any bulkImportIdentitiesApiV1IdentityBulkimportPost()

Import en masse d\'identités via fichier CSV ou Excel.  **Formats supportés :** - **CSV** : Fichier avec séparateur point-virgule (;) - **Excel** : Fichier .xlsx avec onglets (identities, roles, cycles)  **Colonnes attendues :** - `nom` : Nom de famille (requis) - `prenom` : Prénom (requis) - `email` : Adresse email (requis, unique) - `numero_telephone` : Numéro de téléphone (optionnel, unique si fourni) - `role_principal` : Rôle principal (student, parent, teacher, admin_staff) - `role_effectif` : Rôle effectif (optionnel) - `cycle` : Cycles couverts, séparés par virgules (ex: primary,middle)  **Exemple de fichier CSV :** ```csv nom;prenom;email;numero_telephone;role_principal;role_effectif;cycle Martin;Jean;jean.martin@example.com;0123456789;student;;primary Bernard;Marie;marie.bernard@example.com;0987654321;teacher;prof_principal;primary,middle ```  **Exemple de fichier Excel :** - Onglet \"identities\" : Données de base des identités - Onglet \"roles\" : Rôles et établissements - Onglet \"cycles\" : Cycles couverts par chaque identité  **Établissement :** - L\'établissement est fourni via le paramètre `establishment_id` du formulaire - Toutes les identités du fichier seront associées à cet établissement - Pas besoin de spécifier l\'établissement dans le fichier  **Réponse :** - Rapport détaillé de l\'import - Statistiques (succès, erreurs, nouvelles identités) - Détails par identité traitée - Erreurs de validation des établissements

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let file: File; //Fichier CSV ou Excel à importer (default to undefined)
let establishmentId: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.bulkImportIdentitiesApiV1IdentityBulkimportPost(
    file,
    establishmentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **file** | [**File**] | Fichier CSV ou Excel à importer | defaults to undefined|
| **establishmentId** | [**string**] |  | (optional) defaults to undefined|


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**202** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createIdentityApiV1IdentityPost**
> StandardSuccessResponse createIdentityApiV1IdentityPost(identityCreate)

Crée une nouvelle identité.  Args:     identity_data: Données de l\'identité à créer     identity_crud_service: Service CRUD des identités     tenant_context: Contexte tenant avec rôles et établissement      Returns:     IdentityResponse: Identité créée

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

const { status, data } = await apiInstance.createIdentityApiV1IdentityPost(
    identityCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **identityCreate** | **IdentityCreate**|  | |


### Return type

**StandardSuccessResponse**

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

# **createRoleAssignmentApiV1IdentityIdentitiesIdentityIdRolesPost**
> RoleAssignmentResponse createRoleAssignmentApiV1IdentityIdentitiesIdentityIdRolesPost(roleAssignmentCreate)

Crée un nouveau rôle complexe pour une identité.  Args:     identity_id: ID de l\'identité     role_data: Données du rôle à créer      Returns:     RoleAssignmentResponse: Rôle créé avec succès

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    RoleAssignmentCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let identityId: string; // (default to undefined)
let roleAssignmentCreate: RoleAssignmentCreate; //

const { status, data } = await apiInstance.createRoleAssignmentApiV1IdentityIdentitiesIdentityIdRolesPost(
    identityId,
    roleAssignmentCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roleAssignmentCreate** | **RoleAssignmentCreate**|  | |
| **identityId** | [**string**] |  | defaults to undefined|


### Return type

**RoleAssignmentResponse**

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

# **deleteIdentityApiV1IdentityIdentityIdDelete**
> StandardSuccessResponse deleteIdentityApiV1IdentityIdentityIdDelete()

Supprime une identité.  Args:     identity_id: ID de l\'identité à supprimer     identity_crud_service: Service CRUD des identités     tenant_context: Contexte tenant avec rôles et établissement      Returns:     Dict: Message de confirmation

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let identityId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteIdentityApiV1IdentityIdentityIdDelete(
    identityId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **identityId** | [**string**] |  | defaults to undefined|


### Return type

**StandardSuccessResponse**

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

# **deleteRoleAssignmentApiV1IdentityIdentitiesIdentityIdRolesRoleIdDelete**
> any deleteRoleAssignmentApiV1IdentityIdentitiesIdentityIdRolesRoleIdDelete()

Supprime un rôle complexe d\'une identité.  Args:     identity_id: ID de l\'identité     role_id: ID du rôle      Returns:     dict: Message de confirmation

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let identityId: string; // (default to undefined)
let roleId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteRoleAssignmentApiV1IdentityIdentitiesIdentityIdRolesRoleIdDelete(
    identityId,
    roleId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **identityId** | [**string**] |  | defaults to undefined|
| **roleId** | [**string**] |  | defaults to undefined|


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

# **getBatchDetailsApiV1IdentityBulkimportBatchesBatchIdGet**
> any getBatchDetailsApiV1IdentityBulkimportBatchesBatchIdGet()

Récupère les détails d\'un batch spécifique.  Args:     batch_id: ID du batch      Returns:     Dict: Détails du batch

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let batchId: string; // (default to undefined)

const { status, data } = await apiInstance.getBatchDetailsApiV1IdentityBulkimportBatchesBatchIdGet(
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

# **getBatchErrorsApiV1IdentityBulkimportBatchesBatchIdErrorsGet**
> any getBatchErrorsApiV1IdentityBulkimportBatchesBatchIdErrorsGet()

Récupère les erreurs d\'un batch avec pagination et filtres.  Args:     batch_id: ID du batch     page: Numéro de page (défaut: 1)     size: Taille de page (défaut: 50, max: 200)     error_type: Filtrer par type d\'erreur      Returns:     Dict: Erreurs paginées avec métadonnées

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let batchId: string; // (default to undefined)
let page: number; //Numéro de page (optional) (default to 1)
let size: number; //Taille de page (optional) (default to 50)
let errorType: string; //Filtrer par type d\'erreur (VALIDATION, DUPLICATE, DATABASE, etc.) (optional) (default to undefined)

const { status, data } = await apiInstance.getBatchErrorsApiV1IdentityBulkimportBatchesBatchIdErrorsGet(
    batchId,
    page,
    size,
    errorType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchId** | [**string**] |  | defaults to undefined|
| **page** | [**number**] | Numéro de page | (optional) defaults to 1|
| **size** | [**number**] | Taille de page | (optional) defaults to 50|
| **errorType** | [**string**] | Filtrer par type d\&#39;erreur (VALIDATION, DUPLICATE, DATABASE, etc.) | (optional) defaults to undefined|


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

# **getBatchItemsApiV1IdentityBulkimportBatchesBatchIdItemsGet**
> any getBatchItemsApiV1IdentityBulkimportBatchesBatchIdItemsGet()

Récupère les items d\'un batch avec pagination et filtres.  Args:     batch_id: ID du batch     page: Numéro de page (défaut: 1)     size: Taille de page (défaut: 50, max: 200)     status: Filtrer par statut     search: Rechercher par email      Returns:     Dict: Items paginés avec métadonnées

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let batchId: string; // (default to undefined)
let page: number; //Numéro de page (optional) (default to 1)
let size: number; //Taille de page (optional) (default to 50)
let status: string; //Filtrer par statut (PENDING, PROCESSING, SUCCESS, ERROR, SKIPPED) (optional) (default to undefined)
let search: string; //Rechercher par email (optional) (default to undefined)

const { status, data } = await apiInstance.getBatchItemsApiV1IdentityBulkimportBatchesBatchIdItemsGet(
    batchId,
    page,
    size,
    status,
    search
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchId** | [**string**] |  | defaults to undefined|
| **page** | [**number**] | Numéro de page | (optional) defaults to 1|
| **size** | [**number**] | Taille de page | (optional) defaults to 50|
| **status** | [**string**] | Filtrer par statut (PENDING, PROCESSING, SUCCESS, ERROR, SKIPPED) | (optional) defaults to undefined|
| **search** | [**string**] | Rechercher par email | (optional) defaults to undefined|


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

# **getBatchStatusApiV1IdentityBulkimportBatchesBatchIdStatusGet**
> any getBatchStatusApiV1IdentityBulkimportBatchesBatchIdStatusGet()

Récupère le statut actuel d\'un batch.  Args:     batch_id: ID du batch      Returns:     Dict: Statut du batch

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let batchId: string; // (default to undefined)

const { status, data } = await apiInstance.getBatchStatusApiV1IdentityBulkimportBatchesBatchIdStatusGet(
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

# **getCyclesApiV1IdentityCatalogsCycleGet**
> StandardListResponse getCyclesApiV1IdentityCatalogsCycleGet()

Récupère la liste des cycles pédagogiques.  Args:     page: Numéro de page     size: Taille de la page     search: Terme de recherche     is_active: Filtrer par statut actif     db: Session de base de données      Returns:     List[CycleResponse]: Liste des cycles

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
let search: string; //Terme de recherche (optional) (default to undefined)
let isActive: boolean; //Filtrer par statut actif (optional) (default to undefined)

const { status, data } = await apiInstance.getCyclesApiV1IdentityCatalogsCycleGet(
    page,
    size,
    search,
    isActive
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Numéro de page | (optional) defaults to 1|
| **size** | [**number**] | Taille de la page | (optional) defaults to 10|
| **search** | [**string**] | Terme de recherche | (optional) defaults to undefined|
| **isActive** | [**boolean**] | Filtrer par statut actif | (optional) defaults to undefined|


### Return type

**StandardListResponse**

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

# **getCyclesApiV1IdentityCatalogsCyclesGet**
> StandardListResponse getCyclesApiV1IdentityCatalogsCyclesGet()

Récupère la liste des cycles pédagogiques.  Args:     page: Numéro de page     size: Taille de la page     search: Terme de recherche     is_active: Filtrer par statut actif     db: Session de base de données      Returns:     List[CycleResponse]: Liste des cycles

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
let search: string; //Terme de recherche (optional) (default to undefined)
let isActive: boolean; //Filtrer par statut actif (optional) (default to undefined)

const { status, data } = await apiInstance.getCyclesApiV1IdentityCatalogsCyclesGet(
    page,
    size,
    search,
    isActive
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Numéro de page | (optional) defaults to 1|
| **size** | [**number**] | Taille de la page | (optional) defaults to 10|
| **search** | [**string**] | Terme de recherche | (optional) defaults to undefined|
| **isActive** | [**boolean**] | Filtrer par statut actif | (optional) defaults to undefined|


### Return type

**StandardListResponse**

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

# **getIdentityApiV1IdentityIdentityIdGet**
> StandardSingleResponse getIdentityApiV1IdentityIdentityIdGet()

Récupère une identité par son ID.  Args:     identity_id: ID de l\'identité     identity_crud_service: Service CRUD des identités     tenant_context: Contexte tenant avec rôles et établissement      Returns:     IdentityResponse: Identité trouvée

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let identityId: string; // (default to undefined)

const { status, data } = await apiInstance.getIdentityApiV1IdentityIdentityIdGet(
    identityId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **identityId** | [**string**] |  | defaults to undefined|


### Return type

**StandardSingleResponse**

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

# **getIdentityRolesApiV1IdentityIdentitiesIdentityIdRolesGet**
> Array<RoleAssignmentResponse> getIdentityRolesApiV1IdentityIdentitiesIdentityIdRolesGet()

Récupère tous les rôles d\'une identité.  Args:     identity_id: ID de l\'identité     establishment_id: ID de l\'établissement (optionnel)      Returns:     List[RoleAssignmentResponse]: Liste des rôles de l\'identité

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let identityId: string; // (default to undefined)
let establishmentId: string; //Filtrer par établissement (optional) (default to undefined)

const { status, data } = await apiInstance.getIdentityRolesApiV1IdentityIdentitiesIdentityIdRolesGet(
    identityId,
    establishmentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **identityId** | [**string**] |  | defaults to undefined|
| **establishmentId** | [**string**] | Filtrer par établissement | (optional) defaults to undefined|


### Return type

**Array<RoleAssignmentResponse>**

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

# **getIdentityWithRolesApiV1IdentityIdentitiesIdentityIdFullGet**
> IdentityWithRoles getIdentityWithRolesApiV1IdentityIdentitiesIdentityIdFullGet()

Récupère une identité avec tous ses rôles complexes.  Args:     identity_id: ID de l\'identité      Returns:     IdentityWithRoles: Identité avec ses rôles

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let identityId: string; // (default to undefined)

const { status, data } = await apiInstance.getIdentityWithRolesApiV1IdentityIdentitiesIdentityIdFullGet(
    identityId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **identityId** | [**string**] |  | defaults to undefined|


### Return type

**IdentityWithRoles**

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

# **getImportTemplateApiV1IdentityBulkimportTemplateRoleGet**
> any getImportTemplateApiV1IdentityBulkimportTemplateRoleGet()

Exporter un template pour l\'import d\'identités.  **Rôles supportés :** - `admin_staff` : Personnel administratif - `teacher` : Enseignants - `student` : Élèves - `parent` : Parents  **Formats supportés :** - `csv` : Fichier CSV avec séparateur point-virgule - `xlsx` : Fichier Excel avec onglet  **Colonnes du template (standardisées) :** - `lastname` : Nom de famille - `firstname` : Prénom - `email` : Adresse email - `phone` : Numéro de téléphone - `role_principal` : Rôle principal (student, parent, teacher, admin_staff) - `role_effectif` : Rôle effectif (optionnel) - `cycle` : Liste de cycles parmi `preschool, primary, middle, high` (séparés par virgules) - `class_code` et `school_year` : pour teacher/student (optionnels pour admin_staff/parent) - `birth_date`, `gender`, `level`, `account_required` : champs additionnels pour student  **Exemples inclus :** Chaque template contient 2 lignes d\'exemple pour montrer la structure des données attendue.  **Établissement :** - L\'établissement est fourni via le paramètre `establishment_id` du formulaire - Toutes les identités du fichier seront associées à cet établissement - Pas besoin de spécifier l\'établissement dans le fichier  **Réponse :** - Fichier téléchargeable au format demandé - Headers appropriés pour le téléchargement

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let role: string; // (default to undefined)
let formatType: string; // (optional) (default to 'csv')

const { status, data } = await apiInstance.getImportTemplateApiV1IdentityBulkimportTemplateRoleGet(
    role,
    formatType
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **role** | [**string**] |  | defaults to undefined|
| **formatType** | [**string**] |  | (optional) defaults to 'csv'|


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

# **getLastCodeIdentiteApiV1IdentityLastCodeGet**
> LastCodeResponse getLastCodeIdentiteApiV1IdentityLastCodeGet()

Récupère le dernier code d\'identité utilisé.  **Permissions requises :** ROLE_ADMIN, ROLE_ADMINSTAFF  **Réponse :** - Dernier code utilisé uniquement (format: {\"last_code\": \"IDT000001\"})

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.getLastCodeIdentiteApiV1IdentityLastCodeGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**LastCodeResponse**

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

# **getRoleAssignmentApiV1IdentityIdentitiesIdentityIdRolesRoleIdGet**
> RoleAssignmentResponse getRoleAssignmentApiV1IdentityIdentitiesIdentityIdRolesRoleIdGet()

Récupère un rôle spécifique d\'une identité.  Args:     identity_id: ID de l\'identité     role_id: ID du rôle      Returns:     RoleAssignmentResponse: Rôle demandé

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let identityId: string; // (default to undefined)
let roleId: string; // (default to undefined)

const { status, data } = await apiInstance.getRoleAssignmentApiV1IdentityIdentitiesIdentityIdRolesRoleIdGet(
    identityId,
    roleId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **identityId** | [**string**] |  | defaults to undefined|
| **roleId** | [**string**] |  | defaults to undefined|


### Return type

**RoleAssignmentResponse**

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

# **getRolesEffectifsApiV1IdentityCatalogsRolesEffectifsGet**
> StandardListResponse getRolesEffectifsApiV1IdentityCatalogsRolesEffectifsGet()

Récupère la liste des rôles effectifs.  Args:     page: Numéro de page     size: Taille de la page     search: Terme de recherche     group_key: Filtrer par groupe fonctionnel     is_sensitive: Filtrer par sensibilité     is_active: Filtrer par statut actif     db: Session de base de données      Returns:     List[RoleEffectifResponse]: Liste des rôles effectifs

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
let search: string; //Terme de recherche (optional) (default to undefined)
let groupKey: string; //Filtrer par groupe (optional) (default to undefined)
let isSensitive: boolean; //Filtrer par sensibilité (optional) (default to undefined)
let isActive: boolean; //Filtrer par statut actif (optional) (default to undefined)

const { status, data } = await apiInstance.getRolesEffectifsApiV1IdentityCatalogsRolesEffectifsGet(
    page,
    size,
    search,
    groupKey,
    isSensitive,
    isActive
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Numéro de page | (optional) defaults to 1|
| **size** | [**number**] | Taille de la page | (optional) defaults to 10|
| **search** | [**string**] | Terme de recherche | (optional) defaults to undefined|
| **groupKey** | [**string**] | Filtrer par groupe | (optional) defaults to undefined|
| **isSensitive** | [**boolean**] | Filtrer par sensibilité | (optional) defaults to undefined|
| **isActive** | [**boolean**] | Filtrer par statut actif | (optional) defaults to undefined|


### Return type

**StandardListResponse**

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

# **getRolesEffectifsMappingApiV1IdentityCatalogsRolesEffectifsMappingGet**
> any getRolesEffectifsMappingApiV1IdentityCatalogsRolesEffectifsMappingGet()

Récupère le catalogue des rôles effectifs (DB) et le mapping par rôle principal.  Retourne:   - roles_effectifs: liste des rôles effectifs actifs (code, label_key, group_key, is_sensitive, sort_order)   - by_principal: mapping des rôles principaux vers les codes effectifs autorisés (intersection DB ∩ mapping service)

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.getRolesEffectifsMappingApiV1IdentityCatalogsRolesEffectifsMappingGet();
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

# **getRolesPrincipauxApiV1IdentityCatalogsRolePrincipalGet**
> StandardListResponse getRolesPrincipauxApiV1IdentityCatalogsRolePrincipalGet()

Récupère la liste des rôles principaux.  Args:     page: Numéro de page     size: Taille de la page     search: Terme de recherche     is_active: Filtrer par statut actif     db: Session de base de données      Returns:     List[RolePrincipalResponse]: Liste des rôles principaux

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
let search: string; //Terme de recherche (optional) (default to undefined)
let isActive: boolean; //Filtrer par statut actif (optional) (default to undefined)

const { status, data } = await apiInstance.getRolesPrincipauxApiV1IdentityCatalogsRolePrincipalGet(
    page,
    size,
    search,
    isActive
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Numéro de page | (optional) defaults to 1|
| **size** | [**number**] | Taille de la page | (optional) defaults to 10|
| **search** | [**string**] | Terme de recherche | (optional) defaults to undefined|
| **isActive** | [**boolean**] | Filtrer par statut actif | (optional) defaults to undefined|


### Return type

**StandardListResponse**

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

# **getRolesPrincipauxApiV1IdentityCatalogsRolesPrincipauxGet**
> StandardListResponse getRolesPrincipauxApiV1IdentityCatalogsRolesPrincipauxGet()

Récupère la liste des rôles principaux.  Args:     page: Numéro de page     size: Taille de la page     search: Terme de recherche     is_active: Filtrer par statut actif     db: Session de base de données      Returns:     List[RolePrincipalResponse]: Liste des rôles principaux

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
let search: string; //Terme de recherche (optional) (default to undefined)
let isActive: boolean; //Filtrer par statut actif (optional) (default to undefined)

const { status, data } = await apiInstance.getRolesPrincipauxApiV1IdentityCatalogsRolesPrincipauxGet(
    page,
    size,
    search,
    isActive
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Numéro de page | (optional) defaults to 1|
| **size** | [**number**] | Taille de la page | (optional) defaults to 10|
| **search** | [**string**] | Terme de recherche | (optional) defaults to undefined|
| **isActive** | [**boolean**] | Filtrer par statut actif | (optional) defaults to undefined|


### Return type

**StandardListResponse**

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

# **getTemplateInfoApiV1IdentityBulkimportTemplateRoleInfoGet**
> TemplateResponse getTemplateInfoApiV1IdentityBulkimportTemplateRoleInfoGet()

Obtenir les informations sur un template d\'import.  **Paramètres :** - `role` : Rôle du template (admin_staff, teacher, student, parent)  **Réponse :** - Informations sur le template - Colonnes disponibles - Nombre d\'exemples - Description du template

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let role: string; // (default to undefined)

const { status, data } = await apiInstance.getTemplateInfoApiV1IdentityBulkimportTemplateRoleInfoGet(
    role
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **role** | [**string**] |  | defaults to undefined|


### Return type

**TemplateResponse**

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
> StandardSingleResponse healthCheckHealthGet()

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

**StandardSingleResponse**

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

# **linkIdentityToEstablishmentApiV1IdentityIdentityIdEstablishmentsPost**
> StandardSuccessResponse linkIdentityToEstablishmentApiV1IdentityIdentityIdEstablishmentsPost(establishmentLinkCreate)

Lie une identité à un établissement.  Args:     identity_id: ID de l\'identité     link_data: Données du lien     tenant_context: Contexte tenant avec rôles et établissement      Returns:     Dict: Message de confirmation

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

const { status, data } = await apiInstance.linkIdentityToEstablishmentApiV1IdentityIdentityIdEstablishmentsPost(
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

**StandardSuccessResponse**

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

# **listAvailableTemplatesApiV1IdentityBulkimportTemplatesGet**
> any listAvailableTemplatesApiV1IdentityBulkimportTemplatesGet()

Lister les templates d\'import disponibles.  **Réponse :** - Liste des rôles supportés - Formats disponibles pour chaque rôle - Informations générales sur les templates

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.listAvailableTemplatesApiV1IdentityBulkimportTemplatesGet();
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

# **listBatchesApiV1IdentityBulkimportBatchesGet**
> any listBatchesApiV1IdentityBulkimportBatchesGet()

Liste les batches d\'import avec pagination.  Args:     page: Numéro de page (défaut: 1)     size: Taille de page (défaut: 10, max: 100)     status: Statut pour filtrer (optionnel)      Returns:     Dict: Liste paginée des batches

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //Numéro de page (optional) (default to 1)
let size: number; //Taille de page (optional) (default to 10)
let status: string; //Filtrer par statut (optional) (default to undefined)

const { status, data } = await apiInstance.listBatchesApiV1IdentityBulkimportBatchesGet(
    page,
    size,
    status
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Numéro de page | (optional) defaults to 1|
| **size** | [**number**] | Taille de page | (optional) defaults to 10|
| **status** | [**string**] | Filtrer par statut | (optional) defaults to undefined|


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

# **listIdentitiesApiV1IdentityGet**
> StandardListResponse listIdentitiesApiV1IdentityGet()

Liste les identités avec pagination et filtres.  Args:     page: Numéro de page     size: Taille de la page     search: Terme de recherche global     sort_by: Champ de tri     sort_order: Ordre de tri     firstname: Filtre par prénom     lastname: Filtre par nom     email: Filtre par email     status: Filtre par statut     establishment_id: Filtre par établissement     role: Filtre par rôle     identity_crud_service: Service CRUD des identités     tenant_context: Contexte tenant avec rôles et établissement      Returns:     IdentityListResponse: Liste paginée des identités

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

const { status, data } = await apiInstance.listIdentitiesApiV1IdentityGet(
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

**StandardListResponse**

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
> StandardSingleResponse rootGet()

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

**StandardSingleResponse**

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

# **streamImportProgressApiV1IdentityBulkimportSseBatchIdGet**
> any streamImportProgressApiV1IdentityBulkimportSseBatchIdGet()

Stream Server-Sent Events pour suivre la progression d\'un import en masse.  Args:     batch_id: ID du batch d\'import à suivre     user_id: ID de l\'utilisateur (pour l\'authentification)     timeout: Timeout de la connexion SSE en secondes      Returns:     StreamingResponse: Stream SSE avec les événements de progression      Events:     - PROGRESS: Progression de l\'import (pourcentage, éléments traités)     - COMPLETED: Import terminé avec succès     - ERROR: Erreur lors de l\'import     - CANCELLED: Import annulé     - TIMEOUT: Connexion expirée

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let batchId: string; // (default to undefined)
let userId: string; //ID de l\'utilisateur pour l\'authentification (optional) (default to undefined)
let timeout: number; //Timeout en secondes (défaut: 5 minutes) (optional) (default to 300)

const { status, data } = await apiInstance.streamImportProgressApiV1IdentityBulkimportSseBatchIdGet(
    batchId,
    userId,
    timeout
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **batchId** | [**string**] |  | defaults to undefined|
| **userId** | [**string**] | ID de l\&#39;utilisateur pour l\&#39;authentification | (optional) defaults to undefined|
| **timeout** | [**number**] | Timeout en secondes (défaut: 5 minutes) | (optional) defaults to 300|


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

# **unlinkIdentityFromEstablishmentApiV1IdentityIdentityIdEstablishmentsEstablishmentIdDelete**
> StandardSuccessResponse unlinkIdentityFromEstablishmentApiV1IdentityIdentityIdEstablishmentsEstablishmentIdDelete()

Supprime le lien entre une identité et un établissement.  Args:     identity_id: ID de l\'identité     establishment_id: ID de l\'établissement     identity_crud_service: Service CRUD des identités     tenant_context: Contexte tenant avec rôles et établissement      Returns:     Dict: Message de confirmation

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

const { status, data } = await apiInstance.unlinkIdentityFromEstablishmentApiV1IdentityIdentityIdEstablishmentsEstablishmentIdDelete(
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

**StandardSuccessResponse**

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

# **updateIdentityApiV1IdentityIdentityIdPatch**
> StandardSuccessResponse updateIdentityApiV1IdentityIdentityIdPatch(identityUpdate)

Met à jour une identité.  Args:     identity_id: ID de l\'identité à mettre à jour     identity_data: Nouvelles données     identity_crud_service: Service CRUD des identités     tenant_context: Contexte tenant avec rôles et établissement      Returns:     IdentityResponse: Identité mise à jour

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

const { status, data } = await apiInstance.updateIdentityApiV1IdentityIdentityIdPatch(
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

**StandardSuccessResponse**

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

# **updateRoleAssignmentApiV1IdentityIdentitiesIdentityIdRolesRoleIdPut**
> RoleAssignmentResponse updateRoleAssignmentApiV1IdentityIdentitiesIdentityIdRolesRoleIdPut(roleAssignmentUpdate)

Met à jour un rôle complexe d\'une identité.  Args:     identity_id: ID de l\'identité     role_id: ID du rôle     role_data: Nouvelles données du rôle      Returns:     RoleAssignmentResponse: Rôle mis à jour

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    RoleAssignmentUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let identityId: string; // (default to undefined)
let roleId: string; // (default to undefined)
let roleAssignmentUpdate: RoleAssignmentUpdate; //

const { status, data } = await apiInstance.updateRoleAssignmentApiV1IdentityIdentitiesIdentityIdRolesRoleIdPut(
    identityId,
    roleId,
    roleAssignmentUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roleAssignmentUpdate** | **RoleAssignmentUpdate**|  | |
| **identityId** | [**string**] |  | defaults to undefined|
| **roleId** | [**string**] |  | defaults to undefined|


### Return type

**RoleAssignmentResponse**

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


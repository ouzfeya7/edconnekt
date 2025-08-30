# EstablishmentsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createEstablishmentApiEtablissementsPost**](#createestablishmentapietablissementspost) | **POST** /api/etablissements/ | Create Establishment|
|[**createManualAuditEntryApiEtablissementsEstablishmentIdAuditManualPost**](#createmanualauditentryapietablissementsestablishmentidauditmanualpost) | **POST** /api/etablissements/{establishment_id}/audit/manual | Create Manual Audit Entry|
|[**exportEstablishmentAuditApiEtablissementsEstablishmentIdAuditExportGet**](#exportestablishmentauditapietablissementsestablishmentidauditexportget) | **GET** /api/etablissements/{establishment_id}/audit/export | Export Establishment Audit|
|[**getEstablishmentApiEtablissementsEstablishmentIdGet**](#getestablishmentapietablissementsestablishmentidget) | **GET** /api/etablissements/{establishment_id} | Get Establishment|
|[**getEstablishmentAuditApiEtablissementsEstablishmentIdAuditGet**](#getestablishmentauditapietablissementsestablishmentidauditget) | **GET** /api/etablissements/{establishment_id}/audit | Get Establishment Audit|
|[**getEstablishmentAuditStatisticsApiEtablissementsEstablishmentIdAuditStatisticsGet**](#getestablishmentauditstatisticsapietablissementsestablishmentidauditstatisticsget) | **GET** /api/etablissements/{establishment_id}/audit/statistics | Get Establishment Audit Statistics|
|[**getEstablishmentAuditSummaryApiEtablissementsEstablishmentIdAuditSummaryGet**](#getestablishmentauditsummaryapietablissementsestablishmentidauditsummaryget) | **GET** /api/etablissements/{establishment_id}/audit/summary | Get Establishment Audit Summary|
|[**listEstablishmentsApiEtablissementsGet**](#listestablishmentsapietablissementsget) | **GET** /api/etablissements/ | List Establishments|
|[**listPublicEstablishmentsApiEtablissementsPublicGet**](#listpublicestablishmentsapietablissementspublicget) | **GET** /api/etablissements/public/ | List Public Establishments|
|[**updateEstablishmentApiEtablissementsEstablishmentIdPatch**](#updateestablishmentapietablissementsestablishmentidpatch) | **PATCH** /api/etablissements/{establishment_id} | Update Establishment|
|[**updateEstablishmentCoordinatesApiEtablissementsEstablishmentIdCoordinatesPatch**](#updateestablishmentcoordinatesapietablissementsestablishmentidcoordinatespatch) | **PATCH** /api/etablissements/{establishment_id}/coordinates | Update Establishment Coordinates|
|[**updateEstablishmentStatusApiEtablissementsEstablishmentIdStatusPatch**](#updateestablishmentstatusapietablissementsestablishmentidstatuspatch) | **PATCH** /api/etablissements/{establishment_id}/status | Update Establishment Status|

# **createEstablishmentApiEtablissementsPost**
> ResponseCreateEstablishmentApiEtablissementsPost createEstablishmentApiEtablissementsPost(etablissementCreateFlexible)

Crée un ou plusieurs établissements  Accepte soit un établissement unique, soit une liste d\'établissements. En cas d\'erreur sur un seul établissement, tous sont annulés (rollback complet).  Requiert le rôle ROLE_ADMIN.

### Example

```typescript
import {
    EstablishmentsApi,
    Configuration,
    EtablissementCreateFlexible
} from './api';

const configuration = new Configuration();
const apiInstance = new EstablishmentsApi(configuration);

let etablissementCreateFlexible: EtablissementCreateFlexible; //

const { status, data } = await apiInstance.createEstablishmentApiEtablissementsPost(
    etablissementCreateFlexible
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **etablissementCreateFlexible** | **EtablissementCreateFlexible**|  | |


### Return type

**ResponseCreateEstablishmentApiEtablissementsPost**

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

# **createManualAuditEntryApiEtablissementsEstablishmentIdAuditManualPost**
> EtablissementAuditResponse createManualAuditEntryApiEtablissementsEstablishmentIdAuditManualPost(manualAuditCreate)

Crée manuellement une entrée d\'audit pour un établissement  Requiert le rôle ROLE_ADMIN.  **Corps de la requête :** ```json {     \"operation\": \"CUSTOM_OPERATION\",     \"motif\": \"Description de l\'opération\",     \"auteur_id\": \"user-123\",     \"auteur_nom\": \"Nom de l\'utilisateur\" } ```  **Retourne :** - L\'entrée d\'audit créée

### Example

```typescript
import {
    EstablishmentsApi,
    Configuration,
    ManualAuditCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new EstablishmentsApi(configuration);

let establishmentId: string; // (default to undefined)
let manualAuditCreate: ManualAuditCreate; //

const { status, data } = await apiInstance.createManualAuditEntryApiEtablissementsEstablishmentIdAuditManualPost(
    establishmentId,
    manualAuditCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **manualAuditCreate** | **ManualAuditCreate**|  | |
| **establishmentId** | [**string**] |  | defaults to undefined|


### Return type

**EtablissementAuditResponse**

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

# **exportEstablishmentAuditApiEtablissementsEstablishmentIdAuditExportGet**
> any exportEstablishmentAuditApiEtablissementsEstablishmentIdAuditExportGet()

Exporte les données d\'audit d\'un établissement  Requiert le rôle ROLE_ADMIN ou ROLE_DIRECTION. ROLE_DIRECTION ne peut exporter que les données de son propre établissement.  **Paramètres :** - `date_from` : Date de début pour l\'export (optionnel) - `date_to` : Date de fin pour l\'export (optionnel) - `format` : Format d\'export (\"json\" ou \"csv\")  **Retourne :** - Fichier JSON ou CSV avec les données d\'audit

### Example

```typescript
import {
    EstablishmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EstablishmentsApi(configuration);

let establishmentId: string; // (default to undefined)
let dateFrom: string; //Date de début pour l\'export (optional) (default to undefined)
let dateTo: string; //Date de fin pour l\'export (optional) (default to undefined)
let format: string; //Format d\'export (json ou csv) (optional) (default to 'json')

const { status, data } = await apiInstance.exportEstablishmentAuditApiEtablissementsEstablishmentIdAuditExportGet(
    establishmentId,
    dateFrom,
    dateTo,
    format
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **establishmentId** | [**string**] |  | defaults to undefined|
| **dateFrom** | [**string**] | Date de début pour l\&#39;export | (optional) defaults to undefined|
| **dateTo** | [**string**] | Date de fin pour l\&#39;export | (optional) defaults to undefined|
| **format** | [**string**] | Format d\&#39;export (json ou csv) | (optional) defaults to 'json'|


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

# **getEstablishmentApiEtablissementsEstablishmentIdGet**
> EtablissementOut getEstablishmentApiEtablissementsEstablishmentIdGet()

Récupère un établissement par son ID  Requiert le rôle ROLE_ADMIN ou ROLE_DIRECTION. ROLE_DIRECTION ne peut accéder qu\'à son propre établissement.

### Example

```typescript
import {
    EstablishmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EstablishmentsApi(configuration);

let establishmentId: string; // (default to undefined)

const { status, data } = await apiInstance.getEstablishmentApiEtablissementsEstablishmentIdGet(
    establishmentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **establishmentId** | [**string**] |  | defaults to undefined|


### Return type

**EtablissementOut**

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

# **getEstablishmentAuditApiEtablissementsEstablishmentIdAuditGet**
> AuditListResponse getEstablishmentAuditApiEtablissementsEstablishmentIdAuditGet()

Récupère l\'historique d\'audit d\'un établissement avec filtres et pagination  Requiert le rôle ROLE_ADMIN ou ROLE_DIRECTION. ROLE_DIRECTION ne peut accéder qu\'à l\'audit de son propre établissement.  **Paramètres de filtrage :** - `operation` : Type d\'opération (CREATE, UPDATE, DELETE, STATUS_CHANGE, INSERT) - `auteur_id` : ID de l\'auteur de l\'opération - `auteur_nom` : Nom de l\'auteur (recherche partielle) - `date_from` : Date de début pour le filtrage - `date_to` : Date de fin pour le filtrage  **Paramètres de pagination :** - `limit` : Nombre maximum d\'éléments (1-100) - `offset` : Offset pour la pagination  **Paramètres de tri :** - `sort_by` : Champ de tri (date_operation, operation, auteur_nom, id) - `sort_order` : Ordre de tri (asc/desc)

### Example

```typescript
import {
    EstablishmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EstablishmentsApi(configuration);

let establishmentId: string; // (default to undefined)
let operation: AuditOperationEnum; //Filtrer par type d\'opération (optional) (default to undefined)
let auteurId: string; //Filtrer par ID de l\'auteur (optional) (default to undefined)
let auteurNom: string; //Filtrer par nom de l\'auteur (optional) (default to undefined)
let dateFrom: string; //Date de début pour le filtrage (optional) (default to undefined)
let dateTo: string; //Date de fin pour le filtrage (optional) (default to undefined)
let limit: number; //Nombre maximum d\'éléments (optional) (default to 10)
let offset: number; //Offset pour la pagination (optional) (default to 0)
let sortBy: string; //Champ de tri (optional) (default to 'date_operation')
let sortOrder: string; //Ordre de tri (asc/desc) (optional) (default to 'desc')

const { status, data } = await apiInstance.getEstablishmentAuditApiEtablissementsEstablishmentIdAuditGet(
    establishmentId,
    operation,
    auteurId,
    auteurNom,
    dateFrom,
    dateTo,
    limit,
    offset,
    sortBy,
    sortOrder
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **establishmentId** | [**string**] |  | defaults to undefined|
| **operation** | **AuditOperationEnum** | Filtrer par type d\&#39;opération | (optional) defaults to undefined|
| **auteurId** | [**string**] | Filtrer par ID de l\&#39;auteur | (optional) defaults to undefined|
| **auteurNom** | [**string**] | Filtrer par nom de l\&#39;auteur | (optional) defaults to undefined|
| **dateFrom** | [**string**] | Date de début pour le filtrage | (optional) defaults to undefined|
| **dateTo** | [**string**] | Date de fin pour le filtrage | (optional) defaults to undefined|
| **limit** | [**number**] | Nombre maximum d\&#39;éléments | (optional) defaults to 10|
| **offset** | [**number**] | Offset pour la pagination | (optional) defaults to 0|
| **sortBy** | [**string**] | Champ de tri | (optional) defaults to 'date_operation'|
| **sortOrder** | [**string**] | Ordre de tri (asc/desc) | (optional) defaults to 'desc'|


### Return type

**AuditListResponse**

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

# **getEstablishmentAuditStatisticsApiEtablissementsEstablishmentIdAuditStatisticsGet**
> AuditStatistics getEstablishmentAuditStatisticsApiEtablissementsEstablishmentIdAuditStatisticsGet()

Récupère les statistiques d\'audit pour un établissement  Requiert le rôle ROLE_ADMIN ou ROLE_DIRECTION. ROLE_DIRECTION ne peut accéder qu\'aux statistiques de son propre établissement.  **Retourne :** - Nombre total d\'opérations - Nombre d\'opérations par type - Date de la dernière opération - Utilisateur le plus actif - Nombre d\'opérations ce mois-ci

### Example

```typescript
import {
    EstablishmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EstablishmentsApi(configuration);

let establishmentId: string; // (default to undefined)

const { status, data } = await apiInstance.getEstablishmentAuditStatisticsApiEtablissementsEstablishmentIdAuditStatisticsGet(
    establishmentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **establishmentId** | [**string**] |  | defaults to undefined|


### Return type

**AuditStatistics**

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

# **getEstablishmentAuditSummaryApiEtablissementsEstablishmentIdAuditSummaryGet**
> { [key: string]: any; } getEstablishmentAuditSummaryApiEtablissementsEstablishmentIdAuditSummaryGet()

Récupère un résumé d\'audit pour un établissement sur une période donnée  Requiert le rôle ROLE_ADMIN ou ROLE_DIRECTION. ROLE_DIRECTION ne peut accéder qu\'au résumé de son propre établissement.  **Paramètres :** - `days` : Nombre de jours pour le résumé (1-365, défaut: 30)  **Retourne :** - Résumé des opérations par type - Activité par utilisateur - Activité quotidienne - Utilisateur le plus actif - Opération la plus courante

### Example

```typescript
import {
    EstablishmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EstablishmentsApi(configuration);

let establishmentId: string; // (default to undefined)
let days: number; //Nombre de jours pour le résumé (optional) (default to 30)

const { status, data } = await apiInstance.getEstablishmentAuditSummaryApiEtablissementsEstablishmentIdAuditSummaryGet(
    establishmentId,
    days
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **establishmentId** | [**string**] |  | defaults to undefined|
| **days** | [**number**] | Nombre de jours pour le résumé | (optional) defaults to 30|


### Return type

**{ [key: string]: any; }**

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

# **listEstablishmentsApiEtablissementsGet**
> Array<EtablissementOut> listEstablishmentsApiEtablissementsGet()

Liste tous les établissements avec pagination et filtres  Requiert le rôle ROLE_ADMIN.

### Example

```typescript
import {
    EstablishmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EstablishmentsApi(configuration);

let status: StatusEnum; //Filtrer par statut (optional) (default to undefined)
let limit: number; //Nombre maximum d\'éléments (optional) (default to 10)
let offset: number; //Offset pour la pagination (optional) (default to 0)

const { status, data } = await apiInstance.listEstablishmentsApiEtablissementsGet(
    status,
    limit,
    offset
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **status** | **StatusEnum** | Filtrer par statut | (optional) defaults to undefined|
| **limit** | [**number**] | Nombre maximum d\&#39;éléments | (optional) defaults to 10|
| **offset** | [**number**] | Offset pour la pagination | (optional) defaults to 0|


### Return type

**Array<EtablissementOut>**

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

# **listPublicEstablishmentsApiEtablissementsPublicGet**
> Array<EtablissementOut> listPublicEstablishmentsApiEtablissementsPublicGet()

Liste publique des etablissements actifs  Aucune authentification requise - accessible publiquement. Retourne seulement les etablissements avec le statut ACTIVE.

### Example

```typescript
import {
    EstablishmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EstablishmentsApi(configuration);

let limit: number; //Nombre maximum d\'elements (optional) (default to 10)
let offset: number; //Offset pour la pagination (optional) (default to 0)

const { status, data } = await apiInstance.listPublicEstablishmentsApiEtablissementsPublicGet(
    limit,
    offset
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] | Nombre maximum d\&#39;elements | (optional) defaults to 10|
| **offset** | [**number**] | Offset pour la pagination | (optional) defaults to 0|


### Return type

**Array<EtablissementOut>**

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

# **updateEstablishmentApiEtablissementsEstablishmentIdPatch**
> EtablissementOut updateEstablishmentApiEtablissementsEstablishmentIdPatch(etablissementUpdate)

Met à jour les informations d\'un établissement

### Example

```typescript
import {
    EstablishmentsApi,
    Configuration,
    EtablissementUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new EstablishmentsApi(configuration);

let establishmentId: string; // (default to undefined)
let etablissementUpdate: EtablissementUpdate; //

const { status, data } = await apiInstance.updateEstablishmentApiEtablissementsEstablishmentIdPatch(
    establishmentId,
    etablissementUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **etablissementUpdate** | **EtablissementUpdate**|  | |
| **establishmentId** | [**string**] |  | defaults to undefined|


### Return type

**EtablissementOut**

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

# **updateEstablishmentCoordinatesApiEtablissementsEstablishmentIdCoordinatesPatch**
> EtablissementOut updateEstablishmentCoordinatesApiEtablissementsEstablishmentIdCoordinatesPatch(etablissementCoordinatesUpdate)

Met à jour les coordonnées d\'un établissement  Requiert le rôle ROLE_ADMIN ou ROLE_DIRECTION. ROLE_DIRECTION ne peut modifier que son propre établissement.

### Example

```typescript
import {
    EstablishmentsApi,
    Configuration,
    EtablissementCoordinatesUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new EstablishmentsApi(configuration);

let establishmentId: string; // (default to undefined)
let etablissementCoordinatesUpdate: EtablissementCoordinatesUpdate; //

const { status, data } = await apiInstance.updateEstablishmentCoordinatesApiEtablissementsEstablishmentIdCoordinatesPatch(
    establishmentId,
    etablissementCoordinatesUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **etablissementCoordinatesUpdate** | **EtablissementCoordinatesUpdate**|  | |
| **establishmentId** | [**string**] |  | defaults to undefined|


### Return type

**EtablissementOut**

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

# **updateEstablishmentStatusApiEtablissementsEstablishmentIdStatusPatch**
> EtablissementOut updateEstablishmentStatusApiEtablissementsEstablishmentIdStatusPatch()

Met à jour le statut d\'un établissement  Requiert le rôle ROLE_ADMIN.

### Example

```typescript
import {
    EstablishmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EstablishmentsApi(configuration);

let establishmentId: string; // (default to undefined)
let status: StatusEnum; // (default to undefined)
let motif: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.updateEstablishmentStatusApiEtablissementsEstablishmentIdStatusPatch(
    establishmentId,
    status,
    motif
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **establishmentId** | [**string**] |  | defaults to undefined|
| **status** | **StatusEnum** |  | defaults to undefined|
| **motif** | [**string**] |  | (optional) defaults to undefined|


### Return type

**EtablissementOut**

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


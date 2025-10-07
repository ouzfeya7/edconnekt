# EstablishmentsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createBuildingApiEtablissementsEstablishmentIdBatimentsPost**](#createbuildingapietablissementsestablishmentidbatimentspost) | **POST** /api/etablissements/{establishment_id}/batiments | Create Building|
|[**createEstablishmentApiEtablissementsPost**](#createestablishmentapietablissementspost) | **POST** /api/etablissements/ | Create Establishment|
|[**createManualAuditEntryApiEtablissementsEstablishmentIdAuditManualPost**](#createmanualauditentryapietablissementsestablishmentidauditmanualpost) | **POST** /api/etablissements/{establishment_id}/audit/manual | Create Manual Audit Entry|
|[**createRoomApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesPost**](#createroomapietablissementsestablishmentidbatimentsbuildingidsallespost) | **POST** /api/etablissements/{establishment_id}/batiments/{building_id}/salles | Create Room|
|[**deleteBuildingApiEtablissementsEstablishmentIdBatimentsBuildingIdDelete**](#deletebuildingapietablissementsestablishmentidbatimentsbuildingiddelete) | **DELETE** /api/etablissements/{establishment_id}/batiments/{building_id} | Delete Building|
|[**deleteRoomApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesRoomIdDelete**](#deleteroomapietablissementsestablishmentidbatimentsbuildingidsallesroomiddelete) | **DELETE** /api/etablissements/{establishment_id}/batiments/{building_id}/salles/{room_id} | Delete Room|
|[**exportEstablishmentAuditApiEtablissementsEstablishmentIdAuditExportGet**](#exportestablishmentauditapietablissementsestablishmentidauditexportget) | **GET** /api/etablissements/{establishment_id}/audit/export | Export Establishment Audit|
|[**getBuildingApiEtablissementsEstablishmentIdBatimentsBuildingIdGet**](#getbuildingapietablissementsestablishmentidbatimentsbuildingidget) | **GET** /api/etablissements/{establishment_id}/batiments/{building_id} | Get Building|
|[**getEstablishmentApiEtablissementsEstablishmentIdGet**](#getestablishmentapietablissementsestablishmentidget) | **GET** /api/etablissements/{establishment_id} | Get Establishment|
|[**getEstablishmentAuditApiEtablissementsEstablishmentIdAuditGet**](#getestablishmentauditapietablissementsestablishmentidauditget) | **GET** /api/etablissements/{establishment_id}/audit | Get Establishment Audit|
|[**getEstablishmentAuditStatisticsApiEtablissementsEstablishmentIdAuditStatisticsGet**](#getestablishmentauditstatisticsapietablissementsestablishmentidauditstatisticsget) | **GET** /api/etablissements/{establishment_id}/audit/statistics | Get Establishment Audit Statistics|
|[**getEstablishmentAuditSummaryApiEtablissementsEstablishmentIdAuditSummaryGet**](#getestablishmentauditsummaryapietablissementsestablishmentidauditsummaryget) | **GET** /api/etablissements/{establishment_id}/audit/summary | Get Establishment Audit Summary|
|[**getLastCodeEtablissementApiEtablissementsLastCodeGet**](#getlastcodeetablissementapietablissementslastcodeget) | **GET** /api/etablissements/last-code | Get Last Code Etablissement|
|[**getRoomApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesRoomIdGet**](#getroomapietablissementsestablishmentidbatimentsbuildingidsallesroomidget) | **GET** /api/etablissements/{establishment_id}/batiments/{building_id}/salles/{room_id} | Get Room|
|[**listBuildingsApiEtablissementsEstablishmentIdBatimentsGet**](#listbuildingsapietablissementsestablishmentidbatimentsget) | **GET** /api/etablissements/{establishment_id}/batiments | List Buildings|
|[**listEstablishmentsApiEtablissementsGet**](#listestablishmentsapietablissementsget) | **GET** /api/etablissements/ | List Establishments|
|[**listPublicEstablishmentsApiEtablissementsPublicGet**](#listpublicestablishmentsapietablissementspublicget) | **GET** /api/etablissements/public/ | List Public Establishments|
|[**listRoomsApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesGet**](#listroomsapietablissementsestablishmentidbatimentsbuildingidsallesget) | **GET** /api/etablissements/{establishment_id}/batiments/{building_id}/salles | List Rooms|
|[**updateBuildingApiEtablissementsEstablishmentIdBatimentsBuildingIdPatch**](#updatebuildingapietablissementsestablishmentidbatimentsbuildingidpatch) | **PATCH** /api/etablissements/{establishment_id}/batiments/{building_id} | Update Building|
|[**updateEstablishmentApiEtablissementsEstablishmentIdPatch**](#updateestablishmentapietablissementsestablishmentidpatch) | **PATCH** /api/etablissements/{establishment_id} | Update Establishment|
|[**updateEstablishmentCoordinatesApiEtablissementsEstablishmentIdCoordinatesPatch**](#updateestablishmentcoordinatesapietablissementsestablishmentidcoordinatespatch) | **PATCH** /api/etablissements/{establishment_id}/coordinates | Update Establishment Coordinates|
|[**updateEstablishmentStatusApiEtablissementsEstablishmentIdStatusPatch**](#updateestablishmentstatusapietablissementsestablishmentidstatuspatch) | **PATCH** /api/etablissements/{establishment_id}/status | Update Establishment Status|
|[**updateRoomApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesRoomIdPatch**](#updateroomapietablissementsestablishmentidbatimentsbuildingidsallesroomidpatch) | **PATCH** /api/etablissements/{establishment_id}/batiments/{building_id}/salles/{room_id} | Update Room|

# **createBuildingApiEtablissementsEstablishmentIdBatimentsPost**
> BuildingOut createBuildingApiEtablissementsEstablishmentIdBatimentsPost(buildingCreate)


### Example

```typescript
import {
    EstablishmentsApi,
    Configuration,
    BuildingCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new EstablishmentsApi(configuration);

let establishmentId: string; // (default to undefined)
let buildingCreate: BuildingCreate; //

const { status, data } = await apiInstance.createBuildingApiEtablissementsEstablishmentIdBatimentsPost(
    establishmentId,
    buildingCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **buildingCreate** | **BuildingCreate**|  | |
| **establishmentId** | [**string**] |  | defaults to undefined|


### Return type

**BuildingOut**

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
|**201** | Successful Response |  -  |
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

# **createRoomApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesPost**
> RoomOut createRoomApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesPost(roomCreate)


### Example

```typescript
import {
    EstablishmentsApi,
    Configuration,
    RoomCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new EstablishmentsApi(configuration);

let establishmentId: string; // (default to undefined)
let buildingId: string; // (default to undefined)
let roomCreate: RoomCreate; //

const { status, data } = await apiInstance.createRoomApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesPost(
    establishmentId,
    buildingId,
    roomCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomCreate** | **RoomCreate**|  | |
| **establishmentId** | [**string**] |  | defaults to undefined|
| **buildingId** | [**string**] |  | defaults to undefined|


### Return type

**RoomOut**

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

# **deleteBuildingApiEtablissementsEstablishmentIdBatimentsBuildingIdDelete**
> deleteBuildingApiEtablissementsEstablishmentIdBatimentsBuildingIdDelete()


### Example

```typescript
import {
    EstablishmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EstablishmentsApi(configuration);

let establishmentId: string; // (default to undefined)
let buildingId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteBuildingApiEtablissementsEstablishmentIdBatimentsBuildingIdDelete(
    establishmentId,
    buildingId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **establishmentId** | [**string**] |  | defaults to undefined|
| **buildingId** | [**string**] |  | defaults to undefined|


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

# **deleteRoomApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesRoomIdDelete**
> deleteRoomApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesRoomIdDelete()


### Example

```typescript
import {
    EstablishmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EstablishmentsApi(configuration);

let establishmentId: string; // (default to undefined)
let buildingId: string; // (default to undefined)
let roomId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteRoomApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesRoomIdDelete(
    establishmentId,
    buildingId,
    roomId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **establishmentId** | [**string**] |  | defaults to undefined|
| **buildingId** | [**string**] |  | defaults to undefined|
| **roomId** | [**string**] |  | defaults to undefined|


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

# **exportEstablishmentAuditApiEtablissementsEstablishmentIdAuditExportGet**
> any exportEstablishmentAuditApiEtablissementsEstablishmentIdAuditExportGet()

Exporte les données d\'audit d\'un établissement  Requiert le rôle ROLE_ADMIN ou ROLE_ADMINSTAFF. ROLE_ADMINSTAFF ne peut exporter que les données de son propre établissement.  **Paramètres :** - `date_from` : Date de début pour l\'export (optionnel) - `date_to` : Date de fin pour l\'export (optionnel) - `format` : Format d\'export (\"json\" ou \"csv\")  **Retourne :** - Fichier JSON ou CSV avec les données d\'audit

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

# **getBuildingApiEtablissementsEstablishmentIdBatimentsBuildingIdGet**
> BuildingOut getBuildingApiEtablissementsEstablishmentIdBatimentsBuildingIdGet()


### Example

```typescript
import {
    EstablishmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EstablishmentsApi(configuration);

let establishmentId: string; // (default to undefined)
let buildingId: string; // (default to undefined)

const { status, data } = await apiInstance.getBuildingApiEtablissementsEstablishmentIdBatimentsBuildingIdGet(
    establishmentId,
    buildingId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **establishmentId** | [**string**] |  | defaults to undefined|
| **buildingId** | [**string**] |  | defaults to undefined|


### Return type

**BuildingOut**

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

Récupère un établissement par son ID  Requiert le rôle ROLE_ADMIN ou ROLE_ADMINSTAFF. ROLE_ADMINSTAFF ne peut accéder qu\'à son propre établissement.

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

Récupère l\'historique d\'audit d\'un établissement avec filtres et pagination  Requiert le rôle ROLE_ADMIN ou ROLE_ADMINSTAFF. ROLE_ADMINSTAFF ne peut accéder qu\'à l\'audit de son propre établissement.  **Paramètres de filtrage :** - `operation` : Type d\'opération (CREATE, UPDATE, DELETE, STATUS_CHANGE, INSERT) - `auteur_id` : ID de l\'auteur de l\'opération - `auteur_nom` : Nom de l\'auteur (recherche partielle) - `date_from` : Date de début pour le filtrage - `date_to` : Date de fin pour le filtrage  **Paramètres de pagination :** - `limit` : Nombre maximum d\'éléments (1-100) - `offset` : Offset pour la pagination  **Paramètres de tri :** - `sort_by` : Champ de tri (date_operation, operation, auteur_nom, id) - `sort_order` : Ordre de tri (asc/desc)

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

Récupère les statistiques d\'audit pour un établissement  Requiert le rôle ROLE_ADMIN ou ROLE_ADMINSTAFF. ROLE_ADMINSTAFF ne peut accéder qu\'aux statistiques de son propre établissement.  **Retourne :** - Nombre total d\'opérations - Nombre d\'opérations par type - Date de la dernière opération - Utilisateur le plus actif - Nombre d\'opérations ce mois-ci

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

Récupère un résumé d\'audit pour un établissement sur une période donnée  Requiert le rôle ROLE_ADMIN ou ROLE_ADMINSTAFF. ROLE_ADMINSTAFF ne peut accéder qu\'au résumé de son propre établissement.  **Paramètres :** - `days` : Nombre de jours pour le résumé (1-365, défaut: 30)  **Retourne :** - Résumé des opérations par type - Activité par utilisateur - Activité quotidienne - Utilisateur le plus actif - Opération la plus courante

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

# **getLastCodeEtablissementApiEtablissementsLastCodeGet**
> LastCodeEtablissementResponse getLastCodeEtablissementApiEtablissementsLastCodeGet()

Récupère le dernier code établissement utilisé  Cette route permet aux administrateurs de connaître le dernier code utilisé. La logique de calcul du code suivant appartient au client.  Requiert le rôle ROLE_ADMIN.

### Example

```typescript
import {
    EstablishmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EstablishmentsApi(configuration);

const { status, data } = await apiInstance.getLastCodeEtablissementApiEtablissementsLastCodeGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**LastCodeEtablissementResponse**

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

# **getRoomApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesRoomIdGet**
> RoomOut getRoomApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesRoomIdGet()


### Example

```typescript
import {
    EstablishmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EstablishmentsApi(configuration);

let establishmentId: string; // (default to undefined)
let buildingId: string; // (default to undefined)
let roomId: string; // (default to undefined)

const { status, data } = await apiInstance.getRoomApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesRoomIdGet(
    establishmentId,
    buildingId,
    roomId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **establishmentId** | [**string**] |  | defaults to undefined|
| **buildingId** | [**string**] |  | defaults to undefined|
| **roomId** | [**string**] |  | defaults to undefined|


### Return type

**RoomOut**

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

# **listBuildingsApiEtablissementsEstablishmentIdBatimentsGet**
> BuildingListResponse listBuildingsApiEtablissementsEstablishmentIdBatimentsGet()


### Example

```typescript
import {
    EstablishmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EstablishmentsApi(configuration);

let establishmentId: string; // (default to undefined)
let page: number; // (optional) (default to 1)
let size: number; // (optional) (default to 10)
let q: string; //Recherche par nom (optional) (default to undefined)
let orderBy: string; // (optional) (default to 'created_at')
let orderDir: string; // (optional) (default to 'desc')

const { status, data } = await apiInstance.listBuildingsApiEtablissementsEstablishmentIdBatimentsGet(
    establishmentId,
    page,
    size,
    q,
    orderBy,
    orderDir
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **establishmentId** | [**string**] |  | defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to 1|
| **size** | [**number**] |  | (optional) defaults to 10|
| **q** | [**string**] | Recherche par nom | (optional) defaults to undefined|
| **orderBy** | [**string**] |  | (optional) defaults to 'created_at'|
| **orderDir** | [**string**] |  | (optional) defaults to 'desc'|


### Return type

**BuildingListResponse**

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

# **listRoomsApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesGet**
> RoomListResponse listRoomsApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesGet()


### Example

```typescript
import {
    EstablishmentsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EstablishmentsApi(configuration);

let establishmentId: string; // (default to undefined)
let buildingId: string; // (default to undefined)
let page: number; // (optional) (default to 1)
let size: number; // (optional) (default to 10)
let q: string; // (optional) (default to undefined)
let orderBy: string; // (optional) (default to 'created_at')
let orderDir: string; // (optional) (default to 'desc')

const { status, data } = await apiInstance.listRoomsApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesGet(
    establishmentId,
    buildingId,
    page,
    size,
    q,
    orderBy,
    orderDir
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **establishmentId** | [**string**] |  | defaults to undefined|
| **buildingId** | [**string**] |  | defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to 1|
| **size** | [**number**] |  | (optional) defaults to 10|
| **q** | [**string**] |  | (optional) defaults to undefined|
| **orderBy** | [**string**] |  | (optional) defaults to 'created_at'|
| **orderDir** | [**string**] |  | (optional) defaults to 'desc'|


### Return type

**RoomListResponse**

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

# **updateBuildingApiEtablissementsEstablishmentIdBatimentsBuildingIdPatch**
> BuildingOut updateBuildingApiEtablissementsEstablishmentIdBatimentsBuildingIdPatch(buildingUpdate)


### Example

```typescript
import {
    EstablishmentsApi,
    Configuration,
    BuildingUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new EstablishmentsApi(configuration);

let establishmentId: string; // (default to undefined)
let buildingId: string; // (default to undefined)
let buildingUpdate: BuildingUpdate; //

const { status, data } = await apiInstance.updateBuildingApiEtablissementsEstablishmentIdBatimentsBuildingIdPatch(
    establishmentId,
    buildingId,
    buildingUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **buildingUpdate** | **BuildingUpdate**|  | |
| **establishmentId** | [**string**] |  | defaults to undefined|
| **buildingId** | [**string**] |  | defaults to undefined|


### Return type

**BuildingOut**

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

Met à jour les coordonnées d\'un établissement  Requiert le rôle ROLE_ADMIN ou ROLE_ADMINSTAFF. ROLE_ADMINSTAFF ne peut modifier que son propre établissement.

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

# **updateRoomApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesRoomIdPatch**
> RoomOut updateRoomApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesRoomIdPatch(roomUpdate)


### Example

```typescript
import {
    EstablishmentsApi,
    Configuration,
    RoomUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new EstablishmentsApi(configuration);

let establishmentId: string; // (default to undefined)
let buildingId: string; // (default to undefined)
let roomId: string; // (default to undefined)
let roomUpdate: RoomUpdate; //

const { status, data } = await apiInstance.updateRoomApiEtablissementsEstablishmentIdBatimentsBuildingIdSallesRoomIdPatch(
    establishmentId,
    buildingId,
    roomId,
    roomUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomUpdate** | **RoomUpdate**|  | |
| **establishmentId** | [**string**] |  | defaults to undefined|
| **buildingId** | [**string**] |  | defaults to undefined|
| **roomId** | [**string**] |  | defaults to undefined|


### Return type

**RoomOut**

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


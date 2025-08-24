# EstablishmentsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createEstablishmentApiEtablissementsPost**](#createestablishmentapietablissementspost) | **POST** /api/etablissements/ | Create Establishment|
|[**getEstablishmentApiEtablissementsEstablishmentIdGet**](#getestablishmentapietablissementsestablishmentidget) | **GET** /api/etablissements/{establishment_id} | Get Establishment|
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


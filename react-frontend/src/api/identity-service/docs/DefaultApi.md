# DefaultApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**bulkImportIdentitiesApiV1IdentityBulkimportPost**](#bulkimportidentitiesapiv1identitybulkimportpost) | **POST** /api/v1/identity/bulkimport | Bulk Import Identities|
|[**getAuditHistoryApiV1IdentityBulkimportAuditGet**](#getaudithistoryapiv1identitybulkimportauditget) | **GET** /api/v1/identity/bulkimport/audit | Get Audit History|
|[**getCsvTemplateApiV1IdentityBulkimportTemplateDomainGet**](#getcsvtemplateapiv1identitybulkimporttemplatedomainget) | **GET** /api/v1/identity/bulkimport/template/{domain} | Get Csv Template|
|[**healthCheckHealthGet**](#healthcheckhealthget) | **GET** /health | Health Check|
|[**rootGet**](#rootget) | **GET** / | Root|

# **bulkImportIdentitiesApiV1IdentityBulkimportPost**
> BulkImportResponse bulkImportIdentitiesApiV1IdentityBulkimportPost()

Import en masse d\'identités via fichier CSV.       Accepte les formats CSV avec les schémas suivants :  - **students.csv** : establishment_id;firstname;lastname;birth_date;gender;level;account_required;email;phone  - **parents.csv** : establishment_id;firstname;lastname;email;phone  - **teachers.csv** : establishment_id;firstname;lastname;email;phone;subject;hire_date  - **admin_staff.csv** : establishment_id;firstname;lastname;email;phone;position;hire_date    Note: L\'external_id (ID Keycloak) sera automatiquement généré lors de la création du compte.    Le domaine est automatiquement détecté à partir des en-têtes du CSV.

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


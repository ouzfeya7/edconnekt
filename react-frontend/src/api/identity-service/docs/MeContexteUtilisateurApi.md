# MeContexteUtilisateurApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getUserEstablishmentsApiV1IdentityMeEstablishmentsGet**](#getuserestablishmentsapiv1identitymeestablishmentsget) | **GET** /api/v1/identity/me/establishments | Liste des établissements de l\&#39;utilisateur|
|[**getUserRolesApiV1IdentityMeRolesGet**](#getuserrolesapiv1identitymerolesget) | **GET** /api/v1/identity/me/roles | Rôles de l\&#39;utilisateur dans un établissement|
|[**selectContextApiV1IdentityMeContextSelectPost**](#selectcontextapiv1identitymecontextselectpost) | **POST** /api/v1/identity/me/context/select | Validation de la sélection de contexte|

# **getUserEstablishmentsApiV1IdentityMeEstablishmentsGet**
> StandardListResponse getUserEstablishmentsApiV1IdentityMeEstablishmentsGet()

Récupère la liste des établissements auxquels l\'utilisateur est rattaché.          **Source de données :** `identity_establishment` table     **Authentification :** Requiert en-tête `X-User`     **Réponse :** Liste des UUIDs d\'établissements          **Erreurs :**     - `403` : Aucun rattachement à un établissement     - `404` : Utilisateur non trouvé

### Example

```typescript
import {
    MeContexteUtilisateurApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MeContexteUtilisateurApi(configuration);

const { status, data } = await apiInstance.getUserEstablishmentsApiV1IdentityMeEstablishmentsGet();
```

### Parameters
This endpoint does not have any parameters.


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
|**403** | Accès non autorisé |  -  |
|**404** | Ressource non trouvée |  -  |
|**500** | Erreur interne du serveur |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUserRolesApiV1IdentityMeRolesGet**
> StandardListResponse getUserRolesApiV1IdentityMeRolesGet()

Récupère les rôles de l\'utilisateur dans un établissement spécifique.          **Source de données :** `identity_establishment_role` avec jointures sur les catalogues     **Authentification :** Requiert en-têtes `X-User`     **Paramètres :** `etab` (UUID de l\'établissement)     **Réponse :** Liste des rôles avec détails (principal, effectif, cycles, matières)          **Erreurs :**     - `403` : Utilisateur non rattaché à l\'établissement ou aucun rôle     - `404` : Utilisateur non trouvé

### Example

```typescript
import {
    MeContexteUtilisateurApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MeContexteUtilisateurApi(configuration);

let etab: string; //UUID de l\'établissement (default to undefined)

const { status, data } = await apiInstance.getUserRolesApiV1IdentityMeRolesGet(
    etab
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **etab** | [**string**] | UUID de l\&#39;établissement | defaults to undefined|


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
|**403** | Accès non autorisé |  -  |
|**404** | Ressource non trouvée |  -  |
|**500** | Erreur interne du serveur |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **selectContextApiV1IdentityMeContextSelectPost**
> ContextSelectResponse selectContextApiV1IdentityMeContextSelectPost(contextSelectRequest)

Valide la sélection de contexte (établissement + rôle) par l\'utilisateur.          **Validation :** Vérifie que l\'utilisateur a ce rôle dans cet établissement     **Authentification :** Requiert en-tête `X-User`     **Action :** auth-service s\'occupe de l\'injection des en-têtes après validation          **Erreurs :**     - `403` : Sélection non autorisée (rôle non valide pour l\'établissement)     - `404` : Utilisateur non trouvé

### Example

```typescript
import {
    MeContexteUtilisateurApi,
    Configuration,
    ContextSelectRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new MeContexteUtilisateurApi(configuration);

let contextSelectRequest: ContextSelectRequest; //

const { status, data } = await apiInstance.selectContextApiV1IdentityMeContextSelectPost(
    contextSelectRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **contextSelectRequest** | **ContextSelectRequest**|  | |


### Return type

**ContextSelectResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**403** | Accès non autorisé |  -  |
|**404** | Ressource non trouvée |  -  |
|**500** | Erreur interne du serveur |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


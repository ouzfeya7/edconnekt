# AbsencesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createAbsenceAbsencesPost**](#createabsenceabsencespost) | **POST** /absences/ | Create Absence|
|[**deleteAbsenceAbsencesAbsenceIdDelete**](#deleteabsenceabsencesabsenceiddelete) | **DELETE** /absences/{absence_id} | Delete Absence|
|[**validateAbsenceAbsencesAbsenceIdValidatePost**](#validateabsenceabsencesabsenceidvalidatepost) | **POST** /absences/{absence_id}/validate | Validate Absence|

# **createAbsenceAbsencesPost**
> AbsenceRead createAbsenceAbsencesPost(absenceCreate)

Déclarer une absence (status REPORTED). Rôles: ENSEIGNANT, COORDONNATEUR, ADMIN

### Example

```typescript
import {
    AbsencesApi,
    Configuration,
    AbsenceCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new AbsencesApi(configuration);

let absenceCreate: AbsenceCreate; //

const { status, data } = await apiInstance.createAbsenceAbsencesPost(
    absenceCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **absenceCreate** | **AbsenceCreate**|  | |


### Return type

**AbsenceRead**

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

# **deleteAbsenceAbsencesAbsenceIdDelete**
> AbsenceRead deleteAbsenceAbsencesAbsenceIdDelete()

Supprimer une absence. Rôles: COORDONNATEUR, ADMIN

### Example

```typescript
import {
    AbsencesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AbsencesApi(configuration);

let absenceId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteAbsenceAbsencesAbsenceIdDelete(
    absenceId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **absenceId** | [**string**] |  | defaults to undefined|


### Return type

**AbsenceRead**

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

# **validateAbsenceAbsencesAbsenceIdValidatePost**
> AbsenceRead validateAbsenceAbsencesAbsenceIdValidatePost()

Valider une absence (status VALIDATED). Rôle: DIRECTEUR. Propage le status sur les lessons du créneau.

### Example

```typescript
import {
    AbsencesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AbsencesApi(configuration);

let absenceId: string; // (default to undefined)

const { status, data } = await apiInstance.validateAbsenceAbsencesAbsenceIdValidatePost(
    absenceId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **absenceId** | [**string**] |  | defaults to undefined|


### Return type

**AbsenceRead**

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


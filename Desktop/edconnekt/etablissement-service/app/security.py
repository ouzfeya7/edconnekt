from fastapi import Depends, HTTPException
from fastapi.security import OAuth2AuthorizationCodeBearer
from jose import jwt, JWTError
import requests
import os

# à adapter à ton Keycloak
KEYCLOAK_REALM = "EdConnect"
KEYCLOAK_URL = "http://keycloak.localhost:8081"
CLIENT_ID = "myclient"
ALGORITHM = "RS256"

oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=f"{KEYCLOAK_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/auth",
    tokenUrl=f"{KEYCLOAK_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/token"
)

# récupérer la clé publique
def get_public_key():
    response = requests.get(f"{KEYCLOAK_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/certs")
    jwks = response.json()
    public_key = jwt.algorithms.RSAAlgorithm.from_jwk(jwks["keys"][0])
    return public_key

# décoder le token
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, get_public_key(), algorithms=[ALGORITHM], audience=CLIENT_ID)
        return {
            "sub": payload.get("sub"),
            "roles": payload.get("realm_access", {}).get("roles", []),
            "group": payload.get("etablissement_id")  # selon le mapper Keycloak
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide ou expiré")

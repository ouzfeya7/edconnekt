
from fastapi import Depends, HTTPException, Header
from jose import jwt, JWTError
import requests
import os

KEYCLOAK_URL = os.getenv("KEYCLOAK_URL", "http://keycloak.localhost:8081")
REALM = os.getenv("KEYCLOAK_REALM", "EdConnect")

# 🔑 Récupération de la clé publique (caching conseillé en prod)
def get_jwk():
    response = requests.get(f"{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/certs")
    return response.json()

def get_current_user(authorization: str = Header(...)):
    try:
        token = authorization.split()[1]  # "Bearer <token>"
        jwks = get_jwk()
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header["kid"]
        key = next(k for k in jwks["keys"] if k["kid"] == kid)
        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=os.getenv("KEYCLOAK_CLIENT_ID", "yka"),
            issuer=f"{KEYCLOAK_URL}/realms/{REALM}"
        )
        return payload  # Contient sub, email, realm_access.roles...
    except JWTError:
        raise HTTPException(status_code=403, detail="Token invalide")


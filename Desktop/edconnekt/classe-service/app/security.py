from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
import requests
from jose.exceptions import JWTError
from typing import Dict
import os

# 📌 Config Keycloak
KEYCLOAK_URL = os.getenv("KEYCLOAK_URL", "http://keycloak.localhost:8081")
KEYCLOAK_REALM = os.getenv("KEYCLOAK_REALM", "EdConnect")
KEYCLOAK_CLIENT_ID = os.getenv("KEYCLOAK_CLIENT_ID", "yka")

# Endpoint JWK de Keycloak
JWKS_URL = f"{KEYCLOAK_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/certs"

# FastAPI Security
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# 🔐 Fonction pour récupérer les clés publiques (cache possible)
def get_jwk_key(token: str) -> Dict:
    try:
        jwks = requests.get(JWKS_URL, timeout=5).json()
        headers = jwt.get_unverified_header(token)
        for key in jwks["keys"]:
            if key["kid"] == headers["kid"]:
                return key
        raise Exception("Clé JWK non trouvée")
    except Exception as e:
        raise HTTPException(status_code=403, detail=f"Échec validation token : {e}")


# 🔐 Décoder le token JWT et retourner les claims
def verify_token(token: str) -> Dict:
    key = get_jwk_key(token)
    try:
        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=KEYCLOAK_CLIENT_ID,
            options={"verify_aud": False}  # désactive la vérification d'audience si besoin
        )
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Token invalide ou expiré : {str(e)}"
        )


# 🔑 À utiliser dans les endpoints pour sécuriser
def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict:
    return verify_token(token)
def has_role(user: dict, required_roles: list[str]) -> bool:
    roles = user.get("realm_access", {}).get("roles", [])
    return any(role in roles for role in required_roles)

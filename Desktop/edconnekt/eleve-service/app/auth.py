from fastapi import Depends, HTTPException, Header
from jose import jwt, JWTError
import requests
import os

# 🔐 Config Keycloak via env
KEYCLOAK_URL = os.getenv("KEYCLOAK_URL", "http://keycloak.localhost:8081")
REALM = os.getenv("KEYCLOAK_REALM", "EdConnect")
CLIENT_ID = os.getenv("KEYCLOAK_CLIENT_ID", "myclient")

JWK_CACHE = None  # mise en cache temporaire des clés

def get_jwk():
    global JWK_CACHE
    if JWK_CACHE:
        return JWK_CACHE

    jwks_url = f"{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/certs"
    response = requests.get(jwks_url)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Impossible de récupérer les clés publiques de Keycloak")
    
    JWK_CACHE = response.json()
    return JWK_CACHE

def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Le token Bearer est manquant ou mal formé")
    token = authorization.split(" ")[1]
    try:
        # 🔍 Récupération des JWK
        jwks = get_jwk()
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header["kid"]
        key = next((k for k in jwks["keys"] if k["kid"] == kid), None)
        if not key:
            raise HTTPException(status_code=401, detail="Clé publique non trouvée pour ce token")
        # Décodage sécurisé du token
        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=CLIENT_ID,
            issuer=f"{KEYCLOAK_URL}/realms/{REALM}"
        )
        return payload  # Contient les claims du token

    except JWTError as e:
        raise HTTPException(status_code=403, detail=f"Token invalide : {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=403, detail=f"Erreur d'authentification : {str(e)}")

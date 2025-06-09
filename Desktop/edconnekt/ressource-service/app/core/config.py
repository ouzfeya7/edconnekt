from fastapi import Depends, HTTPException
from fastapi.security import OAuth2AuthorizationCodeBearer
from jose import jwt, JWTError
import requests
from app.core.settings import settings

# Configuration Keycloak
KEYCLOAK_REALM = str(settings.KEYCLOAK_ISSUER).rsplit('/', 1)[-1]
KEYCLOAK_URL =str(settings.KEYCLOAK_ISSUER).rsplit('/realms', 1)[0]
CLIENT_ID = settings.API_AUDIENCE
ALGORITHM = "RS256"

oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=f"{KEYCLOAK_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/auth",
    tokenUrl=f"{KEYCLOAK_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/token",scopes={
    "categorie:create": "Créer une catégorie",
    "categorie:read": "Lire les catégories",
    "categorie:update": "Modifier une catégorie",
    "categorie:delete": "Supprimer une catégorie"
}
)
# Récupération de la clé publique Keycloak via JWKS
_jwks = None
def get_public_key():
    global _jwks
    if _jwks is None:
        resp = requests.get(settings.KEYCLOAK_JWKS_URL)
        resp.raise_for_status()
        jwks = resp.json()
        _jwks = jwks["keys"][0]
    return jwt.algorithms.RSAAlgorithm.from_jwk(_jwks)
# Dépendance FastAPI pour récupérer l'utilisateur courant
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        public_key = get_public_key()
        payload = jwt.decode(
            token,
            public_key,
            algorithms=[ALGORITHM],
            audience=CLIENT_ID,
            issuer=settings.KEYCLOAK_ISSUER
        )
        token_scopes = payload.get("scope", "").split()
        for scope in security_scopes.scopes:
            if scope not in token_scopes:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Permission manquante : {scope}",
                )
        return {
            "sub": payload.get("sub"),
            "roles": payload.get("realm_access", {}).get("roles", []),
            # Extrait un attribut personnalisé (ex: etablissement_id)
            "group": payload.get("etablissement_id")
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide ou expiré")

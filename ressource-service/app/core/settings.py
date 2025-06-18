from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

import os
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user_with_scopes(token: str = Depends(oauth2_scheme)):
    # Simule un utilisateur, ou fais une vraie validation de token avec Keycloak
    return {"sub": "user_id", "scopes": ["read", "write"]}
class Settings(BaseSettings):
    # Indique à pydantic-settings de charger .env
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )
    # Database URL pour FastAPI
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:password@ressources-db:5432/ressources"
    )
    # Répertoires d’uploads
    UPLOAD_IMAGES_DIR: str = os.getenv("UPLOAD_IMAGES_DIR", "uploads/images")
    UPLOAD_FILES_DIR: str = os.getenv("UPLOAD_FILES_DIR", "uploads/fichiers")
    # Extensions autorisées pour les fichiers
    ALLOWED_FILE_EXTENSIONS: List[str] = ["pdf", "docx", "pptx", "xlsx"]
    # URL du service d’audit
    AUDIT_SERVICE_URL: AnyHttpUrl = os.getenv(
        "AUDIT_SERVICE_URL",
        "http://audit-service:8000/api/v1/audit"
    )
    # Configuration Keycloak pour la sécurité
    KEYCLOAK_ISSUER: AnyHttpUrl = os.getenv(
        "KEYCLOAK_ISSUER",
        "http://keycloak:8080/auth/realms/EdConnect"
    )
    KEYCLOAK_JWKS_URL: AnyHttpUrl = os.getenv(
        "KEYCLOAK_JWKS_URL",
        "http://keycloak:8080/auth/realms/EdConnect/protocol/openid-connect/certs"
    )
    API_AUDIENCE: str = os.getenv("API_AUDIENCE", "ressource-service")

    @field_validator("UPLOAD_IMAGES_DIR", "UPLOAD_FILES_DIR", mode="before")
    def create_upload_dirs(cls, v: str) -> str:
        os.makedirs(v, exist_ok=True)
        return v

# Instanciation de la configuration
settings = Settings()

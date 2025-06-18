from pydantic import BaseModel
from typing import Optional, Any, Dict
from datetime import datetime

# Base schema définissant les champs partagés
class AuditLogBase(BaseModel):
    service: str              # Nom du microservice émetteur
    entite: str               # Type d'entité ("Ressource", "Categorie", etc.)
    entite_id: str            # ID de l'entité concernée
    action: str               # Action CRUD : "CREATE", "UPDATE", "DELETE", etc.
    payload: Optional[Dict[str, Any]] = None  # Détails facultatifs de l'événement

# Schema pour la création d'un audit (inclut la date de l'action)
class AuditLogCreate(AuditLogBase):
    performed_by_id: Optional[str]    # ID de l’utilisateur (Keycloak sub ou email)
    performed_by_label: Optional[str] # Libellé humain (nom/role) au moment de l’action
    performed_at: datetime            # Timestamp de l’action (UTC)

# Schema pour la sortie (lecture) d’un audit
class AuditLogOut(AuditLogBase):
    id: str                           # UUID de l’enregistrement d’audit
    performed_by_id: Optional[str]
    performed_by_label: Optional[str]
    performed_at: datetime            # Timestamp de l’action

    class Config:
        orm_mode = True               # Lecture depuis le modèle SQLAlchemy

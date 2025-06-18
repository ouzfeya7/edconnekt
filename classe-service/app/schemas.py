from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


# 🔹 Base classe
class ClasseBase(BaseModel):
    nom: str
    niveau: str
    annee_scolaire: str
    etablissement_id: UUID


# 🔹 Création classe
class ClasseCreate(ClasseBase):
    createur_id: str  # ID Keycloak du directeur/admin


# 🔹 Mise à jour classe
class ClasseUpdate(BaseModel):
    nom: Optional[str]
    niveau: Optional[str]
    annee_scolaire: Optional[str]


# 🔹 Réponse classe
class ClasseOut(ClasseBase):
    id: UUID
    createur_id: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        model_config = {
    "from_attributes": True
}


# 🔹 Affectation enseignant
class ClasseEnseignantCreate(BaseModel):
    classe_id: UUID
    enseignant_kc_id: str


class ClasseEnseignantOut(ClasseEnseignantCreate):
    id: UUID
    date_affectation: datetime
    date_fin: Optional[datetime]

    class Config:
        model_config = {
    "from_attributes": True
}


# 🔹 Affectation élève
class ClasseEleveCreate(BaseModel):
    classe_id: UUID
    eleve_id: UUID


class ClasseEleveOut(ClasseEleveCreate):
    id: UUID
    date_entree: datetime
    date_sortie: Optional[datetime]

    class Config:
        model_config = {
    "from_attributes": True
}


# 🔹 Audit
class ClasseAuditCreate(BaseModel):
    classe_id: UUID
    operation: str
    motif: Optional[str]
    auteur_id: str
    auteur_nom: Optional[str]


class ClasseAuditOut(ClasseAuditCreate):
    id: UUID
    date_operation: datetime

    class Config:
        model_config = {
    "from_attributes": True
}

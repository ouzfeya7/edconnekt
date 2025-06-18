from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from uuid import UUID


# 🔹 Base élève
class EleveBase(BaseModel):
    prenom: str
    nom: str
    date_naissance: Optional[date]
    sexe: Optional[str]
    etablissement_id: UUID
    parent_kc_id: Optional[str]


class EleveCreate(EleveBase):
    pass


class EleveUpdate(BaseModel):
    prenom: Optional[str]
    nom: Optional[str]
    date_naissance: Optional[date]
    sexe: Optional[str]
    parent_kc_id: Optional[str]


# 🔹 Réponse d’un élève
class EleveOut(EleveBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
       model_config = {"from_attributes": True}


# 🔹 Affectation élève à une classe
class EleveClasseBase(BaseModel):
    classe_id: UUID
    enseignant_kc_id: Optional[str]
    date_entree: date
    date_sortie: Optional[date]


class EleveClasseCreate(EleveClasseBase):
    eleve_id: UUID


class EleveClasseOut(EleveClasseBase):
    id: UUID
    eleve_id: UUID

    class Config:
        model_config = {
    "from_attributes": True
}


# 🔹 Journalisation (audit)
class EleveAuditCreate(BaseModel):
    eleve_id: UUID
    operation: str               # Ex: "CREATE", "AFFECTATION"
    motif: Optional[str]
    auteur_id: Optional[str]
    auteur_nom: Optional[str]


class EleveAuditOut(EleveAuditCreate):
    id: UUID
    date_operation: datetime

    class Config:
        model_config = {
    "from_attributes": True
}

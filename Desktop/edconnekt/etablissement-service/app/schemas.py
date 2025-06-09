from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime

class EtablissementCreate(BaseModel):
    code: str
    nom: str
    adresse: str
    email: EmailStr
    telephone: str
    statut_abonnement: Optional[str] = "actif"
    type_abonnement: Optional[str] = "gratuit"
    date_debut: Optional[date]
    date_fin: Optional[date]

class EtablissementUpdate(BaseModel):
    nom: Optional[str]
    adresse: Optional[str]
    email: Optional[EmailStr]
    telephone: Optional[str]
    statut_abonnement: Optional[str]
    type_abonnement: Optional[str]
    date_debut: Optional[date]
    date_fin: Optional[date]

class EtablissementAuditCreate(BaseModel):
    etablissement_id: int
    operation: str
    motif: Optional[str] = None
    auteur_id: Optional[str] = None
    auteur_nom: Optional[str] = None

class EtablissementAuditResponse(EtablissementAuditCreate):
    id: int
    date_operation: datetime

    class Config:   
        from_attributes = True

class EtablissementOut(EtablissementCreate):
    id: int
    date_creation: date
    date_modification: Optional[date]
    etablissement_group: Optional[str]
    etablissement_id: Optional[str]
    etablissement_ouvert: Optional[bool]
    etablissement_ferme: Optional[bool]
    audits: Optional[List[EtablissementAuditResponse]] = []

    class Config:
        from_attributes = True

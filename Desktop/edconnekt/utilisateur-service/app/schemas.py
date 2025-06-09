from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID

class UtilisateurBase(BaseModel):
    email: EmailStr
    nom_complet: Optional[str]
    telephone: Optional[str]
    photo_url: Optional[str]
    role: Optional[str]
    etablissement_id: Optional[UUID]

class UtilisateurCreate(UtilisateurBase):
    kc_id: str

class UtilisateurUpdate(BaseModel):
    nom_complet: Optional[str]
    telephone: Optional[str]
    photo_url: Optional[str]

class UtilisateurOut(UtilisateurBase):
    id: UUID
    kc_id: str

    class Config:
        orm_mode = True

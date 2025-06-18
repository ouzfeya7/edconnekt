from pydantic import BaseModel,ConfigDict
from typing import Optional, List
from datetime import datetime

class RessourceBase(BaseModel):
    titre: str

class RessourceCreate(RessourceBase):
    categorie_id: int
    annee: Optional[str] = None
    is_recent: Optional[bool] = True
    fichier: str  # Chemin ou URL du fichier

class RessourceUpdate(BaseModel):
    titre: Optional[str] = None
    annee: Optional[str] = None
    is_recent: Optional[bool] = None
    fichier: Optional[str] = None

class RessourceOut(RessourceBase):
    id: int
    fichier: str
    annee: Optional[str]
    is_recent: bool
    categorie_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        model_config = ConfigDict(from_attributes=True)
from pydantic import BaseModel,ConfigDict
from typing import Optional, List
from datetime import datetime

# ===========================
# Schemas pour Categorie
# ===========================
class CategorieBase(BaseModel):
    nom: str

class CategorieCreate(CategorieBase):
    image: Optional[str] = None

class CategorieUpdate(BaseModel):
    nom: Optional[str] = None
    image: Optional[str] = None

class CategorieOut(CategorieBase):
    id: int
    image: Optional[str]
    created_at: datetime
    updated_at: datetime
    # Liste des ressources associées
    ressources: Optional[List[int]] = []  # IDs des ressources

    class Config:
        model_config = ConfigDict(from_attributes=True)
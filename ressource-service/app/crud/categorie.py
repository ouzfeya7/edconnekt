
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.categorie import Categorie

def create_categorie(db: Session, nom: str, image_path: Optional[str] = None) -> Categorie:
    db_cat = Categorie(nom=nom, image=image_path)
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat
def get_categorie_by_id(db: Session, cat_id: int) -> Optional[Categorie]:
    return db.query(Categorie).filter(Categorie.id == cat_id).first()
def get_all_categories(db: Session, skip: int = 0, limit: int = 100) -> List[Categorie]:
    return db.query(Categorie).offset(skip).limit(limit).all()
def update_categorie(
    db: Session,
    cat_id: int,
    nom: Optional[str] = None,
    image_path: Optional[str] = None
) -> Optional[Categorie]:
    cat = get_categorie_by_id(db, cat_id)
    if not cat:
        return None
    if nom:
        cat.nom = nom
    if image_path:
        cat.image = image_path
    db.commit()
    db.refresh(cat)
    return cat


def delete_categorie(db: Session, cat_id: int) -> None:
    cat = get_categorie_by_id(db, cat_id)
    if cat:
        db.delete(cat)
        db.commit()

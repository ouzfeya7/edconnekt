from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.ressource import Ressource

def create_ressource(
    db: Session,
    titre: str,
    fichier_path: str,
    categorie_id: int,
    annee: Optional[str] = None,
    is_recent: bool = True
) -> Ressource:
    db_res = Ressource(
        titre=titre,
        fichier=fichier_path,
        categorie_id=categorie_id,
        annee=annee,
        is_recent=is_recent
    )
    db.add(db_res)
    db.commit()
    db.refresh(db_res)
    return db_res

def get_ressource_by_id(db: Session, res_id: int) -> Optional[Ressource]:
    return db.query(Ressource).filter(Ressource.id == res_id).first()

def get_all_ressources(db: Session, skip: int = 0, limit: int = 100) -> List[Ressource]:
    return db.query(Ressource).offset(skip).limit(limit).all()

def get_ressources_by_categorie(
    db: Session,
    categorie_id: int,
    skip: int = 0,
    limit: int = 100
) -> List[Ressource]:
    return (
        db.query(Ressource)
        .filter(Ressource.categorie_id == categorie_id)
        .offset(skip)
        .limit(limit)
        .all()
    )

def update_ressource(
    db: Session,
    res_id: int,
    titre: Optional[str] = None,
    fichier_path: Optional[str] = None,
    annee: Optional[str] = None,
    is_recent: Optional[bool] = None
) -> Optional[Ressource]:
    res = get_ressource_by_id(db, res_id)
    if not res:
        return None
    if titre:
        res.titre = titre
    if fichier_path:
        res.fichier = fichier_path
    if annee is not None:
        res.annee = annee
    if is_recent is not None:
        res.is_recent = is_recent
    db.commit()
    db.refresh(res)
    return res

def delete_ressource(db: Session, res_id: int) -> None:
    res = get_ressource_by_id(db, res_id)
    if res:
        db.delete(res)
        db.commit()

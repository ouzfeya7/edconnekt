from sqlalchemy.orm import Session
from . import models, schemas

def get_user_by_kc_id(db: Session, kc_id: str):
    return db.query(models.Utilisateur).filter(models.Utilisateur.kc_id == kc_id).first()

def create_user(db: Session, data: schemas.UtilisateurCreate):
    user = models.Utilisateur(**data.dict())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def update_user(db: Session, kc_id: str, updates: schemas.UtilisateurUpdate):
    user = get_user_by_kc_id(db, kc_id)
    if not user:
        return None
    for field, value in updates.dict(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user

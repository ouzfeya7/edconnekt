
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import database, models, crud, schemas
from .auth import get_current_user

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Utilisateur Service")

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/me", response_model=schemas.UtilisateurOut)
def get_profile(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    user = crud.get_user_by_kc_id(db, current_user["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur inconnu")
    return user

@app.post("/utilisateurs", response_model=schemas.UtilisateurOut)
def create_user(data: schemas.UtilisateurCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, data)

@app.patch("/utilisateurs/{kc_id}", response_model=schemas.UtilisateurOut)
def update_user(kc_id: str, updates: schemas.UtilisateurUpdate, db: Session = Depends(get_db)):
    user = crud.update_user(db, kc_id, updates)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    return user

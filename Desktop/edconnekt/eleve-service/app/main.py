from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from . import models, schemas, crud, events
from .database import SessionLocal, engine
from .auth import get_current_user

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Eleve Service")

# ⚙️ Dépendance DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🛡️ Vérifie que l'utilisateur a un rôle requis
def check_role(user, required_roles: List[str]):
    user_roles = user.get("realm_access", {}).get("roles", [])
    if not any(role in user_roles for role in required_roles):
        raise HTTPException(status_code=403, detail="Accès interdit : rôle manquant")


# 🔹 Créer un élève
@app.post("/eleves", response_model=schemas.EleveOut)
def create_eleve(
    data: schemas.EleveCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_role(current_user, ["ROLE_ADMIN", "ROLE_DIRECTEUR"])
    eleve = crud.create_eleve(db, data)

    audit = schemas.EleveAuditCreate(
        eleve_id=eleve.id,
        operation="CREATE",
        motif="Création élève",
        auteur_id=current_user["sub"],
        auteur_nom=current_user.get("preferred_username", "inconnu")
    )
    crud.log_audit(db, audit)

    events.publish_eleve_event("EleveCreated", eleve.dict(), routing_key="eleve.created")
    return eleve


# 🔹 Récupérer un élève
@app.get("/eleves/{id}", response_model=schemas.EleveOut)
def get_eleve(id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return crud.get_eleve_by_id(db, id)


# 🔹 Modifier un élève
@app.patch("/eleves/{id}", response_model=schemas.EleveOut)
def update_eleve(
    id: str,
    updates: schemas.EleveUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_role(current_user, ["ROLE_ADMIN", "ROLE_DIRECTEUR"])
    eleve = crud.update_eleve(db, id, updates)
    if not eleve:
        raise HTTPException(status_code=404, detail="Élève introuvable")

    audit = schemas.EleveAuditCreate(
        eleve_id=eleve.id,
        operation="UPDATE",
        motif="Mise à jour élève",
        auteur_id=current_user["sub"],
        auteur_nom=current_user.get("preferred_username", "inconnu")
    )
    crud.log_audit(db, audit)
    events.publish_eleve_event("EleveUpdated", eleve.dict(), routing_key="eleve.updated")
    return eleve


# 🔹 Lister les élèves (filtrable par établissement)
@app.get("/eleves", response_model=List[schemas.EleveOut])
def list_eleves(
    etablissement_id: str = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_role(current_user, ["ROLE_ADMIN", "ROLE_DIRECTEUR", "ROLE_ENSEIGNANT"])
    return crud.get_all_eleves(db, etablissement_id)


# 🔹 Affecter un élève à une classe
@app.post("/eleves/affectation", response_model=schemas.EleveClasseOut)
def assign_classe(
    data: schemas.EleveClasseCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    check_role(current_user, ["ROLE_ADMIN", "ROLE_DIRECTEUR"])
    affectation = crud.assign_eleve_to_classe(db, data)

    audit = schemas.EleveAuditCreate(
        eleve_id=data.eleve_id,
        operation="AFFECTATION",
        motif="Affectation à une classe",
        auteur_id=current_user["sub"],
        auteur_nom=current_user.get("preferred_username", "inconnu")
    )
    crud.log_audit(db, audit)
    events.publish_eleve_event("EleveAssignedToClass", data.dict(), routing_key="eleve.classe.assigned")
    return affectation


# 🔹 Voir l’historique de classe d’un élève
@app.get("/eleves/{id}/classes", response_model=List[schemas.EleveClasseOut])
def get_eleve_classes(id: UUID, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return crud.get_eleve_class_history(db, id)


# 🔹 Voir les audits d’un élève
@app.get("/eleves/{id}/audits", response_model=List[schemas.EleveAuditOut])
def get_eleve_audits(id: UUID, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    check_role(current_user, ["ROLE_ADMIN", "ROLE_DIRECTEUR"])
    return crud.get_audits_by_eleve(db, id)

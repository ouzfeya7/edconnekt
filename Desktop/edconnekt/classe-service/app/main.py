from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List
from . import models, schemas, crud, events
from .database import SessionLocal, engine
from .security import get_current_user, has_role  

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Classe Service")


# DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/classes", response_model=schemas.ClasseOut)
def create_classe(
    data: schemas.ClasseCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if not has_role(current_user, ["ROLE_ADMIN_SYSTEME", "ROLE_DIRECTEUR"]):
        raise HTTPException(status_code=403, detail="Permission refusée")

    classe = crud.create_classe(db, data)
    crud.log_audit(db, schemas.ClasseAuditCreate(
        classe_id=classe.id,
        operation="CREATE",
        motif="Création classe",
        auteur_id=current_user["sub"],
        auteur_nom=current_user.get("preferred_username", "inconnu")
    ))
    events.publish_classe_event("ClasseCreated", classe.dict(), routing_key="classe.created")
    return classe


@app.patch("/classes/{classe_id}", response_model=schemas.ClasseOut)
def update_classe(
    classe_id: UUID,
    data: schemas.ClasseUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if not has_role(current_user, ["ROLE_ADMIN_SYSTEME", "ROLE_DIRECTEUR"]):
        raise HTTPException(status_code=403, detail="Permission refusée")

    classe = crud.update_classe(db, classe_id, data)
    if not classe:
        raise HTTPException(status_code=404, detail="Classe introuvable")

    crud.log_audit(db, schemas.ClasseAuditCreate(
        classe_id=classe.id,
        operation="UPDATE",
        motif="Modification classe",
        auteur_id=current_user["sub"],
        auteur_nom=current_user.get("preferred_username", "inconnu")
    ))
    events.publish_classe_event("ClasseUpdated", classe.dict(), routing_key="classe.updated")
    return classe


@app.post("/classes/enseignants", response_model=schemas.ClasseEnseignantOut)
def assign_enseignant(
    data: schemas.ClasseEnseignantCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if not has_role(current_user, ["ROLE_DIRECTEUR", "ROLE_COORDONNATEUR"]):
        raise HTTPException(status_code=403, detail="Permission refusée")

    affectation = crud.assign_enseignant(db, data)
    crud.log_audit(db, schemas.ClasseAuditCreate(
        classe_id=data.classe_id,
        operation="AFFECTATION_ENSEIGNANT",
        motif="Affectation enseignant",
        auteur_id=current_user["sub"],
        auteur_nom=current_user.get("preferred_username", "inconnu")
    ))
    events.publish_classe_event("EnseignantAssigned", data.dict(), routing_key="classe.enseignant.assigned")
    return affectation


@app.post("/classes/eleves", response_model=schemas.ClasseEleveOut)
def assign_eleve(
    data: schemas.ClasseEleveCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if not has_role(current_user, ["ROLE_DIRECTEUR", "ROLE_VIE_SCOLAIRE"]):
        raise HTTPException(status_code=403, detail="Permission refusée")

    affectation = crud.assign_eleve(db, data)
    crud.log_audit(db, schemas.ClasseAuditCreate(
        classe_id=data.classe_id,
        operation="AFFECTATION_ELEVE",
        motif="Affectation élève",
        auteur_id=current_user["sub"],
        auteur_nom=current_user.get("preferred_username", "inconnu")
    ))
    events.publish_classe_event("EleveAssigned", data.dict(), routing_key="classe.eleve.assigned")
    return affectation


@app.get("/classes/{classe_id}", response_model=schemas.ClasseOut)
def get_classe(
    classe_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return crud.get_classe_by_id(db, classe_id)


@app.get("/classes", response_model=List[schemas.ClasseOut])
def get_classes(
    etablissement_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return crud.get_classes_by_etablissement(db, etablissement_id)


@app.get("/classes/{classe_id}/enseignants", response_model=List[schemas.ClasseEnseignantOut])
def get_enseignants(
    classe_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return crud.get_enseignants_by_classe(db, classe_id)


@app.get("/classes/{classe_id}/eleves", response_model=List[schemas.ClasseEleveOut])
def get_eleves(
    classe_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return crud.get_eleves_by_classe(db, classe_id)


@app.get("/classes/{classe_id}/audits", response_model=List[schemas.ClasseAuditOut])
def get_audits(
    classe_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if not has_role(current_user, ["ROLE_ADMIN_SYSTEME", "ROLE_DIRECTEUR"]):
        raise HTTPException(status_code=403, detail="Accès restreint à l'historique")
    return crud.get_audits_by_classe(db, classe_id)

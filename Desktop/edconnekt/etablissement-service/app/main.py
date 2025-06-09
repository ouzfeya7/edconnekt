from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models, schemas, crud
from .events import publish_status_changed_event
from uuid import uuid4
from . import models
from .security import get_current_user
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Etablissement Service")

def get_db(current_user=Depends(get_current_user)):
    db = SessionLocal()
    # on garde l’ID et le nom de l’utilisateur dans la session
    db.info['current_user_id'] = current_user['sub']
    db.info['current_user_name'] = current_user.get('preferred_username', 'inconnu')
    try:
        yield db
    finally:
        db.close()

# Simule la création d'un groupe Keycloak
# (dans l'intégration réelle, importer depuis keycloak.py)
def create_keycloak_group(est_id: str):
    return f"etab_{est_id}"  # Retourne nom ou ID Keycloak simulé

@app.post("/etablissements", response_model=schemas.EtablissementOut)
def create_est(data: schemas.EtablissementCreate, db: Session = Depends(get_db)):
    try:
        kc_group_id = create_keycloak_group(str(uuid4())[:8])
        return crud.create_etablissement(db, data, kc_group_id)
    except ValueError:
        raise HTTPException(status_code=409, detail="Email déjà utilisé")

@app.get("/public/etablissements", response_model=list[schemas.EtablissementOut])
def list_public_etablissements(db: Session = Depends(get_db)):
    return crud.get_all_etablissements(db, status="ACTIVE")

@app.get("/etablissements/{id}", response_model=schemas.EtablissementOut)
def get_etablissement(id: str, db: Session = Depends(get_db)):
    est = crud.get_etablissement_by_id(db, id)
    if not est:
        raise HTTPException(status_code=404, detail="Établissement introuvable")
    return est

@app.patch("/etablissements/{id}/status", response_model=schemas.EtablissementOut)
def update_status(id: str, status: str, db: Session = Depends(get_db)):
    est = crud.update_etablissement_status(db, id, status)
    if not est:
        raise HTTPException(status_code=404, detail="Établissement introuvable")
    publish_status_changed_event(est.id, est.status)
    return est

@app.patch("/etablissements/{id}", response_model=schemas.EtablissementOut)
def update_infos(id: str, update: schemas.EtablissementUpdate, db: Session = Depends(get_db)):
    est = crud.update_etablissement_infos(db, id, update)
    if not est:
        raise HTTPException(status_code=404, detail="Établissement introuvable")
    return est

@app.get("/etablissements", response_model=list[schemas.EtablissementOut])
def list_etablissements(
    status: str = Query(None),
    limit: int = Query(10),
    offset: int = Query(0),
    db: Session = Depends(get_db)
):
    return crud.get_all_etablissements(db, status, limit, offset)

@app.patch("/etablissements/{id}/status", response_model=schemas.EtablissementOut)
def update_status(id: str, status: str, motif: str = None, db: Session = Depends(get_db)):
    est = crud.update_etablissement_status(db, id, status)
    if not est:
        raise HTTPException(status_code=404, detail="Établissement introuvable")
    
    # 🔄 log l’opération
    crud.log_etablissement_event(
        db=db,
        etablissement_id=id,
        operation="change_status",
        motif=motif,
        auteur_id="system",  # à remplacer par user_id depuis Keycloak
        auteur_nom="System Admin"  # à remplacer dynamiquement
    )
    est._last_motif = f"changement de statut vers {status}"
    db.commit()  # le listener après flush va créer l’audit

    publish_status_changed_event(est.id, est.status)
    db.refresh(est)
    return est

@app.get("/etablissements/{id}/audit", response_model=list[schemas.EtablissementOut])
def get_audit(id: str, db: Session = Depends(get_db)):
    return db.query(models.EtablissementAudit).filter(models.EtablissementAudit.etablissement_id == id).all()

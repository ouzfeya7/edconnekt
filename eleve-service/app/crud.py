from sqlalchemy.orm import Session
from . import models, schemas
from uuid import UUID


# 🔹 Créer un élève
def create_eleve(db: Session, data: schemas.EleveCreate) -> models.Eleve:
    eleve = models.Eleve(**data.dict())
    db.add(eleve)
    db.commit()
    db.refresh(eleve)
    return eleve


# 🔹 Lire un élève par ID
def get_eleve_by_id(db: Session, eleve_id: str) -> models.Eleve | None:
    return db.query(models.Eleve).filter(models.Eleve.id == eleve_id).first()


# 🔹 Mettre à jour un élève
def update_eleve(db: Session, eleve_id: str, updates: schemas.EleveUpdate) -> models.Eleve | None:
    eleve = get_eleve_by_id(db, eleve_id)
    if not eleve:
        return None
    for field, value in updates.dict(exclude_unset=True).items():
        setattr(eleve, field, value)
    db.commit()
    db.refresh(eleve)
    return eleve


# 🔹 Récupérer tous les élèves (filtrables par établissement)
def get_all_eleves(db: Session, etablissement_id: str = None):
    query = db.query(models.Eleve)
    if etablissement_id:
        query = query.filter(models.Eleve.etablissement_id == etablissement_id)
    return query.all()


# 🔹 Enregistrer une opération d’audit
def log_audit(db: Session, audit_data: schemas.EleveAuditCreate) -> models.EleveAudit:
    audit = models.EleveAudit(**audit_data.dict())
    db.add(audit)
    db.commit()
    db.refresh(audit)
    return audit


# 🔹 Récupérer les audits d’un élève
def get_audits_by_eleve(db: Session, eleve_id: UUID):
    return db.query(models.EleveAudit).filter(models.EleveAudit.eleve_id == eleve_id).all()


# 🔹 Affecter un élève à une classe (avec historisation)
def assign_eleve_to_classe(db: Session, data: schemas.EleveClasseCreate) -> models.EleveClasse:
    affectation = models.EleveClasse(**data.dict())
    db.add(affectation)
    db.commit()
    db.refresh(affectation)
    return affectation


# 🔹 Voir l’historique des classes d’un élève
def get_eleve_class_history(db: Session, eleve_id: UUID):
    return db.query(models.EleveClasse).filter(models.EleveClasse.eleve_id == eleve_id).order_by(models.EleveClasse.date_entree.desc()).all()

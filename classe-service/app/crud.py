from sqlalchemy.orm import Session
from . import models, schemas
from uuid import UUID


# 🔹 Créer une classe
def create_classe(db: Session, data: schemas.ClasseCreate) -> models.Classe:
    classe = models.Classe(**data.dict())
    db.add(classe)
    db.commit()
    db.refresh(classe)
    return classe


# 🔹 Obtenir une classe par ID
def get_classe_by_id(db: Session, classe_id: UUID) -> models.Classe | None:
    return db.query(models.Classe).filter(models.Classe.id == classe_id).first()


# 🔹 Mettre à jour une classe
def update_classe(db: Session, classe_id: UUID, update_data: schemas.ClasseUpdate) -> models.Classe | None:
    classe = get_classe_by_id(db, classe_id)
    if not classe:
        return None
    for field, value in update_data.dict(exclude_unset=True).items():
        setattr(classe, field, value)
    db.commit()
    db.refresh(classe)
    return classe


# 🔹 Lister toutes les classes d’un établissement
def get_classes_by_etablissement(db: Session, etablissement_id: UUID):
    return db.query(models.Classe).filter(models.Classe.etablissement_id == etablissement_id).all()


# 🔹 Affecter un enseignant à une classe
def assign_enseignant(db: Session, data: schemas.ClasseEnseignantCreate) -> models.ClasseEnseignant:
    affectation = models.ClasseEnseignant(**data.dict())
    db.add(affectation)
    db.commit()
    db.refresh(affectation)
    return affectation


# 🔹 Historique des enseignants d'une classe
def get_enseignants_by_classe(db: Session, classe_id: UUID):
    return db.query(models.ClasseEnseignant).filter(models.ClasseEnseignant.classe_id == classe_id).all()


# 🔹 Affecter un élève à une classe
def assign_eleve(db: Session, data: schemas.ClasseEleveCreate) -> models.ClasseEleve:
    affectation = models.ClasseEleve(**data.dict())
    db.add(affectation)
    db.commit()
    db.refresh(affectation)
    return affectation


# 🔹 Historique des élèves d'une classe
def get_eleves_by_classe(db: Session, classe_id: UUID):
    return db.query(models.ClasseEleve).filter(models.ClasseEleve.classe_id == classe_id).all()


# 🔹 Journaliser une opération
def log_audit(db: Session, data: schemas.ClasseAuditCreate) -> models.ClasseAudit:
    audit = models.ClasseAudit(**data.dict())
    db.add(audit)
    db.commit()
    db.refresh(audit)
    return audit


# 🔹 Lire l’historique d’audit d’une classe
def get_audits_by_classe(db: Session, classe_id: UUID):
    return db.query(models.ClasseAudit).filter(models.ClasseAudit.classe_id == classe_id).order_by(models.ClasseAudit.date_operation.desc()).all()

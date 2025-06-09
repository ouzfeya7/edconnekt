from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from . import models, schemas


# 🚀 Créer un établissement
def create_etablissement(db: Session, data: schemas.EtablissementCreate, kc_group_id: str):
    est = models.Etablissement(
        **data.dict(),
        etablissement_group=kc_group_id,
        etablissement_id=kc_group_id  # si différent, adapte ici
    )
    try:
        db.add(est)
        db.commit()
        db.refresh(est)
        return est
    except IntegrityError:
        db.rollback()
        raise ValueError("Email déjà utilisé")

# 🧠 Récupérer un établissement par ID
def get_etablissement_by_id(db: Session, est_id: str):
    return db.query(models.Etablissement).filter(models.Etablissement.id == est_id).first()

# ✏️ Mise à jour des infos
def update_etablissement_infos(db: Session, est_id: str, update_data: schemas.EtablissementUpdate):
    est = get_etablissement_by_id(db, est_id)
    if not est:
        return None
    for field, value in update_data.dict(exclude_unset=True).items():
        setattr(est, field, value)
    db.commit()
    db.refresh(est)
    return est

# 🔄 Changement de statut
def update_etablissement_status(db: Session, est_id: str, new_status: str):
    est = get_etablissement_by_id(db, est_id)
    if not est:
        return None
    est.statut_abonnement = new_status
    db.commit()
    db.refresh(est)
    return est

# 📋 Lister tous les établissements (filtrable par statut)
def get_all_etablissements(db: Session, status: str = None, limit: int = 10, offset: int = 0):
    query = db.query(models.Etablissement)
    if status:
        query = query.filter(models.Etablissement.statut_abonnement == status)
    return query.offset(offset).limit(limit).all()

# 📩 Logger une opération dans l’audit trail
def log_etablissement_event(
    db: Session,
    etablissement_id: str,
    operation: str,
    motif: str = None,
    auteur_id: str = None,
    auteur_nom: str = None
):
    entry = models.EtablissementAudit(
        etablissement_id=etablissement_id,
        operation=operation,
        motif=motif,
        auteur_id=auteur_id,
        auteur_nom=auteur_nom
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

# 🧾 Récupérer tous les audits liés à un établissement
def get_audit_for_etablissement(db: Session, etablissement_id: str):
    return db.query(models.EtablissementAudit)\
             .filter(models.EtablissementAudit.etablissement_id == etablissement_id)\
             .order_by(models.EtablissementAudit.date_operation.desc())\
             .all()

from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.audit import AuditLog
from app.schemas.audit import AuditLogCreate


def create_audit_log(db: Session, audit: AuditLogCreate) -> AuditLog:
    """
    Crée un nouvel enregistrement d'audit dans la base.
    """
    db_audit = AuditLog(
        service=audit.service,
        entite=audit.entite,
        entite_id=audit.entite_id,
        action=audit.action,
        performed_by_id=audit.performed_by_id,
        performed_by_label=audit.performed_by_label,
        performed_at=audit.performed_at,
        payload=audit.payload,
    )
    db.add(db_audit)
    db.commit()
    db.refresh(db_audit)
    return db_audit


def get_audit_by_id(db: Session, audit_id: str) -> Optional[AuditLog]:
    """
    Récupère un audit par son ID.
    """
    return db.query(AuditLog).filter(AuditLog.id == audit_id).first()


def get_audits(
    db: Session,
    skip: int = 0,
    limit: int = 100
) -> List[AuditLog]:
    """
    Récupère les audits, triés par date décroissante.
    """
    return (
        db.query(AuditLog)
        .order_by(AuditLog.performed_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_audits_by_service(
    db: Session,
    service: str,
    skip: int = 0,
    limit: int = 100
) -> List[AuditLog]:
    """
    Récupère les audits pour un microservice donné.
    """
    return (
        db.query(AuditLog)
        .filter(AuditLog.service == service)
        .order_by(AuditLog.performed_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_audits_by_entity(
    db: Session,
    entite: str,
    entite_id: str,
    skip: int = 0,
    limit: int = 100
) -> List[AuditLog]:
    """
    Récupère les audits pour une entité et son ID.
    """
    return (
        db.query(AuditLog)
        .filter(AuditLog.entite == entite, AuditLog.entite_id == entite_id)
        .order_by(AuditLog.performed_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

# Note: Les logs d'audit sont immuables, donc pas de fonction update ou delete.

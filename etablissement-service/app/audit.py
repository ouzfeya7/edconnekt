# audit.py
from sqlalchemy import event
from sqlalchemy.orm import Session as SessionType
from .models import EtablissementAudit  # ou EleveAudit, ClasseAudit…
from datetime import datetime

@event.listens_for(SessionType, "after_flush")
def auto_audit(session: SessionType, flush_context):
    # pour chaque nouvel objet (INSERT)
    for obj in session.new:
        # n’auditer que les entités métier dont on a un audit lié
        audit_model = getattr(obj.__class__, "_audit_model", None)
        if not audit_model:
            continue
        session.add(
            audit_model(
                etablissement_id=getattr(obj, "id", None),
                operation="INSERT",
                motif=getattr(obj, "_last_motif", None) or "création",
                auteur_id=session.info.get("current_user_id"),
                auteur_nom=session.info.get("current_user_name"),
                date_operation=datetime.utcnow()
            )
        )
    # pour chaque objet modifié (UPDATE)
    for obj in session.dirty:
        if not session.is_modified(obj, include_collections=False):
            continue
        audit_model = getattr(obj.__class__, "_audit_model", None)
        if not audit_model:
            continue
        session.add(
            audit_model(
                etablissement_id=getattr(obj, "id", None),
                operation="UPDATE",
                motif=getattr(obj, "_last_motif", None) or "mise à jour",
                auteur_id=session.info.get("current_user_id"),
                auteur_nom=session.info.get("current_user_name"),
                date_operation=datetime.utcnow()
            )
        )

from sqlalchemy import Column, String, DateTime, JSON
from uuid import uuid4
from datetime import datetime
from app.db.base_class import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    service = Column(String, nullable=False)
    entite = Column(String, nullable=False)
    entite_id = Column(String, nullable=False)
    action = Column(String, nullable=False)

    performed_by_id = Column(String, nullable=True)  # UUID, email, ou ID logique
    performed_by_label = Column(String, nullable=True)  # nom complet, role, etc.
    
    performed_at = Column(DateTime, default=datetime.utcnow)

    payload = Column(JSON, nullable=True)

from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from .database import Base

class Utilisateur(Base):
    __tablename__ = "utilisateurs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    kc_id = Column(String, unique=True, nullable=False)  # ID Keycloak
    email = Column(String, unique=True, nullable=False)
    nom_complet = Column(String)
    telephone = Column(String)
    photo_url = Column(String)
    role = Column(String)  # Exemple : ROLE_ENSEIGNANT, ROLE_PARENT
    etablissement_id = Column(UUID(as_uuid=True), nullable=True)

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

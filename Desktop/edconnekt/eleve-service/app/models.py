from sqlalchemy import Column, String, Date, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from .database import Base

# Table principale des élèves
class Eleve(Base):
    __tablename__ = "eleves"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    prenom = Column(String, nullable=False)
    nom = Column(String, nullable=False)
    date_naissance = Column(Date)
    sexe = Column(String)
    etablissement_id = Column(UUID(as_uuid=True), nullable=False)
    parent_kc_id = Column(String, nullable=True)  # ID utilisateur Keycloak

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    # Relation avec les classes
    classes = relationship("EleveClasse", back_populates="eleve")


# Historique des classes d’un élève
class EleveClasse(Base):
    __tablename__ = "eleves_classes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    eleve_id = Column(UUID(as_uuid=True), ForeignKey("eleves.id"), nullable=False)
    classe_id = Column(UUID(as_uuid=True), nullable=False)  # classe ID référencée
    enseignant_kc_id = Column(String, nullable=True)        # ID Keycloak du prof responsable

    date_entree = Column(Date, nullable=False)
    date_sortie = Column(Date, nullable=True)

    eleve = relationship("Eleve", back_populates="classes")


# Historique des opérations (audit)
class EleveAudit(Base):
    __tablename__ = "eleves_audit"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    eleve_id = Column(UUID(as_uuid=True), ForeignKey("eleves.id"), nullable=False)
    operation = Column(String, nullable=False)  # CREATE, UPDATE, AFFECTATION, etc.
    motif = Column(String)
    auteur_id = Column(String)
    auteur_nom = Column(String)
    date_operation = Column(DateTime, server_default=func.now())

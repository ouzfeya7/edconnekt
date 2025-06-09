from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from .database import Base


class Classe(Base):
    __tablename__ = "classes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nom = Column(String, nullable=False)
    niveau = Column(String, nullable=False)
    annee_scolaire = Column(String, nullable=False)
    etablissement_id = Column(UUID(as_uuid=True), nullable=False)

    createur_id = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    enseignants = relationship("ClasseEnseignant", back_populates="classe")
    eleves = relationship("ClasseEleve", back_populates="classe")


class ClasseEnseignant(Base):
    __tablename__ = "classes_enseignants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    classe_id = Column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=False)
    enseignant_kc_id = Column(String, nullable=False)

    date_affectation = Column(DateTime, server_default=func.now())
    date_fin = Column(DateTime, nullable=True)

    classe = relationship("Classe", back_populates="enseignants")


class ClasseEleve(Base):
    __tablename__ = "classes_eleves"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    classe_id = Column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=False)
    eleve_id = Column(UUID(as_uuid=True), nullable=False)

    date_entree = Column(DateTime, server_default=func.now())
    date_sortie = Column(DateTime, nullable=True)

    classe = relationship("Classe", back_populates="eleves")


class ClasseAudit(Base):
    __tablename__ = "classes_audit"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    classe_id = Column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=False)
    operation = Column(String, nullable=False)        # CREATE, UPDATE, AFFECTATION, etc.
    motif = Column(String, nullable=True)             # Explication ou raison
    auteur_id = Column(String, nullable=False)        # ID Keycloak de l'utilisateur
    auteur_nom = Column(String, nullable=True)        # Nom visible
    date_operation = Column(DateTime, server_default=func.now())

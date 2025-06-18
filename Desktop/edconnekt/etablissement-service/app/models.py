from sqlalchemy import Column, Integer, String, Date, Boolean, func,ForeignKey,DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from .database import Base
from sqlalchemy.orm import relationship
class Etablissement(Base):
    __tablename__ = "etablissement"
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False)
    nom = Column(String, nullable=False)
    adresse = Column(String)
    email = Column(String, unique=True, nullable=False)
    telephone = Column(String)

    statut_abonnement = Column(String, default="actif")
    type_abonnement = Column(String, default="gratuit")
    date_debut = Column(Date)
    date_fin = Column(Date)

    date_creation = Column(Date, server_default=func.now())
    date_modification = Column(Date, onupdate=func.now())

    etablissement_group = Column(String, nullable=True)
    etablissement_id = Column(String, nullable=True)

    etablissement_ouvert = Column(Boolean, default=True)
    etablissement_ferme = Column(Boolean, default=False)
    audits = relationship("EtablissementAudit", back_populates="etablissement", cascade="all, delete-orphan")

    # pour l’audit automatique
    _audit_model = None  # on définira après la classe EtablissementAudit


class EtablissementAudit(Base):
    __tablename__ = "etablissement_audit"
    id = Column(Integer, primary_key=True, index=True)
    etablissement_id = Column(Integer, ForeignKey("etablissement.id"))
    operation = Column(String, nullable=False)  # ex: "suspension", "modification"
    motif = Column(String, nullable=True)       # ex: "Défaut de paiement"
    auteur_id = Column(String, nullable=True)   # ID Keycloak ou interne
    auteur_nom = Column(String, nullable=True)
    date_operation = Column(DateTime, server_default=func.now())
    etablissement = relationship("Etablissement", back_populates="audits")

# Lie les deux
Etablissement._audit_model = EtablissementAudit
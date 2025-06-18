from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Ressource(Base):
    __tablename__ = "ressources"

    id = Column(Integer, primary_key=True, index=True)
    titre = Column(String, nullable=False)
    fichier = Column(String, nullable=False)
    annee = Column(String, nullable=True)  # ex: "2024-2025"
    is_recent = Column(Boolean, default=True)

    categorie_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    categorie = relationship("Categorie", back_populates="ressources")

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

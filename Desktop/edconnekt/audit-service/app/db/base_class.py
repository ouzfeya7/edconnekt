from typing import Any
from sqlalchemy.ext.declarative import as_declarative, declared_attr
from sqlalchemy import MetaData

# Metadata partagée pour l'ensemble des modèles
metadata = MetaData()

@as_declarative(metadata=metadata)
class Base:
    """
    Base declarative pour SQLAlchemy avec génération automatique
    de __tablename__ via declared_attr.
    """
    id: Any
    __name__: str

    @declared_attr
    def __tablename__(cls) -> str:
        # Génère le nom de table à partir du nom de la classe, en minuscule et au pluriel
        return cls.__name__.lower() + 's'

    # Optionnel : représentation générique
    def __repr__(self) -> str:
        return f"<{self.__class__.__name__}(id={getattr(self, 'id', None)})>"

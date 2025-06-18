from fastapi import FastAPI
from app.api.v1.routes_categories import router_categories
from app.api.v1.routes_ressources import router_ressources
from app.db.session import engine
from app.db.base_class import Base
from app.core.config import settings


def create_app() -> FastAPI:
    """
    Création et configuration de l'application FastAPI
    """
    app = FastAPI(
        title="Ressource Service",
        version="1.0.0",
        description="Microservice pour la gestion des ressources pédagogiques"
    )

    # Inclusion des routes
    app.include_router(router_categories, prefix="/api/v1", tags=["Catégories"])
    app.include_router(router_ressources, prefix="/api/v1", tags=["Ressources"])

    # Création automatique des tables au démarrage
    @app.on_event("startup")
    def on_startup():
        Base.metadata.create_all(bind=engine)

    return app


# Instanciation de l'application
app = create_app()

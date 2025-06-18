# app/db/session.py

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Récupère l'URL depuis l'env (ex. via docker-compose) ou valeur par défaut
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:password@ressources-db:5432/ressources"
)

# Crée l’engine SQLAlchemy
engine = create_engine(DATABASE_URL)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Dependency FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

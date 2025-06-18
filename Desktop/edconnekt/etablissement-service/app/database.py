from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DB_URL = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASS')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"
engine = create_engine(DB_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# app/models.py
from sqlalchemy import Column, String, Date, Enum # type: ignore
from sqlalchemy.dialects.postgresql import UUID # type: ignore
import uuid, enum
from .database import Base

class PlanEnum(str, enum.Enum):
    BASIC = "BASIC"
    GOLD = "GOLD"
    Daimond = "DIAMOND"
    ENTERPRISE = "ENTERPRISE"

class StatusEnum(str, enum.Enum):
    TRIAL = "TRIAL"
    ACTIVE = "ACTIVE"
    SUSPENDED = "SUSPENDED"
    CLOSED = "CLOSED"

class Etablissement(Base):
    __tablename__ = "etablissement"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    address = Column(String)
    city = Column(String)
    country = Column(String)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String)
    subscription_start = Column(Date)
    subscription_end = Column(Date)
    plan = Column(Enum(PlanEnum), default=PlanEnum.BASIC)
    status = Column(Enum(StatusEnum), default=StatusEnum.TRIAL)
    kc_group_id = Column
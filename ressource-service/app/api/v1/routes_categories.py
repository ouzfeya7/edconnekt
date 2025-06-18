from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Security
from fastapi.security import SecurityScopes
from sqlalchemy.orm import Session
from uuid import uuid4
import os
import httpx
from datetime import datetime

from app.db.session import get_db
from app.core.config import settings
from app.core.settings import get_current_user_with_scopes
from app.schemas.categorie import CategorieOut
from app.crud.categorie import (
    create_categorie,
    get_all_categories,
    get_categorie_by_id,
    update_categorie,
    delete_categorie,
)

router_categories = APIRouter(tags=["Catégories"])

# Créer une catégorie (scope: categorie:create)
@router_categories.post("/categories/", response_model=CategorieOut)
async def api_create_categorie(
    nom: str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    user: dict = Security(get_current_user_with_scopes, scopes=["categorie:create"])
):
    image_path = None
    if image:
        ext = image.filename.split('.')[-1]
        filename = f"{uuid4()}.{ext}"
        image_path = os.path.join(settings.UPLOAD_IMAGES_DIR, filename)
        with open(image_path, 'wb') as f:
            f.write(await image.read())

    cat = create_categorie(db, nom=nom, image_path=image_path)

    async with httpx.AsyncClient() as client:
        await client.post(settings.AUDIT_SERVICE_URL, json={
            "service": "ressource-service",
            "entite": "Categorie",
            "entite_id": str(cat.id),
            "action": "CREATE",
            "performed_by_id": user['sub'],
            "performed_by_label": ",".join(user.get('roles', [])),
            "performed_at": cat.created_at.isoformat(),
            "payload": {"nom": nom}
        })
    return cat

# Lister les catégories (scope: categorie:read)
@router_categories.get("/categories/", response_model=list[CategorieOut])
def api_get_categories(
    db: Session = Depends(get_db),
    _: dict = Security(get_current_user_with_scopes, scopes=["categorie:read"])
):
    return get_all_categories(db)

# Détails d’une catégorie (scope: categorie:read)
@router_categories.get("/categories/{cat_id}", response_model=CategorieOut)
def api_get_categorie(
    cat_id: int,
    db: Session = Depends(get_db),
    _: dict = Security(get_current_user_with_scopes, scopes=["categorie:read"])
):
    cat = get_categorie_by_id(db, cat_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    return cat

# Mettre à jour une catégorie (scope: categorie:update)
@router_categories.put("/categories/{cat_id}", response_model=CategorieOut)
async def api_update_categorie(
    cat_id: int,
    nom: str = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    user: dict = Security(get_current_user_with_scopes, scopes=["categorie:update"])
):
    image_path = None
    if image:
        ext = image.filename.split('.')[-1]
        filename = f"{uuid4()}.{ext}"
        image_path = os.path.join(settings.UPLOAD_IMAGES_DIR, filename)
        with open(image_path, 'wb') as f:
            f.write(await image.read())

    cat = update_categorie(db, cat_id, nom=nom, image_path=image_path)
    if not cat:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")

    async with httpx.AsyncClient() as client:
        await client.post(settings.AUDIT_SERVICE_URL, json={
            "service": "ressource-service",
            "entite": "Categorie",
            "entite_id": str(cat.id),
            "action": "UPDATE",
            "performed_by_id": user['sub'],
            "performed_by_label": ",".join(user.get('roles', [])),
            "performed_at": cat.updated_at.isoformat(),
            "payload": {"nom": nom}
        })
    return cat

# Supprimer une catégorie (scope: categorie:delete)
@router_categories.delete("/categories/{cat_id}")
async def api_delete_categorie(
    cat_id: int,
    db: Session = Depends(get_db),
    user: dict = Security(get_current_user_with_scopes, scopes=["categorie:delete"])
):
    cat = get_categorie_by_id(db, cat_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")

    delete_categorie(db, cat_id)

    async with httpx.AsyncClient() as client:
        await client.post(settings.AUDIT_SERVICE_URL, json={
            "service": "ressource-service",
            "entite": "Categorie",
            "entite_id": str(cat_id),
            "action": "DELETE",
            "performed_by_id": user['sub'],
            "performed_by_label": ",".join(user.get('roles', [])),
            "performed_at": datetime.utcnow().isoformat(),
            "payload": None
        })
    return {"detail": "Catégorie supprimée"}

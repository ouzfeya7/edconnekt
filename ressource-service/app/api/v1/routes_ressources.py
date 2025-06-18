# app/api/v1/routes_ressources.py

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException,BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from uuid import uuid4
import os
import httpx
from datetime import datetime

from app.db.session import get_db
from app.core.config import settings
from app.core.config import get_current_user
from app.schemas.ressource import RessourceOut
from app.crud.ressource import (
    create_ressource,
    get_ressource_by_id,
    get_all_ressources,
    get_ressources_by_categorie,
)


router_ressources = APIRouter(tags=["Ressources"])

# Upload de ressource
@router_ressources.post("/ressources/", response_model=RessourceOut)
async def api_upload_ressource(
    titre: str = Form(...),
    categorie_id: int = Form(...),
    annee: str = Form(None),
    is_recent: bool = Form(True),
    fichier: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    ext = fichier.filename.split('.')[-1].lower()
    if ext not in settings.ALLOWED_FILE_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Fichier non supporté.")
    filename = f"{uuid4()}_{fichier.filename}"
    file_path = os.path.join(settings.UPLOAD_FILES_DIR, filename)
    with open(file_path, 'wb') as f:
        f.write(await fichier.read())
    res = create_ressource(db, titre=titre, fichier_path=file_path, categorie_id=categorie_id, annee=annee, is_recent=is_recent)
    # Audit
    async with httpx.AsyncClient() as client:
        await client.post(settings.AUDIT_SERVICE_URL, json={
            "service": "ressource-service",
            "entite": "Ressource",
            "entite_id": str(res.id),
            "action": "CREATE",
            "performed_by_id": user['sub'],
            "performed_by_label": ",".join(user.get('roles', [])),
            "performed_at": res.created_at.isoformat(),
            "payload": {"titre": titre, "annee": annee}
        })
    return res

# Lister toutes les ressources
@router_ressources.get("/ressources/", response_model=list[RessourceOut])
def api_get_all_ressources(
    db: Session = Depends(get_db),
    _: dict = Depends(get_current_user)
):
    return get_all_ressources(db)

# Lister par catégorie
@router_ressources.get("/ressources/by-categorie/{categorie_id}", response_model=list[RessourceOut])
def api_get_by_categorie(categorie_id: int, db: Session = Depends(get_db), _: dict = Depends(get_current_user)):
    return get_ressources_by_categorie(db, categorie_id)

@router_ressources.get(
    "/ressources/{ressource_id}/download",
    response_class=FileResponse
)
async def api_download(
    ressource_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    # 1. Récupérer la ressource
    res = get_ressource_by_id(db, ressource_id)
    if not res:
        raise HTTPException(status_code=404, detail="Ressource non trouvée")

    # 2. Préparer l'événement d'audit
    audit_event = {
        "service": "ressource-service",
        "entite": "Ressource",
        "entite_id": str(res.id),
        "action": "READ",
        "performed_by_id": user["sub"],
        "performed_by_label": ",".join(user.get("roles", [])),
        "performed_at": datetime.utcnow().isoformat(),
        "payload": None
    }

    # 3. Planifier l'appel audit en tâche de fond
    background_tasks.add_task(
        httpx.post,
        settings.AUDIT_SERVICE_URL,
        json=audit_event
    )

    # 4. Retourner le fichier immédiatement
    return FileResponse(path=res.fichier, filename=res.titre)
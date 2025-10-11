# Admission Service - Gestion des Demandes d'Admission

## Vue d'ensemble

**Statut** : ✅ Intégré

**Description** : Système complet de gestion des demandes d'admission permettant aux parents de soumettre des demandes publiques et aux administrateurs de les traiter avec workflow de validation.

**Service API** : `admission-service`  
**Endpoints utilisés** : 
- `GET /api/v1/admissions/` - Liste des admissions avec filtres
- `POST /api/v1/admissions/` - Création d'admission (publique avec CAPTCHA)
- `GET /api/v1/admissions/{id}` - Détail d'une admission
- `PUT /api/v1/admissions/{id}` - Mise à jour complète
- `PATCH /api/v1/admissions/{id}/status` - Mise à jour du statut uniquement
- `DELETE /api/v1/admissions/{id}` - Suppression
- `GET /api/v1/admissions/stats/summary` - Statistiques

## Prérequis

### Rôles Utilisateur
- [x] Admin Staff (gestion des admissions)
- [ ] Enseignant  
- [ ] Élève
- [x] Parent (formulaire public)
- [ ] Admin 

### État Initial du Système
- **Formulaire public** : Aucune authentification requise
- **Interface admin** : Utilisateur authentifié avec rôle Admin
- **reCAPTCHA v3** : Configuré avec VITE_RECAPTCHA_SITE_KEY

## Workflow E2E - Parent : Soumission d'Admission Publique

### 1. Point d'Entrée Public
**Page** : `src/pages/AdmissionPublicPage.tsx`  
**Route** : `/admission` (publique, sans authentification)  
**Navigation** : Accès direct via URL ou lien externe

**Action utilisateur** :
- Accès au formulaire d'admission public
- Chargement automatique du script reCAPTCHA v3

**Initialisation reCAPTCHA** :
```typescript
// Chargement du script reCAPTCHA v3
useEffect(() => {
  const script = document.createElement('script');
  script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
  script.async = true;
  script.onload = () => setLoadingCaptcha(false);
  document.body.appendChild(script);
}, []);

// Génération du token
useEffect(() => {
  if (!window.grecaptcha || !RECAPTCHA_SITE_KEY) return;
  window.grecaptcha.ready(() => {
    window.grecaptcha!
      .execute(RECAPTCHA_SITE_KEY, { action: 'admission_submit' })
      .then((token) => setToken(token));
  });
}, [loadingCaptcha]);
```

**Résultat attendu** :
- Formulaire d'admission affiché
- reCAPTCHA v3 chargé en arrière-plan
- Token généré automatiquement

### 2. Saisie des Informations
**Déclencheur** : Remplissage du formulaire par le parent

**Champs requis** :
- **Élève** : Nom complet, date de naissance
- **Parent** : Nom, contact (email ou téléphone)
- **Scolarité** : Classe demandée

**Champs optionnels** :
- **Contacts supplémentaires** : Email/téléphone élève et parent
- **Notes** : Informations complémentaires
- **Pièces jointes** : Documents (à implémenter)

**Validation côté client** :
```typescript
const isValid = useMemo(() => {
  return (
    studentName.trim().length > 1 &&
    studentBirthdate.trim().length > 0 &&
    classRequested.trim().length > 0 &&
    parentName.trim().length > 1 &&
    parentContact.trim().length > 3
  );
}, [studentName, studentBirthdate, classRequested, parentName, parentContact]);
```

### 3. Soumission avec CAPTCHA
**Déclencheur** : Clic sur "Soumettre la demande"

**Action utilisateur** :
- Validation du formulaire
- Génération d'un token reCAPTCHA "frais"
- Soumission des données

**Appel API** :
```typescript
const createAdmissionMutation = useCreateAdmission();

// Régénération du token avant envoi
let freshToken = token;
if (window.grecaptcha && RECAPTCHA_SITE_KEY) {
  freshToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { 
    action: 'admission_submit' 
  });
}

const payload: AdmissionCreateRequest = {
  student_name: studentName.trim(),
  student_birthdate: studentBirthdate,
  class_requested: classRequested,
  parent_name: parentName.trim(),
  parent_contact: parentContact.trim(),
  student_email: studentEmail || null,
  student_phone: studentPhone || null,
  parent_email: parentEmail || null,
  parent_phone: parentPhone || null,
  notes: notes || null,
  attachments: null, // À implémenter
  captcha_token: freshToken
};

createAdmissionMutation.mutate(payload);
```

**Résultat attendu** :
- Toast de succès : "Demande d'admission soumise avec succès"
- Formulaire réinitialisé
- Numéro de demande affiché (si retourné par l'API)

## Workflow E2E - Admin : Gestion des Admissions

### 1. Point d'Entrée Admin
**Page** : `src/pages/admin/admissions/AdmissionsPage.tsx`  
**Route** : `/admin/admissions`  
**Navigation** : Menu admin → Admissions

**Action utilisateur** :
- Accès à la liste des admissions
- Chargement des statistiques

**Appels API** :
```typescript
// Liste des admissions avec filtres
const { data, isLoading, error } = useAdmissions({
  page: 1,
  limit: 10,
  status: selectedStatus,
  classRequested: classFilter,
  studentName: searchStudent,
  parentName: searchParent
});

// Statistiques
const { data: stats } = useAdmissionStats();
```

**Résultat attendu** :
- Liste paginée des admissions
- Filtres de recherche disponibles
- Statistiques par statut affichées

### 2. Filtrage et Recherche
**Déclencheur** : Utilisation des filtres

**Filtres disponibles** :
- **Statut** : PENDING, ACCEPTED, REJECTED, WAITLIST
- **Classe demandée** : Dropdown des classes disponibles
- **Nom élève** : Recherche textuelle
- **Nom parent** : Recherche textuelle

**Interface de filtrage** :
```typescript
const params = useMemo(() => ({
  page,
  limit,
  status: status ?? undefined,
  classRequested: classRequested || undefined,
  studentName: studentName || undefined,
  parentName: parentName || undefined,
}), [page, limit, status, classRequested, studentName, parentName]);
```

**Résultat attendu** :
- Liste filtrée en temps réel
- Pagination adaptée aux résultats
- Compteurs mis à jour

### 3. Gestion des Statuts
**Déclencheur** : Modification du statut d'une admission

**Actions disponibles** :
- **PENDING** → ACCEPTED/REJECTED/WAITLIST
- **WAITLIST** → ACCEPTED/REJECTED
- **ACCEPTED/REJECTED** → Modification possible selon règles métier

**Interface de mise à jour** :
```typescript
const updateStatusMutation = useUpdateAdmissionStatus();

const onApplyStatus = async (admission: AdmissionResponse) => {
  const newStatus = pendingStatus[admission.id];
  if (!newStatus || newStatus === admission.status) return;
  
  await updateStatusMutation.mutateAsync({
    admissionId: admission.id,
    update: { 
      status: newStatus,
      admin_notes: adminNotes // Optionnel
    }
  });
  
  toast.success('Statut mis à jour');
  refetch(); // Actualiser la liste
};
```

**Résultat attendu** :
- Statut mis à jour immédiatement
- Toast de confirmation
- Liste actualisée
- Historique conservé (reviewed_by, reviewed_at)

### 4. Consultation des Détails
**Déclencheur** : Clic sur une admission

**Page** : `src/pages/admin/admissions/AdmissionDetailPage.tsx`  
**Route** : `/admin/admissions/{id}`

**Appel API** :
```typescript
const { data: admission, isLoading } = useAdmission(admissionId);
```

**Informations affichées** :
- **Données élève** : Nom, date de naissance, contacts
- **Données parent** : Nom, contacts multiples
- **Scolarité** : Classe demandée
- **Métadonnées** : Date de soumission, statut, historique
- **Notes** : Notes du parent et notes admin
- **Pièces jointes** : Documents joints (si disponibles)

## Points de Validation

### Fonctionnels
- [x] Formulaire public accessible sans authentification
- [x] reCAPTCHA v3 intégré pour protection anti-spam
- [x] Validation côté client et serveur
- [x] Filtrage avancé par statut, classe, noms
- [x] Pagination des résultats
- [x] Gestion des statuts avec workflow
- [x] Statistiques temps réel

### Techniques
- [x] Headers X-Etab et X-Roles pour interface admin
- [x] Pas d'authentification pour formulaire public
- [x] Gestion des erreurs 400/401/403/500
- [x] Cache React Query optimisé
- [x] Types TypeScript stricts
- [x] Token reCAPTCHA régénéré avant soumission

### UX/UI
- [x] Interface responsive
- [x] Feedback utilisateur clair (toasts)
- [x] États de chargement gérés
- [x] Formulaire accessible
- [x] Confirmation avant suppression

## Gestion d'Erreurs

### Erreurs API
| Code | Cause | Comportement UI |
|------|-------|-----------------|
| 400 | Données invalides ou CAPTCHA échoué | Toast d'erreur + validation formulaire |
| 401 | Token expiré (admin uniquement) | Redirection vers login |
| 403 | Permissions insuffisantes | Message "Accès refusé" |
| 404 | Admission introuvable | Retour à la liste |
| 429 | Trop de tentatives (CAPTCHA) | Message "Veuillez patienter" |
| 500 | Erreur serveur | Toast "Erreur technique, réessayez" |

### Erreurs Spécifiques
- **CAPTCHA manquant** : "Configuration reCAPTCHA manquante"
- **CAPTCHA échoué** : "Vérification anti-spam échouée"
- **Champs requis** : "Veuillez remplir tous les champs obligatoires"
- **Format date** : "Format de date invalide"
- **Contact invalide** : "Email ou téléphone requis"

## États de l'UI

### Loading States
```typescript
// Chargement reCAPTCHA
if (loadingCaptcha) {
  return <div>Chargement de la sécurité...</div>;
}

// Liste des admissions
if (isLoading) {
  return <AdmissionListSkeleton />;
}
```

### Empty States
```typescript
// Aucune admission
if (!items.length && !isLoading) {
  return (
    <EmptyState
      icon={<FileText className="h-12 w-12" />}
      title="Aucune demande d'admission"
      description="Les nouvelles demandes apparaîtront ici"
    />
  );
}
```

## Données Impliquées

### Modèles de Données
```typescript
// Demande d'admission
interface AdmissionCreateRequest {
  student_name: string;
  student_birthdate: string;
  class_requested: string;
  parent_name: string;
  parent_contact: string;
  student_email?: string | null;
  student_phone?: string | null;
  parent_email?: string | null;
  parent_phone?: string | null;
  notes?: string | null;
  attachments?: Array<string> | null;
  captcha_token: string; // reCAPTCHA v3
}

// Réponse admission
interface AdmissionResponse {
  id: number;
  student_name: string;
  student_birthdate: string;
  class_requested: string;
  parent_name: string;
  parent_contact: string;
  status: AdmissionStatus;
  created_at: string;
  updated_at: string;
  admin_notes?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  // ... autres champs
}

// Statuts possibles
enum AdmissionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED', 
  REJECTED = 'REJECTED',
  WAITLIST = 'WAITLIST'
}
```

### Transformations
```typescript
// Nettoyage des données avant envoi
const cleanFormData = (formData: FormData): AdmissionCreateRequest => ({
  student_name: formData.studentName.trim(),
  student_birthdate: formData.studentBirthdate,
  class_requested: formData.classRequested,
  parent_name: formData.parentName.trim(),
  parent_contact: formData.parentContact.trim(),
  student_email: formData.studentEmail || null,
  student_phone: formData.studentPhone || null,
  parent_email: formData.parentEmail || null,
  parent_phone: formData.parentPhone || null,
  notes: formData.notes || null,
  attachments: null,
  captcha_token: formData.captchaToken
});
```

## Optimisations

### Performance
- **Cache React Query** : `staleTime: 2 * 60 * 1000` (2 min)
- **Pagination** : 10 éléments par page par défaut
- **Filtrage côté serveur** : Réduction du trafic réseau
- **reCAPTCHA v3** : Chargement asynchrone

### UX
- **Token reCAPTCHA frais** : Régénération avant chaque soumission
- **Validation temps réel** : Feedback immédiat
- **Statuts visuels** : Couleurs distinctes par statut
- **Confirmation suppression** : Prévention des erreurs

### Sécurité
- **reCAPTCHA v3** : Protection anti-spam avancée
- **Validation serveur** : Double validation des données
- **Rate limiting** : Protection contre les abus
- **Sanitisation** : Nettoyage des entrées utilisateur

## Configuration

### Variables d'Environnement
```typescript
// reCAPTCHA (publique)
VITE_RECAPTCHA_SITE_KEY=6Lc...

// API
VITE_ADMISSION_API_BASE_URL=https://api.uat1-engy-partners.com/admission/
```

### Configuration React Query
```typescript
const admissionQueryConfig = {
  staleTime: 2 * 60 * 1000, // 2 minutes
  cacheTime: 5 * 60 * 1000, // 5 minutes
  retry: 2,
  refetchOnWindowFocus: false,
};
```

---

*Dernière mise à jour : 10 octobre 2025*  
*Auteur : Équipe EdConnekt Frontend*

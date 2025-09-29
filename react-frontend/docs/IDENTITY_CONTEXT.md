# Sélecteur de Contexte (Établissement + Rôle)

Ce document décrit l’implémentation frontend du sélecteur de contexte pour l’identity-service.

## Objectif

- Permettre à l’utilisateur de sélectionner un **établissement** et un **rôle** métier (student | parent | teacher | admin_staff).
- Transmettre la sélection au Gateway via des en-têtes HTTP de **sélection**.
- Persister localement le contexte et recharger les données dépendantes.

## Clés localStorage

- `edc.activeEtabId` → UUID de l’établissement sélectionné
- `edc.activeRole` → rôle sélectionné (`student|parent|teacher|admin_staff`)
- `edc.activeCtxAt` → ISO timestamp (trace et debug)

Utilitaires: `src/utils/contextStorage.ts`
- `getActiveContext()`, `setActiveContext(etabId, role)`, `setActiveEtabId()`, `setActiveRole()`, `clearActiveContext()`

## Flux au login / relogin

1) Récupération des établissements
- Hook: `useIdentityMyEstablishments()` (GET `/api/v1/identity/me/establishments`)
- Cas 0: aucun établissement → modal bloquante avec message
- Cas 1: un seul établissement → on charge les rôles
- Cas >1: ouverture du modal combiné

2) Récupération des rôles de l’utilisateur pour un établissement
- Hook: `useIdentityMyRoles(etab)` (GET `/api/v1/identity/me/roles?etab=<UUID>`)
- Si un seul rôle → auto-sélection possible
- Sinon → choix explicite dans le modal

3) Validation
- Persistance locale via `setActiveContext(etabId, role)`
- Invalidation des queries React Query liées à l’identité (`queryKey` débutant par `identity:`)

Implémentation: `src/contexts/IdentityContextProvider.tsx` + `src/components/context/ContextSelectModal.tsx`
- Le Provider orchestre le flux et expose `openContextSelector()` pour rouvrir le modal depuis le header.
- Le Modal propose 2 colonnes: établissements (A) et rôles (B).

## En-têtes HTTP (Axios)

Intercepteur: `src/api/identity-service/http.ts`
- À l’envoi (request):
  - `X-Etab-Select: <edc.activeEtabId>` (si présent)
  - `X-Role-Select: <edc.activeRole>` (si présent)
- À la réception (response):
  - Si `X-Etab` et `X-Role` sont présents → persistance via `setActiveContext(...)`

Note: L’ancien header `X-Establishment-Id` a été retiré (dépréciation terminée côté frontend).

## Points d’intégration

- Wrapping global: `src/App.tsx` (le `IdentityContextProvider` enveloppe `AppContent`)
- Bouton header pour changer le contexte: `src/components/layout/Topbar.tsx`
- Auth Keycloak: `src/pages/authentification/AuthContext.tsx`
  - Le token rafraîchi est réécrit en `sessionStorage` lors de `onTokenExpired`.

## Comportement UI

- Le modal se déclenche automatiquement si aucun contexte n’est sélectionné après login.
- Le bouton “Contexte” dans le header permet de changer d’établissement/rôle à tout moment.
- Les pages qui dépendent du contexte sont rafraîchies automatiquement après sélection.

## Scénarios QA à couvrir

- 0 établissement → modal bloquante, message explicite.
- 1 établissement, 1 rôle → auto-sélection, pas de modal.
- 1 établissement, N rôles → modal, sélection d’un rôle, persistance, rafraîchissement des listes.
- N établissements → modal, rôles changent selon l’établissement sélectionné, validation OK.
- Refresh du token Keycloak → les appels restent authentifiés (pas de 401).
- Changement de contexte après utilisation → invalidation et rechargement des données.
- Réponses avec `X-Etab`/`X-Role` → persistance OK.
- Erreurs 403/422 → messages utilisateur clairs, pas de blocage silencieux.

## Variables d’environnement

- `VITE_IDENTITY_API_BASE_URL` → URL base de l’identity-service (recommandé en DEV pour éviter le fallback UAT)

## Notes

- La voie “POST /me/context/select” n’existe pas dans le client actuel. Le flux s’appuie sur les en-têtes de **sélection** (`X-Etab-Select`, `X-Role-Select`) validés par le Gateway, qui renvoie ensuite `X-Etab`/`X-Role` confirmés.
- Le SSE de progression de batch peut rester en polling si non prioritaire (EventSource possible si nécessaire).

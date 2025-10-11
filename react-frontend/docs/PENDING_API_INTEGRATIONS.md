# APIs Prêtes - Intégrations Pendantes

> **Statut** : 📋 **APIs Disponibles** - Intégration Frontend **En Attente**

Ce document liste les microservices backend qui sont **opérationnels et documentés** mais dont l'intégration frontend n'est **pas encore implémentée** dans l'application React EdConnekt.

---

## 📊 **Vue d'Ensemble**

| Service | Statut Backend | Statut Frontend | Priorité |
|---------|---------------|-----------------|----------|
| **facturation-service** | ✅ Prêt | ❌ Non intégré | 🔴 Haute |
| **report-service** | ✅ Prêt | ❌ Non intégré | 🔴 Haute |
| **pdi-service** | ✅ Prêt | ⚠️ Partiel | 🔴 Haute |
| **notification-service** | ✅ Prêt | ❌ Non intégré | 🔴 Haute |
| **evaluation-service** | ✅ Prêt | ❌ Non intégré | 🔴 Haute |
| **remediation-service** | ✅ Prêt | ❌ Non intégré | 🔴 Haute |

---

## 🔴 **Toutes Priorité Haute**

### 1. **facturation-service**
**Rôle** : Gestion de la facturation et des abonnements établissements

**Endpoints Disponibles** :
- `GET /api/v1/invoices` - Liste des factures
- `POST /api/v1/invoices` - Création de facture
- `GET /api/v1/subscriptions` - Gestion des abonnements
- `GET /api/v1/billing/stats` - Statistiques de facturation

**Intégration Requise** :
- [ ] Génération du client API TypeScript
- [ ] Création des hooks personnalisés (`useInvoices`, `useSubscriptions`)
- [ ] Interface admin pour la gestion des factures
- [ ] Dashboard de facturation avec KPIs
- [ ] Gestion des statuts de paiement

**Rôles Concernés** : Admin, Admin Staff

---

### 2. **evaluation-service**
**Rôle** : Système d'évaluation et de notation des élèves

**Endpoints Disponibles** :
- `GET /api/v1/evaluations` - Liste des évaluations
- `POST /api/v1/evaluations` - Création d'évaluation
- `GET /api/v1/grades` - Gestion des notes
- `GET /api/v1/rubrics` - Grilles d'évaluation

**Intégration Requise** :
- [ ] Génération du client API TypeScript
- [ ] Hooks pour les évaluations (`useEvaluations`, `useGrades`)
- [ ] Interface enseignant pour créer/noter
- [ ] Interface élève/parent pour consulter
- [ ] Système de grilles d'évaluation

**Rôles Concernés** : Enseignant, Élève, Parent, Admin Staff

---

### 3. **pdi-service** ⚠️
**Rôle** : Plans de Développement Individualisés

**Statut Actuel** : Interface développée avec données mockées

**Endpoints Disponibles** :
- `GET /api/v1/pdi/sessions` - Sessions PDI
- `POST /api/v1/pdi/sessions` - Création de session
- `GET /api/v1/pdi/reports` - Rapports PDI

**Intégration Requise** :
- [ ] Remplacement des données mockées par les vrais appels API
- [ ] Finalisation des hooks React Query
- [ ] Tests d'intégration avec l'API réelle
- [ ] Gestion des états d'erreur API

**Rôles Concernés** : Enseignant, Admin Staff, Parent, Élève

---

### 4. **report-service**
**Rôle** : Génération de rapports et bulletins

**Endpoints Disponibles** :
- `GET /api/v1/reports` - Liste des rapports
- `POST /api/v1/reports/generate` - Génération de rapport
- `GET /api/v1/analytics/dashboard` - Données dashboard
- `GET /api/v1/exports` - Exports de données

**Intégration Requise** :
- [ ] Génération du client API TypeScript
- [ ] Hooks pour les rapports (`useReports`, etc.)
- [ ] Interface de génération de rapports
- [ ] Dashboard analytics avec graphiques
- [ ] Système d'export (PDF, Excel, CSV)

**Rôles Concernés** : Admin Staff, Admin, Enseignant

---

### 5. **remediation-service**
**Rôle** : Gestion des remédiations pédagogiques

**Endpoints Disponibles** :
- `GET /api/v1/remediations` - Liste des remédiations
- `POST /api/v1/remediations` - Création de remédiation
- `GET /api/v1/remediation-resources` - Ressources associées

**Intégration Requise** :
- [ ] Génération du client API TypeScript
- [ ] Hooks de gestion (`useRemediations`, `useRemediationResources`)
- [ ] Interface enseignant pour créer des remédiations
- [ ] Association avec les ressources pédagogiques
- [ ] Suivi de progression des élèves

**Rôles Concernés** : Enseignant, Élève, Admin Staff

---

### 6. **notification-service**
**Rôle** : Système de notifications en temps réel

**Endpoints Disponibles** :
- `GET /api/v1/notifications` - Liste des notifications
- `POST /api/v1/notifications` - Envoi de notification
- `WebSocket /ws/notifications` - Notifications temps réel
- `PATCH /api/v1/notifications/{id}/read` - Marquer comme lu

**Intégration Requise** :
- [ ] Génération du client API TypeScript
- [ ] Hooks pour notifications (`useNotifications`, `useWebSocket`)
- [ ] Composant de notification toast
- [ ] Centre de notifications
- [ ] Gestion des préférences utilisateur

**Rôles Concernés** : Tous les rôles

---

## 🛠️ **Plan d'Intégration Recommandé**

> ⚠️ **Toutes les APIs sont de priorité HAUTE** - Intégration parallèle recommandée

### Phase 1 - Intégrations Rapides
1. **pdi-service** : Finaliser l'intégration à l'UI existante
2. **notification-service** : Base pour les autres services

### Phase 2 - Services Métier Core
3. **evaluation-service** : Impact direct sur l'expérience pédagogique
4. **remediation-service** : Compléter l'écosystème pédagogique

### Phase 3 - Services Administratifs
5. **facturation-service** : Gestion administrative critique
6. **report-service** : Génération de rapports et bulletins

**Approche recommandée** : Intégration parallèle avec équipes multiples

---

## 📋 **Checklist d'Intégration Type**

Pour chaque service, suivre cette checklist :

### Étape 1 : Génération API
- [ ] Récupérer la spécification OpenAPI du service
- [ ] Générer le client TypeScript avec `openapi-generator`
- [ ] Configurer l'instance Axios dans `src/api/{service}/http.ts`
- [ ] Ajouter les intercepteurs X-Etab/X-Roles

### Étape 2 : Hooks Personnalisés
- [ ] Créer les hooks de lecture (`use{Resource}`, `use{Resource}List`)
- [ ] Créer les hooks de mutation (`useCreate{Resource}`, `useUpdate{Resource}`)
- [ ] Implémenter la gestion du cache React Query
- [ ] Ajouter la gestion d'erreur et loading states

### Étape 3 : Interface Utilisateur
- [ ] Créer les composants de page dans `src/pages/`
- [ ] Développer les composants métier dans `src/components/`
- [ ] Intégrer avec le système de navigation par rôles
- [ ] Ajouter les traductions i18n (FR/EN)

### Étape 4 : Tests et Documentation
- [ ] Tests unitaires des hooks
- [ ] Tests d'intégration des composants
- [ ] Documentation du workflow dans `functional/api-workflows/`
- [ ] Mise à jour de la navigation et des routes

---

## 🔗 **Ressources**

- **Templates** : [functional/_templates/](functional/_templates/) pour documenter les nouveaux services
- **Guide d'intégration** : [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md)
- **Architecture** : [ARCHITECTURE.md](ARCHITECTURE.md)
- **Standards** : [CODING_STANDARDS.md](CODING_STANDARDS.md)

---

*Document créé le : 11 octobre 2025*  
*Prochaine révision : Hebdomadaire selon l'avancement des intégrations*

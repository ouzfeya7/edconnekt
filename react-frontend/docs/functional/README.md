# Documentation Fonctionnelle EdConnekt Frontend

## Vue d'ensemble

Cette documentation décrit tous les workflows End-to-End (E2E) de l'interface utilisateur EdConnekt, organisés par service API et fonctionnalités. Elle couvre à la fois les fonctionnalités connectées aux APIs et celles utilisant des données mockées.

## 📁 Structure de la Documentation

```
docs/functional/
├── README.md                    # Ce fichier - Vue d'ensemble
├── _templates/                  # Templates pour la documentation
│   ├── api-workflow-template.md
│   └── mock-workflow-template.md
├── api-workflows/              # Workflows connectés aux APIs
│   ├── admission-service.md
│   ├── classe-service.md
│   ├── competence-service.md
│   ├── establishment-service.md
│   ├── event-service.md
│   ├── identity-service.md
│   ├── message-service.md
│   ├── pdi-service.md
│   ├── provisioning-service.md
│   ├── resource-service.md
│   ├── student-service.md
│   ├── supplies-service.md
│   └── timetable-service.md
├── mock-workflows/             # Workflows avec données mockées
│   ├── dashboard-kpis.md
│   ├── notifications.md
│   ├── user-preferences.md
│   └── analytics.md
├── cross-service-workflows/    # Workflows impliquant plusieurs services
│   ├── onboarding-complete.md
│   ├── student-enrollment.md
│   └── campaign-management.md
└── user-journeys/             # Parcours utilisateur par rôle
    ├── admin-staff-workflows.md
    ├── enseignant-workflows.md
    ├── eleve-workflows.md
    ├── parent-workflows.md
    └── admin-workflows.md
```

## 🎯 Objectifs de cette Documentation

### Pour les Développeurs
- **Compréhension rapide** des workflows existants
- **Référence technique** pour les intégrations API
- **Guide d'implémentation** pour les nouvelles fonctionnalités
- **Identification claire** des données mockées vs réelles

### Pour les Équipes Produit
- **Vision complète** des fonctionnalités disponibles
- **Identification des gaps** entre UI et backend
- **Planification** des prochaines intégrations
- **Documentation** des parcours utilisateur

### Pour les Testeurs
- **Scénarios de test** détaillés
- **Cas d'usage** complets
- **Points de validation** critiques
- **Gestion d'erreurs** documentée

## 📊 État Actuel des Intégrations

### Services API Intégrés ✅
- **supplies-service** : Campagnes de fournitures (workflow complet)
- **classe-service** : Gestion des classes
- **student-service** : Gestion des élèves
- **timetable-service** : Emplois du temps
- **identity-service** : Authentification et contexte
- **establishment-service** : Gestion des établissements

### Services API Partiellement Intégrés ⚠️
- **competence-service** : En cours d'intégration
- **resource-service** : Intégration partielle
- **message-service** : Fonctionnalités de base
- **event-service** : Calendrier basique

### Services API Non Intégrés ❌
- **admission-service** : Données mockées
- **pdi-service** : Données mockées
- **provisioning-service** : Données mockées

### Fonctionnalités avec Données Mockées 🔄
- **Dashboard KPIs** : Statistiques simulées
- **Notifications** : Système de notifications local
- **Analytics** : Graphiques avec données de test
- **User Preferences** : Stockage local uniquement

## 🔍 Comment Utiliser cette Documentation

### 1. Pour Comprendre un Workflow Existant
1. Identifiez le service concerné dans `api-workflows/`
2. Consultez la section du workflow spécifique
3. Suivez les étapes E2E documentées
4. Vérifiez les points de validation

### 2. Pour Implémenter une Nouvelle Fonctionnalité
1. Utilisez les templates dans `_templates/`
2. Documentez le workflow avant l'implémentation
3. Référencez les patterns existants
4. Mettez à jour cette documentation

### 3. Pour Planifier des Intégrations
1. Consultez `mock-workflows/` pour identifier les priorités
2. Vérifiez les dépendances dans `cross-service-workflows/`
3. Planifiez les migrations de mock vers API
4. Documentez les impacts utilisateur

## 📝 Conventions de Documentation

### Structure Standard d'un Workflow
```markdown
# [Service/Fonctionnalité] - [Workflow Name]

## Vue d'ensemble
Description courte du workflow et de son objectif.

## Prérequis
- Rôle utilisateur requis
- Permissions nécessaires
- État initial du système

## Étapes E2E
### 1. [Étape 1]
- Action utilisateur
- Appel API (si applicable)
- Résultat attendu

### 2. [Étape 2]
- ...

## Points de Validation
- [ ] Critère 1
- [ ] Critère 2

## Gestion d'Erreurs
- Cas d'erreur 1 → Comportement
- Cas d'erreur 2 → Comportement

## États de l'UI
- Loading states
- Empty states
- Error states

## Données Impliquées
- Modèles de données
- Transformations
- Validations
```

### Codes de Statut
- ✅ **Intégré** : Connecté à l'API, fonctionnel
- ⚠️ **Partiel** : Partiellement intégré ou avec limitations
- ❌ **Mock** : Utilise des données simulées
- 🔄 **En cours** : Intégration en développement
- 📋 **Planifié** : Prévu pour intégration future

## 🚀 Prochaines Étapes

### Phase 1 : Documentation des APIs Intégrées
1. **supplies-service** : Workflow complet enseignant + admin staff
2. **classe-service** : Gestion des classes et groupes
3. **student-service** : CRUD élèves et profils
4. **timetable-service** : Emplois du temps et planification

### Phase 2 : Documentation des Workflows Mockés
1. **Dashboard KPIs** : Statistiques et indicateurs
2. **Notifications** : Système de notifications
3. **Analytics** : Graphiques et rapports
4. **User Preferences** : Paramètres utilisateur

### Phase 3 : Workflows Cross-Service
1. **Onboarding complet** : De l'invitation à l'activation
2. **Enrollment étudiant** : Admission → Classe → Profil
3. **Campaign management** : Fournitures → Classes → Validation

### Phase 4 : Parcours Utilisateur par Rôle
1. **Admin Staff** : Dashboard → Gestion → Validation
2. **Enseignant** : Classes → Ressources → Évaluation
3. **Élève** : Profil → Ressources → Activités
4. **Parent** : Suivi → Communication → Validation

## 📚 Ressources Complémentaires

- [API_INTEGRATION_GUIDE.md](../API_INTEGRATION_GUIDE.md) : Guide technique d'intégration
- [ARCHITECTURE.md](../ARCHITECTURE.md) : Architecture générale
- [CODING_STANDARDS.md](../CODING_STANDARDS.md) : Standards de développement

---

*Documentation créée le : 10 octobre 2025*
*Maintenue par : Équipe EdConnekt Frontend*

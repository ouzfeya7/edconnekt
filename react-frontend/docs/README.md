# Documentation EdConnekt Frontend

> **Documentation complète** de l'application React EdConnekt - Architecture, APIs, Workflows et Guides

Ce dossier contient toute la documentation technique et fonctionnelle du frontend EdConnekt, organisée pour faciliter la navigation et la contribution.

---

## **MIGRATION URGENTE EN COURS**

> **IMPORTANT** : Le rôle `directeur` est en cours de migration vers `admin_staff` dans le codebase frontend.  
> **Documentation** : Terminée | **Code Frontend** : **ACTION URGENTE REQUISE**

---

## **Structure de la Documentation**

### **Documentation Principale**

- **[FRONTEND_DOCUMENTATION.md](./FRONTEND_DOCUMENTATION.md)** - **Point d'entrée principal** - Vue d'ensemble technique
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture générale et structure du projet
- **[API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)** - Guide d'intégration des APIs
- **[PENDING_API_INTEGRATIONS.md](./PENDING_API_INTEGRATIONS.md)** - **APIs prêtes** mais non intégrées (6 services)

### **Workflows Fonctionnels**

- **[functional/README.md](./functional/README.md)** - Index complet des workflows
- **[functional/api-workflows/](./functional/api-workflows/)** - **13 services API** documentés
- **[functional/mock-workflows/](./functional/mock-workflows/)** - **5 workflows** avec données simulées
- **[functional/_templates/](./functional/_templates/)** - Templates pour nouveaux modules

### **Guides Techniques**

- **[DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md)** - Guide de configuration de l'environnement (à créer)
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guide de déploiement (à créer)
- **[TESTING.md](./TESTING.md)** - Guide des tests (à créer)
- **[CODING_STANDARDS.md](./CODING_STANDARDS.md)** - Standards de codage (à créer)

### **Ressources Spécialisées**

- **[REMEDIATION_RESOURCES.md](./REMEDIATION_RESOURCES.md)** - Intégration ressources/remédiations
- **[UI_GUIDELINES.md](./UI_GUIDELINES.md)** - Guidelines d'interface utilisateur (à créer)
- **[COMMIT_CONVENTIONS.md](./COMMIT_CONVENTIONS.md)** - Conventions de commit (à créer)

## 🚀 **Navigation Rapide**

### 🔥 **Démarrage Développeur**

1. **📋 Vue d'ensemble** : [FRONTEND_DOCUMENTATION.md](./FRONTEND_DOCUMENTATION.md) - Point d'entrée principal
2. **🏗️ Architecture** : [ARCHITECTURE.md](./ARCHITECTURE.md) - Structure et principes
3. **🔌 APIs** : [functional/README.md](./functional/README.md) - Index des 13 services intégrés
4. **⚠️ Urgences** : [PENDING_API_INTEGRATIONS.md](./PENDING_API_INTEGRATIONS.md) - 6 APIs à intégrer

### 📊 **Par Domaine Fonctionnel**

- **🎓 Onboarding** : [identity-service.md](./functional/api-workflows/identity-service.md) & [provisioning-service.md](./functional/api-workflows/provisioning-service.md)
- **📚 Fournitures** : [supplies-service.md](./functional/api-workflows/supplies-service.md)
- **🎯 Compétences** : [competence-service.md](./functional/api-workflows/competence-service.md)
- **👥 Classes** : [classe-service.md](./functional/api-workflows/classe-service.md)
- **📅 Emploi du temps** : [timetable-service.md](./functional/api-workflows/timetable-service.md)

### 🛠️ **Développement**

- **📝 Templates** : [functional/_templates/](./functional/_templates/) - Pour documenter de nouveaux modules
- **🔧 Intégration API** : [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) - Process standardisé

## 📝 Contribution à la documentation

### Ajouter une nouvelle documentation

1. Créez un nouveau fichier `.md` dans le dossier approprié
2. Suivez le format Markdown standard
3. Ajoutez une référence dans ce README
4. Mettez à jour la table des matières si nécessaire

### Format recommandé

```markdown
# Titre de la documentation

## Vue d'ensemble
Description courte de la fonctionnalité

## Détails techniques
Informations techniques détaillées

## Utilisation
Guide d'utilisation pratique

## Exemples
Exemples concrets d'utilisation
```

## 🔄 Maintenance

- Mettez à jour la documentation lors de chaque modification importante
- Vérifiez la cohérence entre la documentation et le code
- Supprimez la documentation obsolète


---

## 📈 **État de la Documentation**

| Catégorie | Fichiers | Statut |
|-----------|----------|---------|
| **Documentation Principale** | 4 fichiers | ✅ À jour |
| **Workflows API** | 13 services | ✅ Documentés |
| **Workflows Mock** | 5 workflows | ✅ Documentés |
| **APIs Pendantes** | 6 services | ⚠️ En attente d'intégration |
| **Migration directeur→admin_staff** | Documentation | ✅ Terminée |
| **Migration directeur→admin_staff** | Code Frontend | ❌ **URGENT** |

---

*Dernière mise à jour : 11 octobre 2025*  
*Prochaine révision : Hebdomadaire* 
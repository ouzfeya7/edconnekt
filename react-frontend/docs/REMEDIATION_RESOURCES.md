# Intégration des Ressources dans les Remédiations

## Vue d'ensemble

L'intégration des ressources dans les remédiations permet aux enseignants d'associer des ressources pédagogiques existantes ou de créer de nouvelles ressources spécifiquement pour les sessions de remédiation. Cette fonctionnalité est similaire à celle implémentée dans la page de détails d'un cours.

## Architecture

### Composants principaux

1. **RemediationDetailPage** (`src/pages/RemediationDetailPage.tsx`)
   - Page principale de détails d'une remédiation
   - Gère l'affichage et l'interaction avec les ressources
   - Intègre le modal d'association de ressources

2. **RemediationResourceAssociationModal** (`src/components/course/RemediationResourceAssociationModal.tsx`)
   - Modal pour associer des ressources à une remédiation
   - Permet de rechercher des ressources existantes
   - Permet de créer et uploader de nouvelles ressources

3. **RemediationResourceCard** (`src/components/course/RemediationResourceCard.tsx`)
   - Composant pour afficher une ressource de remédiation
   - Interface utilisateur cohérente avec le design système

4. **RemediationResourceService** (`src/services/remediationResourceService.ts`)
   - Service pour gérer les opérations CRUD des ressources de remédiation
   - Interface avec l'API backend (simulée)

### Types et interfaces

```typescript
interface RemediationResource {
  id: string;
  remediationId: string;
  resourceId: number;
  title: string;
  description: string;
  subject: string;
  imageUrl: string;
  fileType: string;
  fileSize: number;
  visibility: string;
  addedBy: string;
  addedAt: string;
  isActive: boolean;
  isPaid?: boolean;
}
```

## Fonctionnalités

### 1. Affichage des ressources
- Les ressources sont affichées dans l'onglet "Ressources" de la page de remédiation
- Interface en grille avec cartes pour chaque ressource
- Informations détaillées : titre, description, matière, type de fichier, taille, visibilité

### 2. Association de ressources existantes
- Recherche par titre ou description
- Filtrage par matière
- Affichage des métadonnées (visibilité, taille, type de fichier)
- Support des ressources payantes

### 3. Création de nouvelles ressources
- Upload de fichiers (PDF, DOC, PPT, images, vidéos)
- Définition des métadonnées (titre, description, matière, visibilité)
- Intégration automatique dans le système de ressources

### 4. Navigation et interactions
- Clic sur une ressource pour la consulter
- Redirection vers la page de paiement pour les ressources payantes
- Téléchargement direct des ressources gratuites

## Intégration avec le système existant

### Contexte des ressources
- Utilise le `ResourceContext` existant pour la gestion globale des ressources
- Intègre avec le système de visibilité (PRIVATE, CLASS, SCHOOL)
- Support du système de paiement

### Service de remédiation
- Service dédié pour les opérations spécifiques aux remédiations
- Gestion des associations ressource-remédiation
- Persistance des données (simulée)

## Utilisation

### Pour les enseignants

1. **Accéder à une remédiation**
   - Naviguer vers la page de détails d'une remédiation
   - Cliquer sur l'onglet "Ressources"

2. **Ajouter une ressource**
   - Cliquer sur "Ajouter une ressource"
   - Choisir entre rechercher une ressource existante ou créer une nouvelle
   - Remplir les informations nécessaires
   - Confirmer l'association

3. **Gérer les ressources**
   - Consulter les ressources associées
   - Télécharger ou consulter les ressources
   - Voir les métadonnées (date d'ajout, visibilité, etc.)

### Pour les développeurs

1. **Extension du système**
   - Le système est extensible pour d'autres types de contenu
   - Architecture modulaire facilitant l'ajout de nouvelles fonctionnalités

2. **Intégration API**
   - Remplacer les appels simulés par de vraies requêtes API
   - Adapter les interfaces selon les spécifications backend

## Avantages

1. **Cohérence** : Interface similaire à celle des cours
2. **Flexibilité** : Support des ressources existantes et nouvelles
3. **Accessibilité** : Interface intuitive et responsive
4. **Extensibilité** : Architecture modulaire et réutilisable

## Évolutions futures

- Ajout de filtres avancés pour la recherche
- Support de collections de ressources
- Intégration avec un système de tags
- Analytics d'utilisation des ressources
- Partage de ressources entre remédiations 
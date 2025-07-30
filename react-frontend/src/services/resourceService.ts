// Service pour gérer les ressources (compatible microservices)
export interface ResourceVersion {
  id: number;
  resourceId: number;
  versionNumber: number;
  fileUrl: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  changeDescription: string;
}

export interface ResourceUpdate {
  id: number;
  title?: string;
  description?: string;
  imageUrl?: string;
  isPaid?: boolean;
  visibility?: 'PRIVATE' | 'CLASS' | 'SCHOOL';
  competence?: string;
  fileType?: 'PDF' | 'DOCX' | 'PPTX' | 'VIDEO' | 'IMAGE' | 'LINK';
  fileSize?: number;
  version?: number;
  classId?: string;
  changeDescription?: string;
}

class ResourceService {
  private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Récupérer les versions d'une ressource
  async getResourceVersions(resourceId: number): Promise<ResourceVersion[]> {
    try {
      // Pour l'instant, retourner un tableau vide car le microservice n'est pas encore disponible
      console.log('Service microservice non disponible - utilisation des données mock');
      return [];
    } catch (error) {
      console.error('Erreur getResourceVersions:', error);
      return [];
    }
  }

  // Mettre à jour une ressource (gestion des versions côté backend)
  async updateResource(updateData: ResourceUpdate): Promise<boolean> {
    try {
      // Pour l'instant, simuler un succès car le microservice n'est pas encore disponible
      console.log('Service microservice non disponible - simulation de mise à jour');
      return true;
    } catch (error) {
      console.error('Erreur updateResource:', error);
      return false;
    }
  }

  // Créer une nouvelle version
  async createNewVersion(resourceId: number, changeDescription?: string): Promise<boolean> {
    try {
      // Pour l'instant, simuler un succès car le microservice n'est pas encore disponible
      console.log('Service microservice non disponible - simulation de création de version');
      return true;
    } catch (error) {
      console.error('Erreur createNewVersion:', error);
      return false;
    }
  }

  // Restaurer une version
  async restoreVersion(resourceId: number, versionNumber: number): Promise<boolean> {
    try {
      // Pour l'instant, simuler un succès car le microservice n'est pas encore disponible
      console.log('Service microservice non disponible - simulation de restauration de version');
      return true;
    } catch (error) {
      console.error('Erreur restoreVersion:', error);
      return false;
    }
  }

  // Télécharger une version spécifique
  async downloadVersion(resourceId: number, versionNumber: number): Promise<Blob | null> {
    try {
      // Pour l'instant, simuler un téléchargement car le microservice n'est pas encore disponible
      console.log('Service microservice non disponible - simulation de téléchargement');
      return null;
    } catch (error) {
      console.error('Erreur downloadVersion:', error);
      return null;
    }
  }
}

export const resourceService = new ResourceService(); 
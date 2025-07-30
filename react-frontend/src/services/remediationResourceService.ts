export interface RemediationResource {
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

export interface RemediationResourceAssociation {
  remediationId: string;
  resourceId: number;
  addedBy: string;
  addedAt: string;
}

class RemediationResourceService {
  private remediationResources: RemediationResource[] = [];

  // Associer une ressource existante à une remédiation
  async associateResourceToRemediation(association: RemediationResourceAssociation): Promise<boolean> {
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // En production, cela serait une requête API
      console.log('Association de ressource à la remédiation:', association);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'association de la ressource:', error);
      return false;
    }
  }

  // Créer et associer une nouvelle ressource
  async createAndAssociateResource(
    remediationId: string,
    resourceData: Omit<RemediationResource, 'id' | 'remediationId' | 'addedAt' | 'isActive'>
  ): Promise<boolean> {
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRemediationResource: RemediationResource = {
        id: Date.now().toString(),
        remediationId,
        resourceId: resourceData.resourceId,
        title: resourceData.title,
        description: resourceData.description,
        subject: resourceData.subject,
        imageUrl: resourceData.imageUrl,
        fileType: resourceData.fileType,
        fileSize: resourceData.fileSize,
        visibility: resourceData.visibility,
        addedBy: resourceData.addedBy,
        addedAt: new Date().toISOString(),
        isActive: true,
        isPaid: resourceData.isPaid
      };

      this.remediationResources.push(newRemediationResource);
      
      console.log('Nouvelle ressource créée et associée:', newRemediationResource);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la création de la ressource:', error);
      return false;
    }
  }

  // Obtenir toutes les ressources d'une remédiation
  async getRemediationResources(remediationId: string): Promise<RemediationResource[]> {
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return this.remediationResources.filter(r => r.remediationId === remediationId);
    } catch (error) {
      console.error('Erreur lors de la récupération des ressources:', error);
      return [];
    }
  }

  // Supprimer l'association d'une ressource
  async removeResourceFromRemediation(remediationId: string, resourceId: number): Promise<boolean> {
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.remediationResources = this.remediationResources.filter(
        r => !(r.remediationId === remediationId && r.resourceId === resourceId)
      );
      
      console.log('Ressource supprimée de la remédiation:', { remediationId, resourceId });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la ressource:', error);
      return false;
    }
  }

  // Mettre à jour une ressource de remédiation
  async updateRemediationResource(
    resourceId: string,
    updates: Partial<RemediationResource>
  ): Promise<boolean> {
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = this.remediationResources.findIndex(r => r.id === resourceId);
      if (index !== -1) {
        this.remediationResources[index] = {
          ...this.remediationResources[index],
          ...updates,
          addedAt: new Date().toISOString()
        };
      }
      
      console.log('Ressource de remédiation mise à jour:', { resourceId, updates });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la ressource:', error);
      return false;
    }
  }
}

export const remediationResourceService = new RemediationResourceService(); 
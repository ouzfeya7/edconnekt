// Service pour gérer l'association des ressources aux cours
import { useResources } from '../contexts/ResourceContext';

export interface CourseResource {
  id: string;
  courseId: string;
  lessonId?: string;
  resourceId: string;
  title: string;
  description: string;
  subject: string;
  imageUrl: string;
  fileType: string;
  fileSize: number;
  visibility: 'PRIVATE' | 'CLASS' | 'SCHOOL';
  addedBy: string;
  addedAt: string;
  isActive: boolean;
}

export interface CourseResourceAssociation {
  courseId: string;
  lessonId?: string;
  resourceId: string;
  addedBy: string;
  addedAt: string;
}

class CourseResourceService {
  private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Récupérer toutes les ressources d'un cours
  async getCourseResources(courseId: string): Promise<CourseResource[]> {
    try {
      // Pour l'instant, retourner des données mock
      console.log('Service microservice non disponible - utilisation des données mock');
      return this.getMockCourseResources(courseId);
    } catch (error) {
      console.error('Erreur getCourseResources:', error);
      return [];
    }
  }

  // Récupérer les ressources d'une leçon spécifique
  async getLessonResources(courseId: string, lessonId: string): Promise<CourseResource[]> {
    try {
      console.log('Service microservice non disponible - utilisation des données mock');
      return this.getMockLessonResources(courseId, lessonId);
    } catch (error) {
      console.error('Erreur getLessonResources:', error);
      return [];
    }
  }

  // Associer une ressource existante à un cours
  async associateResourceToCourse(association: CourseResourceAssociation): Promise<boolean> {
    try {
      console.log('Service microservice non disponible - simulation d\'association');
      return true;
    } catch (error) {
      console.error('Erreur associateResourceToCourse:', error);
      return false;
    }
  }

  // Créer une nouvelle ressource et l'associer au cours
  async createAndAssociateResource(
    courseId: string, 
    lessonId: string, 
    resourceData: any
  ): Promise<boolean> {
    try {
      console.log('Service microservice non disponible - simulation de création et association');
      return true;
    } catch (error) {
      console.error('Erreur createAndAssociateResource:', error);
      return false;
    }
  }

  // Retirer une ressource d'un cours
  async removeResourceFromCourse(courseId: string, resourceId: string): Promise<boolean> {
    try {
      console.log('Service microservice non disponible - simulation de suppression');
      return true;
    } catch (error) {
      console.error('Erreur removeResourceFromCourse:', error);
      return false;
    }
  }

  // Rechercher des ressources disponibles pour association
  async searchAvailableResources(
    courseId: string, 
    query: string, 
    subject?: string
  ): Promise<any[]> {
    try {
      console.log('Service microservice non disponible - simulation de recherche');
      return this.getMockAvailableResources(query, subject);
    } catch (error) {
      console.error('Erreur searchAvailableResources:', error);
      return [];
    }
  }

  // Données mock pour les ressources de cours
  private getMockCourseResources(courseId: string): CourseResource[] {
    return [
      {
        id: '1',
        courseId,
        lessonId: 'lesson-1',
        resourceId: 'resource-1',
        title: 'Exercices de calcul mental',
        description: 'Série d\'exercices pour pratiquer le calcul mental',
        subject: 'Mathématiques',
        imageUrl: 'https://example.com/math-exercises.jpg',
        fileType: 'PDF',
        fileSize: 2048576,
        visibility: 'CLASS',
        addedBy: 'Marie Dupont',
        addedAt: '2024-01-15T10:30:00Z',
        isActive: true
      },
      {
        id: '2',
        courseId,
        lessonId: 'lesson-2',
        resourceId: 'resource-2',
        title: 'Vidéo : La Révolution Française',
        description: 'Documentaire sur la Révolution Française',
        subject: 'Histoire',
        imageUrl: 'https://example.com/revolution.jpg',
        fileType: 'VIDEO',
        fileSize: 52428800,
        visibility: 'SCHOOL',
        addedBy: 'Jean Martin',
        addedAt: '2024-01-16T14:20:00Z',
        isActive: true
      }
    ];
  }

  private getMockLessonResources(courseId: string, lessonId: string): CourseResource[] {
    return this.getMockCourseResources(courseId).filter(r => r.lessonId === lessonId);
  }

  private getMockAvailableResources(query: string, subject?: string): any[] {
    return [
      {
        id: 'resource-3',
        title: 'Grammaire française - Les temps',
        description: 'Cours complet sur les temps de la conjugaison',
        subject: 'Français',
        imageUrl: 'https://example.com/grammar.jpg',
        fileType: 'PDF',
        fileSize: 1536000,
        visibility: 'SCHOOL'
      },
      {
        id: 'resource-4',
        title: 'Exercices de géométrie',
        description: 'Problèmes de géométrie pour le niveau CP',
        subject: 'Mathématiques',
        imageUrl: 'https://example.com/geometry.jpg',
        fileType: 'PDF',
        fileSize: 1024000,
        visibility: 'CLASS'
      }
    ].filter(r => 
      r.title.toLowerCase().includes(query.toLowerCase()) &&
      (!subject || r.subject === subject)
    );
  }
}

export const courseResourceService = new CourseResourceService(); 
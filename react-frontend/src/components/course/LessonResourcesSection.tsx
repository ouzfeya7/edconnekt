import React, { useState, useEffect } from 'react';
import ResourceCard from './ResourceCard';
import { useAuth } from '../../pages/authentification/useAuth';
import { useAppRolesFromIdentity } from '../../hooks/useAppRolesFromIdentity';
import { ActionCard } from '../ui/ActionCard';
import { Plus, Trash2, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import ResourceAssociationModal from './ResourceAssociationModal';
import { courseResourceService, CourseResource } from '../../services/courseResourceService';

// Logique de rôle
type Role = "enseignant" | "directeur" | "eleve" | "parent" | "administrateur" | "espaceFamille";
const rolesPriority: Role[] = ["administrateur", "directeur", "enseignant", "eleve", "parent", "espaceFamille"];

interface LessonResourcesSectionProps {
  courseId: string;
  lessonId?: string;
  onViewResource?: (resourceId: string) => void;
}

const LessonResourcesSection: React.FC<LessonResourcesSectionProps> = ({
  courseId,
  lessonId,
  onViewResource,
}) => {
  const { roles } = useAuth();
  const { capabilities } = useAppRolesFromIdentity();
  const userRole = capabilities.isAdminStaff ? 'directeur' : capabilities.isTeacher ? 'enseignant' : capabilities.isStudent ? 'eleve' : capabilities.isParent ? 'parent' : rolesPriority.find(r => roles.includes(r));
  
  const [resources, setResources] = useState<CourseResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Charger les ressources du cours/leçon
  useEffect(() => {
    const loadResources = async () => {
      setIsLoading(true);
      try {
        let courseResources: CourseResource[];
        if (lessonId) {
          courseResources = await courseResourceService.getLessonResources(courseId, lessonId);
        } else {
          courseResources = await courseResourceService.getCourseResources(courseId);
        }
        setResources(courseResources);
      } catch (error) {
        console.error('Erreur lors du chargement des ressources:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadResources();
  }, [courseId, lessonId]);

  // Gérer l'ajout d'une nouvelle ressource
  const handleResourceAssociated = (newResource: CourseResource) => {
    setResources(prev => [...prev, newResource]);
  };

  // Gérer la suppression d'une ressource
  const handleRemoveResource = async (resourceId: string) => {
    try {
      const success = await courseResourceService.removeResourceFromCourse(courseId, resourceId);
      if (success) {
        setResources(prev => prev.filter(r => r.resourceId !== resourceId));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const canModifyResources = capabilities.canManageResources || userRole === 'administrateur';

  if (isLoading) {
    return (
      <section className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-semibold text-gray-800">Ressources</h3>
        </div>
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 mt-2">Chargement des ressources...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold text-gray-800">Ressources</h3>
        {canModifyResources && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <div className="inline-block">
                <ActionCard 
                  icon={<Plus className="text-orange-500 w-5 h-5" />} 
                  label="Associer une ressource" 
                  onClick={() => setIsModalOpen(true)}
                />
              </div>
            </DialogTrigger>
            <DialogContent>
              <ResourceAssociationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                courseId={courseId}
                lessonId={lessonId}
                onResourceAssociated={handleResourceAssociated}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {resources.length === 0 ? (
        <div className="text-center py-8">
          <Eye className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">
            {canModifyResources 
              ? "Aucune ressource associée à cette leçon. Cliquez sur 'Associer une ressource' pour commencer."
              : "Aucune ressource pour cette leçon."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {resources.map(resource => (
            <div key={resource.id} className="relative group">
              <ResourceCard 
                title={resource.title}
                imageUrl={resource.imageUrl}
                fileCount={1} // Chaque ressource a au moins un fichier
                onViewResource={onViewResource ? () => onViewResource(resource.resourceId) : undefined}
              />
              
              {/* Badge de visibilité */}
              <div className="absolute top-2 right-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  resource.visibility === 'PRIVATE' ? 'bg-red-100 text-red-700' :
                  resource.visibility === 'CLASS' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {resource.visibility === 'PRIVATE' ? 'Privé' :
                   resource.visibility === 'CLASS' ? 'Classe' : 'École'}
                </span>
              </div>

              {/* Bouton de suppression pour les enseignants */}
              {canModifyResources && (
                <button
                  onClick={() => handleRemoveResource(resource.resourceId)}
                  className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  title="Retirer cette ressource"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}

              {/* Informations supplémentaires */}
              <div className="mt-2 text-xs text-gray-500">
                <p>Ajouté par {resource.addedBy}</p>
                <p>{new Date(resource.addedAt).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default LessonResourcesSection; 
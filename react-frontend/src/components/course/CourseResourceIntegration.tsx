import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, ExternalLink, Calendar } from 'lucide-react';
import { useAuth } from '../../pages/authentification/useAuth';
import ResourceAssociationModal from './ResourceAssociationModal';
import { courseResourceService, CourseResource } from '../../services/courseResourceService';

interface CourseResourceIntegrationProps {
  courseId: string;
  lessonId?: string;
  lessonTitle?: string;
  onResourceSelected?: (resourceId: string) => void;
}

const CourseResourceIntegration: React.FC<CourseResourceIntegrationProps> = ({
  courseId,
  lessonId,
  lessonTitle,
  onResourceSelected
}) => {
  const { roles } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentResources, setRecentResources] = useState<CourseResource[]>([]);

  const canModifyResources = roles.includes('enseignant') || roles.includes('directeur') || roles.includes('administrateur');

  // Charger les ressources récentes du cours
  useEffect(() => {
    const loadRecentResources = async () => {
      try {
        const resources = await courseResourceService.getCourseResources(courseId);
        setRecentResources(resources.slice(0, 5)); // Les 5 plus récentes
      } catch (error) {
        console.error('Erreur lors du chargement des ressources récentes:', error);
      }
    };

    loadRecentResources();
  }, [courseId]);

  const handleResourceAssociated = (newResource: CourseResource) => {
    setRecentResources(prev => [newResource, ...prev.slice(0, 4)]);
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'PRIVATE': return <span className="text-red-500">🔒</span>;
      case 'CLASS': return <span className="text-blue-500">👥</span>;
      case 'SCHOOL': return <span className="text-green-500">🌐</span>;
      default: return <span className="text-gray-500">👁️</span>;
    }
  };

  // const handleVisibilityChange = (resourceId: string, newVisibility: 'PRIVATE' | 'CLASS' | 'SCHOOL') => {
  //   setRecentResources(prev => 
  //     prev.map(resource => 
  //       resource.id === resourceId 
  //         ? { ...resource, visibility: newVisibility }
  //         : resource
  //     )
  //   );
  // };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            {lessonTitle ? `Ressources - ${lessonTitle}` : 'Ressources du cours'}
          </h3>
        </div>
        {canModifyResources && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition"
          >
            <Plus className="w-4 h-4" />
            Joindre ressource
          </button>
        )}
      </div>

      {recentResources.length === 0 ? (
        <div className="text-center py-6">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm mb-3">
            Aucune ressource associée à ce cours
          </p>
          {canModifyResources && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              <Plus className="w-4 h-4" />
              Associer une ressource
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {recentResources.map((resource) => (
            <div
              key={resource.id}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer"
              onClick={() => onResourceSelected?.(resource.resourceId)}
            >
              {/* Icône de visibilité */}
              <div className="flex-shrink-0">
                {getVisibilityIcon(resource.visibility)}
              </div>

              {/* Informations de la ressource */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {resource.title}
                </h4>
                <p className="text-sm text-gray-600 truncate">
                  {resource.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    {resource.subject}
                  </span>
                  <span className="text-xs text-gray-500">
                    {resource.fileType}
                  </span>
                </div>
              </div>

              {/* Bouton d'action */}
              <div className="flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onResourceSelected?.(resource.resourceId);
                  }}
                  className="p-1 text-gray-400 hover:text-orange-500 transition"
                  title="Voir la ressource"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Lien vers toutes les ressources */}
          <div className="pt-2 border-t border-gray-200">
            <button
              onClick={() => onResourceSelected?.('all')}
              className="w-full text-center py-2 text-orange-600 hover:text-orange-700 font-medium text-sm"
            >
              Voir toutes les ressources ({recentResources.length})
            </button>
          </div>
        </div>
      )}

      {/* Instructions pour les enseignants */}
      {canModifyResources && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-blue-500 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Conseil pour les enseignants :</p>
              <p>
                Associez des ressources à vos leçons pour les rendre accessibles aux élèves et parents. 
                Les ressources avec visibilité "Classe" seront visibles par les parents de votre classe.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'association */}
      <ResourceAssociationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseId={courseId}
        lessonId={lessonId}
        onResourceAssociated={handleResourceAssociated}
      />
    </div>
  );
};

export default CourseResourceIntegration; 
import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Eye, Users, Globe, Lock, FileText, Video, Image, Link } from 'lucide-react';
import { courseResourceService, CourseResource } from '../../services/courseResourceService';
import { useAuth } from '../../pages/authentification/useAuth';
import ResourceAssociationModal from './ResourceAssociationModal';

interface CourseResourcesWidgetProps {
  courseId: string;
  courseTitle: string;
  onViewResource?: (resourceId: string) => void;
  onResourceClick?: (resourceId: string) => void;
}

const CourseResourcesWidget: React.FC<CourseResourcesWidgetProps> = ({ 
  courseId, 
  // courseTitle,
  // onViewResource,
  onResourceClick 
}) => {
  const { roles } = useAuth();
  const [resources, setResources] = useState<CourseResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const canModifyResources = roles.includes('enseignant') || roles.includes('directeur') || roles.includes('administrateur');

  useEffect(() => {
    const loadResources = async () => {
      setIsLoading(true);
      try {
        const courseResources = await courseResourceService.getCourseResources(courseId);
        setResources(courseResources);
      } catch (error) {
        console.error('Erreur lors du chargement des ressources:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadResources();
  }, [courseId]);

  const handleResourceAssociated = (newResource: CourseResource) => {
    setResources(prev => [...prev, newResource]);
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case 'PDF':
      case 'DOCX':
      case 'DOC':
        return <FileText className="w-4 h-4" />;
      case 'VIDEO':
      case 'MP4':
        return <Video className="w-4 h-4" />;
      case 'IMAGE':
      case 'JPG':
      case 'PNG':
        return <Image className="w-4 h-4" />;
      case 'LINK':
        return <Link className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'PRIVATE': return <Lock className="w-3 h-3" />;
      case 'CLASS': return <Users className="w-3 h-3" />;
      case 'SCHOOL': return <Globe className="w-3 h-3" />;
      default: return <Eye className="w-3 h-3" />;
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'PRIVATE': return 'bg-red-100 text-red-700';
      case 'CLASS': return 'bg-blue-100 text-blue-700';
      case 'SCHOOL': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const displayedResources = showAll ? resources : resources.slice(0, 3);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-500" />
            Ressources du cours
          </h3>
        </div>
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 mt-2">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-orange-500" />
          Ressources du cours
        </h3>
        {canModifyResources && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition"
          >
            <Plus className="w-4 h-4" />
            Associer
          </button>
        )}
      </div>

      {resources.length === 0 ? (
        <div className="text-center py-8">
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
          {displayedResources.map((resource) => (
            <div
              key={resource.id}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer"
              onClick={() => onResourceClick?.(resource.resourceId)}
            >
              {/* Icône du type de fichier */}
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                {getFileTypeIcon(resource.fileType)}
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
                  <span className={`text-xs px-2 py-0.5 rounded ${getVisibilityColor(resource.visibility)}`}>
                    {getVisibilityIcon(resource.visibility)}
                    {resource.visibility === 'PRIVATE' ? 'Privé' :
                     resource.visibility === 'CLASS' ? 'Classe' : 'École'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatFileSize(resource.fileSize)}
                  </span>
                </div>
              </div>

              {/* Informations supplémentaires */}
              <div className="flex-shrink-0 text-right">
                <p className="text-xs text-gray-500">
                  Ajouté par {resource.addedBy}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(resource.addedAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          ))}

          {/* Bouton "Voir plus" si il y a plus de 3 ressources */}
          {resources.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full text-center py-2 text-orange-600 hover:text-orange-700 font-medium"
            >
              {showAll ? 'Voir moins' : `Voir ${resources.length - 3} autres ressources`}
            </button>
          )}

          {/* Statistiques */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{resources.length} ressource{resources.length > 1 ? 's' : ''} associée{resources.length > 1 ? 's' : ''}</span>
              <span>
                {resources.filter(r => r.visibility === 'SCHOOL').length} publique{resources.filter(r => r.visibility === 'SCHOOL').length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'association */}
      <ResourceAssociationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseId={courseId}
        onResourceAssociated={handleResourceAssociated}
      />
    </div>
  );
};

export default CourseResourcesWidget; 
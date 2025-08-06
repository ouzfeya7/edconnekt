import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../pages/authentification/useAuth';
import { Eye, Users, User, Lock, FileText, Calendar, Tag, Globe } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface ResourceMetadataProps {
  resource: {
    title: string;
    subject: string;
    competence?: string;
    description: string;
    visibility?: 'PRIVATE' | 'CLASS' | 'SCHOOL';
    fileType?: 'PDF' | 'DOCX' | 'PPTX' | 'VIDEO' | 'IMAGE' | 'LINK';
    fileSize?: number;
    author?: {
      id: string;
      name: string;
      role: string;
    };
    createdAt?: string;
    updatedAt?: string;
    version?: number;
    classId?: string;
  };
  onUpdate?: () => void;
}

const ResourceMetadata: React.FC<ResourceMetadataProps> = ({ 
  resource, 
  onUpdate 
}) => {
  const { t } = useTranslation();
  const { user, roles } = useAuth();
  
  // Permissions : les parents/élèves voient moins d'informations
  const canViewDetailedMetadata = roles.includes('enseignant') || roles.includes('directeur') || roles.includes('administrateur');

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'N/A';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getVisibilityIcon = (visibility?: string) => {
    switch (visibility) {
      case 'PRIVATE': return <Lock className="w-4 h-4" />;
      case 'CLASS': return <Users className="w-4 h-4" />;
      case 'SCHOOL': return <Globe className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getVisibilityLabel = (visibility?: string) => {
    switch (visibility) {
      case 'PRIVATE': return t('private', 'Privé');
      case 'CLASS': return t('class', 'Classe');
      case 'SCHOOL': return t('school', 'École');
      default: return t('unknown', 'Inconnu');
    }
  };

  const getVisibilityColor = (visibility?: string) => {
    switch (visibility) {
      case 'PRIVATE': return 'bg-red-100 text-red-800';
      case 'CLASS': return 'bg-blue-100 text-blue-800';
      case 'SCHOOL': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileTypeIcon = (fileType?: string) => {
    switch (fileType) {
      case 'PDF': return '📄';
      case 'DOCX': return '📝';
      case 'PPTX': return '📊';
      case 'VIDEO': return '🎥';
      case 'IMAGE': return '🖼️';
      case 'LINK': return '🔗';
      default: return '📁';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button 
          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 bg-gray-50 rounded hover:bg-gray-100 transition-colors duration-150" 
          title="Voir les détails"
          onClick={e => e.stopPropagation()}
        >
          <Eye className="w-3 h-3" />
          Détails
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {t('resource_details', 'Détails de la ressource')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="bg-white rounded-lg p-4">
      
      <div className="space-y-4">
        {/* Informations de base - visibles par tous */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">{t('subject', 'Matière')}</p>
              <p className="text-sm text-gray-600">{resource.subject}</p>
            </div>
          </div>
          
          {resource.competence && (
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">{t('competence', 'Compétence')}</p>
                <p className="text-sm text-gray-600">{resource.competence}</p>
              </div>
            </div>
          )}
        </div>

        {/* Visibilité - visible par tous mais avec icônes différentes */}
        <div className="flex items-center gap-3">
          {getVisibilityIcon(resource.visibility)}
          <div>
            <p className="text-sm font-medium text-gray-900">{t('visibility', 'Visibilité')}</p>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getVisibilityColor(resource.visibility)}`}>
              {getVisibilityLabel(resource.visibility)}
            </span>
          </div>
        </div>

        {/* Informations détaillées - uniquement pour les enseignants/admin */}
        {canViewDetailedMetadata && (
          <>
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                {t('technical_details', 'Détails techniques')}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getFileTypeIcon(resource.fileType)}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t('file_type', 'Type de fichier')}</p>
                    <p className="text-sm text-gray-600">{resource.fileType || t('not_specified', 'Non spécifié')}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t('file_size', 'Taille du fichier')}</p>
                    <p className="text-sm text-gray-600">{formatFileSize(resource.fileSize)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t('author', 'Auteur')}</p>
                    <p className="text-sm text-gray-600">
                      {resource.author?.name || t('unknown_author', 'Auteur inconnu')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t('created_at', 'Créé le')}</p>
                    <p className="text-sm text-gray-600">{formatDate(resource.createdAt)}</p>
                  </div>
                </div>
              </div>
              
              {resource.version && (
                <div className="flex items-center gap-3 mt-4">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t('version', 'Version')}</p>
                    <p className="text-sm text-gray-600">{resource.version}</p>
                  </div>
                </div>
              )}
              
              {resource.updatedAt && resource.updatedAt !== resource.createdAt && (
                <div className="flex items-center gap-3 mt-4">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t('last_updated', 'Dernière modification')}</p>
                    <p className="text-sm text-gray-600">{formatDate(resource.updatedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Description - visible par tous */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            {t('description', 'Description')}
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {resource.description}
          </p>
        </div>
      </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceMetadata; 
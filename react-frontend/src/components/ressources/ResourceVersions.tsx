import React from 'react';
import { useTranslation } from 'react-i18next';
import { useResources } from '../../contexts/ResourceContext';
import { useAuth } from '../../pages/authentification/useAuth';
import { Clock, Download, FileText, User, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface ResourceVersionsProps {
  resourceId: number;
  resourceTitle: string;
}

const ResourceVersions: React.FC<ResourceVersionsProps> = ({ resourceId, resourceTitle }) => {
  const { t } = useTranslation();
  const { getVersionsByResourceId } = useResources();
  const { roles } = useAuth();
  
  // Permissions : seuls les enseignants et admin peuvent voir les versions
  const canViewVersions = roles.includes('enseignant') || roles.includes('directeur') || roles.includes('administrateur');
  const canAddVersions = roles.includes('enseignant') || roles.includes('directeur') || roles.includes('administrateur');
  
  const versions = getVersionsByResourceId(resourceId);

  if (!canViewVersions) {
    return null; // Masquer complètement pour les parents/élèves
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors" title="Gérer les versions">
          <Clock className="w-3 h-3" />
          {versions.length}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {t('resource_versions', 'Versions de la ressource')}
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">{resourceTitle}</p>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          {versions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>{t('no_versions', 'Aucune version disponible')}</p>
            </div>
          ) : (
            versions.map((version) => (
              <div key={version.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {t('version', 'Version')} {version.versionNumber}
                      </span>
                      {version.versionNumber === Math.max(...versions.map(v => v.versionNumber)) && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {t('latest', 'Plus récente')}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{version.changeDescription}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{version.uploadedBy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(version.uploadedAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{formatFileSize(version.fileSize)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => window.open(version.fileUrl, '_blank')}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                      title={t('download_version', 'Télécharger cette version')}
                    >
                      <Download className="w-4 h-4" />
                      {t('download', 'Télécharger')}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {canAddVersions && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-orange-400 rounded-lg hover:bg-orange-600 transition-colors"
            >
              <FileText className="w-4 h-4" />
              {t('add_new_version', 'Ajouter une nouvelle version')}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResourceVersions; 
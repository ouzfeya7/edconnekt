import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Search, Upload, FileText, X, Eye, Users, Globe, Lock, DollarSign } from 'lucide-react';
import { courseResourceService, CourseResource } from '../../services/courseResourceService';
import { useAvailableResources, AvailableResource } from '../../hooks/useAvailableResources';
import { useResources } from '../../contexts/ResourceContext';

interface ResourceAssociationModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  lessonId?: string;
  onResourceAssociated: (resource: CourseResource) => void;
}

const ResourceAssociationModal: React.FC<ResourceAssociationModalProps> = ({
  isOpen,
  onClose,
  courseId,
  lessonId,
  onResourceAssociated
}) => {
  const { addResource } = useResources();
  const { searchResources } = useAvailableResources();
  
  const [activeTab, setActiveTab] = useState<'search' | 'upload'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [filteredResources, setFilteredResources] = useState<AvailableResource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResource, setSelectedResource] = useState<AvailableResource | null>(null);

  // États pour l'upload
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadSubject, setUploadSubject] = useState('');
  const [uploadVisibility, setUploadVisibility] = useState<'PRIVATE' | 'CLASS' | 'SCHOOL'>('CLASS');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const subjects = [
    'Mathématiques', 'Français', 'Histoire', 'Géographie', 
    'Sciences', 'Anglais', 'Arts plastiques', 'EPS', 'Musique',
    'Vivre dans son milieu', 'Études islamiques', 'Quran'
  ];

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'PRIVATE': return <Lock className="w-4 h-4" />;
      case 'CLASS': return <Users className="w-4 h-4" />;
      case 'SCHOOL': return <Globe className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case 'PRIVATE': return 'Privé';
      case 'CLASS': return 'Classe';
      case 'SCHOOL': return 'École';
      default: return 'Inconnu';
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

  // Rechercher des ressources disponibles
  const performSearch = useCallback(() => {
    setIsLoading(true);
    try {
      const results = searchResources(searchQuery, selectedSubject || undefined);
      setFilteredResources(results);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedSubject, searchResources]);

  // Associer une ressource existante
  const associateExistingResource = async (resource: AvailableResource) => {
    try {
      const success = await courseResourceService.associateResourceToCourse({
        courseId,
        lessonId,
        resourceId: resource.id,
        addedBy: 'Enseignant',
        addedAt: new Date().toISOString()
      });

      if (success) {
        const courseResource: CourseResource = {
          id: Date.now().toString(),
          courseId,
          lessonId,
          resourceId: resource.id,
          title: resource.title,
          description: resource.description,
          subject: resource.subject,
          imageUrl: resource.imageUrl,
          fileType: resource.fileType || 'PDF',
          fileSize: resource.fileSize || 0,
          visibility: resource.visibility || 'CLASS',
          addedBy: 'Enseignant',
          addedAt: new Date().toISOString(),
          isActive: true
        };

        onResourceAssociated(courseResource);
        onClose();
      }
    } catch (error) {
      console.error('Erreur lors de l\'association:', error);
    }
  };

  // Créer et associer une nouvelle ressource
  const createAndAssociateResource = async () => {
    if (!uploadTitle || !uploadSubject || !uploadedFile) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsUploading(true);
    try {
      // Créer la nouvelle ressource dans le contexte
      const newResourceData = {
        title: uploadTitle,
        description: uploadDescription,
        subject: uploadSubject,
        imageUrl: uploadedFile.type.startsWith('image/') ? URL.createObjectURL(uploadedFile) : '/placeholder-image.jpg',
        visibility: uploadVisibility,
        fileType: uploadedFile.type.split('/')[1].toUpperCase() as 'PDF' | 'DOCX' | 'PPTX' | 'VIDEO' | 'IMAGE' | 'LINK',
        fileSize: uploadedFile.size,
        author: {
          id: 'user_1',
          name: 'Enseignant',
          role: 'enseignant'
        }
      };

      addResource(newResourceData);

      // Associer la ressource au cours
      const success = await courseResourceService.createAndAssociateResource(
        courseId,
        lessonId || 'general',
        newResourceData
      );

      if (success) {
        const courseResource: CourseResource = {
          id: Date.now().toString(),
          courseId,
          lessonId,
          resourceId: `new-${Date.now()}`,
          title: uploadTitle,
          description: uploadDescription,
          subject: uploadSubject,
          imageUrl: newResourceData.imageUrl,
          fileType: newResourceData.fileType,
          fileSize: newResourceData.fileSize,
          visibility: uploadVisibility,
          addedBy: 'Enseignant',
          addedAt: new Date().toISOString(),
          isActive: true
        };

        onResourceAssociated(courseResource);
        onClose();
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  useEffect(() => {
    if (searchQuery.trim() || selectedSubject) {
      const timeoutId = setTimeout(performSearch, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setFilteredResources([]);
    }
  }, [searchQuery, selectedSubject, performSearch]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Associer une ressource au cours
          </DialogTitle>
        </DialogHeader>

        {/* Onglets */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'search'
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Rechercher une ressource existante
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'upload'
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Créer une nouvelle ressource
          </button>
        </div>

        {activeTab === 'search' ? (
          /* Onglet Recherche */
          <div className="space-y-4">
            {/* Barre de recherche */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher par titre ou description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Toutes les matières</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Résultats de recherche */}
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-500 mt-2">Recherche en cours...</p>
                </div>
              ) : filteredResources.length > 0 ? (
                filteredResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => setSelectedResource(resource)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <img
                          src={resource.imageUrl}
                          alt={resource.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900">{resource.title}</h3>
                            {resource.isPaid && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                <DollarSign className="w-3 h-3" />
                                Payant
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {resource.subject}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${getVisibilityColor(resource.visibility || 'CLASS')}`}>
                              {getVisibilityIcon(resource.visibility || 'CLASS')}
                              {getVisibilityLabel(resource.visibility || 'CLASS')}
                            </span>
                            {resource.fileSize && (
                              <span className="text-xs text-gray-500">
                                {formatFileSize(resource.fileSize)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : searchQuery ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Aucune ressource trouvée</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Tapez votre recherche pour commencer</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Onglet Upload */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Titre de la ressource"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matière *
                </label>
                <select
                  value={uploadSubject}
                  onChange={(e) => setUploadSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une matière</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                placeholder="Description de la ressource..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibilité
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['PRIVATE', 'CLASS', 'SCHOOL'] as const).map((visibility) => (
                  <button
                    key={visibility}
                    onClick={() => setUploadVisibility(visibility)}
                    className={`p-3 rounded-lg border transition flex items-center gap-2 ${
                      uploadVisibility === visibility
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {getVisibilityIcon(visibility)}
                    <span className="text-sm font-medium">{getVisibilityLabel(visibility)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fichier *
              </label>
              {!uploadedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.jpg,.jpeg,.png"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-1">Cliquez pour sélectionner un fichier</p>
                    <p className="text-sm text-gray-500">PDF, DOC, PPT, Images, Vidéos (max 250MB)</p>
                  </label>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-800">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(uploadedFile.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={removeFile}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            Annuler
          </button>
          
          {activeTab === 'search' && selectedResource ? (
            <button
              onClick={() => associateExistingResource(selectedResource)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Associer cette ressource
            </button>
          ) : activeTab === 'upload' ? (
            <button
              onClick={createAndAssociateResource}
              disabled={isUploading || !uploadTitle || !uploadSubject || !uploadedFile}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Création...' : 'Créer et associer'}
            </button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceAssociationModal; 
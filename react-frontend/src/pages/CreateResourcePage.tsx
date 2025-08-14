import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
    Upload, FileText, Lock, Users, Globe,
    ChevronLeft, ChevronRight, Check, AlertCircle
} from "lucide-react";
import { useCreateResource } from "../hooks/useCreateResource";
import { useUpdateResource } from "../hooks/useUpdateResource";
import { useResourceDetail } from "../hooks/useResourceDetail";
import { subjectNameToIdMap, subjectIdToNameMap } from "./RessourcesPage";

// Données des domaines et matières (réutilisées depuis RessourcesPage)
const domainsData: { [key: string]: string[] } = {
  "LANGUES ET COMMUNICATION": ["Anglais", "Français"],
  "SCIENCES HUMAINES": ["Études islamiques", "Géographie", "Histoire", "Lecture arabe", "Qran", "Vivre dans son milieu", "Vivre ensemble", "Wellness"],
  "STEM": ["Mathématiques"],
  "CREATIVITE ARTISTIQUE / SPORTIVE": ["Arts plastiques", "EPS", "Motricité", "Musique", "Théâtre/Drama"],
};

const domainNames = [
  "LANGUES ET COMMUNICATION",
  "SCIENCES HUMAINES", 
  "STEM",
  "CREATIVITE ARTISTIQUE / SPORTIVE",
];

interface ResourceFormData {
    title: string;
    description: string;
    domain: string;
    subject: string;
    competence?: string;
    visibility: 'PRIVATE' | 'CLASS' | 'SCHOOL';
    file?: File;
    coverImage?: string; // URL de l'image de couverture
    coverImageFile?: File; // Fichier uploadé
}

function CreateResourcePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const createResourceMutation = useCreateResource();
    const updateResourceMutation = useUpdateResource();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [creationError, setCreationError] = useState<string | null>(null);

    // États du formulaire
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<ResourceFormData>({
        title: '',
        description: '',
        domain: domainNames[0],
        subject: '',
        competence: '',
        visibility: 'SCHOOL',
    });

    // États pour le drag & drop
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string>('');

    // États pour l'image de couverture
    const [coverImageUrl, setCoverImageUrl] = useState<string>('');
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [coverImageError, setCoverImageError] = useState<string>('');

    // États pour l'édition
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
    const [readOnlyFields, setReadOnlyFields] = useState<string[]>([]);
    
    // Récupération des données pour l'édition
    const resourceIdFromURL = searchParams.get('resourceId');
    const { data: resourceToEdit, isLoading: isLoadingResource } = useResourceDetail(resourceIdFromURL!);

    // Initialisation pour l'édition
    useEffect(() => {
        const editParam = searchParams.get('edit');
        if (editParam === 'true' && resourceIdFromURL) {
                setIsEditMode(true);
            setEditingResourceId(resourceIdFromURL);
        }

        if (isEditMode && resourceToEdit) {
            const subjectName = subjectIdToNameMap[resourceToEdit.subject_id] || '';
            const domainName = Object.keys(domainsData).find(domain => 
                domainsData[domain].includes(subjectName)
            ) || domainNames[0];

                // Pré-remplir les données du formulaire
                setFormData({
                title: resourceToEdit.title || '',
                description: resourceToEdit.description || '',
                domain: domainName,
                subject: subjectName,
                competence: '', // API does not provide this yet
                visibility: resourceToEdit.visibility || 'SCHOOL',
            });

                // Commencer par l'étape 1 pour permettre la navigation
                setCurrentStep(1);
            }
    }, [searchParams, resourceIdFromURL, isEditMode, resourceToEdit]);

    // Validation des étapes (maintenant 3 étapes au lieu de 4)
    const isStep1Valid = uploadedFile !== null || isEditMode;
    const isStep2Valid = formData.title.trim() !== '' && formData.subject !== '';
    const isStep3Valid = true; // Étape de validation
    const canProceed = currentStep === 1 ? isStep1Valid : 
                      currentStep === 2 ? isStep2Valid : 
                      currentStep === 3 ? isStep3Valid : true;

    // Gestion du drag & drop
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        setUploadError('');

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    }, []);

    const handleFileSelect = (file: File) => {
        // Validation du fichier
        const maxSize = 250 * 1024 * 1024; // 250MB
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'image/jpeg',
            'image/png',
            'image/gif',
            'video/mp4',
            'video/avi',
            'video/mov',
            'audio/mpeg',
            'audio/wav',
            'audio/mp3'
        ];

        if (file.size > maxSize) {
            setUploadError('Le fichier est trop volumineux (max 250MB)');
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            setUploadError('Type de fichier non supporté');
            return;
        }

        setUploadedFile(file);
        setUploadError('');
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const removeFile = () => {
        setUploadedFile(null);
        setUploadError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Gestion de l'image de couverture
    const handleCoverImageUrlChange = (url: string) => {
        setCoverImageUrl(url);
        setCoverImageFile(null);
        setCoverImageError('');
    };

    const handleCoverImageFileSelect = (file: File) => {
        // Validation du fichier image
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            setCoverImageError('Type de fichier non supporté. Utilisez JPG, PNG, GIF ou WebP.');
            return;
        }

        if (file.size > maxSize) {
            setCoverImageError('Le fichier est trop volumineux (max 5MB)');
            return;
        }

        setCoverImageFile(file);
        setCoverImageUrl('');
        setCoverImageError('');
    };

    const removeCoverImage = () => {
        setCoverImageFile(null);
        setCoverImageUrl('');
        setCoverImageError('');
    };

    // Navigation entre les étapes
    const nextStep = () => {
        if (canProceed && currentStep < 3) { // Changé de 4 à 3
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Création ou mise à jour de la ressource
    const createResource = async () => {
        if (!uploadedFile && !isEditMode) return;
        setCreationError(null);

        const subjectId = subjectNameToIdMap[formData.subject];
        // For now, let's use a placeholder for competenceId
        const competenceId = 1;

        if (isEditMode && editingResourceId) {
            updateResourceMutation.mutate({
                resourceId: editingResourceId,
                title: formData.title,
                description: formData.description,
                subjectId: subjectId,
                competenceId: competenceId,
                visibility: formData.visibility,
                file: uploadedFile || undefined,
            }, {
                onSuccess: () => {
                    navigate('/ressources');
                },
                onError: (error) => {
                    setCreationError(error.message || "Une erreur inattendue est survenue.");
                }
            });
        } else if (uploadedFile) {
            createResourceMutation.mutate({
                title: formData.title,
                description: formData.description,
                subjectId: subjectId,
                competenceId: competenceId,
                visibility: formData.visibility,
                file: uploadedFile,
            }, {
                onSuccess: () => {
            navigate('/ressources');
                },
                onError: (error) => {
                    setCreationError(error.message || "Une erreur inattendue est survenue.");
                }
            });
        }
    };

    if (isLoadingResource && isEditMode) {
        return <div>Chargement de la ressource pour modification...</div>;
    }

    // Fonction pour mapper les types MIME vers les types de fichiers
    const getFileTypeFromMime = (mimeType: string): 'PDF' | 'DOCX' | 'PPTX' | 'VIDEO' | 'IMAGE' | 'LINK' => {
        switch (mimeType) {
            case 'application/pdf':
                return 'PDF';
            case 'application/msword':
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return 'DOCX';
            case 'application/vnd.ms-powerpoint':
            case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                return 'PPTX';
            case 'application/vnd.ms-excel':
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                return 'DOCX'; // On utilise DOCX pour les fichiers Excel pour l'instant
            case 'image/jpeg':
            case 'image/png':
            case 'image/gif':
            case 'image/webp':
                return 'IMAGE';
            case 'video/mp4':
            case 'video/avi':
            case 'video/mov':
            case 'video/webm':
                return 'VIDEO';
            case 'audio/mpeg':
            case 'audio/wav':
            case 'audio/mp3':
            case 'audio/ogg':
                return 'LINK'; // On utilise LINK pour l'audio pour l'instant
            default:
                return 'PDF'; // Par défaut
        }
    };

    // Formatage de la taille de fichier
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Rendu des étapes
    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {isEditMode ? 'Modifier le fichier' : 'Déposez vos fichiers'}
                </h2>
                <p className="text-gray-600">
                    {isEditMode 
                        ? 'Remplacez le fichier existant ou gardez le fichier actuel'
                        : 'Sélectionnez ou glissez-déposez vos ressources éducatives'
                    }
                </p>
            </div>

            <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    isDragOver 
                        ? 'border-orange-400 bg-orange-50' 
                        : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {!uploadedFile ? (
                    <div className="space-y-4">
                        <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                        <div>
                            <p className="text-lg font-medium text-gray-900 mb-2">
                                {isEditMode ? 'Remplacez le fichier' : 'Glissez-déposez vos fichiers ici'}
                            </p>
                            <p className="text-gray-500 mb-4">
                                {isEditMode 
                                    ? 'ou cliquez pour sélectionner un nouveau fichier'
                                    : 'ou cliquez pour sélectionner vos fichiers'
                                }
                            </p>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                {isEditMode ? 'Sélectionner un nouveau fichier' : 'Sélectionner un fichier'}
                            </button>
                            {isEditMode && (
                                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800 font-medium mb-2">
                                        📁 Fichier actuel conservé
                                    </p>
                                    <p className="text-xs text-blue-600">
                                        Le fichier existant sera conservé. Vous pouvez le remplacer en sélectionnant un nouveau fichier ci-dessus.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-center">
                            <FileText className="w-12 h-12 text-green-500" />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-gray-900">{uploadedFile.name}</p>
                            <p className="text-sm text-gray-500">{formatFileSize(uploadedFile.size)}</p>
                        </div>
                        <button
                            onClick={removeFile}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                            Supprimer le fichier
                        </button>
                    </div>
                )}
            </div>

            {uploadError && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700">{uploadError}</span>
                </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Formats supportés :</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="font-medium text-gray-700">Documents</p>
                        <p className="text-gray-600">PDF, DOC, DOCX</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-700">Présentations</p>
                        <p className="text-gray-600">PPT, PPTX, XLS, XLSX</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-700">Médias</p>
                        <p className="text-gray-600">Images, Vidéos, Audio</p>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">Maximum 250MB par fichier</p>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInput}
                className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav"
            />
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {isEditMode ? 'Modifier les informations' : 'Informations de la ressource'}
                </h2>
                <p className="text-gray-600">
                    {isEditMode 
                        ? 'Modifiez les informations de votre ressource'
                        : 'Décrivez votre ressource pour faciliter sa découverte'
                    }
                </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Formulaire principal */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Titre de la ressource *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="Entrez le titre de votre ressource"
                            readOnly={readOnlyFields.includes('title')}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Domaine de compétence *
                        </label>
                        <select
                            value={formData.domain}
                            onChange={(e) => {
                                setFormData({
                                    ...formData, 
                                    domain: e.target.value,
                                    subject: '' // Reset subject when domain changes
                                });
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            disabled={readOnlyFields.includes('domain')}
                        >
                            {domainNames.map(domain => (
                                <option key={domain} value={domain}>{domain}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Matière *
                        </label>
                        <select
                            value={formData.subject}
                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            disabled={readOnlyFields.includes('subject')}
                        >
                            <option value="">Sélectionnez une matière</option>
                            {domainsData[formData.domain]?.map(subject => (
                                <option key={subject} value={subject}>{subject}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Compétence (facultatif)
                        </label>
                        <input
                            type="text"
                            value={formData.competence}
                            onChange={(e) => setFormData({...formData, competence: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="Ex: Comprendre les fractions"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Décrivez le contenu de votre ressource..."
                    />
                </div>

                {/* Image de couverture */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image de couverture (facultatif)
                    </label>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* URL de l'image */}
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">
                                Ou entrez une URL d'image
                            </label>
                            <input
                                type="url"
                                value={coverImageUrl}
                                onChange={(e) => handleCoverImageUrlChange(e.target.value)}
                                placeholder="https://exemple.com/image.jpg"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                            />
                        </div>

                        {/* Upload d'image */}
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">
                                Ou uploadez une image depuis votre appareil
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleCoverImageFileSelect(file);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                            />
                        </div>
                    </div>

                    {/* Aperçu de l'image sélectionnée */}
                    {(coverImageUrl || coverImageFile) && (
                        <div className="mt-4 relative inline-block">
                            <div className="w-32 h-20 bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    src={coverImageFile ? URL.createObjectURL(coverImageFile) : coverImageUrl}
                                    alt="Aperçu de l'image de couverture"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={removeCoverImage}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {coverImageError && (
                        <p className="text-red-600 text-sm mt-2">{coverImageError}</p>
                    )}

                    <p className="text-xs text-gray-500 mt-2">
                        Formats supportés : JPG, PNG, GIF, WebP. Taille max : 5MB.
                    </p>
                </div>

                {/* Visibilité */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Visibilité
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                            { value: 'PRIVATE', icon: Lock, label: 'Privé', description: 'Visible uniquement par vous' },
                            { value: 'CLASS', icon: Users, label: 'Classe', description: 'Visible par votre classe' },
                            { value: 'SCHOOL', icon: Globe, label: 'École', description: 'Visible par toute l\'école' }
                        ].map(option => (
                            <label key={option.value} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="visibility"
                                    value={option.value}
                                    checked={formData.visibility === option.value}
                                    onChange={(e) => setFormData({...formData, visibility: e.target.value as "PRIVATE" | "CLASS" | "SCHOOL"})}
                                    className="mr-3"
                                />
                                <div className="flex items-center">
                                    <option.icon className="w-5 h-5 text-gray-500 mr-3" />
                                    <div>
                                        <p className="font-medium text-gray-900">{option.label}</p>
                                        <p className="text-sm text-gray-500">{option.description}</p>
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // L'étape 3 fusionnée : Aperçu et validation
    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {isEditMode ? 'Aperçu des modifications' : 'Aperçu et validation'}
                </h2>
                <p className="text-gray-600">
                    {isEditMode 
                        ? 'Vérifiez les modifications avant de mettre à jour votre ressource'
                        : 'Vérifiez les informations avant de créer votre ressource'
                    }
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Aperçu visuel de la ressource */}
                <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        {(uploadedFile || isEditMode) && (
                            <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                {(coverImageUrl || coverImageFile) ? (
                                    <img 
                                        src={coverImageFile ? URL.createObjectURL(coverImageFile) : coverImageUrl} 
                                        alt="Image de couverture" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : uploadedFile?.type.startsWith('image/') ? (
                                    <img 
                                        src={URL.createObjectURL(uploadedFile)} 
                                        alt="Aperçu" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FileText className="w-16 h-16 text-gray-400" />
                                )}
                            </div>
                        )}
                        <div className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">{formData.title}</h4>
                            <p className="text-sm text-gray-600 mb-3">{formData.subject}</p>
                            {formData.description && (
                                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{formData.description}</p>
                            )}
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>Par Enseignant</span>
                                <span>{new Date().toLocaleDateString('fr-FR')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Résumé et validation */}
                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {isEditMode ? 'Résumé des modifications' : 'Résumé des informations'}
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <span className="text-sm font-medium text-gray-600">Titre</span>
                                <p className="text-gray-900">{formData.title}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">Domaine</span>
                                <p className="text-gray-900">{formData.domain}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">Matière</span>
                                <p className="text-gray-900">{formData.subject}</p>
                            </div>
                            {formData.competence && (
                                <div>
                                    <span className="text-sm font-medium text-gray-600">Compétence</span>
                                    <p className="text-gray-900">{formData.competence}</p>
                                </div>
                            )}
                            <div>
                                <span className="text-sm font-medium text-gray-600">Visibilité</span>
                                <p className="text-gray-900">
                                    {formData.visibility === 'PRIVATE' ? 'Privé' :
                                     formData.visibility === 'CLASS' ? 'Classe' : 'École'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Informations techniques */}
                    {uploadedFile && (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Informations techniques</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Type de fichier</span>
                                    <span className="font-medium text-gray-900">
                                        {getFileTypeFromMime(uploadedFile.type)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Taille totale</span>
                                    <span className="font-medium text-gray-900">
                                        {formatFileSize(uploadedFile.size)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Version</span>
                                    <span className="font-medium text-gray-900">v1</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bouton de création/modification */}
                    {creationError && (
                        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <span className="text-red-700">{creationError}</span>
                        </div>
                    )}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <Check className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="font-medium text-green-900">
                                    {isEditMode ? 'Prêt à modifier' : 'Prêt à créer'}
                                </p>
                                <p className="text-sm text-green-700">
                                    {isEditMode 
                                        ? 'Toutes les modifications sont prêtes'
                                        : 'Toutes les informations sont complètes'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep = () => {
        switch (currentStep) {
            case 1: return renderStep1();
            case 2: return renderStep2();
            case 3: return renderStep3();
            default: return renderStep1();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate('/ressources')}
                                className="flex items-center text-gray-600 hover:text-gray-900"
                            >
                                <ChevronLeft className="w-5 h-5 mr-2" />
                                Retour aux ressources
                            </button>
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            {isEditMode ? 'Modifier la ressource' : 'Créer une nouvelle ressource'}
                        </h1>
                        <div className="w-32"></div> {/* Spacer pour centrer le titre */}
                    </div>
                </div>
            </div>

            {/* Barre de progression sticky */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                Étape {currentStep} sur 3
                            </span>
                            <span className="text-sm text-gray-500">
                                {Math.round((currentStep / 3) * 100)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(currentStep / 3) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    {renderStep()}

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className="flex items-center px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 mr-2" />
                            Précédent
                        </button>

                        <div className="flex items-center gap-3">
                            {currentStep < 3 ? (
                                <button
                                    onClick={nextStep}
                                    disabled={!canProceed}
                                    className="flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Suivant
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </button>
                            ) : (
                                <button
                                    onClick={createResource}
                                    className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    <Check className="w-5 h-5 mr-2" />
                                    {isEditMode ? 'Modifier la ressource' : 'Créer la ressource'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateResourcePage; 
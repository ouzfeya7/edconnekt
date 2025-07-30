import React, { createContext, useContext, useState, ReactNode } from 'react';
// import { useTranslation } from 'react-i18next';
import { useAuth } from '../pages/authentification/useAuth';

// Fonction pour détecter le type de fichier basé sur le contenu
const detectFileType = (file: File): 'PDF' | 'DOCX' | 'PPTX' | 'VIDEO' | 'IMAGE' | 'LINK' | 'AUDIO' | 'DOC' | 'PPT' | 'XLS' | 'XLSX' | 'TXT' | 'HTML' | 'JSON' | 'ZIP' | 'FILE' => {
  const mimeType = file.type;
  
  // Détection basée sur le MIME type
  if (mimeType.startsWith('image/')) {
    return 'IMAGE';
  } else if (mimeType.startsWith('video/')) {
    return 'VIDEO';
  } else if (mimeType.startsWith('audio/')) {
    return 'AUDIO';
  } else if (mimeType === 'application/pdf') {
    return 'PDF';
  } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return 'DOCX';
  } else if (mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
    return 'PPTX';
  } else if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    return 'XLSX';
  } else if (mimeType === 'application/msword') {
    return 'DOC';
  } else if (mimeType === 'application/vnd.ms-powerpoint') {
    return 'PPT';
  } else if (mimeType === 'application/vnd.ms-excel') {
    return 'XLS';
  } else if (mimeType === 'text/plain') {
    return 'TXT';
  } else if (mimeType === 'text/html') {
    return 'HTML';
  } else if (mimeType === 'application/json') {
    return 'JSON';
  } else if (mimeType === 'application/zip' || mimeType === 'application/x-zip-compressed') {
    return 'ZIP';
  }
  
  // Fallback basé sur l'extension si le MIME type n'est pas reconnu
  const extension = file.name.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'PDF';
    case 'doc':
    case 'docx':
      return 'DOCX';
    case 'ppt':
    case 'pptx':
      return 'PPTX';
    case 'xls':
    case 'xlsx':
      return 'XLSX';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'webp':
      return 'IMAGE';
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'flv':
    case 'webm':
      return 'VIDEO';
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'aac':
      return 'AUDIO';
    case 'txt':
      return 'TXT';
    case 'html':
    case 'htm':
      return 'HTML';
    case 'json':
      return 'JSON';
    case 'zip':
    case 'rar':
    case '7z':
      return 'ZIP';
    default:
      return 'FILE';
  }
};



// --- Définition des types enrichis ---
interface Resource {
  id: number;
  title: string;
  subject: string;
  description: string;
  imageUrl: string;
  isArchived: boolean;
  isPaid?: boolean;
  paymentUrl?: string;
  //  Nouveaux champs optionnels pour ne pas casser l'existant
  competence?: string;
  visibility?: 'PRIVATE' | 'CLASS' | 'SCHOOL';
  fileType?: 'PDF' | 'DOCX' | 'PPTX' | 'VIDEO' | 'IMAGE' | 'LINK' | 'AUDIO' | 'DOC' | 'PPT' | 'XLS' | 'XLSX' | 'TXT' | 'HTML' | 'JSON' | 'ZIP' | 'FILE';
  fileUrl?: string;
  fileSize?: number;
  uploadedFile?: File; // stockage du fichier uploadé
  author?: {
    id: string;
    name: string;
    role: string;
  };
  createdAt?: string;
  updatedAt?: string;
  version?: number;
  classId?: string;
}

//  Nouveaux types pour les versions et l'audit
interface ResourceVersion {
  id: number;
  resourceId: number;
  versionNumber: number;
  fileUrl: string;
  fileSize: number;
  fileType?: string;
  uploadedBy: string;
  uploadedAt: string;
  changeDescription: string;
}

interface AuditLog {
  id: number;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'ARCHIVE' | 'RESTORE';
  resourceId: number;
  userId: string;
  userRole: string;
  timestamp: string;
  details: string;
  changes?: object;
}

interface ResourceFile {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  url: string;
}

// Type pour la structure des fichiers : un objet où la clé est l'ID de la ressource
type FilesByResource = Record<number, ResourceFile[]>;

interface ResourceContextType {
  resources: Resource[];
  files: FilesByResource;
  versions: ResourceVersion[]; // Nouveau
  auditLogs: AuditLog[]; // Nouveau
  addResource: (resource: Omit<Resource, 'id' | 'isArchived'>) => void;
  deleteResource: (resourceId: number) => void;
  archiveResource: (resourceId: number) => void;
  unarchiveResource: (resourceId: number) => void;
  updateResource: (resourceId: number, updates: Partial<Resource>) => void; // Nouveau
  addFile: (resourceId: number, file: Omit<ResourceFile, 'id' | 'uploadDate'>) => void;
  deleteFile: (resourceId: number, fileId: number) => void;
  getFilesByResourceId: (resourceId: number) => ResourceFile[];
  addVersion: (resourceId: number, version: Omit<ResourceVersion, 'id'>) => void; // Nouveau
  getVersionsByResourceId: (resourceId: number) => ResourceVersion[]; // Nouveau
  restoreVersion: (resourceId: number, versionNumber: number) => void; // Nouveau
  addAuditLog: (log: Omit<AuditLog, 'id'>) => void; // Nouveau
  getAuditLogs: () => AuditLog[]; // Nouveau
}

// --- Données Mock Initiales ---
const getInitialResources = (): Resource[] => [
    {
        id: 1,
        title: "Cahier d’activités EDD CP",
        subject: "Vivre dans son milieu",
        description: "Cahier d'activités pour l'éducation au développement durable, niveau CP. Disponible chez les éditions Didactikos.",
        imageUrl: "https://editionsdidactikos.sn/wp-content/uploads/2025/06/Capture-decran-2025-06-23-a-16.24.24.png",
        isArchived: false,
        isPaid: false
    },
    {
        id: 2,
        title: "Cahier d’activités EDD CP (nouvelle édition)",
        subject: "Vivre dans son milieu",
        description: "Nouvelle édition du cahier d'activités pour l'éducation au développement durable, CP.",
        imageUrl: "https://editionsdidactikos.sn/wp-content/uploads/2024/11/Capture-decran-2024-11-02-a-10.17.45.png",
        isArchived: false,
        isPaid: true,
        paymentUrl: "/paiement/2"
    },
    {
        id: 3,
        title: "Découverte du monde CP",
        subject: "Histoire",
        description: "Livre de découverte du monde pour le CP, éditions Didactikos.",
        imageUrl: "https://editionsdidactikos.sn/wp-content/uploads/2022/09/livre-de-decouverte-du-monde-cp.png",
        isArchived: false,
        isPaid: false
    },
    {
        id: 4,
        title: "Mathématiques CP",
        subject: "Mathématiques",
        description: "Livre de mathématiques pour le CP, éditions Didactikos.",
        imageUrl: "https://editionsdidactikos.sn/wp-content/uploads/2022/05/livre-de-mathematique-cp.png",
        isArchived: false,
        isPaid: true,
        paymentUrl: "/paiement/4"
    },
    {
        id: 5,
        title: "Langue et communication CP",
        subject: "Français",
        description: "Livre de langue et communication pour le CP, éditions Didactikos.",
        imageUrl: "https://editionsdidactikos.sn/wp-content/uploads/2022/04/livre-de-langue-et-communication-cp.png",
        isArchived: false,
        isPaid: false
    },
    {
        id: 6,
        title: "Découverte du monde CP",
        subject: "Géographie",
        description: "Livre de découverte du monde pour le CP, éditions Didactikos.",
        imageUrl: "https://editionsdidactikos.sn/wp-content/uploads/2022/09/livre-de-decouverte-du-monde-cp.png",
        isArchived: false,
        isPaid: false
    },
    {
        id: 7,
        title: "Lecture CP",
        subject: "Français",
        description: "Français Sénégal CP langue et communication",
        imageUrl: "https://m.media-amazon.com/images/I/41pleKyHSvL._SY445_SX342_.jpg",
        isArchived: false,
        isPaid: true,
        paymentUrl: "/paiement/7"
    }
];

const initialFiles: FilesByResource = {
    1: [ // Fichiers pour Histoire (ID 1)
        { id: 101, name: "Chapitre 1 - La Révolution Française.pdf", type: 'PDF', size: '2.5 MB', uploadDate: '12 Sept. 2023', url: '#' },
        { id: 102, name: "Vidéo : La prise de la Bastille", type: 'Vidéo', size: 'N/A', uploadDate: '18 Sept. 2023', url: 'https://youtube.com' },
    ],
    2: [ // Fichiers pour Géographie (ID 2)
        { id: 201, name: "Les capitales du monde.docx", type: 'Word', size: '0.8 MB', uploadDate: '14 Sept. 2023', url: '#' },
    ],
    3: [], // Anglais (ID 3) n'a pas encore de fichier
    4: [ // Fichiers pour Mathématique (ID 4)
        { id: 401, name: "Formules de trigonométrie.pdf", type: 'PDF', size: '0.5 MB', uploadDate: '20 Sept. 2023', url: '#' },
        { id: 402, name: "Exercices sur les intégrales.pdf", type: 'PDF', size: '1.2 MB', uploadDate: '22 Sept. 2023', url: '#' },
        { id: 403, name: "Lien vers Khan Academy", type: 'Lien', size: 'N/A', uploadDate: '25 Sept. 2023', url: '#' },
    ],
};

// Nouvelles données mock pour les versions
const getInitialVersions = (): ResourceVersion[] => [
    {
        id: 1,
        resourceId: 1,
        versionNumber: 1,
        fileUrl: "https://example.com/edd-cp-v1.pdf",
        fileSize: 1800000,
        fileType: "PDF",
        uploadedBy: "Ibrahima Diouf",
        uploadedAt: "2024-01-10T09:00:00Z",
        changeDescription: "Version initiale"
    },
    {
        id: 2,
        resourceId: 1,
        versionNumber: 2,
        fileUrl: "https://example.com/edd-cp-v2.pdf",
        fileSize: 2048576,
        fileType: "PDF",
        uploadedBy: "Ibrahima Diouf",
        uploadedAt: "2024-01-15T10:30:00Z",
        changeDescription: "Correction des exercices page 15"
    }
];

// Nouvelles données mock pour l'audit
const getInitialAuditLogs = (): AuditLog[] => [
    {
        id: 1,
        action: "CREATE",
        resourceId: 1,
        userId: "user_1",
        userRole: "enseignant",
        timestamp: "2024-01-15T10:30:00Z",
        details: "Création de la ressource 'Cahier d'activités EDD CP'",
        changes: {
            title: "Cahier d'activités EDD CP",
            subject: "Vivre dans son milieu"
        }
    },
    {
        id: 2,
        action: "UPDATE",
        resourceId: 1,
        userId: "user_1",
        userRole: "enseignant",
        timestamp: "2024-01-15T10:30:00Z",
        details: "Mise à jour vers la version 2",
        changes: {
            version: "1 → 2",
            fileSize: "1.8MB → 2MB"
        }
    }
];

// --- Création du Contexte ---
const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

// --- Fournisseur du Contexte (Provider) ---
export const ResourceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // const { t } = useTranslation();
    const { user, roles } = useAuth();
    const [resources, setResources] = useState<Resource[]>(() => getInitialResources());
    const [files, setFiles] = useState<FilesByResource>(initialFiles);
    const [versions, setVersions] = useState<ResourceVersion[]>(() => getInitialVersions());
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getInitialAuditLogs());

    // Fonction pour obtenir les informations de l'utilisateur connecté
    const getCurrentUserInfo = () => {
        if (!user) {
            return {
                id: 'unknown',
                name: 'Utilisateur inconnu',
                role: roles.length > 0 ? roles[0] : 'unknown'
            };
        }
        
        return {
            id: user.username || user.id || 'unknown',
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Utilisateur',
            role: roles.length > 0 ? roles[0] : 'unknown'
        };
    };

    // Nouvelle fonction pour ajouter un log d'audit
    const addAuditLog = (log: Omit<AuditLog, 'id'>) => {
        const newLog: AuditLog = {
            id: Date.now(),
            ...log,
        };
        setAuditLogs(prev => [newLog, ...prev]);
    };

    const addResource = (newResourceData: Omit<Resource, 'id' | 'isArchived'>) => {
        const now = new Date().toISOString();
        const currentUser = getCurrentUserInfo();
        
        // Détecter automatiquement le type de fichier si un fichier est uploadé
        let detectedFileType = newResourceData.fileType;
        if (newResourceData.uploadedFile) {
            detectedFileType = detectFileType(newResourceData.uploadedFile);
        }
        
        const newResource: Resource = {
            id: Date.now(), // Génère un ID unique simple
            ...newResourceData,
            fileType: detectedFileType,
            isArchived: false,
            createdAt: now,
            updatedAt: now,
            version: 1,
            author: {
                id: currentUser.id,
                name: currentUser.name,
                role: currentUser.role
            }
        };
        
        setResources(prev => {
            // Initialiser le tableau de fichiers pour la nouvelle ressource
            setFiles(prevFiles => ({
                ...prevFiles,
                [newResource.id]: []
            }));
            return [newResource, ...prev];
        });

        // Ajouter un log d'audit avec les informations de l'utilisateur connecté
        addAuditLog({
            action: 'CREATE',
            resourceId: newResource.id,
            userId: currentUser.id,
            userRole: currentUser.role,
            timestamp: now,
            details: `Création de la ressource "${newResource.title}"`,
            changes: {
                title: newResource.title,
                subject: newResource.subject,
                visibility: newResource.visibility
            }
        });
    };

    const deleteResource = (resourceId: number) => {
        // Supprimer la ressource
        setResources(prev => prev.filter(r => r.id !== resourceId));
        // Supprimer les fichiers associés
        setFiles(prev => {
            const newFiles = { ...prev };
            delete newFiles[resourceId];
            return newFiles;
        });
    };

    // Nouvelle fonction de mise à jour
    const updateResource = (resourceId: number, updates: Partial<Resource>) => {
        const currentUser = getCurrentUserInfo();
        
        setResources(prev => prev.map(r => {
            if (r.id === resourceId) {
                const currentVersion = r.version || 1;
                const newVersion = currentVersion + 1;

                // Archiver l'ancienne version avant la mise à jour
                addVersion(resourceId, {
                    resourceId,
                    versionNumber: currentVersion,
                    fileUrl: r.fileUrl || '#',
                    fileSize: r.fileSize || 0,
                    fileType: r.fileType,
                    uploadedBy: currentUser.name,
                    uploadedAt: r.updatedAt || new Date().toISOString(),
                    changeDescription: `Version ${currentVersion} archivée lors de la mise à jour`
                });

                const updatedResource = {
                    ...r,
                    ...updates,
                    updatedAt: new Date().toISOString(),
                    version: newVersion,
                    author: {
                        id: currentUser.id,
                        name: currentUser.name,
                        role: currentUser.role
                    }
                };
                
                // Ajouter un log d'audit détaillé avec l'utilisateur connecté
                addAuditLog({
                    action: 'UPDATE',
                    resourceId,
                    userId: currentUser.id,
                    userRole: currentUser.role,
                    timestamp: new Date().toISOString(),
                    details: `Mise à jour de la ressource "${r.title}" vers la version ${newVersion}`,
                    changes: updates
                });
                
                return updatedResource;
            }
            return r;
        }));
    };

    const archiveResource = (resourceId: number) => {
        const currentUser = getCurrentUserInfo();
        
        setResources(prev =>
            prev.map(r => {
                if (r.id === resourceId) {
                    // Ajouter un log d'audit avec l'utilisateur connecté
                    addAuditLog({
                        action: 'ARCHIVE',
                        resourceId,
                        userId: currentUser.id,
                        userRole: currentUser.role,
                        timestamp: new Date().toISOString(),
                        details: `Archivage de la ressource "${r.title}"`
                    });
                    
                    return { ...r, isArchived: true };
                }
                return r;
            })
        );
    };

    const unarchiveResource = (resourceId: number) => {
        const currentUser = getCurrentUserInfo();
        
        setResources(prev =>
            prev.map(r => {
                if (r.id === resourceId) {
                    // Ajouter un log d'audit avec l'utilisateur connecté
                    addAuditLog({
                        action: 'RESTORE',
                        resourceId,
                        userId: currentUser.id,
                        userRole: currentUser.role,
                        timestamp: new Date().toISOString(),
                        details: `Restauration de la ressource "${r.title}"`
                    });
                    
                    return { ...r, isArchived: false };
                }
                return r;
            })
        );
    };

    const addFile = (resourceId: number, newFileData: Omit<ResourceFile, 'id' | 'uploadDate'>) => {
        const newFile: ResourceFile = {
            id: Date.now(),
            ...newFileData,
            uploadDate: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
        };

        setFiles(prev => ({
            ...prev,
            [resourceId]: [...(prev[resourceId] || []), newFile],
        }));
    };

    const deleteFile = (resourceId: number, fileId: number) => {
        setFiles(prev => {
            const newFilesForResource = (prev[resourceId] || []).filter(file => file.id !== fileId);
            return {
                ...prev,
                [resourceId]: newFilesForResource,
            };
        });
    };
    
    const getFilesByResourceId = (resourceId: number) => {
        return files[resourceId] || [];
    };

    // Nouvelles fonctions pour les versions
    const addVersion = (resourceId: number, version: Omit<ResourceVersion, 'id'>) => {
        const newVersion: ResourceVersion = {
            id: Date.now(),
            ...version,
        };
        setVersions(prev => [newVersion, ...prev]);
    };

    const getVersionsByResourceId = (resourceId: number) => {
        return versions.filter(v => v.resourceId === resourceId);
    };

    // Nouvelle fonction pour restaurer une version
    const restoreVersion = (resourceId: number, versionNumber: number) => {
        const resource = resources.find(r => r.id === resourceId);
        if (!resource) return;

        const currentVersion = resource.version || 1;
        if (versionNumber >= currentVersion) {
            console.warn(`Version ${versionNumber} is not a previous version of resource ${resourceId}. Current version is ${currentVersion}.`);
            return;
        }

        // Trouver la version à restaurer
        const versionToRestore = versions.find(v => v.resourceId === resourceId && v.versionNumber === versionNumber);
        if (!versionToRestore) {
            console.warn(`Version ${versionNumber} not found for resource ${resourceId}.`);
            return;
        }

        // Mettre à jour la ressource avec les données de la version restaurée
        setResources(prev => prev.map(r => {
            if (r.id === resourceId) {
                const updatedResource = {
                    ...r,
                    fileUrl: versionToRestore.fileUrl,
                    fileSize: versionToRestore.fileSize,
                    updatedAt: new Date().toISOString(),
                    version: versionNumber // Restaurer la version
                };

                // Ajouter un log d'audit pour la restauration
                addAuditLog({
                    action: 'RESTORE',
                    resourceId: resourceId,
                    userId: r.author?.id || 'unknown',
                    userRole: r.author?.role || 'unknown',
                    timestamp: new Date().toISOString(),
                    details: `Restauration de la ressource "${r.title}" vers la version ${versionNumber}`,
                    changes: {
                        version: `${versionNumber} → ${currentVersion}`
                    }
                });

                return updatedResource;
            }
            return r;
        }));
    };

    // Fonction pour récupérer les logs d'audit
    const getAuditLogs = () => {
        return auditLogs;
    };

    return (
        <ResourceContext.Provider value={{ 
            resources, 
            files, 
            versions,
            auditLogs,
            addResource, 
            deleteResource, 
            archiveResource, 
            unarchiveResource,
            updateResource, // Nouveau
            addFile, 
            deleteFile, 
            getFilesByResourceId,
            addVersion, // Nouveau
            getVersionsByResourceId, // Nouveau
            restoreVersion, // Nouveau
            addAuditLog, // Nouveau
            getAuditLogs, // Nouveau
        }}>
            {children}
        </ResourceContext.Provider>
    );
};

// --- Hook personnalisé pour utiliser le contexte ---
export const useResources = (): ResourceContextType => {
    const context = useContext(ResourceContext);
    if (context === undefined) {
        throw new Error('useResources must be used within a ResourceProvider');
    }
    return context;
}; 
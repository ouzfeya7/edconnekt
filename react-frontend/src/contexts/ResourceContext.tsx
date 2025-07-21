import React, { createContext, useContext, useState, ReactNode } from 'react';
// import { useTranslation } from 'react-i18next';

// --- Définition des types ---
interface Resource {
  id: number;
  title: string;
  subject: string;
  description: string;
  imageUrl: string;
  isArchived: boolean;
  isPaid?: boolean;
  paymentUrl?: string;
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
  addResource: (resource: Omit<Resource, 'id' | 'isArchived'>) => void;
  deleteResource: (resourceId: number) => void;
  archiveResource: (resourceId: number) => void;
  unarchiveResource: (resourceId: number) => void;
  addFile: (resourceId: number, file: Omit<ResourceFile, 'id' | 'uploadDate'>) => void;
  deleteFile: (resourceId: number, fileId: number) => void;
  getFilesByResourceId: (resourceId: number) => ResourceFile[];
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

// --- Création du Contexte ---
const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

// --- Fournisseur du Contexte (Provider) ---
export const ResourceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // const { t } = useTranslation();
    const [resources, setResources] = useState<Resource[]>(() => getInitialResources());
    const [files, setFiles] = useState<FilesByResource>(initialFiles);
    
    // Plus besoin de useEffect pour t

    const addResource = (newResourceData: Omit<Resource, 'id' | 'isArchived'>) => {
        setResources(prev => {
            const newResource = {
                id: Date.now(), // Génère un ID unique simple
                ...newResourceData,
                isArchived: false,
            };
            // Initialiser le tableau de fichiers pour la nouvelle ressource
            setFiles(prevFiles => ({
                ...prevFiles,
                [newResource.id]: []
            }));
            return [...prev, newResource];
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

    const archiveResource = (resourceId: number) => {
        setResources(prev =>
            prev.map(r => (r.id === resourceId ? { ...r, isArchived: true } : r))
        );
    };

    const unarchiveResource = (resourceId: number) => {
        setResources(prev =>
            prev.map(r => (r.id === resourceId ? { ...r, isArchived: false } : r))
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

    return (
        <ResourceContext.Provider value={{ resources, files, addResource, deleteResource, archiveResource, unarchiveResource, addFile, deleteFile, getFilesByResourceId }}>
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
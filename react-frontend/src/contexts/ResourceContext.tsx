import React, { createContext, useContext, useState, ReactNode } from 'react';

// --- Définition des types ---
interface Resource {
  id: number;
  title: string;
  subject: string;
  description: string;
  imageUrl: string;
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
  addResource: (resource: Omit<Resource, 'id'>) => void;
  deleteResource: (resourceId: number) => void;
  addFile: (resourceId: number, file: Omit<ResourceFile, 'id' | 'uploadDate'>) => void;
  deleteFile: (resourceId: number, fileId: number) => void;
  getFilesByResourceId: (resourceId: number) => ResourceFile[];
}

// --- Données Mock Initiales ---
const initialResources: Resource[] = [
    { id: 1, title: "Histoire", subject: "Histoire", description: "Cours sur l'histoire du monde.", imageUrl: "https://picsum.photos/seed/history/400/300" },
    { id: 2, title: "Géographie", subject: "Géographie", description: "Étude des cartes et des paysages.", imageUrl: "https://picsum.photos/seed/geography/400/300" },
    { id: 3, title: "Anglais", subject: "Anglais", description: "Apprentissage de la langue anglaise.", imageUrl: "https://picsum.photos/seed/english/400/300" },
    { id: 4, title: "Mathématique", subject: "Mathématique", description: "Algèbre, géométrie et analyse.", imageUrl: "https://picsum.photos/seed/math/400/300" },
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
    const [resources, setResources] = useState<Resource[]>(initialResources);
    const [files, setFiles] = useState<FilesByResource>(initialFiles);

    const addResource = (newResourceData: Omit<Resource, 'id'>) => {
        setResources(prev => {
            const newResource = {
                id: Date.now(), // Génère un ID unique simple
                ...newResourceData
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
        <ResourceContext.Provider value={{ resources, files, addResource, deleteResource, addFile, deleteFile, getFilesByResourceId }}>
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
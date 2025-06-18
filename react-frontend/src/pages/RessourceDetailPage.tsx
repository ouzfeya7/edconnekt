import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Dialog, 
    DialogContent, 
    DialogTrigger,
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter,
    DialogClose
} from '../components/ui/dialog';
import { 
    ArrowLeft, 
    FileText, 
    Download, 
    Plus, 
    Link as LinkIcon, 
    Film, 
    FileType, 
    ExternalLink, 
    Trash2,
    UploadCloud
} from 'lucide-react';
import { useResources } from '../contexts/ResourceContext';

// L'interface ResourceFile est déjà dans le contexte, mais on la redéfinit pour le formulaire
interface FileFormData {
  name: string;
  type: string; // Simplifié en string, sera déduit
  size: string;
  url:string
}

const fileIcons: Record<string, React.ReactNode> = {
  PDF: <FileText className="h-5 w-5 text-red-500" />,
  Word: <FileType className="h-5 w-5 text-blue-500" />,
  Vidéo: <Film className="h-5 w-5 text-purple-500" />,
  Lien: <LinkIcon className="h-5 w-5 text-green-500" />,
  Autre: <FileText className="h-5 w-5 text-gray-500" />, // Ajout d'une icône par défaut
};

const RessourceDetailPage: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const navigate = useNavigate();
  const { resources, getFilesByResourceId, addFile, deleteFile } = useResources();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const id = parseInt(resourceId || '');
  const resource = resources.find(r => r.id === id);
  const files = getFilesByResourceId(id);

  const handleAddFile = (newFileData: Omit<FileFormData, 'size'> & { file?: File }) => {
    if (!resource) return;

    let size = "N/A";
    let url = newFileData.url;

    if (newFileData.file) {
      size = `${(newFileData.file.size / 1024 / 1024).toFixed(2)} MB`;
      url = URL.createObjectURL(newFileData.file);
    }

    addFile(resource.id, { ...newFileData, size, url });
    setIsModalOpen(false);
  };

  if (!resource) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Ressource non trouvée
        </h1>
        <button
          onClick={() => navigate("/ressources")}
          className="mt-4 px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
        >
          Retour aux ressources
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Retour"
        >
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800 ml-4">
          {resource.title}
        </h1>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-sm mb-8">
            <Plus size={20} className="text-orange-500" />
            Ajouter un fichier
          </button>
        </DialogTrigger>
        <DialogContent>
          <AddFileForm onAddFile={handleAddFile} />
        </DialogContent>
      </Dialog>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">
                Nom du fichier
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">
                Taille
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">
                Date d'ajout
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {files.map((file) => (
              <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    {fileIcons[file.type]}
                    {file.type === 'Lien' ? (
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {file.name}
                      </a>
                    ) : (
                      <span className="font-medium text-gray-800">
                        {file.name}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {file.size}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {file.uploadDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    {file.type === 'Lien' ? (
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Ouvrir le lien"
                        className="text-gray-500 hover:text-orange-500 transition-colors"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    ) : (
                      <a
                        href={file.url}
                        download={file.name}
                        title="Télécharger"
                        className="text-gray-500 hover:text-orange-500 transition-colors"
                      >
                        <Download className="h-5 w-5" />
                      </a>
                    )}
                    <DeleteConfirmation onConfirm={() => deleteFile(id, file.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {files.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun fichier dans cette ressource.</p>
            <p className="text-sm text-gray-400 mt-2">Cliquez sur "Ajouter un fichier" pour commencer.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Composant pour la confirmation de suppression ---
function DeleteConfirmation({ onConfirm }: { onConfirm: () => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button title="Supprimer" className="text-gray-500 hover:text-red-600 transition-colors">
          <Trash2 className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Êtes-vous sûr de vouloir supprimer ce fichier ?</DialogTitle>
          <DialogDescription>
            Cette action est irréversible. Le fichier sera définitivement supprimé.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
             <button type="button" className="mt-2 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm">
                Annuler
            </button>
          </DialogClose>
          <DialogClose asChild>
              <button 
                type="button" 
                onClick={onConfirm}
                className="mt-2 inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                  Supprimer
              </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- Logique de déduction du type de fichier ---
const getFileType = (fileName: string): 'PDF' | 'Word' | 'Vidéo' | 'Autre' => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (extension === 'pdf') return 'PDF';
  if (['doc', 'docx'].includes(extension || '')) return 'Word';
  if (['mp4', 'avi', 'mov'].includes(extension || '')) return 'Vidéo';
  return 'Autre';
};

// --- Formulaire d'ajout de fichier ---
function AddFileForm({ onAddFile }: { onAddFile: (data: Omit<FileFormData, 'size'> & { file?: File }) => void }) {
  const [formType, setFormType] = useState<'file' | 'link'>('file');
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setName(selectedFile.name); // Pré-remplir le nom avec celui du fichier
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const selectedFile = droppedFiles[0];
      setFile(selectedFile);
      setName(selectedFile.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formType === 'file' && file) {
      const fileType = getFileType(file.name);
      onAddFile({ name: file.name, type: fileType, url: '', file });
    } else if (formType === 'link' && name && url) {
      onAddFile({ name, type: 'Lien', url });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-1">
      <h2 className="text-xl font-semibold mb-2 text-gray-700">Ajouter une nouvelle ressource</h2>
      
      {/* Sélecteur Fichier/Lien */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setFormType('file')}
          className={`w-full py-2 rounded-md text-sm font-medium ${formType === 'file' ? 'bg-white shadow' : 'text-gray-600'}`}
        >
          Fichier
        </button>
        <button
          type="button"
          onClick={() => setFormType('link')}
          className={`w-full py-2 rounded-md text-sm font-medium ${formType === 'link' ? 'bg-white shadow' : 'text-gray-600'}`}
        >
          Lien externe
        </button>
      </div>

      {formType === 'link' ? (
        <>
          <input
            name="name"
            type="text"
            placeholder="Nom du lien (ex: Article sur Wikipedia)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded-md focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            required
          />
          <input
            name="url"
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border p-2 rounded-md focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            required
          />
        </>
      ) : (
        <>
          <label 
            htmlFor="file-upload" 
            className={`w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-400'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              id="file-upload"
              name="file"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
                <p className="text-gray-700 font-medium">{file.name}</p>
            ) : (
                <div className='flex flex-col items-center gap-2'>
                    <UploadCloud className="h-8 w-8 text-gray-400"/>
                    <p className="text-gray-500">
                        <span className='font-semibold text-orange-600'>Cliquez pour choisir</span> ou glissez-déposez un fichier
                    </p>
                    <p className='text-xs text-gray-400'>PDF, Word, Vidéo, etc.</p>
                </div>
            )}
          </label>
        </>
      )}
      
      <button
        type="submit"
        className="bg-orange-500 text-white px-4 py-2.5 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 transition-colors duration-150 mt-2"
        disabled={formType === 'file' ? !file : !name || !url}
      >
        Ajouter
      </button>
    </form>
  );
}

export default RessourceDetailPage;

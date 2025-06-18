import React, { useState } from 'react';
import ResourceCard from './ResourceCard'; // Importer le ResourceCard
import { useAuth } from '../../pages/authentification/useAuth';
import { ActionCard } from '../ui/ActionCard';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';

// Interface pour les ressources de la leçon
interface Resource {
  id: string;
  title: string;
  imageUrl: string;
  fileCount: number;
}

// Interface pour le formulaire (plus détaillée)
interface FormData {
    id: string;
    title: string;
    subject: string;
    description: string;
    imageUrl: string;
    fileCount: number;
}

// Composant de formulaire défini localement
function AddResourceForm({ onAddResource, onClose }: { onAddResource: (resource: FormData) => void, onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newResource: FormData = {
      id: Date.now().toString(),
      title,
      subject,
      description,
      imageUrl,
      fileCount: 0,
    };
    onAddResource(newResource);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-1">
      <h2 className="text-xl font-semibold mb-2 text-gray-700">Ajouter une nouvelle ressource</h2>
      <input type="text" placeholder="Titre de la ressource" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 rounded-md" required />
      <input type="text" placeholder="Matière" value={subject} onChange={(e) => setSubject(e.target.value)} className="border p-2 rounded-md" required />
      <textarea placeholder="Courte description" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 rounded-md h-24" required />
      <input type="text" placeholder="URL de l'image" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="border p-2 rounded-md" required />
      <button type="submit" className="bg-orange-500 text-white px-4 py-2.5 rounded-md hover:bg-orange-600">Ajouter la ressource</button>
    </form>
  );
}

// Logique de rôle
type Role = "enseignant" | "directeur" | "eleve" | "parent" | "administrateur" | "espaceFamille";
const rolesPriority: Role[] = ["administrateur", "directeur", "enseignant", "eleve", "parent", "espaceFamille"];

interface LessonResourcesSectionProps {
  resources: Omit<Resource, 'fileCount'>[]; // Adapter le type entrant
  onViewResource?: (resourceId: string) => void; // Callback pour la vue d'une ressource
}

const LessonResourcesSection: React.FC<LessonResourcesSectionProps> = ({
  resources: initialResources,
  onViewResource,
}) => {
  const { roles } = useAuth();
  const userRole = rolesPriority.find(r => roles.includes(r));
  
  // Ajouter fileCount aux ressources initiales
  const [resources, setResources] = useState<Resource[]>(
    initialResources.map(r => ({ ...r, fileCount: 0 }))
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addResource = (newResource: FormData) => {
    setResources(prev => [...prev, newResource]);
  };

  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold text-gray-800">Ressources</h3>
        {userRole === 'enseignant' && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <div className="inline-block">
                <ActionCard 
                  icon={<Plus className="text-orange-500 w-5 h-5" />} 
                  label="Ajouter une ressource" 
                  onClick={() => setIsDialogOpen(true)}
                />
              </div>
            </DialogTrigger>
            <DialogContent>
              <AddResourceForm 
                onAddResource={addResource} 
                onClose={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {resources.length === 0 ? (
        userRole !== 'enseignant' && <p className="text-gray-500 text-sm">Aucune ressource pour cette leçon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {resources.map(resource => (
            <ResourceCard 
              key={resource.id}
              title={resource.title}
              imageUrl={resource.imageUrl}
              fileCount={resource.fileCount}
              onViewResource={onViewResource ? () => onViewResource(resource.id) : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default LessonResourcesSection; 
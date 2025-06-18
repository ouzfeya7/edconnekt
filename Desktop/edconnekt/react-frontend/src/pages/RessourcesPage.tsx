import { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "../components/ui/dialog";
import { ActionCard } from "../components/ui/ActionCard";
import ResourceCard from "../components/course/ResourceCard";
import { useNavigate } from "react-router-dom";

interface Resource {
  id: number;
  title: string;
  subject: string;
  description: string;
  imageUrl: string;
  fileCount: number;
}

const mockResources: Resource[] = [
  {
    id: 1,
    title: "Histoire",
    subject: "Histoire",
    description: "L'histoire est à la fois l'étude et l'écriture des faits et ...",
    imageUrl: "https://picsum.photos/seed/history/400/300",
    fileCount: 0,
  },
  {
    id: 2,
    title: "Géographie",
    subject: "Géographie",
    description: "La géographie est l'étude des espaces et des territoires ...",
    imageUrl: "https://picsum.photos/seed/geography/400/300",
    fileCount: 0,
  },
  {
    id: 3,
    title: "Anglais",
    subject: "Anglais",
    description: "Cours d'anglais pour débutants",
    imageUrl: "https://picsum.photos/seed/english/400/300",
    fileCount: 0,
  },
  {
    id: 4,
    title: "Mathématique",
    subject: "Mathématique",
    description: "Algèbre et géométrie",
    imageUrl: "https://picsum.photos/seed/math/400/300",
    fileCount: 0,
  },
  {
    id: 5,
    title: "Français",
    subject: "Français",
    description: "Grammaire et conjugaison",
    imageUrl: "https://picsum.photos/seed/french/400/300",
    fileCount: 0,
  },
  {
    id: 6,
    title: "Science de la vie",
    subject: "Science",
    description: "Biologie cellulaire",
    imageUrl: "https://picsum.photos/seed/science/400/300",
    fileCount: 0,
  },
  {
    id: 7,
    title: "Programme scolaire annuel",
    subject: "Administration",
    description: "Détails du programme de l'année",
    imageUrl: "https://picsum.photos/seed/program/400/300",
    fileCount: 0,
  },
];

function RessourcesPage() {
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const navigate = useNavigate();

  const addResource = (newResource: Resource) => {
    setResources((prev) => [...prev, newResource]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Ressources</h1>

      <Dialog>
        <DialogTrigger asChild>
          <div className="mb-8 inline-block">
            <ActionCard 
              icon={<Plus className="text-orange-500 w-5 h-5" />} 
              label="Ajouter une ressource" 
              onClick={() => {}}
            />
          </div>
        </DialogTrigger>
        <DialogContent>
          <AddResourceForm onAddResource={addResource} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {resources.map((resource) => (
          <ResourceCard 
            key={resource.id} 
            title={resource.title} 
            imageUrl={resource.imageUrl} 
            fileCount={resource.fileCount}
            onViewResource={() => navigate(`/ressources/${resource.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

function AddResourceForm({ onAddResource }: { onAddResource: (resource: Resource) => void }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newResource: Resource = {
      id: Date.now(),
      title,
      subject,
      description,
      imageUrl,
      fileCount: 0,
    };
    onAddResource(newResource);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-1">
      <h2 className="text-xl font-semibold mb-2 text-gray-700">Ajouter une nouvelle ressource</h2>
      <input
        type="text"
        placeholder="Titre de la ressource"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded-md focus:ring-2 focus:ring-orange-400 focus:border-transparent"
        required
      />
      <input
        type="text"
        placeholder="Matière (ex: Français, Mathématique)"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="border p-2 rounded-md focus:ring-2 focus:ring-orange-400 focus:border-transparent"
        required
      />
      <textarea
        placeholder="Courte description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 rounded-md h-24 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
        required
      />
      <input
        type="text"
        placeholder="URL de l'image (ex: https://...)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="border p-2 rounded-md focus:ring-2 focus:ring-orange-400 focus:border-transparent"
        required
      />
      <button
        type="submit"
        className="bg-orange-500 text-white px-4 py-2.5 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 transition-colors duration-150"
      >
        Ajouter la ressource
      </button>
    </form>
  );
}

export default RessourcesPage;

import { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "../components/ui/dialog";
import { ActionCard } from "../components/ui/ActionCard";
import ResourceCard from "../components/course/ResourceCard";
import { useNavigate } from "react-router-dom";
import { useResources } from "../contexts/ResourceContext";
import { useTranslation } from "react-i18next";

interface ResourceFormData {
  title: string;
  subject: string;
  description: string;
  imageUrl: string;
}

function RessourcesPage() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { resources, files, addResource, deleteResource } = useResources();

  const handleAddResource = (newResourceData: ResourceFormData) => {
    addResource(newResourceData);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-[#F5F7FA] min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('resources_title')}</h1>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <div className="mb-8 inline-block">
            <ActionCard 
              icon={<Plus className="text-orange-500 w-5 h-5" />} 
              label={t('add_resource')}
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </DialogTrigger>
        <DialogContent>
          <AddResourceForm onAddResource={handleAddResource} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {resources.map((resource) => (
          <ResourceCard 
            key={resource.id} 
            title={resource.title} 
            imageUrl={resource.imageUrl} 
            fileCount={files[resource.id]?.length || 0}
            onViewResource={() => navigate(`/ressources/${resource.id}`)}
            onDelete={() => deleteResource(resource.id)}
          />
        ))}
      </div>
    </div>
  );
}

function AddResourceForm({ onAddResource }: { onAddResource: (data: ResourceFormData) => void }) {
  const { t } = useTranslation();
  const initialFormState: ResourceFormData = {
    title: "",
    subject: "",
    description: "",
    imageUrl: "",
  };
  const [formState, setFormState] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const previewUrl = URL.createObjectURL(file);
          setImagePreview(previewUrl);
          setFormState(prev => ({ ...prev, imageUrl: previewUrl }));
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddResource(formState);
    setFormState(initialFormState);
    setImagePreview(null);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-1">
      <h2 className="text-xl font-semibold mb-2 text-gray-700">{t('add_new_resource', 'Ajouter une nouvelle ressource')}</h2>
      <input
        name="title"
        type="text"
        placeholder={t('resource_title_placeholder', 'Titre de la ressource')}
        value={formState.title}
        onChange={handleChange}
        className="border p-2 rounded-md focus:ring-2 focus:ring-orange-400 focus:border-transparent"
        required
      />
      <input
        name="subject"
        type="text"
        placeholder={t('subject_placeholder', 'Matière (ex: Français, Mathématique)')}
        value={formState.subject}
        onChange={handleChange}
        className="border p-2 rounded-md focus:ring-2 focus:ring-orange-400 focus:border-transparent"
        required
      />
      <textarea
        name="description"
        placeholder={t('short_description_placeholder', 'Courte description')}
        value={formState.description}
        onChange={handleChange}
        className="border p-2 rounded-md h-24 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
        required
      />
      
      <div>
        <label htmlFor="imageUpload" className="text-sm font-medium text-gray-700">{t('resource_image', 'Image de la ressource')}</label>
        <input
            id="imageUpload"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full border p-2 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            required
        />
      </div>

      {imagePreview && (
          <div className="mt-2">
              <p className="text-sm font-medium text-gray-600 mb-1">{t('preview', 'Aperçu :')}</p>
              <img src={imagePreview} alt={t('preview_alt', 'Aperçu')} className="w-full h-32 object-cover rounded-md border" />
          </div>
      )}

      <button
        type="submit"
        className="bg-orange-500 text-white px-4 py-2.5 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 transition-colors duration-150"
      >
        {t('add_resource_button', 'Ajouter la ressource')}
      </button>
    </form>
  );
}

export default RessourcesPage;

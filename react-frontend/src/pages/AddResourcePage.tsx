import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';
import { useResources } from '../contexts/ResourceContext';

const domainsData: { [key: string]: string[] } = {
  "Langues et Communication": ["Anglais", "Français"],
  "Sciences Humaines": ["Études islamiques", "Géographie", "Histoire", "Lecture arabe", "Qran", "Vivre dans son milieu", "Vivre ensemble", "Wellness"],
  "STEM": ["Mathématiques"],
  "Créativité & Sport": ["Arts plastiques", "EPS", "Motricité", "Musique", "Théâtre/Drama"],
};
const domainNames = Object.keys(domainsData).sort();

const subjects = [
    "Anglais",
    "Arts plastiques",
    "EPS",
    "Etude Islamique",
    "Études islamiques",
    "Français",
    "Geographie",
    "Géographie",

    "Histoire",
    "Lecture arabe",
    "Mathématiques",
    "Motricité",
    "Musique",
    "Quran",
    "Qran",
    "STEM",
    "Théâtre/Drama",
    "VDSM",
    "Vivre Dans Son Milieu",
    "Vivre Ensemble",
    "Vivre dans son milieu",
    "Vivre ensemble",
    "Wellness",
];
const uniqueSubjects = [...new Set(subjects)].sort();

interface ResourceFormData {
  title: string;
  subject: string;
  description: string;
  imageUrl: string;
}

const AddResourcePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addResource } = useResources();

  const [selectedDomain, setSelectedDomain] = useState('');

  const initialFormState: ResourceFormData = {
    title: "",
    subject: "",
    description: "",
    imageUrl: "",
  };

  const [formState, setFormState] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const domain = e.target.value;
    setSelectedDomain(domain);
    // Reset subject when domain changes
    setFormState(prev => ({ ...prev, subject: '' }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        setFormState(prev => ({ ...prev, imageUrl: previewUrl }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          processFile(file);
      }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addResource(formState);
    navigate('/ressources'); // Redirect back to the resources list
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('add_new_resource', 'Ajouter une nouvelle ressource')}</h1>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                {/* --- Colonne de gauche : Informations --- */}
                <div className="flex flex-col gap-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">{t('resource_title', 'Titre de la ressource')}</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder={t('resource_title_placeholder', 'Ex: Le système solaire')}
                            value={formState.title}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-md focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">{t('domain', 'Domaine de compétence')}</label>
                        <select
                            id="domain"
                            name="domain"
                            value={selectedDomain}
                            onChange={handleDomainChange}
                            className="w-full border bg-white p-3 rounded-md focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                            required
                        >
                            <option value="" disabled>{t('select_domain_placeholder', 'Sélectionnez un domaine...')}</option>
                            {domainNames.map(domain => (
                                <option key={domain} value={domain}>{domain}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">{t('subject', 'Matière')}</label>
                        <select
                            id="subject"
                            name="subject"
                            value={formState.subject}
                            onChange={handleChange}
                            className="w-full border bg-white p-3 rounded-md focus:ring-2 focus:ring-orange-400 focus:border-transparent transition disabled:bg-gray-100"
                            required
                            disabled={!selectedDomain}
                        >
                            <option value="" disabled>{t('select_subject_placeholder', 'Sélectionnez une matière...')}</option>
                            {selectedDomain && domainsData[selectedDomain].map(subject => (
                                <option key={subject} value={subject}>{subject}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">{t('description', 'Description')}</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder={t('short_description_placeholder', 'Décrivez brièvement le contenu de la ressource...')}
                            value={formState.description}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-md h-40 focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                            required
                        />
                    </div>
                </div>

                {/* --- Colonne de droite : Image --- */}
                <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('resource_image', 'Image de la ressource')}</label>
                    <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative flex-grow flex flex-col justify-center items-center border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200
                            ${isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-400'}`}
                    >
                        <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                            <UploadCloud className={`mx-auto h-12 w-12 mb-4 transition-colors duration-200 ${isDragging ? 'text-orange-600' : 'text-orange-500'}`} />
                            <h3 className="text-lg font-semibold text-gray-800">{t('cover_image_title', 'Image de couverture')}</h3>
                            <p className="mt-2 text-sm text-gray-500">{t('cover_image_subtitle', 'Glissez-déposez une image ou sélectionnez-en une')}</p>
                            <span className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600">
                                {t('select_image_btn', 'Sélectionner une image')}
                            </span>
                        </label>
                        <input
                            id="imageUpload"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            required={!formState.imageUrl}
                        />
                    </div>

                    {imagePreview && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-600 mb-2">{t('preview', 'Aperçu :')}</p>
                            <img src={imagePreview} alt={t('preview_alt', 'Aperçu')} className="w-full h-48 object-cover rounded-md border" />
                        </div>
                    )}
                </div>
            </div>

            {/* --- Actions --- */}
            <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-gray-200">
                <button
                    type="button"
                    onClick={() => navigate('/ressources')}
                    className="bg-gray-200 text-gray-800 font-semibold px-6 py-2.5 rounded-md hover:bg-gray-300 transition"
                >
                    {t('cancel', 'Annuler')}
                </button>
                <button
                    type="submit"
                    className="bg-orange-500 text-white font-semibold px-6 py-2.5 rounded-md hover:bg-orange-600 transition"
                >
                    {t('add_resource_button', 'Ajouter la ressource')}
                </button>
            </div>
        </form>
    </div>
  );
};

export default AddResourcePage; 
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
    Palette, Music, Bike, Theater, Move,
    Languages,
    Sigma,
    Globe, ScrollText, BookOpenCheck, BookMarked, Home, Users, HeartPulse,
    X
} from 'lucide-react';
import { useResources } from '../contexts/ResourceContext';
import { useUser } from '../layouts/DashboardLayout';
import { Checkbox } from '../components/ui/checkbox';

// Data for domains and subjects, matching RessourcesPage exactly
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

// Couleurs subtiles spécifiques à chaque matière (matching RessourcesPage)
const subjectColors: { [key: string]: string } = {
  // CRÉATIVITÉ & SPORT - Teintes bleu-violet
  "Arts plastiques": "bg-indigo-400",
  "EPS": "bg-sky-400", 
  "Motricité": "bg-cyan-400",
  "Musique": "bg-violet-400",
  "Théâtre/Drama": "bg-purple-400",
  
  // LANGUES ET COMMUNICATION - Teintes vert
  "Anglais": "bg-emerald-400",
  "Français": "bg-green-400",
  
  // STEM - Teintes orange-rouge
  "Mathématiques": "bg-amber-400",
  
  // SCIENCES HUMAINES - Teintes rose-brun
  "Études islamiques": "bg-teal-400",
  "Géographie": "bg-blue-400",
  "Histoire": "bg-slate-400", 
  "Lecture arabe": "bg-lime-400",
  "Qran": "bg-rose-400",
  "Vivre dans son milieu": "bg-stone-400",
  "Vivre ensemble": "bg-pink-400",
  "Wellness": "bg-orange-400",
};

const subjectBadgeColors: { [key: string]: string } = {
  // CRÉATIVITÉ & SPORT
  "Arts plastiques": "bg-indigo-50 text-indigo-700",
  "EPS": "bg-sky-50 text-sky-700",
  "Motricité": "bg-cyan-50 text-cyan-700", 
  "Musique": "bg-violet-50 text-violet-700",
  "Théâtre/Drama": "bg-purple-50 text-purple-700",
  
  // LANGUES ET COMMUNICATION
  "Anglais": "bg-emerald-50 text-emerald-700",
  "Français": "bg-green-50 text-green-700",
  
  // STEM
  "Mathématiques": "bg-amber-50 text-amber-700",
  
  // SCIENCES HUMAINES
  "Études islamiques": "bg-teal-50 text-teal-700",
  "Géographie": "bg-blue-50 text-blue-700",
  "Histoire": "bg-slate-50 text-slate-700",
  "Lecture arabe": "bg-lime-50 text-lime-700", 
  "Qran": "bg-rose-50 text-rose-700",
  "Vivre dans son milieu": "bg-stone-50 text-stone-700",
  "Vivre ensemble": "bg-pink-50 text-pink-700",
  "Wellness": "bg-orange-50 text-orange-700",
};

const getIconForSubject = (subject: string) => {
    switch (subject) {
        case "Arts plastiques": return Palette;
        case "EPS": return Bike;
        case "Motricité": return Move;
        case "Musique": return Music;
        case "Théâtre/Drama": return Theater;
        case "Anglais": return Languages;
        case "Français": return Languages;
        case "Mathématiques": return Sigma;
        case "Études islamiques": return BookMarked;
        case "Géographie": return Globe;
        case "Histoire": return ScrollText;
        case "Lecture arabe": return BookOpenCheck;
        case "Qran": return BookMarked;
        case "Vivre dans son milieu": return Home;
        case "Vivre ensemble": return Users;
        case "Wellness": return HeartPulse;
        default: return BookOpenCheck;
    }
};

interface ResourceFormData {
  title: string;
  subject: string;
  description: string;
  imageUrl: string;
  isPaid: boolean;
}

const CreateResourcePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addResource } = useResources();
  const { user } = useUser();

  const [selectedDomain, setSelectedDomain] = useState('');

  const initialFormState: ResourceFormData = {
    title: "",
    subject: "",
    description: "",
    imageUrl: "",
    isPaid: false,
  };

  const [formState, setFormState] = useState(initialFormState);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newResource = {
      ...formState,
      author: user?.name || 'Enseignant',
      addedDate: new Date().toLocaleDateString('fr-FR'),
    };
    addResource(newResource);
    
    // Reset form and navigate back to resources page
    setFormState(initialFormState);
    setSelectedDomain('');
    navigate('/ressources'); // Redirect to resources page after submission
  };

  // Get subject preview data
  const SubjectPreview = ({ subject }: { subject: string }) => {
    if (!subject) return null;
    
    const Icon = getIconForSubject(subject);
    const bgColor = subjectColors[subject] || "bg-gray-400";
    const badgeColor = subjectBadgeColors[subject] || "bg-gray-50 text-gray-700";
    
    return (
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bgColor} shadow-sm`}>
          <Icon className="w-6 h-6 text-white/90" />
        </div>
        <div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badgeColor} mb-1`}>
            {subject}
          </div>
          <p className="text-sm text-gray-600">
            Par {user ? user.name : 'Enseignant'} • {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {t('add_new_resource', 'Ajouter une nouvelle ressource')}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-3">
              {t('resource_title', 'Titre de la ressource')}
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder={t('resource_title_placeholder', 'Ex: Découverte du monde C.I. - Les éditions didactikos')}
              value={formState.title}
              onChange={handleChange}
              className="w-full border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-150"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label htmlFor="domain" className="block text-sm font-semibold text-gray-900 mb-3">
                {t('domain', 'Domaine de compétence')}
              </label>
              <select
                id="domain"
                name="domain"
                value={selectedDomain}
                onChange={handleDomainChange}
                className="w-full border border-gray-200 bg-white p-4 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-150"
                required
              >
                <option value="" disabled>{t('select_domain_placeholder', 'Sélectionnez un domaine...')}</option>
                {domainNames.map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-3">
                {t('subject', 'Matière')}
              </label>
              <select
                id="subject"
                name="subject"
                value={formState.subject}
                onChange={handleChange}
                className="w-full border border-gray-200 bg-white p-4 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-150 disabled:bg-gray-50 disabled:text-gray-400"
                required
                disabled={!selectedDomain}
              >
                <option value="" disabled>{t('select_subject_placeholder', 'Sélectionnez une matière...')}</option>
                {selectedDomain && domainsData[selectedDomain].map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Champ URL de l'image */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-900 mb-3">
              URL de l'image (facultatif)
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formState.imageUrl}
              onChange={handleChange}
              className="w-full border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-150"
            />
          </div>

          {/* Case à cocher pour le statut payant */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPaid"
              checked={formState.isPaid}
              onCheckedChange={(checked) => setFormState(prev => ({ ...prev, isPaid: Boolean(checked) }))}
              className="border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
            />
            <label htmlFor="isPaid" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Ressource payante
            </label>
          </div>

          {/* Aperçu de la matière sélectionnée */}
          {formState.subject && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Aperçu de la ressource</label>
              <SubjectPreview subject={formState.subject} />
            </div>
          )}
          
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-3">
              {t('description', 'Description')}
            </label>
            <textarea
              id="description"
              name="description"
              placeholder={t('short_description_placeholder', 'Décrivez brièvement le contenu de la ressource...')}
              value={formState.description}
              onChange={handleChange}
              className="w-full border border-gray-200 p-4 rounded-xl h-28 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-150 resize-none"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate('/ressources')} // Back button
              className="bg-gray-100 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors duration-150"
            >
              {t('cancel', 'Annuler')}
            </button>
            <button
              type="submit"
              className="bg-orange-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors duration-150 shadow-sm"
            >
              {t('add_resource_button', 'Ajouter la ressource')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateResourcePage; 
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, FileText, ChevronDown, ChevronUp, Plus, Edit, Trash2, ShieldCheck, Save, Download, Loader2, CheckCircle } from 'lucide-react';
import CircularModal from './CircularModal';
import PracticeModal from './PracticeModal'; // Import de la nouvelle modale
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Interface pour les bonnes pratiques
interface Practice {
  id: string;
  title: string;
  category: string;
  content: string;
}

// Données Mock
const mockPractices: Practice[] = [
  {
    id: 'bp_01',
    title: 'Procédure en cas d\'incendie',
    category: 'Urgence',
    content: '1. Déclenchez l\'alarme. 2. Évacuez calmement vers le point de rassemblement. 3. Ne prenez pas l\'ascenseur. 4. N\'essayez pas de récupérer des objets personnels.',
  },
  {
    id: 'bp_02',
    title: 'Sensibilisation au harcèlement scolaire',
    category: 'Vie Scolaire',
    content: 'Encouragez le dialogue ouvert. Mettez en place une politique de tolérance zéro. Formez le personnel à reconnaître les signes de harcèlement.',
  },
  {
    id: 'bp_03',
    title: 'Sécurité sur le chemin de l\'école',
    category: 'Prévention',
    content: 'Rappellez aux élèves d\'utiliser les passages piétons. Organisez des patrouilles de parents volontaires. Sensibilisez aux dangers de parler à des inconnus.',
  },
  {
    id: 'bp_04',
    title: 'Gestion des allergies alimentaires',
    category: 'Santé',
    content: 'Identifiez les élèves allergiques et informez le personnel de la cantine. Mettez en place des tables spécifiques si nécessaire. Ayez toujours des trousses d\'urgence à portée de main.',
  },
  {
    id: 'bp_05',
    title: 'Bonnes pratiques sur Internet',
    category: 'Cyber-sécurité',
    content: 'Éduquez les élèves sur les dangers du cyber-harcèlement et la protection des données personnelles. Installez des filtres de contenu sur le réseau de l\'école.',
  },
];

// Interface pour les circulaires
interface Circular {
  id: string;
  title: string;
  date: string;
  content: string;
}

// Données Mock pour les circulaires
const mockCirculars: Circular[] = [
  {
    id: 'circ_01',
    title: 'Rappel des règles de stationnement aux abords de l\'école',
    date: '2023-10-26',
    content: 'Pour la sécurité de tous, nous vous rappelons que le stationnement en double file est strictement interdit...',
  },
  {
    id: 'circ_02',
    title: 'Mise en place du plan "Vigipirate"',
    date: '2023-09-15',
    content: 'Suite aux directives nationales, de nouvelles mesures de sécurité sont appliquées à l\'entrée de l\'établissement...',
  },
  {
    id: 'circ_03',
    title: 'Organisation de la journée sportive annuelle',
    date: '2024-05-10',
    content: 'La journée sportive se tiendra le 25 mai. Pensez à prévoir une tenue adaptée pour vos enfants, ainsi qu\'une gourde et une casquette.',
  },
  {
    id: 'circ_04',
    title: 'Campagne de vaccination contre la grippe',
    date: '2023-11-05',
    content: 'Une campagne de vaccination facultative est organisée au sein de l\'école le 20 novembre. Veuillez retourner le formulaire d\'autorisation si vous êtes intéressé.',
  },
];

const initialRulesContent = `# Règlement Intérieur de l'Établissement

**Article 1: Respect mutuel**
Le respect des autres est primordial. Toute forme de violence, verbale ou physique, est strictement interdite.

**Article 2: Ponctualité et assiduité**
Les élèves doivent arriver à l'heure en cours et assister à toutes les leçons, sauf en cas de motif valable.

**Article 3: Tenue vestimentaire**
Une tenue correcte et décente est exigée. Les vêtements provocants ou portant des messages inappropriés sont proscrits.
`;

const SchoolSecurity: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('rules');
  const [expandedPractice, setExpandedPractice] = useState<string | null>(null);
  const [expandedCircular, setExpandedCircular] = useState<string | null>(null); // State pour l'accordéon des circulaires
  const [circulars, setCirculars] = useState<Circular[]>(mockCirculars);
  const [isCircularModalOpen, setIsCircularModalOpen] = useState(false);
  const [editingCircular, setEditingCircular] = useState<Circular | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All'); // State pour le filtre
  
  const [initialRules, setInitialRules] = useState(() => {
    return localStorage.getItem('schoolRulesContent') || initialRulesContent;
  });
  const [rulesContent, setRulesContent] = useState(initialRules);
  const [isSavingRules, setIsSavingRules] = useState(false);
  const [showRulesSuccess, setShowRulesSuccess] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  
  const hasRulesChanged = initialRules !== rulesContent;

  const [practices, setPractices] = useState<Practice[]>(mockPractices);
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
  const [editingPractice, setEditingPractice] = useState<Practice | null>(null);

  const practiceCategories = ['All', ...new Set(practices.map(p => p.category))];
  const filteredPractices = activeCategory === 'All' 
    ? practices 
    : practices.filter(p => p.category === activeCategory);

  const tabs = [
    { id: 'best_practices', label: t('best_practices', 'Bonnes Pratiques'), icon: BookOpen },
    { id: 'circulars', label: t('circulars', 'Circulaires'), icon: FileText },
    { id: 'rules', label: t('rules', 'Règlement Intérieur'), icon: ShieldCheck },
  ];

  const handleTogglePractice = (id: string) => {
    setExpandedPractice(expandedPractice === id ? null : id);
  };

  const handleToggleCircular = (id: string) => {
    setExpandedCircular(expandedCircular === id ? null : id);
  };

  const handleOpenCircularModal = (circular: Circular | null) => {
    setEditingCircular(circular);
    setIsCircularModalOpen(true);
  };

  const handleCloseCircularModal = () => {
    setIsCircularModalOpen(false);
    setEditingCircular(null);
  };

  const handleSaveCircular = (circular: Circular) => {
    if (editingCircular) {
      setCirculars(circulars.map(c => c.id === circular.id ? circular : c));
    } else {
      setCirculars([circular, ...circulars]); // Ajoute la nouvelle en premier
    }
    handleCloseCircularModal();
  };

  const handleDeleteCircular = (circularId: string) => {
    if (window.confirm(t('confirm_delete_circular', 'Êtes-vous sûr de vouloir supprimer cette circulaire ?'))) {
      setCirculars(circulars.filter(c => c.id !== circularId));
    }
  };

  const handleOpenPracticeModal = (practice: Practice | null) => {
    setEditingPractice(practice);
    setIsPracticeModalOpen(true);
  };

  const handleClosePracticeModal = () => {
    setIsPracticeModalOpen(false);
    setEditingPractice(null);
  };

  const handleSavePractice = (practice: Practice) => {
    if (editingPractice) {
      setPractices(practices.map(p => p.id === practice.id ? practice : p));
    } else {
      setPractices([practice, ...practices]);
    }
    handleClosePracticeModal();
  };

  const handleDeletePractice = (practiceId: string) => {
    if (window.confirm(t('confirm_delete_practice', 'Êtes-vous sûr de vouloir supprimer cette bonne pratique ?'))) {
      setPractices(practices.filter(p => p.id !== practiceId));
    }
  };

  const handleDownloadPDF = () => {
    const elementToCapture = previewRef.current;
    if (!elementToCapture) {
      console.error("L'élément de prévisualisation est introuvable.");
      alert("Erreur: Impossible de trouver le contenu à télécharger.");
      return;
    }

    // Options pour améliorer la qualité de l'image
    html2canvas(elementToCapture, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save("reglement-interieur.pdf");
    }).catch(err => {
      console.error("Erreur lors de la conversion en PDF:", err);
      alert("Une erreur est survenue lors de la génération du PDF.");
    });
  };

  const handleSaveRules = () => {
    if (!hasRulesChanged) return;
    setIsSavingRules(true);
    setTimeout(() => {
      localStorage.setItem('schoolRulesContent', rulesContent);
      setInitialRules(rulesContent);
      setIsSavingRules(false);
      setShowRulesSuccess(true);
      setTimeout(() => setShowRulesSuccess(false), 2000);
    }, 1500);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'best_practices':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2 pb-2">
                {practiceCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      activeCategory === category 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category === 'All' ? t('all', 'Tout') : category}
                  </button>
                ))}
              </div>
              <button onClick={() => handleOpenPracticeModal(null)} className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                {t('write_practice', 'Rédiger')}
              </button>
            </div>
            <div className="space-y-4">
              {filteredPractices.map((practice) => (
                <div key={practice.id} className="border border-gray-200 rounded-lg">
                  <div className="p-4 flex justify-between items-start">
                    <button onClick={() => handleTogglePractice(practice.id)} className="flex-grow text-left">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{practice.category}</span>
                      <p className="font-semibold text-gray-800 mt-1">{practice.title}</p>
                    </button>
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                      <button onClick={() => handleOpenPracticeModal(practice)} className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg"><Edit className="w-5 h-5 text-blue-600" /></button>
                      <button onClick={() => handleDeletePractice(practice.id)} className="p-2 bg-red-50 hover:bg-red-100 rounded-lg"><Trash2 className="w-5 h-5 text-red-600" /></button>
                      <button onClick={() => handleTogglePractice(practice.id)} className="p-2 text-gray-200 hover:bg-gray-300 rounded-lg">{expandedPractice === practice.id ? <ChevronUp className="w-5 h-5 text-gray-700" /> : <ChevronDown className="w-5 h-5 text-gray-700" />}</button>
                    </div>
                  </div>
                  {expandedPractice === practice.id && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <p className="text-sm text-gray-600 whitespace-pre-line">{practice.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'circulars':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{t('manage_security_circulars', 'Gérer les circulaires de sécurité')}</h3>
                <p className="text-sm text-gray-500 mt-1">{t('circulars_description', 'Rédigez et consultez les notes de service liées à la sécurité.')}</p>
              </div>
              <button onClick={() => handleOpenCircularModal(null)} className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                {t('create_circular', 'Rédiger une circulaire')}
              </button>
            </div>
            <div className="space-y-4">
              {circulars.map((circular) => (
                <div key={circular.id} className="border border-gray-200 rounded-lg">
                  <div className="p-4 flex justify-between items-start">
                    <button onClick={() => handleToggleCircular(circular.id)} className="flex-grow text-left">
                      <p className="font-semibold text-gray-800">{circular.title}</p>
                      <p className="text-sm text-gray-600">{t('published_on', 'Publiée le')} {new Date(circular.date).toLocaleDateString()}</p>
                    </button>
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                      <button onClick={() => handleOpenCircularModal(circular)} className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg"><Edit className="w-5 h-5 text-blue-600" /></button>
                      <button onClick={() => handleDeleteCircular(circular.id)} className="p-2 bg-red-50 hover:bg-red-100 rounded-lg"><Trash2 className="w-5 h-5 text-red-600" /></button>
                      <button onClick={() => handleToggleCircular(circular.id)} className="p-2 text-gray-200 hover:bg-gray-300 rounded-lg">{expandedCircular === circular.id ? <ChevronUp className="w-5 h-5 text-gray-700" /> : <ChevronDown className="w-5 h-5 text-gray-700" />}</button>
                    </div>
                  </div>
                  {expandedCircular === circular.id && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <p className="text-sm text-gray-600 whitespace-pre-line">{circular.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'rules':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">{t('school_rules_editor', 'Éditeur du Règlement Intérieur')}</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('download', 'Telecharger')}
                </button>
                {showRulesSuccess && <CheckCircle className="text-green-500 w-5 h-5" />}
                <button
                  onClick={handleSaveRules}
                  disabled={!hasRulesChanged || isSavingRules}
                  className="flex items-center justify-center px-4 py-2 w-32 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSavingRules ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {t('save_changes', 'Enregistrer')}
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea
                value={rulesContent}
                onChange={(e) => setRulesContent(e.target.value)}
                className="w-full h-96 p-2 border border-gray-300 rounded-md font-mono"
                placeholder="Rédigez ici en utilisant Markdown..."
              />
              <div ref={previewRef} className="w-full h-96 p-4 border border-gray-200 rounded-md bg-white prose">
                <ReactMarkdown>{rulesContent}</ReactMarkdown>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {t('school_security', 'Sécurité Scolaire')}
      </h2>
      
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div>{renderContent()}</div>

      <CircularModal 
        isOpen={isCircularModalOpen}
        onClose={handleCloseCircularModal}
        onSave={handleSaveCircular}
        circular={editingCircular}
      />
      <PracticeModal 
        isOpen={isPracticeModalOpen}
        onClose={handleClosePracticeModal}
        onSave={handleSavePractice}
        practice={editingPractice}
      />
    </div>
  );
};

export default SchoolSecurity;

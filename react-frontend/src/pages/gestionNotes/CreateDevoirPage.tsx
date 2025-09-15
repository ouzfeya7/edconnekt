import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { UploadCloud, File as FileIcon, X, Calendar, Book, CircleDot, Target, FileText, Plus, Trash2, Search, Eye, Users, Globe, Lock, DollarSign, ChevronLeft } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { classStats, classes } from '../../lib/mock-data';
import dayjs from 'dayjs';
import { mockDevoirs, Devoir } from './GestionDevoirsPage';
import { useAvailableResources, AvailableResource } from '../../hooks/useAvailableResources';

const DRAFT_STORAGE_KEY = 'create-devoir-draft';

// Domaines disponibles avec leurs matières
const DOMAINS_WITH_SUBJECTS = {
  'Langues et Communication': ['Français', 'Anglais'],
  'STEM': ['Mathématiques', 'Sciences'],
  'Sciences Humaines': ['Histoire', 'Géographie', 'Études islamiques', 'Quran', 'Vivre ensemble'],
  'Créativité & Sport': ['Arts plastiques', 'EPS']
};

// Compétences par domaine
const COMPETENCES_BY_DOMAIN = {
  'Langues et Communication': [
    'Expression Orale',
    'Vocabulaire',
    'Grammaire',
    'Conjugaison',
    'Orthographe',
    'Compréhension',
    'Fluidité'
  ],
  'STEM': [
    'Calcul mental',
    'Géométrie',
    'Résolution de problèmes',
    'Mesures',
    'Logique'
  ],
  'Sciences Humaines': [
    'Histoire',
    'Géographie',
    'Études islamiques',
    'Quran',
    'Vivre ensemble'
  ],
  'Créativité & Sport': [
    'Arts plastiques',
    'EPS',
    'Musique',
    'Théâtre'
  ]
};

const CreateDevoirPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { searchResources } = useAvailableResources();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [domain, setDomain] = useState('');
  const [subject, setSubject] = useState('');
  const [competence, setCompetence] = useState('');
  const [dueDate, setDueDate] = useState(dayjs().add(1, 'week').format('YYYY-MM-DD'));
  const [points, setPoints] = useState('100');
  const [resources, setResources] = useState<{ name: string; type: string; url?: string }[]>([]);

  // États pour la recherche de ressources
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('');
  const [filteredResources, setFilteredResources] = useState<AvailableResource[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);

  // Sauvegarde/chargement du brouillon
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      setTitle(draft.title || '');
      setDescription(draft.description || '');
      setInstructions(draft.instructions || '');
      setDomain(draft.domain || '');
      setSubject(draft.subject || '');
      setCompetence(draft.competence || '');
      setDueDate(draft.dueDate || dayjs().add(1, 'week').format('YYYY-MM-DD'));
      setPoints(draft.points || '100');
      setResources(draft.resources || []);
    }
  }, []);

  const saveDraft = useCallback(() => {
    const draft = { 
      title, 
      description, 
      instructions, 
      domain, 
      subject, 
      competence, 
      dueDate, 
      points,
      resources 
    };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  }, [title, description, instructions, domain, subject, competence, dueDate, points, resources]);

  useEffect(() => {
    saveDraft();
  }, [saveDraft]);

  // Réinitialiser la matière quand le domaine change
  useEffect(() => {
    setSubject('');
    setCompetence('');
  }, [domain]);

  // Réinitialiser la compétence quand la matière change
  useEffect(() => {
    setCompetence('');
  }, [subject]);

  const [selectedClass, setSelectedClass] = useState(classes[0]?.id || '');

  const handlePublish = () => {
    if (!title || !domain || !subject || !competence) {
      alert(t('error_required_fields', 'Le titre, le domaine, la matière et la compétence sont requis.'));
      return;
    }
    const className = classes.find(c => c.id === selectedClass)?.name || selectedClass;

    const newDevoir: Devoir = {
      id: `devoir-${Date.now()}`,
      title,
      subject,
      className,
      status: 'En cours',
      startDate: dayjs().format('DD MMMM YYYY'),
      endDate: dayjs(dueDate).format('DD MMMM YYYY'),
      submitted: 0,
      notSubmitted: classStats.total,
      files: files.map(file => ({ name: file.name, url: URL.createObjectURL(file) })),
    };

    mockDevoirs.unshift(newDevoir);
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    navigate('/devoirs');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: setFiles });

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles(prev => prev.filter(f => f !== fileToRemove));
  };
  
  const handleRemoveResource = (index: number) => {
    setResources(prev => prev.filter((_, i) => i !== index));
  };

  // Rechercher des ressources disponibles
  const performSearch = useCallback(() => {
    setIsSearching(true);
    try {
      const results = searchResources(searchQuery, selectedSubjectFilter || undefined);
      setFilteredResources(results);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, selectedSubjectFilter, searchResources]);

  // Ajouter une ressource existante
  const addExistingResource = (resource: AvailableResource) => {
    const newResource = {
      name: resource.title,
      type: resource.fileType || 'Document',
      url: resource.imageUrl
    };
    setResources(prev => [...prev, newResource]);
    setShowResourceModal(false);
    setSearchQuery('');
    setSelectedSubjectFilter('');
    setFilteredResources([]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'PRIVATE': return <Lock className="w-4 h-4" />;
      case 'CLASS': return <Users className="w-4 h-4" />;
      case 'SCHOOL': return <Globe className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case 'PRIVATE': return 'Privé';
      case 'CLASS': return 'Classe';
      case 'SCHOOL': return 'École';
      default: return 'Inconnu';
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'PRIVATE': return 'bg-red-100 text-red-700';
      case 'CLASS': return 'bg-blue-100 text-blue-700';
      case 'SCHOOL': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  useEffect(() => {
    if (searchQuery.trim() || selectedSubjectFilter) {
      const timeoutId = setTimeout(performSearch, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setFilteredResources([]);
    }
  }, [searchQuery, selectedSubjectFilter, performSearch]);

  const subjects = [
    'Mathématiques', 'Français', 'Histoire', 'Géographie', 
    'Sciences', 'Anglais', 'Arts plastiques', 'EPS', 'Musique',
    'Vivre dans son milieu', 'Études islamiques', 'Quran'
  ];

  const subjectsForDomain = domain ? DOMAINS_WITH_SUBJECTS[domain as keyof typeof DOMAINS_WITH_SUBJECTS] || [] : [];
  const competencesForDomain = domain ? COMPETENCES_BY_DOMAIN[domain as keyof typeof COMPETENCES_BY_DOMAIN] || [] : [];

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      <div className="w-full">
        <Link to="/devoirs" className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 mb-6 font-medium">
          <ChevronLeft size={20} />
          <span>{t('back_to_assignments', 'Retour aux devoirs')}</span>
        </Link>

        {/* En-tête moderne décoratif */}
        <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm border border-orange-200/50 p-6">
          {/* Motifs décoratifs */}
          <div className="absolute top-0 right-0 w-28 h-28 bg-orange-500/15 rounded-full -translate-y-14 translate-x-14"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-amber-500/15 rounded-full translate-y-10 -translate-x-10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-500/5 rounded-full"></div>
          <div className="relative flex items-center justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">{t('create_assignment', 'Créer un devoir')}</h1>
            <div className="flex items-center gap-2">
              <button onClick={() => { saveDraft(); navigate('/devoirs'); }} className="px-6 py-2 rounded-lg font-semibold text-slate-700 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition">{t('save_and_exit', 'Enregistrer et quitter')}</button>
              <button onClick={handlePublish} className="px-6 py-2 rounded-lg bg-orange-500 text-white font-semibold shadow-sm hover:bg-orange-600 transition">{t('assign', 'Publier')}</button>
          </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Colonne principale */}
            <div className="lg:col-span-3 space-y-6">
              {/* Informations de base */}
              <div className="p-8 bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Book className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Informations générales</h2>
                    <p className="text-sm text-slate-600">Définissez les détails principaux de votre devoir</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Titre */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-3 flex items-center gap-2" htmlFor="title">
                      <Target className="w-4 h-4 text-orange-500" />
                      {t('title', 'Titre du devoir')}
                      <span className="text-red-500">*</span>
                    </label>
                    <input 
                      id="title" 
                      type="text" 
                      placeholder="Ex: Exercices de conjugaison - Présent de l'indicatif" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                      className="w-full text-xl font-semibold p-4 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all duration-200 bg-slate-50 hover:bg-white" 
                    />
                    <p className="text-xs text-slate-500 mt-2">Un titre clair et descriptif aide les élèves à comprendre le contenu du devoir</p>
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-3 flex items-center gap-2" htmlFor="description">
                      <FileText className="w-4 h-4 text-orange-500" />
                      {t('description', 'Description détaillée')}
                    </label>
                    <textarea 
                      id="description" 
                      placeholder="Décrivez le contexte, les objectifs et les attentes de ce devoir. Par exemple : 'Ce devoir vise à renforcer la maîtrise de la conjugaison au présent de l'indicatif. Les élèves devront identifier et conjuguer correctement les verbes dans différents contextes.'" 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      className="w-full p-4 h-32 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none resize-none transition-all duration-200 bg-slate-50 hover:bg-white" 
                    />
                    <p className="text-xs text-slate-500 mt-2">Une description claire aide les élèves et les parents à comprendre les objectifs pédagogiques</p>
                  </div>
                </div>
              </div>

              {/* Ressources nécessaires */}
              <div className="p-8 bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Ressources nécessaires</h2>
                    <p className="text-sm text-slate-600">Ajoutez les ressources que les élèves devront utiliser</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Bouton pour ajouter des ressources existantes */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">Ressources associées</h3>
                    <button 
                      onClick={() => setShowResourceModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter une ressource existante
                    </button>
                  </div>

                  {/* Liste des ressources */}
                  <div className="space-y-2">
                    {resources.map((resource, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-slate-500" />
                          <span className="font-medium text-slate-800">{resource.name}</span>
                          <span className="text-sm text-slate-500 capitalize">({resource.type})</span>
                        </div>
                        <button
                          onClick={() => handleRemoveResource(index)}
                          className="text-slate-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {resources.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                      <p>Aucune ressource ajoutée</p>
                      <p className="text-sm">Cliquez sur "Ajouter une ressource existante" pour commencer</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Colonne latérale */}
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 space-y-4">
                {/* Domaine */}
                <div>
                  <label className="flex items-center gap-3 text-slate-700 font-semibold mb-2" htmlFor="domain">
                    <Target className="text-slate-500" />
                    {t('domain', 'Domaine')}
                  </label>
                  <select 
                    id="domain" 
                    value={domain} 
                    onChange={e => setDomain(e.target.value)} 
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-orange-200"
                  >
                    <option value="" disabled>{t('select_domain', 'Sélectionner un domaine')}</option>
                    {Object.keys(DOMAINS_WITH_SUBJECTS).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Matière */}
                <div>
                  <label className="flex items-center gap-3 text-slate-700 font-semibold mb-2" htmlFor="subject">
                    <Book className="text-slate-500" />
                    {t('subject', 'Matière')}
                  </label>
                  <select 
                    id="subject" 
                    value={subject} 
                    onChange={e => setSubject(e.target.value)} 
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-orange-200"
                    disabled={!domain}
                  >
                    <option value="" disabled>{t('select_subject', 'Sélectionner une matière')}</option>
                    {subjectsForDomain.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Compétence */}
                <div>
                  <label className="flex items-center gap-3 text-slate-700 font-semibold mb-2" htmlFor="competence">
                    <Target className="text-slate-500" />
                    {t('competence', 'Compétence')}
                  </label>
                  <select 
                    id="competence" 
                    value={competence} 
                    onChange={e => setCompetence(e.target.value)} 
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-orange-200"
                    disabled={!domain || !subject}
                  >
                    <option value="" disabled>{t('select_competence', 'Sélectionner une compétence')}</option>
                    {competencesForDomain.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Date limite */}
                <div>
                  <label className="flex items-center gap-3 text-slate-700 font-semibold mb-2" htmlFor="dueDate">
                    <Calendar className="text-slate-500" />
                    {t('due_date', 'Date limite')}
                  </label>
                  <input 
                    id="dueDate" 
                    type="date" 
                    value={dueDate} 
                    onChange={e => setDueDate(e.target.value)} 
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-orange-200" 
                  />
                </div>

                {/* Points */}
                <div>
                  <label className="flex items-center gap-3 text-slate-700 font-semibold mb-2" htmlFor="points">
                    <CircleDot className="text-slate-500" />
                    {t('points', 'Points')}
                  </label>
                  <input 
                    id="points" 
                    type="text" 
                    value={points} 
                    onChange={e => setPoints(e.target.value)} 
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-orange-200" 
                  />
                </div>

                {/* Classe */}
                <div>
                  <label className="flex items-center gap-3 text-slate-700 font-semibold mb-2" htmlFor="className">
                    <Book className="text-slate-500" />
                    {t('class', 'Classe')}
                  </label>
                  <select
                    id="className"
                    value={selectedClass}
                    onChange={e => setSelectedClass(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-orange-200"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pièces jointes */}
              <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-semibold text-lg mb-4 text-slate-800">{t('attachments', 'Pièces jointes')}</h3>
                <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${isDragActive ? 'border-orange-500 bg-orange-50' : 'border-slate-300 bg-slate-50'}`}> 
                <input {...getInputProps()} />
                  <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                  <p className="mt-2 text-sm text-slate-600">{t('drag_drop', 'Glissez-déposez ou cliquez pour ajouter des fichiers')}</p>
              </div>
              <aside className="mt-4 space-y-2">
                {files.map((file, i) => (
                    <div key={i} className="flex justify-between items-center bg-slate-100 p-2 rounded-md">
                    <div className="flex items-center gap-2">
                        <FileIcon className="h-5 w-5 text-slate-500" />
                        <span className="text-sm text-slate-800">{file.name}</span>
                    </div>
                      <button onClick={() => handleRemoveFile(file)} className="text-slate-500 hover:text-red-600"><X size={16} /></button>
                  </div>
                ))}
              </aside>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Modal de sélection de ressources */}
      {showResourceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Sélectionner des ressources</h2>
                <button 
                  onClick={() => setShowResourceModal(false)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Barre de recherche */}
              <div className="space-y-3 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher par titre ou description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={selectedSubjectFilter}
                  onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Toutes les matières</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
              </select>
              </div>

              {/* Résultats de recherche */}
              <div className="space-y-3">
                {isSearching ? (
                  <div className="text-center py-8">
                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-500 mt-2">Recherche en cours...</p>
                  </div>
                ) : filteredResources.length > 0 ? (
                  filteredResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition cursor-pointer"
                      onClick={() => addExistingResource(resource)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <img
                            src={resource.imageUrl}
                            alt={resource.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-slate-900">{resource.title}</h3>
                              {resource.isPaid && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                  <DollarSign className="w-3 h-3" />
                                  Payant
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{resource.description}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {resource.subject}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${getVisibilityColor(resource.visibility || 'CLASS')}`}>
                                {getVisibilityIcon(resource.visibility || 'CLASS')}
                                {getVisibilityLabel(resource.visibility || 'CLASS')}
                              </span>
                              {resource.fileSize && (
                                <span className="text-xs text-slate-500">
                                  {formatFileSize(resource.fileSize)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : searchQuery ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500">Aucune ressource trouvée</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500">Tapez votre recherche pour commencer</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-200">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowResourceModal(false)}
                  className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateDevoirPage; 
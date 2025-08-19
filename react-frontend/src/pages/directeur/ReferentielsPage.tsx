import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, GraduationCap, BookOpen, Award } from 'lucide-react';

const ReferentielsPage = () => {
  const { t } = useTranslation();
  const [selectedCycle, setSelectedCycle] = useState('primaire');
  const [selectedType, setSelectedType] = useState('competences');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Données mockées pour les cycles
  const cycles = [
    { id: 'prescolaire', label: t('preschool', 'Préscolaire') },
    { id: 'primaire', label: t('primary', 'Primaire') },
    { id: 'college', label: t('middle_school', 'Collège') },
    { id: 'lycee', label: t('high_school', 'Lycée') },
    { id: 'universite', label: t('university', 'Université') }
  ];

  // Types de référentiels
  const referentielTypes = [
    { id: 'competences', label: t('competences', 'Compétences'), icon: <Award className="w-5 h-5" /> },
    { id: 'matieres', label: t('subjects', 'Matières'), icon: <BookOpen className="w-5 h-5" /> },
    { id: 'ue', label: t('units', 'UE/Domaines'), icon: <GraduationCap className="w-5 h-5" /> }
  ];

  // Données mockées pour les référentiels
  const referentielsData = {
    primaire: {
      competences: [
        { id: 1, nom: 'Lire et comprendre', code: 'LIT-001', description: 'Capacité à lire et comprendre des textes simples' },
        { id: 2, nom: 'Calculer', code: 'CAL-001', description: 'Maîtriser les opérations de base' },
        { id: 3, nom: 'Écrire', code: 'ECR-001', description: 'Produire des textes courts et cohérents' }
      ],
      matieres: [
        { id: 1, nom: 'Français', code: 'FR', description: 'Langue française' },
        { id: 2, nom: 'Mathématiques', code: 'MATH', description: 'Mathématiques' },
        { id: 3, nom: 'Histoire-Géographie', code: 'HG', description: 'Histoire et géographie' }
      ],
      ue: [
        { id: 1, nom: 'Langues', code: 'LANG', description: 'Unité d\'enseignement des langues' },
        { id: 2, nom: 'Sciences', code: 'SCI', description: 'Unité d\'enseignement scientifique' }
      ]
    },
    college: {
      competences: [
        { id: 1, nom: 'Analyser un document', code: 'ANA-001', description: 'Analyser et interpréter des documents' },
        { id: 2, nom: 'Raisonner', code: 'RAI-001', description: 'Développer un raisonnement logique' }
      ],
      matieres: [
        { id: 1, nom: 'Français', code: 'FR', description: 'Langue française' },
        { id: 2, nom: 'Mathématiques', code: 'MATH', description: 'Mathématiques' },
        { id: 3, nom: 'SVT', code: 'SVT', description: 'Sciences de la vie et de la terre' }
      ],
      ue: [
        { id: 1, nom: 'Humanités', code: 'HUM', description: 'Unité d\'enseignement humaniste' },
        { id: 2, nom: 'Sciences et technologie', code: 'ST', description: 'Unité d\'enseignement scientifique' }
      ]
    }
  };

  const currentData = referentielsData[selectedCycle as keyof typeof referentielsData]?.[selectedType as keyof typeof referentielsData] || [];

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm(t('confirm_delete', 'Êtes-vous sûr de vouloir supprimer cet élément ?'))) {
      console.log(`Supprimer l'élément ${id}`);
    }
  };

  const handleSave = (formData: any) => {
    if (editingItem) {
      console.log('Modifier:', formData);
    } else {
      console.log('Ajouter:', formData);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('referentiels', 'Référentiels')}
        </h1>
        <p className="text-gray-600">
          {t('referentiels_description', 'Gérez les référentiels pédagogiques de votre établissement')}
        </p>
      </div>

      {/* Sélecteurs */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sélecteur de cycle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('cycle', 'Cycle')}
            </label>
            <select
              value={selectedCycle}
              onChange={(e) => setSelectedCycle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {cycles.map((cycle) => (
                <option key={cycle.id} value={cycle.id}>
                  {cycle.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sélecteur de type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('type', 'Type de référentiel')}
            </label>
            <div className="flex space-x-2">
              {referentielTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    selectedType === type.id
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {type.icon}
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="bg-white border border-gray-200 rounded-lg">
        {/* Header de la liste */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {referentielTypes.find(t => t.id === selectedType)?.label} - {cycles.find(c => c.id === selectedCycle)?.label}
            </h2>
            <p className="text-sm text-gray-600">
              {currentData.length} {t('elements', 'éléments')}
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t('add', 'Ajouter')}</span>
          </button>
        </div>

        {/* Liste des éléments */}
        <div className="p-6">
          {currentData.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {t('no_elements', 'Aucun élément trouvé pour ce cycle et ce type')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentData.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{item.nom}</h3>
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium">
                          {item.code}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-500 hover:text-blue-700 p-2"
                        title={t('edit', 'Modifier')}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700 p-2"
                        title={t('delete', 'Supprimer')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal d'ajout/modification */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingItem ? t('edit_element', 'Modifier l\'élément') : t('add_element', 'Ajouter un élément')}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSave({
                nom: formData.get('nom'),
                code: formData.get('code'),
                description: formData.get('description')
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('name', 'Nom')} *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    defaultValue={editingItem?.nom || ''}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('code', 'Code')} *
                  </label>
                  <input
                    type="text"
                    name="code"
                    defaultValue={editingItem?.code || ''}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('description', 'Description')}
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingItem?.description || ''}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {t('cancel', 'Annuler')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {editingItem ? t('save', 'Enregistrer') : t('add', 'Ajouter')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferentielsPage;

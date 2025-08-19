import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, GraduationCap } from 'lucide-react';
import { useSettings } from '../../../contexts/SettingsContext';

// Type pour les cycles
interface Cycle {
  id: string;
  nom: string;
  description?: string;
  niveau?: string;
  duree?: number;
  actif: boolean;
  classes: string[];
  matieres: string[];
}

const CycleManagement: React.FC = () => {
  const { t } = useTranslation();
  const { 
    cycles, 
    addCycle, 
    updateCycle, 
    deleteCycle, 
    toggleCycle,
    getActiveCycles 
  } = useSettings();
  
  const [showForm, setShowForm] = useState(false);
  const [editingCycle, setEditingCycle] = useState<Cycle | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    niveau: '',
    duree: 1,
    actif: true
  });

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCycle) {
      updateCycle(editingCycle.id, formData);
      setEditingCycle(null);
    } else {
      addCycle({
        ...formData,
        classes: [],
        matieres: []
      });
    }
    
    setShowForm(false);
    setFormData({
      nom: '',
      description: '',
      niveau: '',
      duree: 1,
      actif: true
    });
  };

  const handleEdit = (cycle: Cycle) => {
    setEditingCycle(cycle);
    setFormData({
      nom: cycle.nom,
      description: cycle.description || '',
      niveau: cycle.niveau || '',
      duree: cycle.duree || 1,
      actif: cycle.actif
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('confirm_delete_cycle'))) {
      deleteCycle(id);
    }
  };

  const handleToggle = (id: string) => {
    toggleCycle(id);
  };

  const levels = [
    { value: 'prescolaire', label: t('preschool') },
    { value: 'primaire', label: t('primary') },
    { value: 'college', label: t('middle_school') },
    { value: 'lycee', label: t('high_school') },
    { value: 'universite', label: t('university') }
  ];

  const activeCycles = getActiveCycles();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <GraduationCap className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">
            {t('cycle_management')}
          </h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('add_cycle')}
        </button>
      </div>

      {/* Active Cycles Summary */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          {t('active_cycles')} ({activeCycles.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {activeCycles.map(cycle => (
            <span key={cycle.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
              {cycle.nom}
            </span>
          ))}
        </div>
      </div>

      {/* Cycle Form */}
      {showForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingCycle ? t('edit_cycle') : t('add_cycle')}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('cycle_name')} *
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('level')} *
                </label>
                <select
                  value={formData.niveau}
                  onChange={(e) => handleInputChange('niveau', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">{t('select_level')}</option>
                  {levels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('duration')} (années) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={formData.duree}
                  onChange={(e) => handleInputChange('duree', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('status')}
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.actif}
                    onChange={(e) => handleInputChange('actif', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{t('active')}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('description')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {editingCycle ? t('save') : t('add')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingCycle(null);
                  setFormData({
                    nom: '',
                    description: '',
                    niveau: '',
                    duree: 1,
                    actif: true
                  });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cycles List */}
      <div className="space-y-4">
        {cycles.map(cycle => (
          <div key={cycle.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h4 className="text-lg font-medium text-gray-900">{cycle.nom}</h4>
                <span className={`px-2 py-1 text-xs rounded ${
                  cycle.actif 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {cycle.actif ? t('active') : t('inactive')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{cycle.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                 <span>{t('level')}: {cycle.niveau ? t(cycle.niveau) : ''}</span>
                <span>{t('duration')}: {cycle.duree} {t('years')}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleToggle(cycle.id)}
                className={`p-2 rounded-md ${
                  cycle.actif 
                    ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={cycle.actif ? t('deactivate') : t('activate')}
              >
                {cycle.actif ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => handleEdit(cycle)}
                className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                title={t('edit')}
              >
                <Edit className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => handleDelete(cycle.id)}
                className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                title={t('delete')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CycleManagement;

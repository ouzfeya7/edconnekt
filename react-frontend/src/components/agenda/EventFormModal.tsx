import React from 'react';
import { Dialog } from '@headlessui/react';
import { X, Calendar, MapPin, Clock, Users, FileText, Tag } from 'lucide-react';
import { SchoolEvent, getEventCategories, getTargetAudiences } from './agenda_data';
import { useTranslation } from 'react-i18next';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: SchoolEvent;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onAudienceChange: (audience: string) => void;
  onAllDayChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onDelete: () => void;
  errors: { title?: string };
  eventCategories: ReturnType<typeof getEventCategories>;
  targetAudiences: ReturnType<typeof getTargetAudiences>;
  isEditMode: boolean;
}

const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  event,
  onInputChange,
  onAudienceChange,
  onAllDayChange,
  onSave,
  onDelete,
  errors,
  eventCategories,
  targetAudiences,
  isEditMode
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Panel className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto z-10 max-h-[90vh] overflow-y-auto">
          {/* En-tête */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar size={20} className="text-orange-600" />
              </div>
              <Dialog.Title className="text-2xl font-bold text-gray-900">
                {isEditMode ? t('edit_event', "Modifier l'événement") : t('add_event', "Nouvel événement")}
              </Dialog.Title>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Contenu */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Titre */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText size={16} />
                  {t('title', 'Titre')} *
                </label>
                <input 
                  type="text" 
                  name="title" 
                  value={event.title || ''} 
                  onChange={onInputChange} 
                  className={`w-full border rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder={t('event_title_placeholder', 'Entrez le titre de l\'événement')}
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Catégorie et Lieu */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Tag size={16} />
                    {t('category', 'Catégorie')}
                  </label>
                  <select 
                    name="category" 
                    value={event.category} 
                    onChange={onInputChange} 
                    className="w-full border border-gray-300 rounded-xl p-3 bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  >
                    {Object.entries(eventCategories).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={16} />
                    {t('location', 'Lieu')}
                  </label>
                  <input 
                    type="text" 
                    name="location" 
                    value={event.location || ''} 
                    onChange={onInputChange} 
                    className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder={t('location_placeholder', 'Salle de classe, gymnase...')}
                  />
                </div>
              </div>

              {/* Dates et heures */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Clock size={16} />
                  {t('date_time', 'Date et heure')}
                </label>
                
                <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                  {/* Checkbox journée entière */}
                  <div className="flex items-center gap-3">
                    <input 
                      id="allDay" 
                      type="checkbox" 
                      name="allDay" 
                      checked={event.allDay} 
                      onChange={onAllDayChange} 
                      className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="allDay" className="text-sm font-medium text-gray-700">
                      {t('all_day', 'Journée entière')}
                    </label>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-2 block">
                        {t('start', 'Début')}
                      </label>
                      <input 
                        type={event.allDay ? 'date' : 'datetime-local'} 
                        name="start" 
                        value={event.start?.slice(0, event.allDay ? 10 : 16)} 
                        onChange={onInputChange} 
                        className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-2 block">
                        {t('end', 'Fin')}
                      </label>
                      <input 
                        type={event.allDay ? 'date' : 'datetime-local'} 
                        name="end" 
                        value={event.end?.slice(0, event.allDay ? 10 : 16)} 
                        onChange={onInputChange} 
                        className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText size={16} />
                  {t('description', 'Description')}
                </label>
                <textarea 
                  name="description" 
                  value={event.description || ''} 
                  onChange={onInputChange} 
                  rows={4} 
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                  placeholder={t('description_placeholder', 'Décrivez votre événement...')}
                />
              </div>

              {/* Public cible */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Users size={16} />
                  {t('target_audience', 'Public cible')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {targetAudiences.map(audience => (
                    <button 
                      key={audience} 
                      type="button"
                      onClick={() => onAudienceChange(audience)} 
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        event.targetAudience.includes(audience) 
                          ? 'bg-orange-500 text-white shadow-md hover:bg-orange-600' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                      }`}
                    >
                      {audience}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <div>
              {isEditMode && (
                <button 
                  onClick={onDelete} 
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg transition-colors"
                >
                  {t('delete', 'Supprimer')}
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={onClose} 
                className="px-6 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-full border border-gray-300 transition-colors"
              >
                {t('cancel', 'Annuler')}
              </button>
              <button 
                onClick={onSave} 
                className="px-6 py-2 bg-white border border-gray-300 hover:shadow-md text-gray-700 font-medium rounded-full transition-all duration-200 hover:bg-gray-50"
              >
                {t('save', 'Enregistrer')}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EventFormModal; 
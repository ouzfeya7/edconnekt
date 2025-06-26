import React from 'react';
import { Dialog } from '@headlessui/react';
import { SchoolEvent, getEventCategories, getTargetAudiences } from './agenda_data';
import { useTranslation } from 'react-i18next';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  currentEvent: SchoolEvent;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onAudienceChange: (audience: string) => void;
  onAllDayChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onDelete: () => void;
  errors: { title?: string };
}

const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  isEditMode,
  currentEvent,
  onInputChange,
  onAudienceChange,
  onAllDayChange,
  onSave,
  onDelete,
  errors
}) => {
  const { t } = useTranslation();
  const eventCategories = getEventCategories(t);
  const targetAudiences = getTargetAudiences(t);

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black/30" />
        <Dialog.Panel className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl mx-auto z-10">
          <Dialog.Title className="text-2xl font-bold text-gray-800 mb-5">
            {isEditMode ? t('edit_event', "Modifier l'événement") : t('add_event', "Ajouter un événement")}
          </Dialog.Title>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">{t('title')}</label>
              <input type="text" name="title" value={currentEvent.title || ''} onChange={onInputChange} className="mt-1 w-full border border-gray-300 rounded-lg p-2" />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">{t('category', 'Catégorie')}</label>
              <select name="category" value={currentEvent.category} onChange={onInputChange} className="mt-1 w-full border border-gray-300 rounded-lg p-2 bg-white">
                {Object.entries(eventCategories).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">{t('location', 'Lieu')}</label>
              <input type="text" name="location" value={currentEvent.location || ''} onChange={onInputChange} className="mt-1 w-full border border-gray-300 rounded-lg p-2" />
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-x-6 items-end">
              <div>
                <label className="text-sm font-medium text-gray-700">{t('start', 'Début')}</label>
                <input type={currentEvent.allDay ? 'date' : 'datetime-local'} name="start" value={currentEvent.start?.slice(0, currentEvent.allDay ? 10 : 16)} onChange={onInputChange} className="mt-1 w-full border border-gray-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">{t('end', 'Fin')}</label>
                <input type={currentEvent.allDay ? 'date' : 'datetime-local'} name="end" value={currentEvent.end?.slice(0, currentEvent.allDay ? 10 : 16)} onChange={onInputChange} className="mt-1 w-full border border-gray-300 rounded-lg p-2" />
              </div>
              <div className="flex items-center gap-3 h-10">
                <input id="allDay" type="checkbox" name="allDay" checked={currentEvent.allDay} onChange={onAllDayChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="allDay" className="text-sm font-medium text-gray-700">{t('all_day', 'Toute la journée')}</label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">{t('description', 'Description')}</label>
              <textarea name="description" value={currentEvent.description || ''} onChange={onInputChange} rows={3} className="mt-1 w-full border border-gray-300 rounded-lg p-2"></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">{t('target_audience', 'Public Cible')}</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {targetAudiences.map(audience => (
                  <button key={audience} onClick={() => onAudienceChange(audience)} className={`px-3 py-1 rounded-full text-sm font-medium ${currentEvent.targetAudience.includes(audience) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                    {audience}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div>
              {isEditMode && <button onClick={onDelete} className="bg-red-100 text-red-700 hover:bg-red-200 font-semibold px-4 py-2 rounded-lg">{t('delete', 'Supprimer')}</button>}
            </div>
            <div className="flex gap-4">
              <button onClick={onClose} className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg">{t('cancel', 'Annuler')}</button>
              <button onClick={onSave} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg">{t('save', 'Sauvegarder')}</button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EventFormModal; 
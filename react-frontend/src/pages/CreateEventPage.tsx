import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, Users, FileText, Tag, Save, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SchoolEvent, defaultEventState, getEventCategories, getTargetAudiences } from '../components/agenda/agenda_data';
import { useEvents } from '../contexts/EventContext';

const CreateEventPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { eventId } = useParams();
  const location = useLocation();
  const { events, setEvents } = useEvents();
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<SchoolEvent>(() => defaultEventState(t));
  const [errors, setErrors] = useState<{ title?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const eventCategories = getEventCategories(t);
  const targetAudiences = getTargetAudiences(t);

  // Initialiser les données si on est en mode édition
  useEffect(() => {
    if (eventId && events.length > 0) {
      const existingEvent = events.find(event => event.id === eventId);
      if (existingEvent) {
        setIsEditMode(true);
        setCurrentEvent({
          ...existingEvent,
          start: existingEvent.start ? new Date(existingEvent.start as string).toISOString().slice(0, 16) : defaultEventState(t).start,
          end: existingEvent.end ? new Date(existingEvent.end as string).toISOString().slice(0, 16) : defaultEventState(t).end,
          targetAudience: existingEvent.targetAudience || [],
        });
      }
    } else if (location.state?.date) {
      // Si on arrive avec une date pré-sélectionnée
      const dateStr = location.state.date;
      setCurrentEvent({
        ...defaultEventState(t),
        start: dateStr + 'T09:00',
        end: dateStr + 'T10:00'
      });
    }
  }, [eventId, events, location.state, t]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentEvent(prev => ({ ...prev, [name]: value }));
    // Effacer l'erreur si l'utilisateur commence à taper
    if (name === 'title' && errors.title) {
      setErrors(prev => ({ ...prev, title: undefined }));
    }
  };

  const handleAudienceChange = (audience: string) => {
    setCurrentEvent(prev => {
      const newAudience = prev.targetAudience.includes(audience)
        ? prev.targetAudience.filter(a => a !== audience)
        : [...prev.targetAudience, audience];
      return { ...prev, targetAudience: newAudience };
    });
  };
  
  const handleAllDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentEvent(prev => ({ ...prev, allDay: e.target.checked }));
  };

  const validateForm = () => {
    const newErrors: { title?: string } = {};
    if (!(currentEvent.title || '').trim()) {
      newErrors.title = t('title_is_required', "Le titre est obligatoire.");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const eventToSave: SchoolEvent = {
        ...currentEvent,
        className: eventCategories[currentEvent.category].className,
      };
      
      if (isEditMode) {
        setEvents(events.map(event => event.id === eventToSave.id ? eventToSave : event));
      } else {
        setEvents([...events, { ...eventToSave, id: new Date().getTime().toString() }]);
      }
      
      // Rediriger vers l'agenda après sauvegarde
      navigate('/agenda', { 
        state: { 
          message: isEditMode 
            ? t('event_updated_success', 'Événement modifié avec succès') 
            : t('event_created_success', 'Événement créé avec succès')
        }
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditMode || !currentEvent.id) return;
    
    if (window.confirm(t('confirm_delete_event', 'Êtes-vous sûr de vouloir supprimer cet événement ?'))) {
      setIsLoading(true);
      try {
        setEvents(events.filter(event => event.id !== currentEvent.id));
        navigate('/agenda', { 
          state: { 
            message: t('event_deleted_success', 'Événement supprimé avec succès')
          }
        });
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getCategoryIcon = (category: keyof typeof eventCategories) => {
    switch (category) {
      case 'reunion': return <Users size={16} />;
      case 'activite': return <Calendar size={16} />;
      case 'sportif': return <Clock size={16} />;
      default: return <Tag size={16} />;
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/agenda')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar size={20} className="text-orange-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditMode ? t('edit_event', 'Modifier l\'événement') : t('create_event', 'Créer un événement')}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isEditMode && (
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  {t('delete', 'Supprimer')}
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={16} />
                {isLoading ? t('saving', 'Enregistrement...') : t('save', 'Enregistrer')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="space-y-8">
              {/* Titre */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <FileText size={16} />
                  {t('title', 'Titre')} *
                </label>
                <input 
                  type="text" 
                  name="title" 
                  value={currentEvent.title || ''} 
                  onChange={handleInputChange} 
                  className={`w-full border rounded-xl p-4 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-lg ${
                    errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder={t('event_title_placeholder', 'Entrez le titre de l\'événement')}
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Catégorie et Lieu */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Tag size={16} />
                    {t('category', 'Catégorie')}
                  </label>
                  <div className="relative">
                    <select 
                      name="category" 
                      value={currentEvent.category} 
                      onChange={handleInputChange} 
                      className="w-full border border-gray-300 rounded-xl p-4 bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none"
                    >
                      {Object.entries(eventCategories).map(([key, { label }]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      {getCategoryIcon(currentEvent.category)}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <MapPin size={16} />
                    {t('location', 'Lieu')}
                  </label>
                  <input 
                    type="text" 
                    name="location" 
                    value={currentEvent.location || ''} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-xl p-4 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder={t('location_placeholder', 'Salle de classe, gymnase...')}
                  />
                </div>
              </div>

              {/* Dates et heures */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
                  <Clock size={16} />
                  {t('date_time', 'Date et heure')}
                </label>
                
                <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                  {/* Checkbox journée entière */}
                  <div className="flex items-center gap-3">
                    <input 
                      id="allDay" 
                      type="checkbox" 
                      name="allDay" 
                      checked={currentEvent.allDay} 
                      onChange={handleAllDayChange} 
                      className="h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="allDay" className="text-sm font-medium text-gray-700">
                      {t('all_day', 'Journée entière')}
                    </label>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-3 block">
                        {t('start', 'Début')}
                      </label>
                      <input 
                        type={currentEvent.allDay ? 'date' : 'datetime-local'} 
                        name="start" 
                        value={currentEvent.start?.slice(0, currentEvent.allDay ? 10 : 16)} 
                        onChange={handleInputChange} 
                        className="w-full border border-gray-300 rounded-lg p-4 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-3 block">
                        {t('end', 'Fin')}
                      </label>
                      <input 
                        type={currentEvent.allDay ? 'date' : 'datetime-local'} 
                        name="end" 
                        value={currentEvent.end?.slice(0, currentEvent.allDay ? 10 : 16)} 
                        onChange={handleInputChange} 
                        className="w-full border border-gray-300 rounded-lg p-4 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <FileText size={16} />
                  {t('description', 'Description')}
                </label>
                <textarea 
                  name="description" 
                  value={currentEvent.description || ''} 
                  onChange={handleInputChange} 
                  rows={6} 
                  className="w-full border border-gray-300 rounded-xl p-4 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                  placeholder={t('description_placeholder', 'Décrivez votre événement...')}
                />
              </div>

              {/* Public cible */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
                  <Users size={16} />
                  {t('target_audience', 'Public cible')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {targetAudiences.map(audience => (
                    <button 
                      key={audience} 
                      type="button"
                      onClick={() => handleAudienceChange(audience)} 
                      className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
                        currentEvent.targetAudience.includes(audience) 
                          ? 'bg-orange-500 text-white border-orange-500 shadow-md' 
                          : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {audience}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage; 
import React from 'react';
import { Dialog } from '@headlessui/react';
import { Calendar, MapPin, Users, Clock, FileText, X, Tag, Edit, BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SchoolEvent, getEventCategories } from './agenda_data';
import { useTranslation } from 'react-i18next';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: SchoolEvent | null;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ isOpen, onClose, event }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  if (!event) return null;
  
  const eventCategories = getEventCategories(t);
  const locale = i18n.language;

  const handleEditEvent = () => {
    navigate(`/agenda/edit/${event.id}`);
    onClose();
  };

  const handleViewRemediationDetails = () => {
    // Naviguer vers la page de détails de remédiation
    // On peut utiliser l'ID de l'événement ou chercher la session correspondante
    navigate(`/remediation/${event.id}`);
    onClose();
  };

  const getCategoryIcon = (category: keyof typeof eventCategories) => {
    switch (category) {
      case 'reunion': return <Users size={16} className="text-blue-600" />;
      case 'activite': return <Calendar size={16} className="text-purple-600" />;
      case 'sportif': return <Clock size={16} className="text-green-600" />;
      case 'remediation': return <BookOpen size={16} className="text-rose-600" />;
      default: return <Tag size={16} className="text-gray-600" />;
    }
  };

  const getCategoryColor = (category: keyof typeof eventCategories) => {
    switch (category) {
      case 'reunion': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'activite': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'sportif': return 'bg-green-100 text-green-800 border-green-200';
      case 'remediation': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Panel className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto z-10 max-h-[90vh] overflow-y-auto">
          {/* En-tête avec dégradé remplacé par un fond plus doux */}
          <div className="bg-gray-100 p-6 rounded-t-2xl">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Dialog.Title className="text-2xl font-bold text-gray-900 mb-3">
                  {event.title}
                </Dialog.Title>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full border ${getCategoryColor(event.category)}`}>
                    {getCategoryIcon(event.category)}
                    {eventCategories[event.category].label}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-6 space-y-6">
            {/* Description */}
            {event.description && (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={18} className="text-gray-600" />
                  <h3 className="font-semibold text-gray-900">{t('description', 'Description')}</h3>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}

            {/* Informations principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date et heure */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar size={18} className="text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{t('date_and_time', 'Date et heure')}</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="font-medium">
                    {new Date(event.start as string).toLocaleDateString(locale, { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-500" />
                    <span>
                      {event.allDay
                        ? t('all_day', 'Journée entière')
                        : `${new Date(event.start as string).toLocaleTimeString(locale, { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} - ${new Date(event.end as string).toLocaleTimeString(locale, { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}`
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Lieu */}
              {event.location && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MapPin size={18} className="text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{t('location', 'Lieu')}</h3>
                  </div>
                  <p className="text-gray-700 font-medium">{event.location}</p>
                </div>
              )}
            </div>

            {/* Public cible */}
            {event.targetAudience && event.targetAudience.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users size={18} className="text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{t('target_audience', 'Public cible')}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.targetAudience.map(audience => (
                    <span 
                      key={audience} 
                      className="px-3 py-1.5 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200"
                    >
                      {audience}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Section spéciale pour les remédiations */}
            {event.category === 'remediation' && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-rose-100 rounded-lg">
                    <BookOpen size={18} className="text-rose-600" />
                  </div>
                  <h3 className="font-semibold text-rose-800">Session de remédiation</h3>
                </div>
                <p className="text-rose-700 text-sm mb-4">
                  Cette session de remédiation est conçue pour aider les élèves en difficulté. 
                  Consultez les détails complets pour voir les méthodes utilisées, les ressources disponibles 
                  et le suivi des progrès.
                </p>
                <button
                  onClick={handleViewRemediationDetails}
                  className="w-full px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <BookOpen size={16} />
                  Voir les détails de la remédiation
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <div className="flex justify-between">
              <button 
                onClick={handleEditEvent}
                className="px-6 py-2 bg-white border border-gray-300 hover:shadow-md text-gray-700 font-medium rounded-full transition-all duration-200 hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit size={16} />
                {t('edit', 'Modifier')}
              </button>
              <button 
                onClick={onClose} 
                className="px-6 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-full border border-gray-300 transition-colors"
              >
                {t('close', 'Fermer')}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EventDetailsModal; 
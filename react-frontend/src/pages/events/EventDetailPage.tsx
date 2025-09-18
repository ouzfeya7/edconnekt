import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useEvent } from '../../hooks/useEvents';
import { useEventParticipants } from '../../hooks/useEventParticipants';
import { useRegisterToEvent, useCancelRegistration } from '../../hooks/useEventMutations';
import { eventApiBaseUrl } from '../../api/event-service/client';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers, FaDownload, FaArrowLeft, FaEdit, FaUserPlus, FaTimes } from 'react-icons/fa';

const EventDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const { data: event, isLoading, error } = useEvent(eventId);
  const { data: participants, isLoading: participantsLoading } = useEventParticipants(eventId);
  const registerToEvent = useRegisterToEvent(eventId);
  const cancelRegistration = useCancelRegistration(eventId);
  const [isQuickRegisterOpen, setIsQuickRegisterOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center py-12">
            <div className="text-red-600 text-lg font-medium">{t('not_found', 'Événement introuvable')}</div>
            <button 
              onClick={() => navigate(-1)} 
              className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {t('back', 'Retour')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusBadgeClass = event.status === 'PUBLISHED'
    ? 'bg-green-100 text-green-800 border-green-200'
    : event.status === 'DRAFT'
      ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
      : event.status === 'ARCHIVED'
        ? 'bg-gray-100 text-gray-800 border-gray-200'
        : 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 pb-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <button 
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={t('back', 'Retour')}
                >
                  <FaArrowLeft className="w-4 h-4 text-gray-600" />
                </button>
                <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusBadgeClass}`}>
                  {event.status ?? '—'}
                </span>
                {event.category && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                    {event.category}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center gap-2">
                <FaEdit className="w-4 h-4" />
                {t('edit', 'Modifier')}
              </button>
              <button
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                onClick={() => setIsQuickRegisterOpen(true)}
              >
                <FaUserPlus className="w-4 h-4" />
                {t('register', 'Inscrire')}
              </button>
              <a
                href={`${eventApiBaseUrl}api/v1/events/${event.id}/export?format=pdf`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <FaDownload className="w-4 h-4" />
                PDF
              </a>
              <a
                href={`${eventApiBaseUrl}api/v1/events/${event.id}/export?format=csv`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <FaDownload className="w-4 h-4" />
                CSV
              </a>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('event_details', 'Détails de l\'événement')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FaClock className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">{t('start', 'Début')}</div>
                      <div className="font-medium text-gray-900">
                        {event.start_time ? new Date(event.start_time).toLocaleString() : '—'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaClock className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">{t('end', 'Fin')}</div>
                      <div className="font-medium text-gray-900">
                        {event.end_time ? new Date(event.end_time).toLocaleString() : '—'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">{t('location', 'Lieu')}</div>
                      <div className="font-medium text-gray-900">{event.location ?? '—'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaUsers className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">{t('capacity', 'Capacité')}</div>
                      <div className="font-medium text-gray-900">{event.capacity ?? '—'}</div>
                    </div>
                  </div>
                </div>
              </div>
              {event.description && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-500 mb-2">{t('description', 'Description')}</div>
                  <div className="text-gray-900 whitespace-pre-wrap">{event.description}</div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="text-center">
                <FaCalendarAlt className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                <div className="text-sm text-gray-500 mb-1">ID de l'événement</div>
                <div className="font-mono text-sm text-gray-900 bg-gray-50 px-2 py-1 rounded">{event.id}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Participants Section */}
        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FaUsers className="w-5 h-5 text-gray-400" />
              {t('participants', 'Participants')}
            </h2>
            <div className="text-sm text-gray-500">
              {Array.isArray(participants) ? participants.length : 0} participant(s)
            </div>
          </div>

          {participantsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <div className="text-sm text-gray-500 mt-2">{t('loading', 'Chargement...')}</div>
            </div>
          ) : Array.isArray(participants) && participants.length > 0 ? (
            <div className="space-y-3 mb-6">
              {participants.map((p, idx) => {
                const anyP = p as any;
                const regId = anyP?.registration_id || anyP?.id || '';
                return (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaUsers className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{anyP?.participant_id || '—'}</div>
                        <div className="text-sm text-gray-500">
                          {anyP?.participant_role || anyP?.role || '—'} • {anyP?.status || '—'}
                        </div>
                      </div>
                    </div>
                    {regId && (
                      <button
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        onClick={async () => {
                          try {
                            await cancelRegistration.mutateAsync({ registrationId: String(regId) });
                            toast.success(t('registration_canceled', 'Inscription annulée'));
                          } catch (errUnknown) {
                            const err = errUnknown as { message?: string };
                            toast.error(typeof err?.message === 'string' ? err.message : 'Erreur annulation');
                          }
                        }}
                      >
                        {t('cancel', 'Annuler')}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FaUsers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <div>{t('no_participants', 'Aucun participant')}</div>
            </div>
          )}

          {/* Quick register now available via header button */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500">{t('use_quick_register', "Utilisez le bouton 'Inscrire' en haut de la page pour ajouter un participant.")}</p>
          </div>
        </div>
      </div>

      {/* Quick Register Modal */}
      {isQuickRegisterOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[70vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FaUsers className="text-purple-600" />
                {t('quick_register', 'Inscription rapide')}
              </h3>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsQuickRegisterOpen(false)}
              >
                <FaTimes className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget as HTMLFormElement);
                const participant_id = String(fd.get('participant_id') || '').trim() || undefined;
                const participant_role = String(fd.get('participant_role') || '').trim() || undefined;
                if (!participant_role) {
                  toast.error(t('fill_required_fields', 'Veuillez remplir les champs obligatoires'));
                  return;
                }
                try {
                  await registerToEvent.mutateAsync({ participant_id, participant_role });
                  toast.success(t('registered', 'Inscription enregistrée'));
                  setIsQuickRegisterOpen(false);
                } catch (errUnknown) {
                  const err = errUnknown as { message?: string };
                  toast.error(typeof err?.message === 'string' ? err.message : 'Erreur inconnue');
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('participant_id', 'ID participant')}</label>
                <input
                  name="participant_id"
                  placeholder={t('participant_id', 'ID participant') as string}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('select_role', 'Sélectionner un rôle')} *</label>
                <select
                  name="participant_role"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">{t('select_role', 'Sélectionner un rôle')} *</option>
                  <option value="ELEVE">ELEVE</option>
                  <option value="PARENT">PARENT</option>
                  <option value="DIRECTEUR">DIRECTEUR</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsQuickRegisterOpen(false)}>
                  {t('cancel', 'Annuler')}
                </button>
                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2" disabled={registerToEvent.isPending}>
                  {registerToEvent.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {t('saving', 'Enregistrement...')}
                    </>
                  ) : (
                    <>
                      <FaUserPlus className="w-4 h-4" />
                      {t('register', 'Inscrire')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;

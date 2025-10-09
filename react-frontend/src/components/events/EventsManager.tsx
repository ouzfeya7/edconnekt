import React from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useDirector } from '../../contexts/DirectorContext';
import { useEvents, useEvent } from '../../hooks/useEvents';
import { useCreateEvent, usePublishEventById, useUpdateEvent, useRegisterToEvent } from '../../hooks/useEventMutations';
import type { EventCreateCategoryEnum } from '../../api/event-service/api';
import { FaPlus, FaFilter, FaCalendarAlt, FaEye, FaEdit, FaCheck, FaSearch, FaTimes, FaUserPlus, FaUsers } from 'react-icons/fa';
import { useModal } from '../../hooks/useModal';

export interface EventsManagerProps {
  etablissementId?: string | null;
  showHeaderTitle?: boolean;
}

const EventsManager: React.FC<EventsManagerProps> = ({ etablissementId: propEtabId, showHeaderTitle = true }) => {
  const { t } = useTranslation();
  const { currentEtablissementId } = useDirector();

  const resolvedEtabId = propEtabId ?? currentEtablissementId ?? null;

  // filtres
  const [eventsCategory, setEventsCategory] = React.useState<string | null>(null);
  const [eventsStartDate, setEventsStartDate] = React.useState<string | null>(null);
  const [eventsEndDate, setEventsEndDate] = React.useState<string | null>(null);

  // data & mutations
  const { data: eventsList } = useEvents({ page: 1, size: 50, category: eventsCategory, startDate: eventsStartDate, endDate: eventsEndDate, etablissementId: resolvedEtabId });
  const createEvent = useCreateEvent();
  const publishEventById = usePublishEventById();

  // create modal
  const [isCreateEventOpen, setIsCreateEventOpen] = React.useState(false);
  
  // Utiliser le hook personnalisé pour gérer le modal de création
  useModal(isCreateEventOpen, () => setIsCreateEventOpen(false));
  // edit modal
  const [isEditEventOpen, setIsEditEventOpen] = React.useState(false);
  
  // Utiliser le hook personnalisé pour gérer le modal d'édition
  useModal(isEditEventOpen, () => setIsEditEventOpen(false));
  const [editingEventId, setEditingEventId] = React.useState<string>('');
  const { data: editingEvent, isLoading: editingLoading } = useEvent(isEditEventOpen ? editingEventId : undefined);
  const updateEvent = useUpdateEvent(isEditEventOpen ? editingEventId : undefined);

  // quick register modal
  const [isQuickRegisterOpen, setIsQuickRegisterOpen] = React.useState(false);
  const [registerEventId, setRegisterEventId] = React.useState<string>('');
  const registerToEventQuick = useRegisterToEvent(isQuickRegisterOpen ? registerEventId : undefined);

  const eventsCount = (() => {
    const asArr = eventsList as unknown[] | undefined;
    if (Array.isArray(asArr)) return asArr.length;
    const asObj = eventsList as { total?: number } | undefined;
    return asObj?.total ?? 0;
  })();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        {showHeaderTitle && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <FaCalendarAlt className="text-blue-600" />
                  {t('events', 'Événements')}
                </h1>
                <p className="text-gray-600 mt-2">{t('events_description', "Administration des événements de l'établissement")}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                  {eventsCount} événement{eventsCount > 1 ? 's' : ''}
                </div>
                <button 
                  onClick={() => setIsCreateEventOpen(true)} 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
                >
                  <FaPlus className="w-4 h-4" />
                  {t('create', 'Créer')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Register Modal */}
        {isQuickRegisterOpen && !!registerEventId && (
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
                    await registerToEventQuick.mutateAsync({ participant_id, participant_role });
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
                  <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2" disabled={registerToEventQuick.isPending}>
                    {registerToEventQuick.isPending ? (
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

        {/* Filtres */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FaFilter className="text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">{t('filters', 'Filtres')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('category', 'Catégorie')}</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={eventsCategory ?? ''}
                onChange={(e) => setEventsCategory(e.target.value || null)}
              >
                <option value="">{t('all_categories', 'Toutes catégories')}</option>
                <option value="Sortie">Sortie</option>
                <option value="Cérémonie">Cérémonie</option>
                <option value="Club">Club</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('start_date', 'Date début')}</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={eventsStartDate ?? ''}
                onChange={(e) => setEventsStartDate(e.target.value || null)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('end_date', 'Date fin')}</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={eventsEndDate ?? ''}
                onChange={(e) => setEventsEndDate(e.target.value || null)}
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                onClick={() => { setEventsCategory(null); setEventsStartDate(null); setEventsEndDate(null); }}
              >
                <FaTimes className="w-4 h-4" />
                {t('reset_filters', 'Réinitialiser')}
              </button>
            </div>
          </div>
        </div>

        {/* Table des événements */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t('title', 'Titre')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t('category', 'Catégorie')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t('start', 'Début')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t('end', 'Fin')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t('status', 'Statut')}</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t('actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Array.isArray((eventsList as { items?: unknown } | undefined)?.items) && (eventsList as { items: unknown[] }).items.length > 0 ? (
                  (eventsList as { items: unknown[] }).items.map((evUnknown) => {
                    const ev = evUnknown as { id: string; title: string; category?: string | null; start_time?: string | null; end_time?: string | null; status?: string | null };
                    const id = ev?.id;
                    
                    const statusBadgeClass = ev.status === 'PUBLISHED'
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : ev.status === 'DRAFT'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        : ev.status === 'ARCHIVED'
                          ? 'bg-gray-100 text-gray-800 border-gray-200'
                          : 'bg-gray-100 text-gray-800 border-gray-200';

                    return (
                      <tr key={ev.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{ev.title}</div>
                        </td>
                        <td className="px-6 py-4">
                          {ev.category ? (
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                              {ev.category}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {ev.start_time ? new Date(ev.start_time).toLocaleString() : '—'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {ev.end_time ? new Date(ev.end_time).toLocaleString() : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusBadgeClass}`}>
                            {ev.status ?? '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              to={id ? `/evenements/${id}` : '#'}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-1 text-sm"
                            >
                              <FaEye className="w-3 h-3" />
                              {t('details', 'Détail')}
                            </Link>
                            <button
                              className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition-colors flex items-center gap-1 text-sm"
                              onClick={() => { if (id) { setEditingEventId(id); setIsEditEventOpen(true); } }}
                            >
                              <FaEdit className="w-3 h-3" />
                              {t('edit', 'Modifier')}
                            </button>
                            <button
                              className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg transition-colors flex items-center gap-1 text-sm"
                              onClick={() => { if (id) { setRegisterEventId(id); setIsQuickRegisterOpen(true); } }}
                            >
                              <FaUserPlus className="w-3 h-3" />
                              {t('register', 'Inscrire')}
                            </button>
                            {ev.status !== 'PUBLISHED' && (
                              <button
                                className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-colors flex items-center gap-1 text-sm"
                                onClick={async () => {
                                  try {
                                    if (!id) throw new Error('eventId manquant');
                                    await publishEventById.mutateAsync(id);
                                    toast.success(t('event_published', 'Événement publié'));
                                  } catch (errUnknown) {
                                    const err = errUnknown as { message?: string };
                                    toast.error(typeof err?.message === 'string' ? err.message : 'Erreur publication');
                                  }
                                }}
                              >
                                <FaCheck className="w-3 h-3" />
                                {t('publish', 'Publier')}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FaCalendarAlt className="w-12 h-12 text-gray-300 mb-4" />
                        <div className="text-lg font-medium mb-2">{t('no_events', 'Aucun événement')}</div>
                        <div className="text-sm">Créez votre premier événement pour commencer</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal création */}
        {isCreateEventOpen && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Overlay séparé */}
            <div 
              className="absolute inset-0 bg-black/40 transition-opacity"
              onClick={() => setIsCreateEventOpen(false)}
              aria-hidden="true"
            />
            
            {/* Modal content */}
            <div className="relative bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-xl z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FaPlus className="text-blue-600" />
                  {t('create_event', 'Créer un événement')}
                </h3>
                <button 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                  onClick={() => setIsCreateEventOpen(false)}
                >
                  <FaTimes className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const fd = new FormData(form);
                const title = String(fd.get('title') || '').trim();
                const category = String(fd.get('category') || '').trim() || 'Autre';
                const start_time = String(fd.get('start_time') || '').trim();
                const end_time = String(fd.get('end_time') || '').trim();
                const description = String(fd.get('description') || '').trim() || undefined;
                const location = String(fd.get('location') || '').trim() || undefined;
                const capacityStr = String(fd.get('capacity') || '').trim();
                const capacity = capacityStr !== '' && !Number.isNaN(Number(capacityStr)) ? Number(capacityStr) : undefined;
                if (!title || !category || !start_time || !end_time) {
                  toast.error(t('fill_required_fields', 'Veuillez remplir les champs obligatoires'));
                  return;
                }

                try {
                  const etablissement_id = resolvedEtabId || '';
                  if (!etablissement_id) {
                    toast.error(t('missing_establishment', "Établissement manquant"));
                    return;
                  }
                  await createEvent.mutateAsync({ title, category: category as EventCreateCategoryEnum, start_time, end_time, description, location, capacity, etablissement_id });
                  toast.success(t('event_created', 'Événement créé'));
                  setIsCreateEventOpen(false);
                  form.reset();
                } catch (errUnknown) {
                  const err = errUnknown as { message?: string };
                  toast.error(typeof err?.message === 'string' ? err.message : 'Erreur inconnue');
                }
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('title', 'Titre')} *</label>
                    <input name="title" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('category', 'Catégorie')} *</label>
                    <select name="category" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="Sortie">Sortie</option>
                      <option value="Cérémonie">Cérémonie</option>
                      <option value="Club">Club</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('start', 'Début')} *</label>
                      <input type="datetime-local" name="start_time" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" step="1" />
                      <p className="text-xs text-gray-500 mt-1">{t('timezone_hint', 'Le fuseau sera normalisé automatiquement (UTC)')}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('end', 'Fin')} *</label>
                      <input type="datetime-local" name="end_time" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" step="1" />
                      <p className="text-xs text-gray-500 mt-1">{t('timezone_hint', 'Le fuseau sera normalisé automatiquement (UTC)')}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('location', 'Lieu')}</label>
                    <input name="location" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('description', 'Description')}</label>
                    <textarea name="description" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('capacity', 'Capacité')}</label>
                    <input name="capacity" type="number" min={0} step={1} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button type="button" className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsCreateEventOpen(false)}>{t('cancel', 'Annuler')}</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2" disabled={createEvent.isPending}>
                    {createEvent.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {t('saving', 'Enregistrement...')}
                      </>
                    ) : (
                      <>
                        <FaPlus className="w-4 h-4" />
                        {t('create', 'Créer')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

        {/* Modal d'édition */}
        {isEditEventOpen && !!editingEventId && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Overlay séparé */}
            <div 
              className="absolute inset-0 bg-black/40 transition-opacity"
              onClick={() => setIsEditEventOpen(false)}
              aria-hidden="true"
            />
            
            {/* Modal content */}
            <div className="relative bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-xl z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FaEdit className="text-yellow-600" />
                  {t('edit_event', "Modifier l'événement")}
                </h3>
                <button 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                  onClick={() => setIsEditEventOpen(false)}
                >
                  <FaTimes className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              {!editingEvent || editingLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <div className="text-sm text-gray-500 mt-2">{t('loading', 'Chargement...')}</div>
                </div>
              ) : (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget as HTMLFormElement);
                  const title = String(fd.get('title') || '').trim() || null;
                  const category = String(fd.get('category') || '').trim() || null;
                  const start_time = String(fd.get('start_time') || '').trim() || null;
                  const end_time = String(fd.get('end_time') || '').trim() || null;
                  const description = String(fd.get('description') || '').trim() || null;
                  const location = String(fd.get('location') || '').trim() || null;
                  const capacityStr = String(fd.get('capacity') || '').trim();
                  const capacity = capacityStr !== '' && !Number.isNaN(Number(capacityStr)) ? Number(capacityStr) : null;
                  const status = String(fd.get('status') || '').trim() || null;
                  try {
                    await updateEvent.mutateAsync({ title, description, category: category as any, start_time, end_time, location, capacity, status: status as any });
                    toast.success(t('event_updated', 'Événement mis à jour'));
                    setIsEditEventOpen(false);
                  } catch (errUnknown) {
                    const err = errUnknown as { message?: string };
                    toast.error(typeof err?.message === 'string' ? err.message : 'Erreur inconnue');
                  }
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('title', 'Titre')} *</label>
                      <input name="title" defaultValue={editingEvent.title} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('category', 'Catégorie')} *</label>
                      <select name="category" defaultValue={editingEvent.category ?? ''} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="Sortie">Sortie</option>
                        <option value="Cérémonie">Cérémonie</option>
                        <option value="Club">Club</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('start', 'Début')} *</label>
                        <input type="datetime-local" name="start_time" defaultValue={editingEvent.start_time ? new Date(editingEvent.start_time).toISOString().slice(0,19) : ''} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" step="1" />
                        <p className="text-xs text-gray-500 mt-1">{t('timezone_hint', 'Le fuseau sera normalisé automatiquement (UTC)')}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('end', 'Fin')} *</label>
                        <input type="datetime-local" name="end_time" defaultValue={editingEvent.end_time ? new Date(editingEvent.end_time).toISOString().slice(0,19) : ''} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" step="1" />
                        <p className="text-xs text-gray-500 mt-1">{t('timezone_hint', 'Le fuseau sera normalisé automatiquement (UTC)')}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('location', 'Lieu')}</label>
                      <input name="location" defaultValue={editingEvent.location ?? ''} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('description', 'Description')}</label>
                      <textarea name="description" defaultValue={editingEvent.description ?? ''} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('capacity', 'Capacité')}</label>
                      <input name="capacity" type="number" min={0} step={1} defaultValue={editingEvent.capacity ?? ''} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('status', 'Statut')}</label>
                      <select name="status" defaultValue={editingEvent.status ?? 'DRAFT'} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="DRAFT">DRAFT</option>
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                    <button type="button" className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsEditEventOpen(false)}>{t('cancel', 'Annuler')}</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2" disabled={updateEvent.isPending}>
                      {updateEvent.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          {t('saving', 'Enregistrement...')}
                        </>
                      ) : (
                        <>
                          <FaEdit className="w-4 h-4" />
                          {t('save', 'Enregistrer')}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
};

export default EventsManager;

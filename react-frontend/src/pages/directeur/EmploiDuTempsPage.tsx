import React, { useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Plus, ChevronLeft, ChevronRight, Download, AlertTriangle, CheckCircle, History, AlertCircle, Link as LinkIcon, Repeat } from 'lucide-react';
import AbsenceValidationPanel from '../../components/directeur/emploi-du-temps/AbsenceValidationPanel';
import { useLessons } from '../../hooks/useLessons';
import { useTimeslots } from '../../hooks/useTimeslots';
import { useCreateReplacement, useReplacements, useDeleteReplacement } from '../../hooks/useReplacements';
import { TIMETABLE_API_BASE_URL } from '../../api/timetable-service/http';
import toast from 'react-hot-toast';
import { useUpdateLesson, useDeleteLesson, useCreateLesson } from '../../hooks/useLessonMutations';
import { useRooms } from '../../hooks/useRooms';
import { useEstablishments } from '../../hooks/useEstablishments';
import { useClasses } from '../../hooks/useClasses';
import { useClasseEnseignants } from '../../hooks/useClasseEnseignants';
import { useDirector } from '../../contexts/DirectorContext';
import { useAuth } from '../authentification/useAuth';
import { useAppRolesFromIdentity } from '../../hooks/useAppRolesFromIdentity';
import { useIcsFeed } from '../../hooks/useIcsFeed';

interface NormalizedCourse {
  id: string | number;
  matiere: string;
  enseignant: string;
  classe: string;
  salle: string;
  jour: string;
  heure: string;
  duree: number;
  couleur: string;
}

interface Conflict {
  type: 'enseignant' | 'salle' | 'classe';
  message: string;
  existingCourse: NormalizedCourse;
  newCourse: NormalizedCourse;
}

const EmploiDuTempsPage = () => {
  const { t } = useTranslation();
  const { currentEtablissementId } = useDirector();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedView, setSelectedView] = useState('global');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [activeTab, setActiveTab] = useState<'calendar' | 'replacements' | 'conflicts' | 'validation' | 'audit' | 'ics'>('calendar');
  const [icsClassId, setIcsClassId] = useState<string>('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<NormalizedCourse | null>(null);
  const { user: authUser } = useAuth();
  const currentUserId = (authUser as unknown as { sub?: string })?.sub || authUser?.username || 'unknown';
  const { capabilities } = useAppRolesFromIdentity();
  const canCreateLesson = capabilities.canCreateLesson;

  // Nouveaux états pour le formulaire d'ajout
  const [selectedEtabId, setSelectedEtabId] = useState<string>(currentEtablissementId || '');
  const [selectedClasseId, setSelectedClasseId] = useState<string>('');
  const [replacementsSkip, setReplacementsSkip] = useState(0);
  const [replacementsLimit, setReplacementsLimit] = useState(20);

  // Suit le contexte: l'établissement est figé pour le directeur
  React.useEffect(() => {
    if (currentEtablissementId) {
      setSelectedEtabId(currentEtablissementId);
    }
  }, [currentEtablissementId]);

  // Plus besoin de persister un header legacy: l'intercepteur multi-tenant envoie X-Etab-Select/X-Role-Select

  // Calcul des dates de la semaine affichée (avant les appels API)
  const weekDates = useMemo(() => {
    const dates: Date[] = [];
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 1);
    for (let i = 0; i < 5; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentWeek]);
  // Données API: leçons, créneaux, salles
  const { data: lessons, isLoading: lessonsLoading, isError: lessonsError } = useLessons({
    classId: selectedView === 'classe' ? (selectedClasseId || undefined) : undefined,
    fromDate: weekDates[0]?.toISOString?.().slice(0,10),
    toDate: weekDates[4]?.toISOString?.().slice(0,10),
    limit: 500,
  });
  const { data: timeslots, isLoading: tsLoading, isError: tsError } = useTimeslots({ establishmentId: selectedEtabId });
  const { data: rooms } = useRooms({ establishmentId: selectedEtabId });
  const { data: establishments } = useEstablishments({ limit: 100 });
  const { data: classesResp } = useClasses({ etablissementId: selectedEtabId, limit: 100 });
  const classes = classesResp?.data ?? [];
  const { data: enseignants } = useClasseEnseignants(selectedClasseId || undefined);

  const createReplacement = useCreateReplacement();
  const { data: replacements } = useReplacements({ skip: replacementsSkip, limit: replacementsLimit });
  const deleteReplacement = useDeleteReplacement();
  const updateLesson = useUpdateLesson();
  const deleteLesson = useDeleteLesson();
  const createLesson = useCreateLesson();
  const { data: icsText, isLoading: icsLoading, isError: icsError, refetch: refetchIcs } = useIcsFeed(icsClassId || undefined);

  // utilitaires
  const dayNames = useMemo(() => (['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'] as const), []);
  const colorPool = useMemo(() => (['bg-blue-500','bg-green-500','bg-purple-500','bg-orange-500','bg-pink-500','bg-teal-500','bg-indigo-500'] as const), []);
  const getColorBySubject = useCallback((subjectId: string) => {
    const index = Math.abs([...subjectId].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) % colorPool.length;
    return colorPool[index];
  }, [colorPool]);

  // Normalisation des cours pour l'affichage grille
  const cours = useMemo<NormalizedCourse[]>(() => {
    if (!lessons || !timeslots) return [];
    const tsMap = new Map(timeslots.map((t) => [t.id, t]));
    return lessons.map((lesson) => {
      const ts = tsMap.get(lesson.timeslot_id);
      const start = ts?.start_time?.slice(0, 5) || '08:00';
      const end = ts?.end_time?.slice(0, 5) || start;
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = end.split(':').map(Number);
      const durationHours = Math.max(1, Math.round(((eh * 60 + em) - (sh * 60 + sm)) / 60));
      const d = new Date(lesson.date);
      const jour = dayNames[d.getDay()];
      return {
        id: lesson.id,
        matiere: `Matière ${lesson.subject_id}`,
        enseignant: `Prof ${lesson.teacher_id}`,
        classe: lesson.class_id,
        salle: lesson.room_id,
        jour,
        heure: start,
        duree: durationHours,
        couleur: getColorBySubject(lesson.subject_id),
      };
    });
  }, [lessons, timeslots, dayNames, getColorBySubject]);

  // Détection des conflits
  const detectConflicts = useCallback((newCourse: NormalizedCourse): Conflict[] => {
    const detected: Conflict[] = [];
    cours.forEach((existingCourse) => {
      if (existingCourse.jour === newCourse.jour) {
        const existingStart = parseInt(existingCourse.heure.split(':')[0]);
        const existingEnd = existingStart + existingCourse.duree;
        const newStart = parseInt(newCourse.heure.split(':')[0]);
        const newEnd = newStart + newCourse.duree;
        if (newStart < existingEnd && newEnd > existingStart) {
          if (existingCourse.enseignant === newCourse.enseignant) detected.push({ type: 'enseignant', message: `${t('teacher_conflict', 'Conflit enseignant')} : ${existingCourse.enseignant} a déjà un cours`, existingCourse, newCourse });
          if (existingCourse.salle === newCourse.salle) detected.push({ type: 'salle', message: `${t('room_conflict', 'Conflit salle')} : ${existingCourse.salle} est déjà occupée`, existingCourse, newCourse });
          if (existingCourse.classe === newCourse.classe) detected.push({ type: 'classe', message: `${t('class_conflict', 'Conflit classe')} : ${existingCourse.classe} a déjà un cours`, existingCourse, newCourse });
        }
      }
    });
    return detected;
  }, [cours, t]);

  const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'] as const;
  const heures = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'] as const;

  const getCoursForSlot = (jour: string, heure: string) => {
    return cours.filter((c) => c.jour === jour && c.heure === heure);
  };

  // getWeekDates remplacé par un useMemo plus haut pour éviter l'avertissement d'ordre

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
    });
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const handleToday = () => {
    setCurrentWeek(new Date());
  };

  const handleExport = () => {
    // placeholder export
  };

  React.useEffect(() => {
    if (cours.length === 0) return;
    const sample = cours[0];
    const detectedConflicts = detectConflicts(sample);
    setConflicts(detectedConflicts);
  }, [cours, detectConflicts]);

  // recalculé déjà plus haut pour le filtre

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('emploi_du_temps', 'Emploi du Temps')}
        </h1>
        <p className="text-gray-600">
          {t('emploi_du_temps_description', "Visualisez et planifiez l'emploi du temps de l'établissement")}
        </p>
      </div>

      {/* Onglets */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex flex-wrap gap-4 md:space-x-8">
            <button onClick={() => setActiveTab('calendar')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'calendar' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              <div className="flex items-center space-x-2"><Calendar className="w-4 h-4" /><span>{t('calendar_view', 'Vue Calendrier')}</span></div>
            </button>
            <button onClick={() => setActiveTab('replacements')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'replacements' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              <div className="flex items-center space-x-2"><Repeat className="w-4 h-4" /><span>{t('replacements', 'Remplacements')}</span></div>
            </button>
            <button onClick={() => setActiveTab('conflicts')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'conflicts' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              <div className="flex items-center space-x-2"><AlertCircle className="w-4 h-4" /><span>{t('conflicts', 'Conflits')}</span>{conflicts.length > 0 && (<span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">{conflicts.length}</span>)}</div>
            </button>
            <button onClick={() => setActiveTab('validation')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'validation' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              <div className="flex items-center space-x-2"><CheckCircle className="w-4 h-4" /><span>{t('validation', 'Validation')}</span></div>
            </button>
            <button onClick={() => setActiveTab('audit')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'audit' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              <div className="flex items-center space-x-2"><History className="w-4 h-4" /><span>{t('audit_trail', 'Audit')}</span></div>
            </button>
            <button onClick={() => setActiveTab('ics')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'ics' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              <div className="flex items-center space-x-2"><LinkIcon className="w-4 h-4" /><span>{t('ics_feed', 'Flux ICS')}</span></div>
            </button>
          </nav>
        </div>
      </div>

      {(lessonsLoading || tsLoading) && activeTab === 'calendar' && (<div className="text-gray-500 mb-4">{t('loading', 'Chargement...')}</div>)}
      {(lessonsError || tsError) && activeTab === 'calendar' && (<div className="text-red-600 mb-4">{t('error_loading_timetable', "Erreur lors du chargement de l'emploi du temps")}</div>)}

      {activeTab === 'calendar' && (
        <>
          {/* Contrôles */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <button onClick={handlePreviousWeek} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">{formatDate(weekDates[0])} - {formatDate(weekDates[4])}</span>
                <button onClick={handleToday} className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">{t('today', "Aujourd'hui")}</button>
              </div>
              <button onClick={handleNextWeek} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex border border-gray-300 rounded-lg">
                <button onClick={() => setSelectedView('global')} className={`px-4 py-2 text-sm font-medium rounded-l-lg ${selectedView === 'global' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>{t('global', 'Global')}</button>
                <button onClick={() => setSelectedView('classe')} className={`px-4 py-2 text-sm font-medium border-l border-gray-300 ${selectedView === 'classe' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>{t('by_class', 'Par classe')}</button>
                <button onClick={() => setSelectedView('enseignant')} className={`px-4 py-2 text-sm font-medium border-l border-gray-300 rounded-r-lg ${selectedView === 'enseignant' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>{t('by_teacher', 'Par enseignant')}</button>
              </div>
              <div className="flex items-center space-x-2">
                {canCreateLesson ? (
                  <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"><Plus className="w-4 h-4" /><span>{t('add_course', 'Ajouter un cours')}</span></button>
                ) : (
                  <button
                    onClick={() => toast.error(t('not_authorized_create_lesson', 'Vous n\'êtes pas autorisé à créer un cours'))}
                    className="bg-gray-200 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed flex items-center space-x-2"
                    disabled
                  >
                    <Plus className="w-4 h-4" /><span>{t('add_course', 'Ajouter un cours')}</span>
                  </button>
                )}
                <button onClick={handleExport} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2"><Download className="w-4 h-4" /><span>{t('export', 'Exporter')}</span></button>
              </div>
            </div>
          </div>

          {/* Calendrier simplifié (grille) */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-6 bg-gray-50 border-b border-gray-200">
              <div className="p-4 border-r border-gray-200"><div className="text-sm font-medium text-gray-500">{t('time', 'Heure')}</div></div>
              {jours.map((jour, index) => (
                <div key={jour} className="p-4 border-r border-gray-200 last:border-r-0">
                  <div className="text-sm font-medium text-gray-900 capitalize">{t(jour, jour)}</div>
                  <div className="text-xs text-gray-500">{weekDates[index].toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</div>
                </div>
              ))}
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {heures.map((heure) => (
                  <div key={heure} className="grid grid-cols-6 border-b border-gray-200 last:border-b-0">
                    <div className="p-4 border-r border-gray-200 bg-gray-50"><div className="text-sm font-medium text-gray-700">{heure}</div></div>
                    {jours.map((jour) => {
                      const coursDuCreneau = getCoursForSlot(jour, heure);
                      return (
                        <div key={`${jour}-${heure}`} className="p-2 border-r border-gray-200 last:border-r-0 min-h-[80px]">
                          {coursDuCreneau.map((cours) => (
                            <div
                              key={cours.id}
                              className={`${cours.couleur} text-white p-2 rounded-lg mb-1 text-xs cursor-pointer`}
                              style={{ height: `${cours.duree * 40}px` }}
                              onClick={() => { setEditingCourse(cours); setEditModalOpen(true); }}
                            >
                              <div className="font-medium">{cours.matiere}</div>
                              <div className="text-xs opacity-90">{cours.enseignant}</div>
                              <div className="text-xs opacity-90">{cours.classe}</div>
                              <div className="text-xs opacity-90">{cours.salle}</div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal d'ajout de cours avec listes déroulantes */}
          {isModalOpen && canCreateLesson && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('add_course', 'Ajouter un cours')}</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!canCreateLesson) {
                    toast.error(t('not_authorized_create_lesson', 'Vous n\'êtes pas autorisé à créer un cours'));
                    return;
                  }
                  const form = e.currentTarget as HTMLFormElement;
                  const data = new FormData(form);
                  const subject_id = String(data.get('subject_id') || '').trim();
                  const teacher_id = String(data.get('teacher_id') || '').trim();
                  const class_id = String(data.get('class_id') || '').trim();
                  const timeslot_id = String(data.get('timeslot_id') || '').trim();
                  const room_id = String(data.get('room_id') || '').trim();
                  const date = String(data.get('date') || '').trim();

                  if (!class_id || !teacher_id || !subject_id || !date || !timeslot_id || !room_id) {
                    toast.error(t('fill_required_fields', 'Veuillez remplir les champs obligatoires'));
                    return;
                  }

                  try {
                    await createLesson.mutateAsync({ class_id, subject_id, teacher_id, date, timeslot_id, room_id });
                    toast.success(t('course_created', 'Cours créé'));
                    setIsModalOpen(false);
                    form.reset();
                  } catch (err: unknown) {
                    const msg = (err as { response?: { data?: unknown }; message?: string })?.response?.data || (err as { message?: string })?.message || 'Erreur inconnue';
                    toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
                  }
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('establishment', 'Établissement')} *</label>
                      <input
                        value={establishments?.find((etab) => etab.id === selectedEtabId)?.nom || selectedEtabId}
                        readOnly
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('class', 'Classe')} *</label>
                      <select
                        name="class_id"
                        value={selectedClasseId}
                        onChange={(e) => setSelectedClasseId(e.target.value)}
                        disabled={!selectedEtabId || !classes?.length}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="">{t('select_class', 'Sélectionnez une classe')}</option>
                        {classes?.map((c) => (
                          <option key={c.id} value={c.id}>{c.nom}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('teacher', 'Enseignant')} *</label>
                      <select
                        name="teacher_id"
                        disabled={!selectedClasseId || !enseignants?.length}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="">{t('select_teacher', 'Sélectionnez un enseignant')}</option>
                        {enseignants?.map((e) => (
                          <option key={e.enseignant_kc_id} value={e.enseignant_kc_id}>{e.enseignant_kc_id}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('subject', 'Matière')} *</label>
                      <input name="subject_id" placeholder={t('enter_subject_id', 'ID matière')} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('date', 'Date')} *</label>
                      <input name="date" type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                    </div>
                    
                      <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('timeslot', 'Créneau')} *</label>
                      <select name="timeslot_id" className="w-full border border-gray-300 rounded-lg px-3 py-2" disabled={!timeslots?.length}>
                        <option value="">{t('select_timeslot', 'Sélectionnez un créneau')}</option>
                        {timeslots?.map((s) => (
                          <option key={s.id} value={s.id}>{s.start_time} – {s.end_time}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('room', 'Salle')} *</label>
                      <select name="room_id" className="w-full border border-gray-300 rounded-lg px-3 py-2" disabled={!rooms?.length}>
                        <option value="">{t('select_room', 'Sélectionnez une salle')}</option>
                        {rooms?.map((r) => (
                          <option key={r.id} value={r.id}>{r.name} ({r.capacity})</option>
                          ))}
                        </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg">{t('cancel', 'Annuler')}</button>
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg" disabled={createLesson.isPending || !selectedClasseId}>{createLesson.isPending ? t('saving', 'Enregistrement...') : t('add', 'Ajouter')}</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Événements déplacés vers la page DirecteurEventsPage */}

          {/* Modal d'édition de cours */}
          {editModalOpen && editingCourse && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('edit_course', 'Modifier le cours')}</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const update = {
                    room_id: String(formData.get('room_id') || '' ) || null,
                    timeslot_id: String(formData.get('timeslot_id') || '' ) || null,
                    status: null,
                  } as const;
                  try {
                    await updateLesson.mutateAsync({ lessonId: String(editingCourse.id), update });
                    toast.success(t('course_updated', 'Cours mis à jour'));
                    setEditModalOpen(false);
                    setEditingCourse(null);
                  } catch (err: unknown) {
                    const msg = (err as { response?: { data?: unknown }; message?: string })?.response?.data || (err as { message?: string })?.message || 'Erreur inconnue';
                    toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
                  }
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('room', 'Salle')}</label>
                      <select name="room_id" defaultValue={editingCourse.salle} className="w-full border border-gray-300 rounded-lg px-3 py-2" disabled={!rooms?.length}>
                        <option value="">{t('select_room', 'Sélectionnez une salle')}</option>
                        {rooms?.map((r) => (
                          <option key={r.id} value={r.id}>{r.name} ({r.capacity})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('timeslot', 'Créneau')}</label>
                      <select name="timeslot_id" className="w-full border border-gray-300 rounded-lg px-3 py-2" disabled={!timeslots?.length}>
                        <option value="">{t('select_timeslot', 'Sélectionnez un créneau')}</option>
                        {timeslots?.map((s) => (
                          <option key={s.id} value={s.id}>{s.start_time} – {s.end_time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-between space-x-3 mt-6">
                    <button type="button" onClick={() => { setEditModalOpen(false); setEditingCourse(null); }} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg">{t('cancel', 'Annuler')}</button>
                    <div className="flex gap-2">
                      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg" disabled={updateLesson.isPending}>{updateLesson.isPending ? t('saving', 'Enregistrement...') : t('save', 'Enregistrer')}</button>
                      <button type="button" className="px-4 py-2 bg-red-500 text-white rounded-lg" onClick={async () => {
                        try {
                          await deleteLesson.mutateAsync(String(editingCourse.id));
                          toast.success(t('course_deleted', 'Cours supprimé'));
                          setEditModalOpen(false);
                          setEditingCourse(null);
                        } catch (err: unknown) {
                          const msg = (err as { response?: { data?: unknown }; message?: string })?.response?.data || (err as { message?: string })?.message || 'Erreur inconnue';
                          toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
                        }
                      }}>{deleteLesson.isPending ? t('deleting', 'Suppression...') : t('delete', 'Supprimer')}</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'replacements' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">{t('replacements', 'Remplacements')}</h3>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const data = new FormData(form);
              const lesson_id = String(data.get('lesson_id') || '').trim();
              const new_teacher_id = String(data.get('new_teacher_id') || '').trim();
              const validated_by = String(data.get('validated_by') || currentUserId).trim();
              if (!lesson_id || !new_teacher_id || !validated_by) {
                toast.error(t('fill_required_fields', 'Veuillez remplir les champs obligatoires'));
                return;
              }
              try {
                await createReplacement.mutateAsync({ lesson_id, new_teacher_id, validated_by });
                toast.success(t('replacement_created', 'Remplacement créé'));
                form.reset();
              } catch (err: unknown) {
                const msg = (err as { response?: { data?: unknown }; message?: string })?.response?.data || (err as { message?: string })?.message || 'Erreur inconnue';
                toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
              }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('lesson_id', 'ID cours')} *</label><input name="lesson_id" className="w-full border border-gray-300 rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('new_teacher_id', 'ID nouvel enseignant')} *</label><input name="new_teacher_id" className="w-full border border-gray-300 rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">{t('validated_by', 'Validé par (ID)')} *</label><input name="validated_by" className="w-full border border-gray-300 rounded-lg px-3 py-2" /></div>
            <div className="md:col-span-3 flex justify-end"><button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" disabled={createReplacement.isPending}>{createReplacement.isPending ? t('saving', 'Enregistrement...') : t('create_replacement', 'Créer le remplacement')}</button></div>
          </form>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm text-gray-600">ID</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-600">{t('lesson_id', 'ID cours')}</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-600">{t('old_teacher', 'Ancien prof')}</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-600">{t('new_teacher', 'Nouveau prof')}</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-600">{t('validated_by', 'Validé par')}</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-600">{t('validated_at', 'Validé le')}</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-600">{t('created_at', 'Créé le')}</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-600">{t('actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(replacements) && replacements.length > 0 ? (
                  replacements.map((r) => (
                    <tr key={r.id} className="border-t">
                      <td className="px-4 py-2 text-sm text-gray-800">{r.id}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{r.lesson_id}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{r.old_teacher_id}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{r.new_teacher_id}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{r.validated_by ?? '—'}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{r.validated_at ? new Date(r.validated_at).toLocaleString() : '—'}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{r.created_at ? new Date(r.created_at).toLocaleString() : '—'}</td>
                      <td className="px-4 py-2 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs"
                            onClick={async () => {
                              if (!r.id) return;
                              if (window.confirm(t('confirm_delete_replacement', 'Supprimer ce remplacement ?'))) {
                                try {
                                  await deleteReplacement.mutateAsync(String(r.id));
                                  toast.success(t('replacement_deleted', 'Remplacement supprimé'));
                                } catch (err: unknown) {
                                  const msg = (err as { response?: { data?: unknown }; message?: string })?.response?.data || (err as { message?: string })?.message || 'Erreur inconnue';
                                  toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
                                }
                              }
                            }}
                            disabled={deleteReplacement.isPending}
                          >
                            {deleteReplacement.isPending ? t('deleting', 'Suppression...') : t('delete', 'Supprimer')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-t">
                    <td className="px-4 py-6 text-center text-gray-500" colSpan={8}>{t('no_replacements', 'Aucun remplacement')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600">
              {t('page', 'Page')}: {Math.floor(replacementsSkip / replacementsLimit) + 1}
            </div>
            <div className="flex items-center gap-2">
              <select
                className="border rounded px-2 py-1 text-sm"
                value={replacementsLimit}
                onChange={(e) => { const next = Number(e.target.value); setReplacementsLimit(next); setReplacementsSkip(0); }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <button
                type="button"
                className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded disabled:opacity-50"
                onClick={() => setReplacementsSkip((s) => Math.max(0, s - replacementsLimit))}
                disabled={replacementsSkip <= 0}
              >
                {t('prev', 'Précédent')}
              </button>
              <button
                type="button"
                className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded disabled:opacity-50"
                onClick={() => setReplacementsSkip((s) => s + replacementsLimit)}
                disabled={(replacements?.length ?? 0) < replacementsLimit}
              >
                {t('next', 'Suivant')}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ics' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">{t('ics_feed', 'Flux ICS')}</h3>
          <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-800 px-3 py-2 text-sm">{t('ics_privacy_notice', 'Le lien ICS est public. Partagez-le avec précaution.')}</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('class_id', 'ID classe')}</label>
              <input value={icsClassId} onChange={(e) => setIcsClassId(e.target.value)} placeholder="uuid-classe" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              {!!icsClassId && !/^([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i.test(icsClassId) && (
                <div className="text-xs text-red-600 mt-1">{t('invalid_uuid', 'Format d\'UUID invalide')}</div>
              )}
            </div>
            <div className="md:col-span-2 space-y-2">
              <div className="text-sm text-gray-700 break-all">{icsClassId ? `${TIMETABLE_API_BASE_URL}feed/${icsClassId}.ics` : t('enter_class_id_to_get_link', 'Saisissez un ID de classe pour obtenir le lien')}</div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    if (!icsClassId) return;
                    try {
                      await navigator.clipboard.writeText(`${TIMETABLE_API_BASE_URL}feed/${icsClassId}.ics`);
                      toast.success(t('copied', 'Lien copié'));
                    } catch {
                      toast.error(t('copy_failed', 'Échec de la copie'));
                    }
                  }}
                  disabled={!icsClassId}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded disabled:opacity-50"
                >
                  {t('copy_link', 'Copier le lien')}
                </button>
                <a
                  href={icsClassId ? `${TIMETABLE_API_BASE_URL}feed/${icsClassId}.ics` : undefined}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded ${icsClassId ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  onClick={(e) => { if (!icsClassId) e.preventDefault(); }}
                >
                  <LinkIcon className="w-4 h-4" /> {t('open_ics_link', 'Ouvrir le lien ICS')}
                </a>
                <button
                  type="button"
                  onClick={async () => {
                    if (!icsClassId) return;
                    try {
                      const res = await fetch(`${TIMETABLE_API_BASE_URL}feed/${icsClassId}.ics`, { method: 'HEAD' });
                      if (res.ok) {
                        toast.success(t('ics_ok', 'Flux accessible'));
                      } else {
                        toast.error(t('ics_not_found', 'Flux indisponible'));
                      }
                    } catch {
                      toast.error(t('ics_check_error', 'Erreur lors du test du lien'));
                    }
                  }}
                  disabled={!icsClassId}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded disabled:opacity-50"
                >
                  {t('test_link', 'Tester le lien')}
                </button>
                <button
                  type="button"
                  onClick={() => refetchIcs()}
                  disabled={!icsClassId || icsLoading}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded disabled:opacity-50"
                >
                  {icsLoading ? t('loading', 'Chargement...') : t('preview', 'Prévisualiser')}
                </button>
              </div>
              {icsClassId && (
                <div className="mt-3 p-3 border rounded bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">{t('ics_preview', 'Prévisualisation ICS')}</div>
                    <button type="button" onClick={() => refetchIcs()} disabled={icsLoading} className="px-2 py-1 text-xs bg-gray-100 rounded disabled:opacity-50">
                      {t('refresh', 'Rafraîchir')}
                    </button>
                  </div>
                  {icsLoading && (<div className="text-sm text-gray-500">{t('loading', 'Chargement...')}</div>)}
                  {icsError && !icsLoading && (<div className="text-sm text-red-600">{t('ics_load_error', 'Erreur lors du chargement du flux')}</div>)}
                  {!icsLoading && !icsError && icsText && (
                    <>
                      <div className="text-xs mb-2">
                        {icsText.includes('BEGIN:VCALENDAR') ? (
                          <span className="px-2 py-1 rounded bg-green-100 text-green-700">{t('ics_valid', 'Flux ICS valide')}</span>
                        ) : (
                          <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700">{t('ics_maybe_invalid', 'Flux ICS non standard')}</span>
                        )}
                      </div>
                      <pre className="text-xs overflow-auto max-h-64 whitespace-pre-wrap bg-white p-2 rounded border">{icsText.slice(0, 5000)}</pre>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* L'onglet Événements a été retiré de cette page */}

      {activeTab === 'conflicts' && (
        <div className="space-y-6">
          {/* En-tête des conflits */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-900">{t('conflicts', 'Conflits')}</h2>
              {conflicts.length > 0 && (<span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">{conflicts.length} {t('conflicts_detected', 'conflits détectés')}</span>)}
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setConflicts([])} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">{t('clear_all', 'Effacer tout')}</button>
              <button onClick={() => setActiveTab('calendar')} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">{t('back_to_calendar', 'Retour au calendrier')}</button>
            </div>
          </div>
          {/* Affichage des conflits */}
          {conflicts.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-green-900 mb-2">{t('no_conflicts', 'Aucun conflit détecté')}</h3>
              <p className="text-green-700">{t('no_conflicts_description', "L'emploi du temps ne présente aucun conflit de planning.")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {conflicts.map((conflict, index) => (
                <div key={index} className="bg-white border border-red-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <span className="font-medium text-red-700 text-lg">{conflict.message}</span>
                    </div>
                    <span className={`${conflict.type === 'enseignant' ? 'bg-blue-100 text-blue-800' : conflict.type === 'salle' ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800'} px-3 py-1 rounded-full text-sm font-medium`}>
                      {conflict.type === 'enseignant' ? t('teacher', 'Enseignant') : conflict.type === 'salle' ? t('room', 'Salle') : t('class', 'Classe')}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center"><Calendar className="w-4 h-4 mr-2" />{t('existing_course', 'Cours existant')}</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">{t('subject', 'Matière')}:</span> {conflict.existingCourse.matiere}</p>
                        <p><span className="font-medium">{t('class', 'Classe')}:</span> {conflict.existingCourse.classe}</p>
                        <p><span className="font-medium">{t('teacher', 'Enseignant')}:</span> {conflict.existingCourse.enseignant}</p>
                        <p><span className="font-medium">{t('room', 'Salle')}:</span> {conflict.existingCourse.salle}</p>
                        <p><span className="font-medium">{t('schedule', 'Horaire')}:</span> {conflict.existingCourse.jour} {conflict.existingCourse.heure}</p>
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <h4 className="font-medium text-red-900 mb-3 flex items-center"><Plus className="w-4 h-4 mr-2" />{t('new_course', 'Nouveau cours')}</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">{t('subject', 'Matière')}:</span> {conflict.newCourse.matiere}</p>
                        <p><span className="font-medium">{t('class', 'Classe')}:</span> {conflict.newCourse.classe}</p>
                        <p><span className="font-medium">{t('teacher', 'Enseignant')}:</span> {conflict.newCourse.enseignant}</p>
                        <p><span className="font-medium">{t('room', 'Salle')}:</span> {conflict.newCourse.salle}</p>
                        <p><span className="font-medium">{t('schedule', 'Horaire')}:</span> {conflict.newCourse.jour} {conflict.newCourse.heure}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end space-x-3">
                    <button onClick={() => { /* résolution */ }} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">{t('resolve_conflict', 'Résoudre')}</button>
                    <button onClick={() => { /* ignorer */ }} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">{t('ignore_conflict', 'Ignorer')}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'validation' && (<div className="space-y-6"><AbsenceValidationPanel /></div>)}

      {activeTab === 'audit' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4"><History className="w-5 h-5 text-blue-500" /><h3 className="text-lg font-semibold text-gray-900">{t('audit_trail', "Journal d'Audit")}</h3></div>
          <p className="text-gray-500 text-center py-8">{t('audit_description', "Historique des modifications de l'emploi du temps")}</p>
        </div>
      )}
    </div>
  );
};

export default EmploiDuTempsPage;
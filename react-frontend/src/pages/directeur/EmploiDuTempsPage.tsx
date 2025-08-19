import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Plus, ChevronLeft, ChevronRight, Download, Users, Clock, AlertTriangle, CheckCircle, History, UserCheck, AlertCircle } from 'lucide-react';
import AbsenceValidationPanel from '../../components/directeur/emploi-du-temps/AbsenceValidationPanel';
import { useLessons } from '../../hooks/useLessons';
import { useTimeslots } from '../../hooks/useTimeslots';

const EmploiDuTempsPage = () => {
  const { t } = useTranslation();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedView, setSelectedView] = useState('global');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [showConflicts, setShowConflicts] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar', 'validation', 'audit', 'conflicts'

  // Données API: leçons et créneaux
  const { data: lessons, isLoading: lessonsLoading, isError: lessonsError } = useLessons();
  const { data: timeslots, isLoading: tsLoading, isError: tsError } = useTimeslots();

  // utilitaires
  const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const colorPool = ['bg-blue-500','bg-green-500','bg-purple-500','bg-orange-500','bg-pink-500','bg-teal-500','bg-indigo-500'];
  const getColorBySubject = (subjectId: string) => {
    const index = Math.abs([...subjectId].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) % colorPool.length;
    return colorPool[index];
  };

  // Normalisation des cours pour l'affichage grille
  const cours = useMemo(() => {
    if (!lessons || !timeslots) return [] as Array<{ id: string; matiere: string; enseignant: string; classe: string; salle: string; jour: string; heure: string; duree: number; couleur: string; }>;
    const tsMap = new Map(timeslots.map(t => [t.id, t]));
    return lessons.map(lesson => {
      const ts = tsMap.get(lesson.timeslot_id);
      const start = ts?.start_time?.slice(0,5) || '08:00';
      const end = ts?.end_time?.slice(0,5) || start;
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = end.split(':').map(Number);
      const durationHours = Math.max(1, Math.round(((eh*60+em) - (sh*60+sm)) / 60));
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
  }, [lessons, timeslots]);

  // Fonction pour détecter les conflits
  const detectConflicts = (newCourse: any) => {
    const conflicts: any[] = [];
    
    cours.forEach(existingCourse => {
      // Conflit de créneau (même jour et heure qui se chevauchent)
      if (existingCourse.jour === newCourse.jour) {
        const existingStart = parseInt(existingCourse.heure.split(':')[0]);
        const existingEnd = existingStart + existingCourse.duree;
        const newStart = parseInt(newCourse.heure.split(':')[0]);
        const newEnd = newStart + newCourse.duree;
        
        if ((newStart < existingEnd && newEnd > existingStart)) {
          // Conflit d'enseignant
          if (existingCourse.enseignant === newCourse.enseignant) {
            conflicts.push({
              type: 'enseignant',
              message: `${t('teacher_conflict', 'Conflit enseignant')} : ${existingCourse.enseignant} a déjà un cours`,
              existingCourse,
              newCourse
            });
          }
          
          // Conflit de salle
          if (existingCourse.salle === newCourse.salle) {
            conflicts.push({
              type: 'salle',
              message: `${t('room_conflict', 'Conflit salle')} : ${existingCourse.salle} est déjà occupée`,
              existingCourse,
              newCourse
            });
          }
          
          // Conflit de classe
          if (existingCourse.classe === newCourse.classe) {
            conflicts.push({
              type: 'classe',
              message: `${t('class_conflict', 'Conflit classe')} : ${existingCourse.classe} a déjà un cours`,
              existingCourse,
              newCourse
            });
          }
        }
      }
    });
    
    return conflicts;
  };

  const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
  const heures = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

  const getCoursForSlot = (jour: string, heure: string) => {
    return cours.filter(c => c.jour === jour && c.heure === heure);
  };

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 1);
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
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
    console.log('Exporter l\'emploi du temps');
  };

  // Détection simple des conflits au chargement (optionnel)
  React.useEffect(() => {
    if (cours.length === 0) return;
    const sample = cours[0];
    const detectedConflicts = detectConflicts(sample);
    setConflicts(detectedConflicts);
  }, [cours]);

  const weekDates = getWeekDates();

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('emploi_du_temps', 'Emploi du Temps')}
        </h1>
        <p className="text-gray-600">
          {t('emploi_du_temps_description', 'Visualisez et planifiez l\'emploi du temps de l\'établissement')}
        </p>
      </div>

      {/* Onglets pour les fonctionnalités du directeur */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'calendar'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{t('calendar_view', 'Vue Calendrier')}</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('conflicts')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'conflicts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>{t('conflicts', 'Conflits')}</span>
                {conflicts.length > 0 && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                    {conflicts.length}
                  </span>
                )}
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('validation')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'validation'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>{t('validation', 'Validation')}</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('audit')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'audit'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4" />
                <span>{t('audit_trail', 'Audit')}</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Contenu selon l'onglet actif */}
      {(lessonsLoading || tsLoading) && (
        <div className="text-gray-500 mb-4">{t('loading', 'Chargement...')}</div>
      )}
      {(lessonsError || tsError) && (
        <div className="text-red-600 mb-4">{t('error_loading_timetable', 'Erreur lors du chargement de l\'emploi du temps')}</div>
      )}
      {activeTab === 'calendar' && (
        <>
          {/* Contrôles */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
            {/* Navigation temporelle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePreviousWeek}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">
                  {formatDate(weekDates[0])} - {formatDate(weekDates[4])}
                </span>
                <button
                  onClick={handleToday}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {t('today', 'Aujourd\'hui')}
                </button>
              </div>
              
              <button
                onClick={handleNextWeek}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Vues et actions */}
            <div className="flex items-center space-x-4">
              {/* Sélecteur de vue */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setSelectedView('global')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                    selectedView === 'global'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t('global', 'Global')}
                </button>
                <button
                  onClick={() => setSelectedView('classe')}
                  className={`px-4 py-2 text-sm font-medium border-l border-gray-300 ${
                    selectedView === 'classe'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t('by_class', 'Par classe')}
                </button>
                <button
                  onClick={() => setSelectedView('enseignant')}
                  className={`px-4 py-2 text-sm font-medium border-l border-gray-300 rounded-r-lg ${
                    selectedView === 'enseignant'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t('by_teacher', 'Par enseignant')}
                </button>
              </div>

              {/* Boutons d'action */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('add_course', 'Ajouter un cours')}</span>
                </button>
                
                <button
                  onClick={handleExport}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{t('export', 'Exporter')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Calendrier */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* En-têtes des jours */}
            <div className="grid grid-cols-6 bg-gray-50 border-b border-gray-200">
              <div className="p-4 border-r border-gray-200">
                <div className="text-sm font-medium text-gray-500">{t('time', 'Heure')}</div>
              </div>
              {jours.map((jour, index) => (
                <div key={jour} className="p-4 border-r border-gray-200 last:border-r-0">
                  <div className="text-sm font-medium text-gray-900 capitalize">
                    {t(jour, jour)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {weekDates[index].toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              ))}
            </div>

            {/* Grille des créneaux */}
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {heures.map((heure) => (
                  <div key={heure} className="grid grid-cols-6 border-b border-gray-200 last:border-b-0">
                    {/* Heure */}
                    <div className="p-4 border-r border-gray-200 bg-gray-50">
                      <div className="text-sm font-medium text-gray-700">{heure}</div>
                    </div>
                    
                    {/* Créneaux pour chaque jour */}
                    {jours.map((jour) => {
                      const coursDuCreneau = getCoursForSlot(jour, heure);
                      return (
                        <div key={`${jour}-${heure}`} className="p-2 border-r border-gray-200 last:border-r-0 min-h-[80px]">
                          {coursDuCreneau.map((cours) => (
                            <div
                              key={cours.id}
                              className={`${cours.couleur} text-white p-2 rounded-lg mb-1 text-xs cursor-pointer hover:opacity-90`}
                              style={{ height: `${cours.duree * 40}px` }}
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

          {/* Légende */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">{t('legend', 'Légende')}</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-700">{t('mathematics', 'Mathématiques')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-700">{t('french', 'Français')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="text-sm text-gray-700">{t('history', 'Histoire')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-sm text-gray-700">{t('svt', 'SVT')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-pink-500 rounded"></div>
                <span className="text-sm text-gray-700">{t('english', 'Anglais')}</span>
              </div>
            </div>
          </div>

          {/* Modal d'ajout de cours */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('add_course', 'Ajouter un cours')}
                </h3>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const newCourse = {
                    id: Date.now(),
                    matiere: formData.get('matiere') as string,
                    enseignant: formData.get('enseignant') as string,
                    classe: formData.get('classe') as string,
                    salle: formData.get('salle') as string,
                    jour: formData.get('jour') as string,
                    heure: formData.get('heure') as string,
                    duree: 1,
                    couleur: 'bg-gray-500'
                  };
                  
                  // Détecter les conflits
                  const detectedConflicts = detectConflicts(newCourse);
                  setConflicts(detectedConflicts);
                  
                  if (detectedConflicts.length > 0) {
                    setActiveTab('conflicts');
                    setIsModalOpen(false);
                    // Afficher un message d'alerte
                    alert(t('conflicts_detected', 'Conflits détectés ! Vérifiez les détails.'));
                  } else {
                    console.log('Ajouter un cours sans conflit');
                    setIsModalOpen(false);
                  }
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('subject', 'Matière')} *
                      </label>
                      <input
                        name="matiere"
                        type="text"
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('teacher', 'Enseignant')} *
                      </label>
                      <input
                        name="enseignant"
                        type="text"
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('class', 'Classe')} *
                      </label>
                      <input
                        name="classe"
                        type="text"
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('room', 'Salle')} *
                      </label>
                      <input
                        name="salle"
                        type="text"
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('day', 'Jour')} *
                        </label>
                        <select name="jour" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          {jours.map((jour) => (
                            <option key={jour} value={jour}>
                              {t(jour, jour)}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('time', 'Heure')} *
                        </label>
                        <select name="heure" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          {heures.map((heure) => (
                            <option key={heure} value={heure}>
                              {heure}
                            </option>
                          ))}
                        </select>
                      </div>
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
                      {t('add', 'Ajouter')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'conflicts' && (
        <div className="space-y-6">
          {/* En-tête des conflits */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                {t('conflicts', 'Conflits')}
              </h2>
              {conflicts.length > 0 && (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  {conflicts.length} {t('conflicts_detected', 'conflits détectés')}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setConflicts([])}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {t('clear_all', 'Effacer tout')}
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {t('back_to_calendar', 'Retour au calendrier')}
              </button>
            </div>
          </div>

          {/* Affichage des conflits */}
          {conflicts.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-green-900 mb-2">
                {t('no_conflicts', 'Aucun conflit détecté')}
              </h3>
              <p className="text-green-700">
                {t('no_conflicts_description', 'L\'emploi du temps ne présente aucun conflit de planning.')}
              </p>
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
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      conflict.type === 'enseignant' ? 'bg-blue-100 text-blue-800' :
                      conflict.type === 'salle' ? 'bg-orange-100 text-orange-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {conflict.type === 'enseignant' ? t('teacher', 'Enseignant') :
                       conflict.type === 'salle' ? t('room', 'Salle') :
                       t('class', 'Classe')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {t('existing_course', 'Cours existant')}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">{t('subject', 'Matière')}:</span> {conflict.existingCourse.matiere}</p>
                        <p><span className="font-medium">{t('class', 'Classe')}:</span> {conflict.existingCourse.classe}</p>
                        <p><span className="font-medium">{t('teacher', 'Enseignant')}:</span> {conflict.existingCourse.enseignant}</p>
                        <p><span className="font-medium">{t('room', 'Salle')}:</span> {conflict.existingCourse.salle}</p>
                        <p><span className="font-medium">{t('schedule', 'Horaire')}:</span> {conflict.existingCourse.jour} {conflict.existingCourse.heure}</p>
                      </div>
                    </div>
                    
                    <div className="bg-red-50 rounded-lg p-4">
                      <h4 className="font-medium text-red-900 mb-3 flex items-center">
                        <Plus className="w-4 h-4 mr-2" />
                        {t('new_course', 'Nouveau cours')}
                      </h4>
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
                    <button
                      onClick={() => {
                        // Logique pour résoudre le conflit
                        console.log('Résoudre le conflit:', conflict);
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      {t('resolve_conflict', 'Résoudre')}
                    </button>
                    <button
                      onClick={() => {
                        // Logique pour ignorer le conflit
                        console.log('Ignorer le conflit:', conflict);
                      }}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      {t('ignore_conflict', 'Ignorer')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'validation' && (
        <div className="space-y-6">
          <AbsenceValidationPanel />
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <History className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              {t('audit_trail', 'Journal d\'Audit')}
            </h3>
          </div>
          <p className="text-gray-500 text-center py-8">
            {t('audit_description', 'Historique des modifications de l\'emploi du temps')}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmploiDuTempsPage;

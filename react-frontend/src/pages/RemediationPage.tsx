import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Clock, 
  CheckCircle, 
  Plus, 
  BookOpen,
  AlertCircle,
  Edit,
  Trash2,
  Play
} from 'lucide-react';
import { useFilters } from '../contexts/FilterContext';
import ClassNameCard from '../components/Header/ClassNameCard';

interface RemediationStats {
  totalSessions: number;
  plannedSessions: number;
  completedSessions: number;
  inProgressSessions: number;
  successRate: number;
}

interface RemediationSessionData {
  id: string;
  title: string;
  subject: string;
  class: string;
  date: string;
  time: string;
  duration: string;
  maxStudents: number;
  currentStudents: number;
  status: 'planned' | 'in_progress' | 'completed';
  description?: string;
  materials?: string[];
  teacher: string;
}

const RemediationPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentClasse } = useFilters();
  const [selectedClass, setSelectedClass] = useState(currentClasse || 'CP2');
  
  const [sessions, setSessions] = useState<RemediationSessionData[]>([]);
  const [selectedSession, setSelectedSession] = useState<RemediationSessionData | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [stats, setStats] = useState<RemediationStats>({
    totalSessions: 0,
    plannedSessions: 0,
    completedSessions: 0,
    inProgressSessions: 0,
    successRate: 0
  });

  // Données mockées pour la démonstration
  useEffect(() => {
    const mockSessions: RemediationSessionData[] = [
      {
        id: '1',
        title: 'Remédiation Mathématiques - Géométrie',
        subject: 'Mathématiques',
        class: 'CP2',
        date: '2024-01-15',
        time: '14:00',
        duration: '1h30',
        maxStudents: 8,
        currentStudents: 6,
        status: 'planned',
        description: 'Séance de remédiation sur les notions de géométrie',
        materials: ['Cahier d\'exercices', 'Règle et compas'],
        teacher: 'Marie Dupont'
      },
      {
        id: '2',
        title: 'Remédiation Français - Conjugaison',
        subject: 'Français',
        class: 'CP2',
        date: '2024-01-16',
        time: '15:30',
        duration: '1h',
        maxStudents: 6,
        currentStudents: 4,
        status: 'in_progress',
        description: 'Travail sur les temps de conjugaison',
        materials: ['Fiches d\'exercices'],
        teacher: 'Pierre Martin'
      },
      {
        id: '3',
        title: 'Remédiation Sciences - Expériences',
        subject: 'Sciences',
        class: 'CP2',
        date: '2024-01-10',
        time: '16:00',
        duration: '2h',
        maxStudents: 10,
        currentStudents: 8,
        status: 'completed',
        description: 'Séance pratique sur les expériences scientifiques',
        materials: ['Matériel de laboratoire', 'Protocoles'],
        teacher: 'Sophie Bernard'
      }
    ];

    setSessions(mockSessions);
    
    // Calculer les statistiques
    const total = mockSessions.length;
    const planned = mockSessions.filter(s => s.status === 'planned').length;
    const completed = mockSessions.filter(s => s.status === 'completed').length;
    const inProgress = mockSessions.filter(s => s.status === 'in_progress').length;
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    setStats({
      totalSessions: total,
      plannedSessions: planned,
      completedSessions: completed,
      inProgressSessions: inProgress,
      successRate
    });
  }, [currentClasse]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planned': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleCreateSession = () => {
    setShowCreateModal(true);
  };

  const handleEditSession = (session: RemediationSessionData) => {
    setSelectedSession(session);
    setShowCreateModal(true);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const handleStartSession = (sessionId: string) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, status: 'in_progress' as const } : s
    ));
  };

  const handlePlanSession = (sessionId: string) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, status: 'planned' as const } : s
    ));
  };

  const handleCompleteSession = (sessionId: string) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, status: 'completed' as const } : s
    ));
  };

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      {/* En-tête moderne décoratif */}
      <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 shadow-sm border border-emerald-200/50 p-6">
        {/* Motifs décoratifs */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/15 rounded-full -translate-y-14 translate-x-14"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-teal-500/15 rounded-full translate-y-10 -translate-x-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/5 rounded-full"></div>
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">{t('remediation_sessions', 'Sessions de Remédiation')}</h1>
          <p className="text-gray-600">{t('remediation_sessions_description', 'Gérez vos sessions de remédiation')}</p>
        </div>
      </div>
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
         <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
           <div className="flex items-center">
             <BookOpen className="w-8 h-8 text-blue-600" />
             <div className="ml-3">
               <p className="text-sm font-medium text-gray-600">{t('total_sessions', 'Total sessions')}</p>
               <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
             </div>
           </div>
         </div>
         
         <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
           <div className="flex items-center">
             <Clock className="w-8 h-8 text-blue-600" />
             <div className="ml-3">
               <p className="text-sm font-medium text-gray-600">{t('planned', 'Planifiée')}</p>
               <p className="text-2xl font-bold text-gray-900">{stats.plannedSessions}</p>
             </div>
           </div>
         </div>
         
         <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
           <div className="flex items-center">
             <AlertCircle className="w-8 h-8 text-yellow-600" />
             <div className="ml-3">
               <p className="text-sm font-medium text-gray-600">En cours</p>
               <p className="text-2xl font-bold text-gray-900">{stats.inProgressSessions}</p>
             </div>
           </div>
         </div>
         
                   <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">{t('completed', 'Terminées')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedSessions}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <ClassNameCard
              className={selectedClass}
              onClassChange={setSelectedClass}
              isEditable={true}
            />
          </div>
       </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {t('quick_actions', 'Actions rapides')}
          </h2>
                     <button 
             onClick={handleCreateSession}
             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
           >
             <Plus className="w-4 h-4" />
             {t('plan_session', 'Planifier une session')}
           </button>
        </div>
      </div>

      {/* Liste des sessions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {t('remediation_sessions_list', 'Sessions de remédiation')}
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  {t('session', 'Session')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  {t('subject', 'Matière')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  {t('date_time', 'Date/Heure')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  {t('students_label', 'Élèves')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  {t('status', 'Statut')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{session.title}</div>
                      <div className="text-sm text-gray-500">{session.class}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{session.subject}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                    <div className="text-sm text-gray-900">
                      <div>{new Date(session.date).toLocaleDateString('fr-FR')}</div>
                      <div className="text-gray-500">{session.time} ({session.duration})</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                    <div className="text-sm text-gray-900">
                      {session.currentStudents}/{session.maxStudents}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                      {getStatusIcon(session.status)}
                                             <span className="ml-1">{t(`status_${session.status}`, session.status === 'planned' ? 'Planifiée' : session.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditSession(session)}
                        className="text-blue-600 hover:text-blue-900"
                        title={t('edit', 'Modifier')}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                                             {session.status === 'planned' && (
                         <button
                           onClick={() => handleStartSession(session.id)}
                           className="text-green-600 hover:text-green-900"
                           title={t('start', 'Démarrer')}
                         >
                           <Play className="w-4 h-4" />
                         </button>
                       )}
                       
                       {session.status === 'in_progress' && (
                         <button
                           onClick={() => handleCompleteSession(session.id)}
                           className="text-green-600 hover:text-green-900"
                           title={t('complete', 'Terminer')}
                         >
                           <CheckCircle className="w-4 h-4" />
                         </button>
                       )}
                       
                       {session.status === 'completed' && (
                         <button
                           onClick={() => handlePlanSession(session.id)}
                           className="text-blue-600 hover:text-blue-900"
                           title={t('replan', 'Replanifier')}
                         >
                           <Clock className="w-4 h-4" />
                         </button>
                       )}
                      
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="text-red-600 hover:text-red-900"
                        title={t('delete', 'Supprimer')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de création/édition (simplifié) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md border border-gray-200 shadow-lg">
                         <h3 className="text-lg font-semibold mb-4">
               {selectedSession ? t('edit_session', 'Modifier la session') : t('plan_session', 'Planifier une session')}
             </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('title', 'Titre')}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder={t('session_title', 'Titre de la session...')}
                />
              </div>
                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   {t('subject', 'Matière')}
                 </label>
                 <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                   <option>Mathématiques</option>
                   <option>Français</option>
                   <option>Sciences</option>
                   <option>Histoire</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   {t('class', 'Classe')}
                 </label>
                 <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                   <option>CP1</option>
                   <option>CP2</option>
                   <option>CE1</option>
                   <option>CE2</option>
                   <option>CM1</option>
                   <option>CM2</option>
                 </select>
               </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('date', 'Date')}
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('time', 'Heure')}
                  </label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('description', 'Description')}
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder={t('session_description', 'Description de la session...')}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {t('cancel', 'Annuler')}
              </button>
              <button
                onClick={() => {
                  // Logique de sauvegarde
                  setShowCreateModal(false);
                }}
                                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
               >
                 {selectedSession ? t('save', 'Sauvegarder') : t('plan', 'Planifier')}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemediationPage; 
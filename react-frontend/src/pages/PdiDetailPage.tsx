import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockFacilitators, Facilitator, mockPdiStudents, PdiStudent } from '../lib/mock-data';
import { useFilters } from '../contexts/FilterContext';

// Import des composants réutilisables
import TrimestreCard from '../components/Header/TrimestreCard';
import PdiCard from '../components/Header/PdiCard';
import CircularProgress from '../components/ui/CircularProgress';
import {
  Briefcase, AlertTriangle, Users, FileText, Bell, Target, Check, 
  TrendingDown, TrendingUp, Download, Share2, Clock, CheckCircle,
  Calendar, Eye, EyeOff
} from 'lucide-react';

// Interface pour les données de séance PDI enrichie
interface PdiSession {
  id: string;
  date: string;
  classId: string; // Ajout de l'identifiant de classe
  className: string; // Ajout du nom de classe
  status: 'completed' | 'in_progress' | 'scheduled';
  students: PdiSessionStudent[];
  observations: string;
  reportGenerated: boolean;
  reportShared: boolean;
}

interface PdiSessionStudent extends PdiStudent {
  presence: 'present' | 'late' | 'absent';
  observations?: string;
  globalScore: number;
  difficultyLevel: 'critique' | 'modéré' | 'léger' | 'normal';
  needsAssistance: boolean;
  alerts: Array<{
    type: 'score_low' | 'regression' | 'absence' | 'attention_urgente';
    message: string;
    severity: 'high' | 'medium' | 'low';
  }>;
}

// Fonction pour transformer les données PdiStudent en PdiSessionStudent
const transformPdiStudentToSessionStudent = (student: PdiStudent): PdiSessionStudent => {
  // Calcul du score global
  const scores = [student.langage, student.conte, student.vocabulaire, student.lecture, student.graphisme];
  const globalScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  
  // Déterminer le niveau de difficulté selon le système de l'école
  let difficultyLevel: 'critique' | 'modéré' | 'léger' | 'normal';
  let needsAssistance = false;
  
  if (globalScore < 30) {
    difficultyLevel = 'critique';
    needsAssistance = true;
  } else if (globalScore < 50) {
    difficultyLevel = 'modéré';
    needsAssistance = true;
  } else if (globalScore < 70) {
    difficultyLevel = 'léger';
    needsAssistance = true;
  } else {
    difficultyLevel = 'normal';
    needsAssistance = false;
  }
  
  // Générer les alertes automatiques
  const alerts = [];
  if (globalScore < 30) {
    alerts.push({
      type: 'score_low' as const,
      message: 'Score critique < 30%',
        severity: 'high' as const
      });
  } else if (globalScore < 70) {
    alerts.push({
      type: 'score_low' as const,
      message: 'Score global < 70%',
        severity: 'medium' as const
      });
    }

  // Vérifier les compétences en difficulté
  const competencesEnDifficulte = [];
  if (student.langage < 50) competencesEnDifficulte.push('Langage');
  if (student.conte < 50) competencesEnDifficulte.push('Conte');
  if (student.vocabulaire < 50) competencesEnDifficulte.push('Vocabulaire');
  if (student.lecture < 50) competencesEnDifficulte.push('Lecture');
  if (student.graphisme < 50) competencesEnDifficulte.push('Graphisme');
  
    if (competencesEnDifficulte.length >= 3) {
    alerts.push({
        type: 'attention_urgente' as const,
        message: 'Intervention immédiate requise',
        severity: 'high' as const
      });
    }

  return {
    ...student,
    presence: 'present' as const, // Par défaut présent
    globalScore,
    difficultyLevel,
    needsAssistance,
    alerts
  };
};

// Créer les séances PDI avec les vraies données par classe
const createPdiSessions = (facilitator: Facilitator): PdiSession[] => {
  const sessionStudents = mockPdiStudents.map(transformPdiStudentToSessionStudent);
  
  // Dates fixes pour les mercredis (selon les spécifications)
  const wednesdayDates = [
    '30/07/2025', // PRESK 1
    '23/07/2025', // PRESK 2
    '16/07/2025', // CP1
    '09/07/2025', // CP2
    '02/07/2025'  // CE1
  ];
  
  // Créer une séance par classe du facilitateur avec les dates de mercredi fixes
  return facilitator.classes.map((className, index) => {
    const sessionDate = wednesdayDates[index] || wednesdayDates[0]; // Fallback si plus de classes que de dates

    return {
      id: `${index + 1}`,
      date: sessionDate,
      classId: `class-${index + 1}`,
      className: className,
      status: 'completed' as const,
      students: sessionStudents.slice(0, 3 + index), // Simuler différents nombres d'élèves par classe
      observations: `Séance productive avec la classe ${className}. Une bonne participation générale. Quelques élèves nécessitent un suivi renforcé.`,
      reportGenerated: index % 2 === 0, // Alterner les rapports générés
      reportShared: index % 3 === 0 // Alterner les rapports partagés
    };
  });
};

const PdiDetailPage: React.FC = () => {
  const { facilitatorId } = useParams<{ facilitatorId: string }>();
  const navigate = useNavigate();
  const facilitator = mockFacilitators.find((f: Facilitator) => f.id === facilitatorId);

  // États pour les filtres
  const { currentTrimestre, setCurrentTrimestre } = useFilters();
  const [pdi, setPdi] = useState('semaine-45'); // Semaine actuelle (21-25 Juil)
  
  // États pour la gestion des séances
  const [sessions, setSessions] = useState<PdiSession[]>(facilitator ? createPdiSessions(facilitator) : []);
  const [selectedSession, setSelectedSession] = useState<PdiSession | null>(sessions[0] || null);
  const [activeTab, setActiveTab] = useState<'sessions' | 'presence' | 'difficulty' | 'observations' | 'report'>('sessions');
  const [showWarning, setShowWarning] = useState(false);

  // Validation de la règle de gestion : une seule séance par classe/semaine
  useEffect(() => {
    const validateSessions = () => {
      if (!facilitator) return;
      
      // Vérifier s'il y a plusieurs séances pour la même classe dans la même semaine
      const classSessions = sessions.filter(s => s.date === '31/07/2025'); // Simuler la même semaine
      const classCounts = classSessions.reduce((acc, session) => {
        acc[session.className] = (acc[session.className] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const hasMultipleSessions = Object.values(classCounts).some(count => count > 1);
      
      if (hasMultipleSessions) {
        setShowWarning(true);
      }
    };

    validateSessions();
  }, [sessions, pdi, currentTrimestre, facilitator]);

  // Mettre à jour les sessions quand le facilitateur change
  useEffect(() => {
    if (facilitator) {
      const newSessions = createPdiSessions(facilitator);
      setSessions(newSessions);
      setSelectedSession(newSessions[0] || null);
    }
  }, [facilitator]);

  if (!facilitator) {
    return <div className="p-6">Facilitateur non trouvé.</div>;
  }

  // Fonctions pour la gestion des séances
  const handlePresenceChange = (studentId: string, presence: 'present' | 'late' | 'absent') => {
    if (!selectedSession) return;
    
    setSelectedSession(prev => prev ? {
      ...prev,
      students: prev.students.map(student => 
        student.id === studentId ? { ...student, presence } : student
      )
    } : null);
  };

  const handleObservationChange = (studentId: string, observation: string) => {
    if (!selectedSession) return;
    
    setSelectedSession(prev => prev ? {
      ...prev,
      students: prev.students.map(student => 
        student.id === studentId ? { ...student, observations: observation } : student
      )
    } : null);
  };

  const markAllPresent = () => {
    if (!selectedSession) return;
    
    setSelectedSession(prev => prev ? {
      ...prev,
      students: prev.students.map(student => ({
        ...student,
        presence: 'present' as const
      }))
    } : null);
  };

  const generateReport = () => {
    if (!selectedSession) return;
    
    setSelectedSession(prev => prev ? { ...prev, reportGenerated: true } : null);
    // Logique de génération PDF
  };

  const shareWithParents = () => {
    if (!selectedSession) return;
    
    if (selectedSession.reportShared) {
      // Le rapport est déjà partagé - demander accord direction
      if (window.confirm('Le rapport a déjà été partagé. Une nouvelle version nécessite l\'accord de la direction. Continuer ?')) {
        // Logique pour demander accord direction
        console.log('Demande d\'accord direction pour nouvelle version');
      }
    } else {
      setSelectedSession(prev => prev ? { ...prev, reportShared: true } : null);
      // Logique de notification parents
    }
  };

  // Fonctions utilitaires
  const getPresenceIcon = (presence: string) => {
    switch (presence) {
      case 'present':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'late':
        return <Clock size={16} className="text-orange-600" />;
      case 'absent':
        return <AlertTriangle size={16} className="text-red-600" />;
      default:
        return null;
    }
  };

  const getDifficultyBadge = (level: string) => {
    switch (level) {
      case 'critique':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Critique</span>;
      case 'modéré':
        return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">Modéré</span>;
      case 'léger':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Léger</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Normal</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Terminée</span>;
      case 'in_progress':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">En cours</span>;
      case 'scheduled':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Programmée</span>;
      default:
        return null;
    }
  };

  // Calculs des statistiques
  const studentsInDifficulty = selectedSession?.students.filter(s => s.needsAssistance) || [];
  const criticalStudents = selectedSession?.students.filter(s => s.difficultyLevel === 'critique') || [];
  const studentsWithAlerts = selectedSession?.students.filter(s => s.alerts.length > 0) || [];
  const averageScore = selectedSession ? 
    Math.round(selectedSession.students.reduce((sum, s) => sum + s.globalScore, 0) / selectedSession.students.length) : 0;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Fil d'Ariane */}
      <div className="text-sm text-gray-500 mb-4">
        <span>Séances PDI</span>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{facilitator.name}</span>
      </div>

      {/* Avertissement pour séances multiples */}
      {showWarning && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-orange-600" />
            <div>
              <h3 className="font-medium text-orange-800">Attention : Séances multiples détectées</h3>
              <p className="text-sm text-orange-700">
                Plusieurs séances PDI ont été créées pour la même classe cette semaine. 
                Veuillez vérifier et consolider si nécessaire.
              </p>
            </div>
            <button 
              onClick={() => setShowWarning(false)}
              className="ml-auto text-orange-600 hover:text-orange-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Section d'information du facilitateur */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img 
            src={facilitator.avatarUrl} 
            alt={facilitator.name} 
            className="w-24 h-24 object-cover rounded-full shadow-md border-4 border-white"
          />
          <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold text-gray-800">{facilitator.name}</h2>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 text-sm mt-1">
            <Briefcase size={16} />
            <span>{facilitator.role.toUpperCase()}</span>
            </div>
          </div>
        </div>
          </div>

      {/* En-tête avec filtres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <TrimestreCard value={currentTrimestre} onChange={setCurrentTrimestre} />
        <PdiCard value={pdi} onChange={setPdi} />
          </div>

      {/* Onglets pour différentes vues */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'sessions', label: 'Mes Séances', icon: <Calendar size={16} /> },
              { id: 'presence', label: 'Présence', icon: <Users size={16} /> },
              { id: 'difficulty', label: 'Élèves en difficulté', icon: <AlertTriangle size={16} /> },
              { id: 'observations', label: 'Observations', icon: <FileText size={16} /> },
              { id: 'report', label: 'Rapport', icon: <Download size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
          </div>
          
        <div className="p-6">
          {/* F-01 : Liste des séances */}
          {activeTab === 'sessions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Mes Séances PDI</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.map(session => (
                  <div 
                    key={session.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedSession?.id === session.id 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-800">{session.date}</h4>
                        <span className="text-sm text-orange-600 font-medium">{session.className}</span>
          </div>
                      {getStatusBadge(session.status)}
      </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Users size={14} />
                        <span>{session.students.length} élèves</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target size={14} />
                        <span>Moyenne: {Math.round(session.students.reduce((sum, s) => sum + s.globalScore, 0) / session.students.length)}%</span>
            </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={14} />
                        <span>{session.students.filter(s => s.needsAssistance).length} en difficulté</span>
            </div>
         </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        {session.reportGenerated ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <FileText size={12} />
                            Rapport généré
                          </span>
                        ) : (
                          <span className="text-orange-600 flex items-center gap-1">
                            <AlertTriangle size={12} />
                            Rapport en attente
                          </span>
                        )}
             </div>
                      {session.reportShared && (
                        <span className="text-xs text-blue-600 flex items-center gap-1">
                          <Share2 size={12} />
                          Partagé
                        </span>
                      )}
             </div>
           </div>
                ))}
           </div>
            </div>
          )}

          {/* F-04 : Saisie de présence */}
          {activeTab === 'presence' && selectedSession && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Présence - {selectedSession.date}</h3>
                  <p className="text-sm text-gray-600">Classe: {selectedSession.className}</p>
                </div>
                <button 
                  onClick={markAllPresent}
                  className="px-3 py-1 text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Marquer tous présents
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedSession.students.map(student => (
                  <div key={student.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full" />
            <div>
                        <h4 className="font-medium text-gray-800">{student.name}</h4>
                        <p className="text-sm text-gray-500">Score: {student.globalScore}%</p>
        </div>
      </div>
      
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {getPresenceIcon(student.presence)}
                        <select
                          value={student.presence}
                          onChange={(e) => handlePresenceChange(student.id, e.target.value as 'present' | 'late' | 'absent')}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="present">Présent</option>
                          <option value="late">Retard</option>
                          <option value="absent">Absent</option>
                        </select>
        </div>

                      <textarea
                        placeholder="Observations..."
                        value={student.observations || ''}
                        onChange={(e) => handleObservationChange(student.id, e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded px-2 py-1 resize-none"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* F-02 : Tableau "Élèves en difficulté" */}
          {activeTab === 'difficulty' && selectedSession && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Élèves en difficulté - {selectedSession.date}</h3>
                <p className="text-sm text-gray-600">Classe: {selectedSession.className}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedSession.students.filter(s => s.needsAssistance).map(student => (
                  <div key={student.id} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <h4 className="font-medium text-gray-800">{student.name}</h4>
                        {getDifficultyBadge(student.difficultyLevel)}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Score global: {student.globalScore}%</p>
                      <div className="text-xs space-y-1">
                        <p>Langage: {student.langage}%</p>
                        <p>Conte: {student.conte}%</p>
                        <p>Vocabulaire: {student.vocabulaire}%</p>
                        <p>Lecture: {student.lecture}%</p>
                        <p>Graphisme: {student.graphisme}%</p>
                      </div>
                    </div>
                    
                    {student.alerts.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {student.alerts.map((alert, index) => (
                          <div key={index} className={`text-xs px-2 py-1 rounded ${
                            alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                            alert.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            <Bell size={10} className="inline mr-1" />
                            {alert.message}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-3 flex gap-2">
                      <button className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200">
                        Ajouter remédiation
                      </button>
                      <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                        Générer rapport
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* F-07 : Observations */}
          {activeTab === 'observations' && selectedSession && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Observations - {selectedSession.date}</h3>
                <p className="text-sm text-gray-600">Classe: {selectedSession.className}</p>
              </div>
              
              <textarea
                value={selectedSession.observations}
                onChange={(e) => setSelectedSession(prev => prev ? { ...prev, observations: e.target.value } : null)}
                placeholder="Décrivez les observations de cette séance PDI..."
                className="w-full border border-gray-300 rounded-lg p-4 resize-none"
                rows={8}
              />
              
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                  Sauvegarder
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Templates
                </button>
              </div>
                        </div>
                      )}

          {/* F-05 & F-06 : Rapport hebdomadaire */}
          {activeTab === 'report' && selectedSession && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Rapport hebdomadaire - {selectedSession.date}</h3>
                  <p className="text-sm text-gray-600">Classe: {selectedSession.className}</p>
                    </div>
                <div className="flex gap-2">
                  {!selectedSession.reportGenerated ? (
                    <button
                      onClick={generateReport}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
                    >
                      <Download size={16} />
                      Générer le rapport
                    </button>
                  ) : (
                    <>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <Download size={16} />
                        Télécharger
                      </button>
                      {!selectedSession.reportShared && (
                        <button 
                          onClick={shareWithParents}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                          <Share2 size={16} />
                          Partager avec les parents
                        </button>
                      )}
                    </>
                      )}
                    </div>
        </div>

              {selectedSession.reportGenerated && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle size={20} />
                    <span className="font-medium">Rapport généré avec succès</span>
            </div>
                  {selectedSession.reportShared && (
                    <p className="text-green-700 text-sm mt-1">Parents notifiés automatiquement</p>
                  )}
            </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdiDetailPage; 
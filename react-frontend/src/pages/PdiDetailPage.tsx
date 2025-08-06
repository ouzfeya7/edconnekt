import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockFacilitators, Facilitator, mockPdiStudents, PdiStudent } from '../lib/mock-data';
import { PdiSession, PdiSessionStudent } from '../types/pdi';
import { useFilters } from '../contexts/FilterContext';

// Import des composants réutilisables
import TrimestreCard from '../components/Header/TrimestreCard';
import PdiCard from '../components/Header/PdiCard';
import CircularProgress from '../components/ui/CircularProgress';
import StudentObservationCard from '../components/pdi/StudentObservationCard';
import ObservationTemplates from '../components/pdi/ObservationTemplates';
import {
  Briefcase, AlertTriangle, Users, FileText, Bell, Target, Check, 
  TrendingDown, TrendingUp, Download, Share2, Clock, CheckCircle,
  Calendar, Eye, EyeOff, Save, X
} from 'lucide-react';

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

  // Ajouter des observations par défaut pour certains élèves
  let observations = '';
  if (globalScore < 50) {
    observations = 'Élève en difficulté nécessitant un suivi renforcé. Recommandation : séances de remédiation 2x par semaine.';
  } else if (globalScore < 70) {
    observations = 'Progrès notables mais encore des efforts à fournir. Encourager la pratique à domicile.';
  } else if (globalScore >= 90) {
    observations = 'Excellent niveau. Possibilité d\'enrichissement et de défi pour maintenir la motivation.';
  }

  return {
    ...student,
    presence: 'present' as const, // Par défaut présent
    globalScore,
    difficultyLevel,
    needsAssistance,
    alerts,
    observations
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
  
  // Distribution des élèves par classe (5 élèves par classe)
  const studentsPerClass = 5;
  
  // Créer une séance par classe du facilitateur avec les dates de mercredi fixes
  return facilitator.classes.map((className, index) => {
    const sessionDate = wednesdayDates[index] || wednesdayDates[0]; // Fallback si plus de classes que de dates
    const startIndex = index * studentsPerClass;
    const endIndex = startIndex + studentsPerClass;
    const classStudents = sessionStudents.slice(startIndex, endIndex);

    return {
      id: `${index + 1}`,
      date: sessionDate,
      classId: `class-${index + 1}`,
      className: className,
      status: 'completed' as const,
      students: classStudents,
      observations: `Séance productive avec la classe ${className}. Une bonne participation générale. Quelques élèves nécessitent un suivi renforcé.`,
      reportGenerated: true, // Tous les rapports sont générés automatiquement
      published: false // Par défaut, aucune séance n'est publiée
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
  const [activeTab, setActiveTab] = useState<'sessions' | 'difficulty' | 'observations' | 'report'>('sessions');
  const [showWarning, setShowWarning] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedStudentForTemplate, setSelectedStudentForTemplate] = useState<string | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'critique' | 'modéré' | 'léger'>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [observations, setObservations] = useState<Record<string, string>>({});
  const [showClassModal, setShowClassModal] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [tempClassFilter, setTempClassFilter] = useState<string>('all');
  const [tempDifficultyFilter, setTempDifficultyFilter] = useState<'all' | 'critique' | 'modéré' | 'léger'>('all');

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


  const handleObservationChange = (studentId: string, observation: string) => {
    // Mettre à jour l'état local des observations
    setObservations(prev => ({
      ...prev,
      [studentId]: observation
    }));
    
    // Mettre à jour les sessions
    setSessions(prev => prev.map(session => ({
      ...session,
      students: session.students.map(student => 
        student.id === studentId ? { ...student, observations: observation } : student
      )
    })));
    
    // Mettre à jour la session sélectionnée si elle existe
    setSelectedSession(prev => prev ? {
      ...prev,
      students: prev.students.map(student => 
        student.id === studentId ? { ...student, observations: observation } : student
      )
    } : null);
    
    console.log(`Observation mise à jour pour l'élève ${studentId}:`, observation);
  };



  const generateReport = () => {
    if (!selectedSession) return;
    
    setSelectedSession(prev => prev ? { ...prev, reportGenerated: true } : null);
    // Logique de génération PDF
  };

  const publishSession = () => {
    if (!selectedSession) return;
    
    if (selectedSession.published) {
      // La séance est déjà publiée - demander accord direction
      if (window.confirm('La séance a déjà été publiée. Une nouvelle version nécessite l\'accord de la direction. Continuer ?')) {
        // Logique pour demander accord direction
        console.log('Demande d\'accord direction pour nouvelle version');
      }
    } else {
      setSelectedSession(prev => prev ? { ...prev, published: true } : null);
      // Logique de notification parents
      console.log('Séance publiée avec succès');
    }
  };

  const publishSpecificSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;
    
    if (session.published) {
      if (window.confirm('Cette séance a déjà été publiée. Une nouvelle version nécessite l\'accord de la direction. Continuer ?')) {
        console.log('Demande d\'accord direction pour nouvelle version');
        // Ici on pourrait ajouter une logique pour demander l'accord de la direction
        alert('Demande d\'accord direction envoyée. Vous serez notifié de la réponse.');
      }
    } else {
      // Générer automatiquement le rapport si pas encore généré
      if (!session.reportGenerated) {
        // Générer le rapport automatiquement
        setSessions(prev => prev.map(s => 
          s.id === sessionId ? { ...s, reportGenerated: true, published: true } : s
        ));
        // Mettre à jour selectedSession si c'est la séance actuellement sélectionnée
        setSelectedSession(prev => prev?.id === sessionId ? { ...prev, reportGenerated: true, published: true } : prev);
      } else {
        // Publier directement car le rapport existe
        setSessions(prev => prev.map(s => 
          s.id === sessionId ? { ...s, published: true } : s
        ));
        // Mettre à jour selectedSession si c'est la séance actuellement sélectionnée
        setSelectedSession(prev => prev?.id === sessionId ? { ...prev, published: true } : prev);
      }
      console.log(`Séance ${sessionId} publiée avec succès`);
    }
  };

  const handleTemplateSelect = (template: { content: string }) => {
    // Copier le template dans le presse-papiers
    setCopiedTemplate(template.content);
    setShowTemplates(false);
    
    // Afficher une notification de copie
    console.log('Template copié:', template.content);
    
    // Vider le template après un délai
    setTimeout(() => {
      setCopiedTemplate(null);
    }, 30000); // 30 secondes
  };

  const openTemplates = (studentId?: string) => {
    setShowTemplates(true);
  };

  const handleStudentDoubleClick = (studentId: string) => {
    if (copiedTemplate) {
      // Coller le template copié dans l'observation de l'élève
      handleObservationChange(studentId, copiedTemplate);
      console.log(`Template collé pour l'élève ${studentId}:`, copiedTemplate);
    }
  };

  // Fonction de sauvegarde automatique
  const handleAutoSaveObservation = (studentId: string, observation: string) => {
    if (observation.trim()) {
      // Sauvegarde automatique de l'observation
      console.log(`Observation auto-sauvegardée pour l'élève ${studentId}:`, observation);
      
      // Ici on pourrait envoyer les données au serveur
      // saveObservationToServer(studentId, observation);
    }
  };

  // Fonction de sauvegarde de toutes les observations
  const handleSaveAllObservations = () => {
    const allObservations = Object.entries(observations).filter(([_, observation]) => observation && observation.trim());
    
    if (allObservations.length === 0) {
      console.log('Aucune observation à sauvegarder');
      return;
    }
    
    // Sauvegarder toutes les observations
    console.log('Sauvegarde de toutes les observations:', allObservations.map(([studentId, observation]) => ({
      studentId,
      observation
    })));
    
    // Ici on pourrait envoyer toutes les observations au serveur
    // saveAllObservationsToServer(allObservations);
  };

  // Fonctions utilitaires

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
                      <div className="flex items-center gap-2">
                        {session.published ? (
                          <span className="text-xs text-blue-600 flex items-center gap-1">
                            <Share2 size={12} />
                            Publiée
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              publishSpecificSession(session.id);
                            }}
                            className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 flex items-center gap-1"
                            title="Publier la séance (rapport généré automatiquement)"
                          >
                            <Share2 size={12} />
                            Publier
                          </button>
                        )}
                      </div>
                    </div>
           </div>
                ))}
           </div>
            </div>
          )}



          {/* F-02 : Tableau "Élèves en difficulté" - Toutes les classes */}
          {activeTab === 'difficulty' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Élèves en difficulté - Toutes les classes</h3>
                <p className="text-sm text-gray-600">Vue d'ensemble de tous les élèves nécessitant une assistance</p>
              </div>
              
              {/* Filtres et statistiques */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      setTempDifficultyFilter(difficultyFilter);
                      setShowDifficultyModal(true);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white hover:bg-gray-50 transition-colors"
                  >
                    {difficultyFilter === 'all' ? 'Tous les niveaux' : 
                     difficultyFilter === 'critique' ? 'Difficulté critique' :
                     difficultyFilter === 'modéré' ? 'Difficulté modérée' : 'Difficulté légère'}
                  </button>
                  <button 
                    onClick={() => {
                      setTempClassFilter(classFilter);
                      setShowClassModal(true);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white hover:bg-gray-50 transition-colors"
                  >
                    {classFilter === 'all' ? 'Toutes les classes' : classFilter}
                  </button>
                </div>
              </div>
              
              {/* Statistiques globales */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-600">
                    {sessions.reduce((sum, session) => 
                      sum + session.students.filter(s => s.difficultyLevel === 'critique').length, 0
                    )}
                  </div>
                  <div className="text-sm text-red-700">Élèves en difficulté critique</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-600">
                    {sessions.reduce((sum, session) => 
                      sum + session.students.filter(s => s.difficultyLevel === 'modéré').length, 0
                    )}
                  </div>
                  <div className="text-sm text-orange-700">Élèves en difficulté modérée</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {sessions.reduce((sum, session) => 
                      sum + session.students.filter(s => s.difficultyLevel === 'léger').length, 0
                    )}
                  </div>
                  <div className="text-sm text-yellow-700">Élèves en difficulté légère</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {sessions.reduce((sum, session) => 
                      sum + session.students.filter(s => s.alerts.length > 0).length, 0
                    )}
                  </div>
                  <div className="text-sm text-blue-700">Élèves avec alertes</div>
                </div>
              </div>
              
              {/* Par classe */}
              {sessions
                .filter(session => classFilter === 'all' || session.className === classFilter)
                .map(session => (
                <div key={session.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                      <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                      {session.className} - {session.date}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {session.students.filter(s => s.needsAssistance).length} élève(s) en difficulté
                    </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {session.students
                      .filter(s => s.needsAssistance)
                      .filter(s => difficultyFilter === 'all' || s.difficultyLevel === difficultyFilter)
                      .map(student => (
                  <div key={student.id} className="bg-orange-50 border border-orange-200 rounded-lg p-4 hover:shadow-md hover:border-orange-300 transition-all duration-200 ease-in-out transform hover:scale-102">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <h4 className="font-medium text-gray-800">{student.name}</h4>
                        {getDifficultyBadge(student.difficultyLevel)}
                      </div>
                    </div>
                    
                    {/* Barres de progression avec code couleur */}
                    <div className="space-y-3">
                      {/* Score global avec barre de progression */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Score global</span>
                          <span className={`text-sm font-bold ${
                            student.globalScore >= 80 ? 'text-green-600' : 
                            student.globalScore >= 60 ? 'text-orange-600' : 
                            student.globalScore >= 40 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {student.globalScore}%
                          </span>
                      </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              student.globalScore >= 80 ? 'bg-green-500' : 
                              student.globalScore >= 60 ? 'bg-orange-500' : 
                              student.globalScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${student.globalScore}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Compétences individuelles */}
                      {[
                        { name: 'Langage', score: student.langage },
                        { name: 'Conte', score: student.conte },
                        { name: 'Vocabulaire', score: student.vocabulaire },
                        { name: 'Lecture', score: student.lecture },
                        { name: 'Graphisme', score: student.graphisme }
                      ].map((competence, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">{competence.name}</span>
                            <span className={`text-xs font-medium ${
                              competence.score >= 80 ? 'text-green-600' : 
                              competence.score >= 60 ? 'text-orange-600' : 
                              competence.score >= 40 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {competence.score}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                competence.score >= 80 ? 'bg-green-400' : 
                                competence.score >= 60 ? 'bg-orange-400' : 
                                competence.score >= 40 ? 'bg-yellow-400' : 'bg-red-400'
                              }`}
                              style={{ width: `${competence.score}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {student.alerts.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {student.alerts.map((alert, index) => (
                          <div key={index} className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
                            alert.severity === 'high' ? 'bg-red-50 border border-red-200 text-red-700' :
                            alert.severity === 'medium' ? 'bg-orange-50 border border-orange-200 text-orange-700' :
                            'bg-yellow-50 border border-yellow-200 text-yellow-700'
                          }`}>
                            <Bell size={12} className="flex-shrink-0" />
                            <span className="font-medium">{alert.message}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Indicateur de niveau */}
                    <div className="mt-3 pt-3 border-t border-orange-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Niveau:</span>
                        <span className={`font-medium ${
                          student.globalScore >= 80 ? 'text-green-600' : 
                          student.globalScore >= 60 ? 'text-orange-600' : 
                          student.globalScore >= 40 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {student.globalScore >= 80 ? 'Excellent' : 
                           student.globalScore >= 60 ? 'Bon' : 
                           student.globalScore >= 40 ? 'Moyen' : 'À améliorer'}
                        </span>
                      </div>
                    </div>
                    

                  </div>
                ))}
              </div>
                  
                  {session.students.filter(s => s.needsAssistance).length === 0 && (
                    <div className="text-center py-8 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-green-600 mb-2">
                        <CheckCircle size={24} className="mx-auto" />
                      </div>
                      <p className="text-sm text-green-700">Aucun élève en difficulté dans cette classe</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* F-07 : Observations - Toutes les classes */}
          {activeTab === 'observations' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Observations par élève - Toutes les classes</h3>
                <p className="text-sm text-gray-600">Gestion des observations pour tous les élèves de toutes les classes</p>
              </div>
              
              {/* Statistiques globales des observations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {sessions.reduce((sum, session) => 
                      sum + session.students.filter(s => s.observations && s.observations.trim()).length, 0
                    )}
                  </div>
                  <div className="text-sm text-blue-700">Observations saisies</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-600">
                    {sessions.reduce((sum, session) => 
                      sum + session.students.filter(s => !s.observations || !s.observations.trim()).length, 0
                    )}
                  </div>
                  <div className="text-sm text-orange-700">Observations manquantes</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {sessions.reduce((sum, session) => sum + session.students.length, 0)}
                  </div>
                  <div className="text-sm text-green-700">Total d'élèves</div>
                </div>
              </div>
              
              {/* Par classe */}
              {sessions
                .filter(session => classFilter === 'all' || session.className === classFilter)
                .map(session => (
                <div key={session.id} className="space-y-4">
                                    <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                      <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                      {session.className} - {session.date}
                    </h4>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        {session.students.filter(s => s.observations && s.observations.trim()).length}/{session.students.length} observations saisies
                      </span>
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        Toutes les cartes sont éditables
                      </span>
                    </div>
                  </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {session.students
                      .filter(s => difficultyFilter === 'all' || s.difficultyLevel === difficultyFilter)
                      .map(student => (
                  <div 
                    key={student.id}
                    className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-200 ease-in-out transform hover:scale-102 ${
                      copiedTemplate ? 'cursor-pointer hover:border-orange-400' : ''
                    }`}
                    onDoubleClick={() => handleStudentDoubleClick(student.id)}
                    title={copiedTemplate ? "Double-cliquez pour coller le template" : ""}
                  >
                    {/* En-tête élève avec indicateur de score */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        <img src={student.avatarUrl} alt={student.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" />
                        <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold ${
                          student.globalScore >= 80 ? 'bg-green-500 text-white' : 
                          student.globalScore >= 60 ? 'bg-orange-500 text-white' : 
                          student.globalScore >= 40 ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          {student.globalScore}%
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-lg">{student.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {getDifficultyBadge(student.difficultyLevel)}
                          <span className="text-sm text-gray-500">• {student.alerts.length} alerte(s)</span>
                        </div>
                        
                        {/* Barre de progression du score global */}
                        <div className="mt-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Score global</span>
                            <span className={`text-sm font-bold ${
                              student.globalScore >= 80 ? 'text-green-600' : 
                              student.globalScore >= 60 ? 'text-orange-600' : 
                              student.globalScore >= 40 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {student.globalScore}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                student.globalScore >= 80 ? 'bg-green-500' : 
                                student.globalScore >= 60 ? 'bg-orange-500' : 
                                student.globalScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${student.globalScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                                            {/* Zone d'observation améliorée */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                            <FileText size={16} className="text-orange-500" />
                            Observations individuelles
                          </label>
                          <div className="relative">
                            <textarea
                              value={observations[student.id] || student.observations || ''}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                handleObservationChange(student.id, newValue);
                                
                                // Sauvegarde automatique après un délai
                                setTimeout(() => {
                                  if (newValue.trim()) {
                                    handleAutoSaveObservation(student.id, newValue);
                                  }
                                }, 1000); // Délai de 1 seconde
                              }}
                              onDoubleClick={() => {
                                if (copiedTemplate) {
                                  handleObservationChange(student.id, copiedTemplate);
                                  console.log(`Template collé pour ${student.name}:`, copiedTemplate);
                                }
                              }}
                              placeholder="Saisissez vos observations sur cet élève... (Double-cliquez pour coller un template)"
                              className={`w-full h-36 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                                copiedTemplate ? 'border-orange-300 bg-orange-50 cursor-pointer' : 'border-gray-300 bg-gray-50 focus:bg-white'
                              }`}
                              title={copiedTemplate ? "Double-cliquez pour coller le template" : ""}
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                              {(observations[student.id] || student.observations || '').length}/500
                            </div>
                          </div>
                        </div>
                    
                                            {/* Indicateur de sauvegarde automatique amélioré */}
                        {(observations[student.id] || student.observations) && (
                          <div className="mt-4 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                            <CheckCircle size={16} />
                            <span className="font-medium">Sauvegardé automatiquement</span>
                            <span className="text-xs text-green-500">• {new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                        )}
                    
                    {/* Alertes de l'élève */}
                    {student.alerts.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {student.alerts.map((alert, index) => (
                          <div key={index} className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
                            alert.severity === 'high' ? 'bg-red-50 border border-red-200 text-red-700' :
                            alert.severity === 'medium' ? 'bg-orange-50 border border-orange-200 text-orange-700' :
                            'bg-yellow-50 border border-yellow-200 text-yellow-700'
                          }`}>
                            <Bell size={12} />
                            <span className="font-medium">{alert.message}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    
                  </div>
                ))}
              </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button 
                  onClick={() => handleSaveAllObservations()}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  Sauvegarder toutes les observations
                </button>
                <button 
                  onClick={() => openTemplates()}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Templates
                </button>
              </div>
            </div>
          )}

          {/* F-05 & F-06 : Rapport hebdomadaire */}
          {activeTab === 'report' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Rapports publiés</h3>
                  <p className="text-sm text-gray-600">Tous les rapports PDI publiés</p>
                </div>
              </div>

              {/* Liste des rapports publiés avec détails */}
              <div className="space-y-6">
                {sessions.filter(session => session.published).map(session => (
                  <div key={session.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    {/* En-tête du rapport */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{session.date}</h4>
                        <span className="text-sm text-orange-600 font-medium">{session.className}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle size={16} />
                          Publié
                        </span>
                        <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center gap-2">
                          <Download size={14} />
                          Télécharger
                        </button>
                </div>
              </div>

                    {/* Résumé du rapport */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center bg-blue-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-600">{session.students.length}</div>
                    <div className="text-sm text-gray-600">Élèves participants</div>
                  </div>
                      <div className="text-center bg-orange-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-600">
                          {Math.round(session.students.reduce((sum, s) => sum + s.globalScore, 0) / session.students.length)}%
                    </div>
                    <div className="text-sm text-gray-600">Moyenne de la classe</div>
                  </div>
                      <div className="text-center bg-red-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-red-600">
                          {session.students.filter(s => s.needsAssistance).length}
                    </div>
                    <div className="text-sm text-gray-600">Élèves en difficulté</div>
                  </div>
                </div>

                    {/* Détails par élève */}
                    <div className="mb-6">
                      <h6 className="font-semibold text-gray-800 mb-4">Détails par élève</h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {session.students.map(student => (
                          <div key={student.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-200 ease-in-out transform hover:scale-102">
                            {/* En-tête élève */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="relative">
                                <img src={student.avatarUrl} alt={student.name} className="w-12 h-12 rounded-full object-cover" />
                                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold ${
                                  student.globalScore >= 80 ? 'bg-green-500 text-white' : 
                                  student.globalScore >= 60 ? 'bg-orange-500 text-white' : 
                                  student.globalScore >= 40 ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                                }`}>
                                  {student.globalScore}%
                                </div>
                              </div>
                              <div className="flex-1">
                                <h6 className="font-semibold text-gray-800">{student.name}</h6>
                                {getDifficultyBadge(student.difficultyLevel)}
                              </div>
                            </div>
                            
                            {/* Barres de progression avec code couleur */}
                            <div className="space-y-3">
                              {/* Score global avec barre de progression */}
                              <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-700">Score global</span>
                                  <span className={`text-sm font-bold ${
                                    student.globalScore >= 80 ? 'text-green-600' : 
                                    student.globalScore >= 60 ? 'text-orange-600' : 
                                    student.globalScore >= 40 ? 'text-yellow-600' : 'text-red-600'
                                  }`}>
                                    {student.globalScore}%
                                  </span>
                              </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                      student.globalScore >= 80 ? 'bg-green-500' : 
                                      student.globalScore >= 60 ? 'bg-orange-500' : 
                                      student.globalScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${student.globalScore}%` }}
                                  ></div>
                              </div>
                              </div>

                              {/* Compétences individuelles */}
                              {[
                                { name: 'Langage', score: student.langage },
                                { name: 'Conte', score: student.conte },
                                { name: 'Vocabulaire', score: student.vocabulaire },
                                { name: 'Lecture', score: student.lecture },
                                { name: 'Graphisme', score: student.graphisme }
                              ].map((competence, index) => (
                                <div key={index} className="space-y-1">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">{competence.name}</span>
                                    <span className={`text-xs font-medium ${
                                      competence.score >= 80 ? 'text-green-600' : 
                                      competence.score >= 60 ? 'text-orange-600' : 
                                      competence.score >= 40 ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                      {competence.score}%
                                    </span>
                              </div>
                                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div 
                                      className={`h-1.5 rounded-full transition-all duration-300 ${
                                        competence.score >= 80 ? 'bg-green-400' : 
                                        competence.score >= 60 ? 'bg-orange-400' : 
                                        competence.score >= 40 ? 'bg-yellow-400' : 'bg-red-400'
                                      }`}
                                      style={{ width: `${competence.score}%` }}
                                    ></div>
                              </div>
                              </div>
                              ))}
                            </div>

                            {/* Alertes avec icônes */}
                            {student.alerts.length > 0 && (
                              <div className="mt-4 space-y-2">
                                {student.alerts.map((alert, index) => (
                                  <div key={index} className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
                                    alert.severity === 'high' ? 'bg-red-50 border border-red-200 text-red-700' :
                                    alert.severity === 'medium' ? 'bg-orange-50 border border-orange-200 text-orange-700' :
                                    'bg-yellow-50 border border-yellow-200 text-yellow-700'
                                  }`}>
                                    <Bell size={12} className="flex-shrink-0" />
                                    <span className="font-medium">{alert.message}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Indicateur de niveau */}
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Niveau:</span>
                                <span className={`font-medium ${
                                  student.globalScore >= 80 ? 'text-green-600' : 
                                  student.globalScore >= 60 ? 'text-orange-600' : 
                                  student.globalScore >= 40 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {student.globalScore >= 80 ? 'Excellent' : 
                                   student.globalScore >= 60 ? 'Bon' : 
                                   student.globalScore >= 40 ? 'Moyen' : 'À améliorer'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Observations générales */}
                    {session.observations && (
                      <div>
                        <h6 className="font-semibold text-gray-800 mb-3">Observations générales</h6>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-gray-700 text-sm">{session.observations}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Message si aucun rapport publié */}
              {sessions.filter(session => session.published).length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <FileText size={48} className="mx-auto" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-600 mb-2">Aucun rapport publié</h4>
                  <p className="text-sm text-gray-500">
                    Publiez une séance pour qu'elle apparaisse dans les rapports
                  </p>
                </div>
              )}


            </div>
          )}
        </div>
        {/* Modal des templates d'observations */}
        {showTemplates && (
          <ObservationTemplates
            onTemplateSelect={handleTemplateSelect}
            onClose={() => setShowTemplates(false)}
          />
        )}

        {/* Modal de sélection de classe */}
        {showClassModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Sélectionner une classe</h3>
                <button 
                  onClick={() => setShowClassModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  onClick={() => setTempClassFilter('all')}
                  className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                    tempClassFilter === 'all' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Toutes
                </button>
                {sessions.map(session => (
                  <button
                    key={session.id}
                    onClick={() => setTempClassFilter(session.className)}
                    className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                      tempClassFilter === session.className 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {session.className}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowClassModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    setClassFilter(tempClassFilter);
                    setShowClassModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de sélection de niveau de difficulté */}
        {showDifficultyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Sélectionner un niveau</h3>
                <button 
                  onClick={() => setShowDifficultyModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => setTempDifficultyFilter('all')}
                  className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                    tempDifficultyFilter === 'all' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Tous les niveaux
                </button>
                <button
                  onClick={() => setTempDifficultyFilter('critique')}
                  className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                    tempDifficultyFilter === 'critique' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Difficulté critique
                </button>
                <button
                  onClick={() => setTempDifficultyFilter('modéré')}
                  className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                    tempDifficultyFilter === 'modéré' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Difficulté modérée
                </button>
                <button
                  onClick={() => setTempDifficultyFilter('léger')}
                  className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                    tempDifficultyFilter === 'léger' 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Difficulté légère
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDifficultyModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    setDifficultyFilter(tempDifficultyFilter);
                    setShowDifficultyModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PdiDetailPage; 
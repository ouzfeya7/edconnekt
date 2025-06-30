import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockRemediations, RemediationStudent } from '../lib/mock-data';
import { 
  ArrowLeft, User, Calendar, BookOpen, CheckCircle, Clock, Loader, 
  Target, MapPin, Users, FileText, Download, Send, BarChart3, 
  TrendingUp, AlertCircle, History, Settings, Bell, PlusCircle, 
  Play, Gamepad2, BookOpenCheck, MessageSquare, ChevronDown, ChevronRight
} from 'lucide-react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { ActionCard } from '../components/ui/ActionCard';

const statusInfo = {
  upcoming: { 
    icon: <Clock className="w-5 h-5 text-orange-600" />, 
    color: "text-orange-600",
    label: "À venir" 
  },
  in_progress: { 
    icon: <Loader className="w-5 h-5 text-orange-600 animate-spin" />, 
    color: "text-orange-600",
    label: "En cours"
  },
  completed: { 
    icon: <CheckCircle className="w-5 h-5 text-green-600" />, 
    color: "text-green-600",
    label: "Terminé"
  },
};

const resourceTypeIcons = {
  fiche_cours: <FileText className="w-4 h-4" />,
  exercice: <BookOpenCheck className="w-4 h-4" />,
  support_audio: <Play className="w-4 h-4" />,
  support_video: <Play className="w-4 h-4" />,
  jeu_educatif: <Gamepad2 className="w-4 h-4" />
};

const RemediationDetailPage = () => {
  const { t } = useTranslation();
  const { remediationId } = useParams<{ remediationId: string }>();
  const remediation = mockRemediations.find(r => r.id === remediationId);

  const [students, setStudents] = useState<RemediationStudent[]>(remediation?.students || []);
  const [activeTab, setActiveTab] = useState<'overview' | 'method' | 'resources' | 'history' | 'pdi'>('overview');
  const [showParentReport, setShowParentReport] = useState(false);
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);

  if (!remediation) {
    return (
      <div className="bg-white min-h-screen p-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Session de remédiation introuvable</h2>
          <Link to="/mes-cours" className="text-orange-600 hover:text-orange-700 font-medium">
            Retour à la liste des cours
          </Link>
        </div>
      </div>
    );
  }

  const handleStatusChange = (studentId: string, newStatus: 'present' | 'absent' | 'late') => {
    setStudents(currentStudents =>
      currentStudents.map(student =>
        student.id === studentId ? { ...student, status: newStatus } : student
      )
    );
  };

  const currentStatusInfo = statusInfo[remediation.status];

  // Calculs des statistiques
  const studentsPresent = students.filter(s => s.status === 'present').length;
  const competencesAcquired = students.filter(s => s.competenceAcquired).length;
  const averageImprovement = students
    .filter(s => s.remediationGrade && s.initialGrade)
    .reduce((acc, s) => acc + (s.remediationGrade! - s.initialGrade!), 0) / 
    students.filter(s => s.remediationGrade && s.initialGrade).length || 0;

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* En-tête avec design orange cohérent */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm border border-orange-200/50 p-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/8 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/6 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-800">Objectif de la session</h3>
                </div>
                <p className="text-slate-700 mb-3">{remediation.objective}</p>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-slate-600">Compétence visée :</span>
                  <span className="text-slate-800">{remediation.skillToAcquire}</span>
                </div>
              </div>
            </div>

            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { icon: <Calendar className="w-5 h-5 text-slate-500" />, label: "Date", value: dayjs(remediation.date).format('dddd D MMMM YYYY') },
                { icon: <BookOpen className="w-5 h-5 text-slate-500" />, label: "Matière", value: remediation.subject },
                { icon: <Clock className="w-5 h-5 text-slate-500" />, label: "Durée", value: `${remediation.duration} minutes` },
                { icon: <MapPin className="w-5 h-5 text-slate-500" />, label: "Lieu", value: remediation.location }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <div>
                      <p className="text-sm font-medium text-slate-600">{item.label}</p>
                      <p className="text-slate-800">{item.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Statistiques de la session */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Élèves présents</p>
                    <p className="text-2xl font-bold text-green-700">{studentsPresent}/{remediation.studentCount}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Compétences acquises</p>
                    <p className="text-2xl font-bold text-orange-700">{competencesAcquired}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-orange-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Amélioration moyenne</p>
                    <p className="text-2xl font-bold text-slate-800">+{Math.round(averageImprovement)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-slate-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Progression PDI</p>
                    <p className="text-2xl font-bold text-orange-700">{remediation.pdiIntegration.competenceTracking.current}%</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Liste des élèves avec notes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-slate-800 flex items-center">
                  <User className="w-6 h-6 mr-3 text-slate-500" />
                  Suivi des élèves ({remediation.studentCount})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-slate-700">Élève</th>
                      <th className="text-center p-4 font-semibold text-slate-700">Présence</th>
                      <th className="text-center p-4 font-semibold text-slate-700">Note initiale</th>
                      <th className="text-center p-4 font-semibold text-slate-700">Note remédiation</th>
                      <th className="text-center p-4 font-semibold text-slate-700">Progression</th>
                      <th className="text-center p-4 font-semibold text-slate-700">Compétence</th>
                      <th className="text-center p-4 font-semibold text-slate-700">Parents informés</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full"/>
                            <span className="font-medium text-slate-800">{student.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <select
                            value={student.status}
                            onChange={(e) => handleStatusChange(student.id, e.target.value as 'present' | 'absent' | 'late')}
                            className={`border-none text-center cursor-pointer px-3 py-1 text-xs font-semibold rounded-full ${
                              student.status === 'present' ? 'bg-green-100 text-green-800' :
                              student.status === 'absent' ? 'bg-red-100 text-red-800' :
                              'bg-amber-100 text-amber-800'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
                          >
                            <option value="present">{t('present')}</option>
                            <option value="absent">{t('absent')}</option>
                            <option value="late">{t('late')}</option>
                          </select>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-slate-700">{student.initialGrade || '-'}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-slate-700">{student.remediationGrade || '-'}</span>
                        </td>
                        <td className="p-4 text-center">
                          {student.initialGrade && student.remediationGrade ? (
                            <span className={`font-bold ${
                              student.remediationGrade > student.initialGrade ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {student.remediationGrade > student.initialGrade ? '+' : ''}{student.remediationGrade - student.initialGrade}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="p-4 text-center">
                          {student.competenceAcquired ? (
                            <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-600 mx-auto" />
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {student.parentNotified ? (
                            <Send className="w-5 h-5 text-orange-600 mx-auto" />
                          ) : (
                            <MessageSquare className="w-5 h-5 text-gray-400 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'method':
        return (
          <div className="space-y-6">
            {remediation.method ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Settings className="w-6 h-6 text-orange-600" />
                  <h3 className="text-xl font-bold text-slate-800">Méthode de remédiation utilisée</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">Nom de la méthode</p>
                    <p className="text-slate-800">{remediation.method.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">Type</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      remediation.method.type === 'individuel' ? 'bg-orange-100 text-orange-800' :
                      remediation.method.type === 'groupe' ? 'bg-green-100 text-green-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {remediation.method.type}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">Durée recommandée</p>
                    <p className="text-slate-800">{remediation.method.duration} minutes</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-slate-600 mb-2">Description</p>
                  <p className="text-slate-700 leading-relaxed">{remediation.method.description}</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-slate-600">Aucune méthode spécifique documentée pour cette session</p>
              </div>
            )}
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Ressources pédagogiques</h3>
              <ActionCard
                icon={<PlusCircle className="w-4 h-4" />}
                label="Ajouter une ressource"
                onClick={() => {}}
                className="bg-orange-600 text-white hover:bg-orange-700"
              />
            </div>
            
            {remediation.resources && remediation.resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {remediation.resources.map((resource) => (
                  <div key={resource.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        {resourceTypeIcons[resource.type]}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800 mb-1">{resource.title}</h4>
                        <p className="text-sm text-slate-600 mb-3">{resource.description}</p>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            resource.type === 'fiche_cours' ? 'bg-orange-100 text-orange-800' :
                            resource.type === 'exercice' ? 'bg-green-100 text-green-800' :
                            resource.type === 'support_audio' ? 'bg-slate-100 text-slate-800' :
                            resource.type === 'support_video' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {resource.type.replace('_', ' ')}
                          </span>
                          <button className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 text-sm font-medium">
                            <Download className="w-4 h-4" />
                            <span>Télécharger</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-slate-600 mb-3">Aucune ressource documentée pour cette session</p>
                <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                  Ajouter des ressources
                </button>
              </div>
            )}
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Historique des remédiations</h3>
            
            {remediation.history && remediation.history.length > 0 ? (
              <div className="space-y-4">
                {remediation.history.map((historyItem) => (
                  <div key={historyItem.sessionId} className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => setExpandedHistory(
                        expandedHistory === historyItem.sessionId ? null : historyItem.sessionId
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <History className="w-5 h-5 text-slate-500" />
                          <div>
                            <p className="font-semibold text-slate-800">
                              Session du {dayjs(historyItem.date).format('DD/MM/YYYY')}
                            </p>
                            <p className="text-sm text-slate-600">{historyItem.method.name}</p>
                          </div>
                        </div>
                        {expandedHistory === historyItem.sessionId ? 
                          <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        }
                      </div>
                    </div>
                    
                    {expandedHistory === historyItem.sessionId && (
                      <div className="px-4 pb-4 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{historyItem.results.studentsImproved}</p>
                            <p className="text-sm text-slate-600">Élèves améliorés</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-orange-600">+{historyItem.results.averageImprovement}</p>
                            <p className="text-sm text-slate-600">Amélioration moyenne</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-slate-700">{historyItem.results.competencesAcquired}</p>
                            <p className="text-sm text-slate-600">Compétences acquises</p>
                          </div>
                        </div>
                        
                        {historyItem.resources.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-semibold text-slate-600 mb-2">Ressources utilisées :</p>
                            <div className="flex flex-wrap gap-2">
                              {historyItem.resources.map(resource => (
                                <span key={resource.id} className="px-2 py-1 bg-gray-100 text-slate-700 text-xs rounded">
                                  {resource.title}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-slate-600">Aucun historique de remédiation disponible</p>
              </div>
            )}
          </div>
        );

      case 'pdi':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Intégration PDI et Suivi</h3>
            
            {/* Suivi des compétences */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-orange-600" />
                Progression des compétences
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-2">Niveau initial</p>
                  <div className="text-3xl font-bold text-red-600">{remediation.pdiIntegration.competenceTracking.initial}%</div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-2">Niveau actuel</p>
                  <div className="text-3xl font-bold text-orange-600">{remediation.pdiIntegration.competenceTracking.current}%</div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-2">Objectif</p>
                  <div className="text-3xl font-bold text-green-600">{remediation.pdiIntegration.competenceTracking.target}%</div>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-red-500 via-orange-500 to-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(remediation.pdiIntegration.competenceTracking.current / remediation.pdiIntegration.competenceTracking.target) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Début</span>
                  <span>Progression actuelle</span>
                  <span>Objectif</span>
                </div>
              </div>
            </div>

            {/* Alertes et notifications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-orange-600" />
                Alertes et notifications
              </h4>
              {remediation.pdiIntegration.alertsGenerated.length > 0 ? (
                <div className="space-y-2">
                  {remediation.pdiIntegration.alertsGenerated.map((alert, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <span className="text-orange-800">{alert}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600">Aucune alerte générée</p>
              )}
            </div>

            {/* Rapport hebdomadaire */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-orange-600" />
                Rapport hebdomadaire PDI
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-700">
                    Statut : {remediation.pdiIntegration.weeklyReportGenerated ? (
                      <span className="text-green-600 font-semibold">Généré</span>
                    ) : (
                      <span className="text-orange-600 font-semibold">En attente</span>
                    )}
                  </p>
                  {remediation.pdiIntegration.weeklyReportGenerated && (
                    <p className="text-sm text-slate-600 mt-1">
                      Dernière mise à jour : {dayjs().subtract(1, 'day').format('DD/MM/YYYY')}
                    </p>
                  )}
                </div>
                <ActionCard
                  icon={<Download className="w-4 h-4" />}
                  label="Télécharger"
                  onClick={() => {}}
                  className="bg-orange-600 text-white hover:bg-orange-700"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/mes-cours" className="flex items-center text-sm text-orange-600 hover:text-orange-700 mb-6 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à mes cours
        </Link>

        {/* En-tête avec design orange cohérent */}
        <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm border border-orange-200/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/8 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/6 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm font-semibold text-orange-600 uppercase tracking-wider">{remediation.theme}</p>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">{remediation.title}</h1>
                <p className="text-slate-600 mt-2">Enseignant : {remediation.teacher}</p>
              </div>
              <div className={`flex items-center font-semibold text-lg ${currentStatusInfo.color}`}>
                {currentStatusInfo.icon}
                <span className="ml-2">{t(currentStatusInfo.label)}</span>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="flex flex-wrap gap-3">
              <ActionCard
                icon={<Send className="w-4 h-4" />}
                label="Informer les parents"
                onClick={() => setShowParentReport(true)}
                className="bg-orange-600 text-white hover:bg-orange-700"
              />
              <ActionCard
                icon={<Download className="w-4 h-4" />}
                label="Exporter le rapport"
                onClick={() => {}}
              />
              <ActionCard
                icon={<BarChart3 className="w-4 h-4" />}
                label="Voir les statistiques"
                onClick={() => {}}
              />
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Vue d\'ensemble', icon: <BarChart3 className="w-4 h-4" /> },
                { key: 'method', label: 'Méthode', icon: <Settings className="w-4 h-4" /> },
                { key: 'resources', label: 'Ressources', icon: <FileText className="w-4 h-4" /> },
                { key: 'history', label: 'Historique', icon: <History className="w-4 h-4" /> },
                { key: 'pdi', label: 'Suivi PDI', icon: <TrendingUp className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as 'overview' | 'method' | 'resources' | 'history' | 'pdi')}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>

        {/* Modal de communication aux parents */}
        {showParentReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-4">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Communication aux parents</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Objet</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    defaultValue={`Remédiation en ${remediation.subject} - ${remediation.title}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    defaultValue={remediation.parentReport?.content || `Votre enfant a participé à une session de remédiation en ${remediation.subject}. Cette session avait pour objectif de travailler sur : ${remediation.skillToAcquire}`}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <ActionCard
                    label="Annuler"
                    onClick={() => setShowParentReport(false)}
                    icon={<></>}
                  />
                  <ActionCard
                    label="Envoyer"
                    onClick={() => setShowParentReport(false)}
                    icon={<Send className="w-4 h-4" />}
                    className="bg-orange-600 text-white hover:bg-orange-700"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemediationDetailPage; 
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockFacilitators, pdiSessionStats, Facilitator } from '../lib/mock-data';
import { useFilters } from '../contexts/FilterContext';

// Import des composants réutilisables
import DateCard from '../components/Header/DateCard';
import TrimestreCard from '../components/Header/TrimestreCard';
import PdiCard from '../components/Header/PdiCard';
import StatsCard from '../components/Header/StatsCard';
import CircularProgress from '../components/ui/CircularProgress';
import ClassTabs from '../components/pdi/ClassTabs';
import {
  Briefcase, MoreHorizontal, Filter, AlertTriangle, TrendingDown, TrendingUp, Users, FileText, Bell, Target, Check, Minus, ArrowRight, Download,
} from 'lucide-react';

// Nouveaux imports pour le tableau et la toolbar
import Toolbar from '../components/ui/Toolbar';
import { mockPdiStudents, PdiStudent } from '../lib/mock-data';

// Interface pour les données du tableau PDI amélioré
interface PdiTableData {
  id: string;
  student: PdiStudent;
  needsAssistance: boolean;
  difficultyLevel: 'critique' | 'modéré' | 'léger' | 'normal';
  competencesEnDifficulte: string[];
  scoreGlobal: number;
  weeklyProgress: number; // Progression depuis la semaine dernière
  alertes: Array<{
    type: 'absence' | 'regression' | 'plateau' | 'attention_urgente';
    message: string;
    severity: 'high' | 'medium' | 'low';
  }>;

  rapportGenere: boolean;
}

const PdiDetailPage: React.FC = () => {
  const { facilitatorId } = useParams<{ facilitatorId: string }>();
  const facilitator = mockFacilitators.find((f: Facilitator) => f.id === facilitatorId);

  // États pour les filtres de l'en-tête
  const { currentDate, currentTrimestre, setCurrentTrimestre } = useFilters();
  const [pdi, setPdi] = useState('PDI 08-13');
  
  // États pour le tableau (recherche et pagination)
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterLevel, setFilterLevel] = useState<'tous' | 'critique' | 'modéré' | 'léger' | 'alertes'>('tous');
  const [showAlertsOnly, setShowAlertsOnly] = useState(false);
  const itemsPerPage = 5;

  if (!facilitator) {
    return <div className="p-6">Facilitateur non trouvé.</div>;
  }

  const handleTabChange = (selectedClass: string) => {
    console.log("Classe sélectionnée :", selectedClass);
  };

  // Fonction pour générer des alertes automatiques selon le système de l'école
  const generateAlertes = (student: PdiStudent, scoreGlobal: number, competencesEnDifficulte: string[]) => {
    const alertes = [];

    // Alerte "Pas Réussi" - critique (0-30)
    if (scoreGlobal < 30) {
      alertes.push({
        type: 'regression' as const,
        message: 'Score critique - Pas Réussi',
        severity: 'high' as const
      });
    }

    // Alerte "Peu Réussi" - plateau (30-50)
    if (scoreGlobal >= 30 && scoreGlobal < 50) {
      alertes.push({
        type: 'plateau' as const,
        message: 'Peu Réussi - Renforcement nécessaire',
        severity: 'medium' as const
      });
    }

    // Alerte attention urgente pour multiples compétences en difficulté
    if (competencesEnDifficulte.length >= 3) {
      alertes.push({
        type: 'attention_urgente' as const,
        message: 'Intervention immédiate requise',
        severity: 'high' as const
      });
    }

    return alertes;
  };

  // Fonction pour analyser les difficultés d'un élève avec suivi hebdomadaire
  const analyzeStudentDifficulties = (student: PdiStudent): PdiTableData => {
    const scores = [student.langage, student.conte, student.vocabulaire, student.lecture, student.graphisme];
    const scoreGlobal = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    
    // Seuils selon le système officiel de l'école
    const seuilPasReussi = 30;      // 0-30: Pas Réussi (Rouge)
    const seuilPeuReussi = 50;      // 30-50: Peu Réussi (Orange)
    const seuilReussi = 70;         // 50-70: Réussi (Jaune)
    const seuilBienReussi = 90;     // 70-90: Bien Réussi (Vert clair)
    // 90-100: Très Bien Réussi (Vert foncé)
    
    const competencesEnDifficulte: string[] = [];
    const scoresByCompetence = {
      'Langage': student.langage,
      'Conte': student.conte,
      'Vocabulaire': student.vocabulaire,
      'Lecture': student.lecture,
      'Graphisme': student.graphisme
    };

    // Identifier les compétences en difficulté (< 50 = Peu/Pas Réussi)
    Object.entries(scoresByCompetence).forEach(([competence, score]) => {
      if (score < seuilPeuReussi) {
        competencesEnDifficulte.push(competence);
      }
    });

    // Déterminer le niveau de difficulté selon le système de l'école
    let difficultyLevel: 'critique' | 'modéré' | 'léger' | 'normal';
    let needsAssistance = false;

    if (scoreGlobal < seuilPasReussi || competencesEnDifficulte.length >= 3) {
      difficultyLevel = 'critique';    // Pas Réussi (0-30)
      needsAssistance = true;
    } else if (scoreGlobal < seuilPeuReussi || competencesEnDifficulte.length >= 2) {
      difficultyLevel = 'modéré';      // Peu Réussi (30-50)
      needsAssistance = true;
    } else if (scoreGlobal < seuilReussi || competencesEnDifficulte.length >= 1) {
      difficultyLevel = 'léger';       // Réussi mais à surveiller (50-70)
      needsAssistance = true;
    } else {
      difficultyLevel = 'normal';      // Bien/Très Bien Réussi (70+)
      needsAssistance = false;
    }

    // Génération des alertes automatiques
    const alertes = generateAlertes(student, scoreGlobal, competencesEnDifficulte);

    // Simulation de données de suivi hebdomadaire
    const weeklyProgress = Math.round((Math.random() - 0.5) * 20); // -10 à +10
    const rapportGenere = Math.random() < 0.7; // 70% ont un rapport généré

    return {
      id: student.id,
      student,
      needsAssistance,
      difficultyLevel,
      competencesEnDifficulte,
      scoreGlobal,
      weeklyProgress,
      alertes,
      rapportGenere
    };
  };

  // Transformation des données avec analyse des difficultés
  const analyzedStudents = mockPdiStudents.map(analyzeStudentDifficulties);

  // Filtrage et pagination des élèves
  const filteredStudents = analyzedStudents.filter(data => {
    const matchesSearch = data.student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterLevel === 'tous' || 
                         (filterLevel === 'alertes' && data.alertes.length > 0) ||
                         data.difficultyLevel === filterLevel;
    const matchesAlerts = !showAlertsOnly || data.alertes.length > 0;
    return matchesSearch && matchesFilter && matchesAlerts;
  });

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calcul des statistiques d'assistance
  const studentsNeedingAssistance = analyzedStudents.filter(data => data.needsAssistance);
  const criticalStudents = analyzedStudents.filter(data => data.difficultyLevel === 'critique');
  const studentsWithAlerts = analyzedStudents.filter(data => data.alertes.length > 0);
  const rapportsEnAttente = analyzedStudents.filter(data => !data.rapportGenere).length;

  // Fonction pour obtenir le style de ligne selon le niveau de difficulté
  const getRowStyle = (difficultyLevel: string, hasAlerts: boolean) => {
    switch (difficultyLevel) {
      case 'critique':
        return 'bg-white hover:bg-gray-50';
      case 'modéré':
        return 'bg-white hover:bg-gray-50';
      case 'léger':
        return 'bg-white hover:bg-gray-50';
      default:
        return 'bg-white hover:bg-gray-50';
    }
  };

  // Fonction pour obtenir le badge de difficulté selon le système de l'école
  const getDifficultyBadge = (difficultyLevel: string) => {
    switch (difficultyLevel) {
      case 'critique':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertTriangle size={12} />
            Pas Réussi
          </span>
        );
      case 'modéré':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <TrendingDown size={12} />
            Peu Réussi
          </span>
        );
      case 'léger':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Check size={14} className="text-green-600" />
            Réussi
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Bien Réussi
          </span>
        );
    }
  };

  // Fonction pour afficher les alertes
  const renderAlertes = (alertes: PdiTableData['alertes']) => {
    if (alertes.length === 0) return <span className="text-gray-400">Aucune</span>;
    
    return (
      <div className="space-y-1">
        {alertes.map((alerte, index) => (
          <div key={index} className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
            alerte.severity === 'high' ? 'bg-red-100 text-red-700' :
            alerte.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            <Bell size={10} />
            <span>{alerte.message}</span>
          </div>
        ))}
      </div>
    );
  };

  // Fonction pour formatter les scores avec les couleurs officielles de l'école
  const formatScoreWithColor = (score: number) => {
    let colorClass = '';
    if (score >= 90) colorClass = 'text-green-800 font-bold';        // Très Bien Réussi (90-100)
    else if (score >= 70) colorClass = 'text-green-600 font-semibold'; // Bien Réussi (70-90)
    else if (score >= 50) colorClass = 'text-yellow-600';              // Réussi (50-70)
    else if (score >= 30) colorClass = 'text-orange-600 font-semibold'; // Peu Réussi (30-50)
    else colorClass = 'text-red-600 font-bold';                       // Pas Réussi (0-30)
    
    return <span className={colorClass}>{score}%</span>;
  };

  // Fonction pour afficher la progression hebdomadaire
  const renderWeeklyProgress = (progress: number) => {
    const isPositive = progress > 0;
    const isNeutral = progress === 0;
    
    return (
      <div className={`flex items-center gap-1 text-sm ${
        isPositive ? 'text-green-600' : isNeutral ? 'text-gray-500' : 'text-red-600'
      }`}>
        {isPositive ? <TrendingUp size={14} /> : isNeutral ? null : <TrendingDown size={14} />}
        <span>{isPositive ? '+' : ''}{progress}%</span>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Fil d'Ariane */}
      <div className="text-sm text-gray-500 mb-4">
        <span>Séance PDI</span>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{facilitator.name}</span>
      </div>

      {/* En-tête avec filtres et stats générales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DateCard value={currentDate} onChange={() => {}} />
          <TrimestreCard value={currentTrimestre} onChange={setCurrentTrimestre} />
          <PdiCard value={pdi} onChange={setPdi} />
        </div>
        <StatsCard stats={pdiSessionStats} />
      </div>

      {/* Section d'information du facilitateur (Améliorée) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
        {/* En-tête du facilitateur */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
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
        
        {/* Statistiques clés du facilitateur */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Stat 1: Moyenne de la classe */}
          <div className="bg-gray-50/80 rounded-xl p-4 flex flex-col items-center justify-center border border-gray-200 text-center">
            <p className="text-xs sm:text-sm text-gray-500 mb-2">Moyenne Classe</p>
            <CircularProgress percentage={facilitator.stats.avg} />
          </div>

          {/* Stat 2: Compétence acquise */}
          <div className="bg-gray-50/80 rounded-xl p-4 flex flex-col items-center justify-center border border-gray-200 text-center">
            <p className="text-xs sm:text-sm text-gray-500 mb-2">Comp. acquise</p>
            <CircularProgress percentage={facilitator.stats.acquired} />
          </div>

          {/* Stat 3: Compétence non acquise */}
          <div className="bg-gray-50/80 rounded-xl p-4 flex flex-col items-center justify-center border border-gray-200 text-center">
            <p className="text-xs sm:text-sm text-gray-500 mb-2">Comp. non acquise</p>
            <CircularProgress percentage={facilitator.stats.notAcquired} />
          </div>
          
          {/* Stat 4: Élèves à remédier (mise en avant) */}
          <div className="bg-red-50 rounded-xl p-4 flex flex-col items-center justify-center border border-red-200 text-center">
            <p className="text-xs sm:text-sm text-red-600 font-semibold mb-1">À remédier</p>
            <span className="text-4xl font-bold text-red-700">{facilitator.stats.remediation}</span>
          </div>
        </div>
      </div>

      {/* Tableau de bord PDI avec alertes intégrées */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Élèves nécessitant une assistance */}
        <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-800">À assister</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-orange-700">{studentsNeedingAssistance.length}</p>
           <p className="text-xs text-orange-600">scores &lt; 70 (besoin d'aide)</p>
         </div>

         {/* Cas critiques */}
         <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-red-100 rounded-lg">
               <AlertTriangle className="w-4 h-4 text-red-600" />
             </div>
             <div>
               <p className="text-sm font-medium text-red-800">Pas Réussi</p>
             </div>
           </div>
           <p className="text-2xl font-bold text-red-700">{criticalStudents.length}</p>
            <p className="text-xs text-red-600">score 0-30 (intervention urgente)</p>
           </div>

        {/* Alertes actives */}
        <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Bell className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-800">Alertes actives</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-700">{studentsWithAlerts.length}</p>
          <p className="text-xs text-purple-600">élèves avec alertes</p>
        </div>

        {/* Rapports en attente */}
        <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">Rapports en attente</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-700">{rapportsEnAttente}</p>
          <p className="text-xs text-blue-600">à générer cette semaine</p>
        </div>
      </div>
      
      {/* Conteneur pour onglets, toolbar et tableau */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 pt-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Élèves en difficulté</h3>
      <ClassTabs classes={facilitator.classes} onTabChange={handleTabChange} />
        </div>

        <Toolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Rechercher un élève..."
          showPagination={true}
          currentPage={currentPage}
          totalItems={filteredStudents.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          containerClassName="px-6"
          rightActions={
            <div className="flex items-center gap-2 sm:gap-4">
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value as any)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="tous">Tous les élèves</option>
                <option value="alertes">Avec alertes</option>
                <option value="critique">Pas Réussi (0-30)</option>
                <option value="modéré">Peu Réussi (30-50)</option>
                <option value="léger">Réussi (50-70)</option>
              </select>
            </div>
          }
        />
        
        {/* Tableau PDI amélioré avec suivi hebdomadaire */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Élève & Score Global
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compétences
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progression Hebdo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Niveau d'assistance
                </th>
                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Alertes intégrées
                 </th>
                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Rapport Hebdo
                 </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedStudents.map((data) => (
                <tr key={data.id} className={getRowStyle(data.difficultyLevel, data.alertes.length > 0)}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={data.student.avatarUrl} alt="" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{data.student.name}</div>
                        <div className="text-sm text-gray-500">Global: {formatScoreWithColor(data.scoreGlobal)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs">
                    <div className="grid grid-cols-2 gap-1">
                      <div>Lang: {formatScoreWithColor(data.student.langage)}</div>
                      <div>Conte: {formatScoreWithColor(data.student.conte)}</div>
                      <div>Vocab: {formatScoreWithColor(data.student.vocabulaire)}</div>
                      <div>Lect: {formatScoreWithColor(data.student.lecture)}</div>
                      <div className="col-span-2">Graph: {formatScoreWithColor(data.student.graphisme)}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {renderWeeklyProgress(data.weeklyProgress)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {getDifficultyBadge(data.difficultyLevel)}
                      {data.competencesEnDifficulte.length > 0 && (
                        <div className="text-xs text-gray-600">
                          {data.competencesEnDifficulte.join(', ')}
                        </div>
                      )}
                    </div>
                  </td>
                                     <td className="px-4 py-4">
                     {renderAlertes(data.alertes)}
                   </td>
                   <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      {data.rapportGenere ? (
                        <button 
                          className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                          aria-label="Télécharger le rapport"
                          title="Télécharger le rapport"
                        >
                          <Download size={18} />
                        </button>
                      ) : (
                        <span className="text-gray-400 font-bold" aria-label="Rapport en attente">-</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Légende et informations PDI */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-2 bg-green-800 rounded"></div>
              <span>Très Bien Réussi (90-100)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-2 bg-green-600 rounded"></div>
              <span>Bien Réussi (70-90)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-2 bg-yellow-500 rounded"></div>
              <span>Réussi (50-70)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-2 bg-orange-500 rounded"></div>
              <span>Peu Réussi (30-50)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-2 bg-red-500 rounded"></div>
              <span>Pas Réussi (0-30)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdiDetailPage; 
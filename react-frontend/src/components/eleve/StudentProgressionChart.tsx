import React, { useState } from 'react';
import { 
  BarChart3,
  TrendingUp,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EvolutionData {
  domain: string;
  color: string;
  continue: number[];
  integration: number[];
  trimestrielle: number[];
}

const getEvolutionData = (): EvolutionData[] => {
  return [
    {
      domain: "Langues et Communication",
      color: "slate",
      continue: [60, 70, 65, 75, 80, 75, 85, 80, 90],
      integration: [70, 75, 80, 75, 85, 80, 90, 85, 95],
      trimestrielle: [65, 75, 80, 85, 90, 85, 95, 90, 100]
    },
    {
      domain: "STEM",
      color: "emerald", 
      continue: [55, 60, 55, 65, 70, 65, 75, 70, 80],
      integration: [65, 70, 65, 75, 80, 75, 85, 80, 90],
      trimestrielle: [60, 70, 75, 80, 85, 80, 90, 85, 95]
    },
    {
      domain: "Sciences Humaines",
      color: "indigo",
      continue: [65, 70, 75, 70, 80, 75, 85, 80, 90],
      integration: [75, 80, 85, 80, 90, 85, 95, 90, 100],
      trimestrielle: [70, 80, 85, 90, 95, 90, 100, 95, 100]
    },
    {
      domain: "Créativité & Sport",
      color: "amber",
      continue: [80, 85, 90, 85, 95, 90, 100, 95, 100],
      integration: [90, 95, 100, 95, 100, 100, 100, 100, 100],
      trimestrielle: [85, 95, 100, 100, 100, 100, 100, 100, 100]
    }
  ];
};



interface MiniChartProps {
  data: EvolutionData;
  evaluationType: 'continue' | 'integration' | 'trimestrielle';
}

const MiniChart: React.FC<MiniChartProps> = ({ data, evaluationType }) => {
  const navigate = useNavigate();
  
  const values = data[evaluationType];
  const maxValue = 100;
  
  // Mapper les domaines vers des URLs spécifiques
  const getDomainUrl = (domain: string) => {
    const domainMapping: { [key: string]: string } = {
      "Langues et Communication": "/mes-notes?domain=langues-communication",
      "STEM": "/mes-notes?domain=stem", 
      "Sciences Humaines": "/mes-notes?domain=sciences-humaines",
      "Créativité & Sport": "/mes-notes?domain=creativite-sport"
    };
    return domainMapping[domain] || "/mes-notes";
  };
  
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'slate': return {
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        line: '#64748B',
        dot: '#475569'
      };
      case 'emerald': return {
        bg: 'bg-emerald-50', 
        border: 'border-emerald-200',
        line: '#10B981',
        dot: '#059669'
      };
      case 'indigo': return {
        bg: 'bg-indigo-50',
        border: 'border-indigo-200', 
        line: '#6366F1',
        dot: '#4F46E5'
      };
      case 'amber': return {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        line: '#F59E0B', 
        dot: '#D97706'
      };
      default: return {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        line: '#6B7280',
        dot: '#4B5563'
      };
    }
  };

  const colors = getColorClasses(data.color);
  const latestValue = values[values.length - 1];
  const previousValue = values[values.length - 2];
  const trend = latestValue > previousValue ? 'up' : latestValue < previousValue ? 'down' : 'stable';

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-lg p-4 hover:shadow-md transition-all duration-200`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-medium text-gray-900 text-sm">{data.domain}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-gray-800">{latestValue}%</span>
            {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
            {trend === 'down' && <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />}
          </div>
        </div>
        <button
          onClick={() => navigate(getDomainUrl(data.domain))}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
          title={`Voir les détails de ${data.domain}`}
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
      
      {/* Mini graphique */}
      <div className="h-16 relative">
        <svg className="w-full h-full" viewBox="0 0 200 60">
          {/* Grille de fond */}
          <defs>
            <pattern id={`grid-${data.color}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="200" height="60" fill={`url(#grid-${data.color})`} />
          
          {/* Ligne de tendance */}
          <polyline
            fill="none"
            stroke={colors.line}
            strokeWidth="2"
            points={values.map((value, index) => {
              const x = (index / (values.length - 1)) * 180 + 10;
              const y = 50 - (value / maxValue) * 40;
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Points */}
          {values.map((value, index) => {
            const x = (index / (values.length - 1)) * 180 + 10;
            const y = 50 - (value / maxValue) * 40;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill={colors.dot}
                stroke="white"
                strokeWidth="1"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

interface EvaluationSectionProps {
  title: string;
  description: string;
  type: 'continue' | 'integration' | 'trimestrielle';
  data: EvolutionData[];
}

const EvaluationSection: React.FC<EvaluationSectionProps> = ({ title, description, type, data }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((domainData, index) => (
          <MiniChart key={index} data={domainData} evaluationType={type} />
        ))}
      </div>
    </div>
  );
};

const StudentProgressionChart: React.FC = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'continue' | 'integration' | 'trimestrielle'>('continue');
  const evolutionData = getEvolutionData();

  const evaluationTypes = [
    {
      key: 'continue' as const,
      title: 'Évaluation Continue',
      description: 'Tes notes au quotidien sur 9 mois'
    },
    {
      key: 'integration' as const,
      title: 'Évaluation d\'Intégration', 
      description: 'Tes évaluations de synthèse'
    },
    {
      key: 'trimestrielle' as const,
      title: 'Évaluation Trimestrielle',
      description: 'Tes bilans de fin de trimestre'
    }
  ];

  const currentIndex = evaluationTypes.findIndex(evaluation => evaluation.key === currentView);
  
  const goToPrevious = () => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : evaluationTypes.length - 1;
    setCurrentView(evaluationTypes[prevIndex].key);
  };

  const goToNext = () => {
    const nextIndex = currentIndex < evaluationTypes.length - 1 ? currentIndex + 1 : 0;
    setCurrentView(evaluationTypes[nextIndex].key);
  };

  const currentEvaluation = evaluationTypes[currentIndex];

  return (
    <div className="space-y-6">
      {/* En-tête avec navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Mon évolution</h2>
        </div>
        
        <button
          onClick={() => navigate('/mes-notes')}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors text-sm font-medium shadow"
        >
          <Eye className="w-4 h-4 text-orange-500" />
          Voir mes notes
        </button>
      </div>

      {/* Navigation entre types d'évaluation */}
      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
        <button
          onClick={goToPrevious}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">{currentEvaluation.title}</h3>
          <p className="text-sm text-gray-600">{currentEvaluation.description}</p>
        </div>
        
        <button
          onClick={goToNext}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

             {/* Indicateurs de navigation */}
       <div className="flex justify-center gap-2">
         {evaluationTypes.map((evaluation) => (
           <button
             key={evaluation.key}
             onClick={() => setCurrentView(evaluation.key)}
             className={`w-2 h-2 rounded-full transition-all ${
               evaluation.key === currentView ? 'bg-orange-500 w-6' : 'bg-gray-300'
             }`}
           />
         ))}
       </div>

      {/* Graphiques par domaine */}
      <EvaluationSection
        title={currentEvaluation.title}
        description={currentEvaluation.description}
        type={currentView}
        data={evolutionData}
      />

      {/* Conseil pédagogique */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-orange-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Conseil de progression</h4>
            <p className="text-sm text-gray-700">
              {currentView === 'continue' && "Tes évaluations continues montrent tes efforts au quotidien. Continue ainsi !"}
              {currentView === 'integration' && "Les évaluations d'intégration montrent ta capacité à synthétiser. Bien joué !"}
              {currentView === 'trimestrielle' && "Tes bilans trimestriels reflètent ta progression globale sur la période."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProgressionChart; 
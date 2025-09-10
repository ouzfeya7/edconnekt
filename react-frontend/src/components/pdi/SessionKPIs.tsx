import React from 'react';
import { TrendingUp, TrendingDown, Target, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { PdiSession } from '../../types/pdi';

interface SessionKPIsProps {
  session: PdiSession;
}

const SessionKPIs: React.FC<SessionKPIsProps> = ({ session }) => {
  const averageScore = session.students.length > 0 
    ? Math.round(session.students.reduce((sum, s) => sum + s.globalScore, 0) / session.students.length)
    : 0;
  
  const studentsInDifficulty = session.students.filter(s => s.needsAssistance).length;
  const criticalStudents = session.students.filter(s => s.difficultyLevel === 'critique').length;
  const totalAlerts = session.students.reduce((sum, s) => sum + s.alerts.length, 0);

  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' };
    if (score >= 60) return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
    if (score >= 40) return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' };
    return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' };
  };

  const getDifficultyColor = (count: number, total: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    if (percentage === 0) return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' };
    if (percentage <= 25) return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
    if (percentage <= 50) return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' };
    return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' };
  };

  const scoreColors = getScoreColor(averageScore);
  const difficultyColors = getDifficultyColor(studentsInDifficulty, session.students.length);
  const criticalColors = criticalStudents > 0 
    ? { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' }
    : { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' };

  const kpis = [
    {
      id: 'average',
      label: 'Moyenne de classe',
      value: `${averageScore}%`,
      icon: <Target size={20} />,
      colors: scoreColors,
      trend: averageScore >= 70 ? <TrendingUp size={14} /> : <TrendingDown size={14} />
    },
    {
      id: 'difficulty',
      label: 'Élèves en difficulté',
      value: `${studentsInDifficulty}/${session.students.length}`,
      icon: <AlertTriangle size={20} />,
      colors: difficultyColors,
      subtitle: session.students.length > 0 ? `${Math.round((studentsInDifficulty / session.students.length) * 100)}%` : '0%'
    },
    {
      id: 'critical',
      label: 'Cas critiques',
      value: criticalStudents.toString(),
      icon: criticalStudents > 0 ? <AlertTriangle size={20} /> : <CheckCircle size={20} />,
      colors: criticalColors,
      subtitle: criticalStudents > 0 ? 'Intervention urgente' : 'Aucun cas critique'
    },
    {
      id: 'alerts',
      label: 'Total alertes',
      value: totalAlerts.toString(),
      icon: <Users size={20} />,
      colors: totalAlerts > 5 
        ? { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' }
        : { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
      subtitle: `${session.students.length} élèves`
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6">
      <h3 className="text-sm font-medium text-slate-700 mb-4 flex items-center gap-2">
        <Target size={16} />
        Indicateurs clés de la séance
      </h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.id}
            className={`p-4 rounded-lg border ${kpi.colors.bg} ${kpi.colors.border}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`${kpi.colors.text} opacity-70`}>
                {kpi.icon}
              </div>
              {kpi.trend && (
                <div className={`${kpi.colors.text} opacity-70`}>
                  {kpi.trend}
                </div>
              )}
            </div>
            
            <div className={`text-2xl font-bold ${kpi.colors.text} mb-1`}>
              {kpi.value}
            </div>
            
            <div className={`text-xs font-medium ${kpi.colors.text} opacity-80`}>
              {kpi.label}
            </div>
            
            {kpi.subtitle && (
              <div className={`text-xs ${kpi.colors.text} opacity-60 mt-1`}>
                {kpi.subtitle}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionKPIs;

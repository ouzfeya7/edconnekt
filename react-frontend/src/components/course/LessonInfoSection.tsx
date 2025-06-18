import React from 'react';
import CircularProgress from '../ui/CircularProgress'; // Chemin ajusté
// import { CheckCircle, AlertCircle, Info } from 'lucide-react'; // Pour les icônes dans StatCard si besoin

// Interface pour un item de statistique individuel
export interface StatItem {
  id: string;
  title: string;
  value: string | number;
  percentage?: number; // Utilisé pour le CircularProgress
  progressColor?: string; // ex: 'text-green-500'
}

interface LessonInfoSectionProps {
  stats: StatItem[];
}

// Placeholder pour un composant de graphique circulaire
// const CircularProgress: React.FC<{ percentage: number, colorClass: string }> = ({ percentage, colorClass }) => { ... }; -- CETTE SECTION SERA SUPPRIMEE

const StatDisplay: React.FC<StatItem> = ({ title, value, percentage, progressColor = 'text-green-500' }) => {
  return (
    <div className="flex-1 px-4 py-2">
      <p className="text-sm text-gray-500 mb-2 truncate h-10">{title}</p>
      <div className="flex items-center gap-2">
        {typeof percentage === 'number' ? (
          <CircularProgress percentage={percentage} colorClass={progressColor} />
        ) : (
          <span className="text-2xl font-bold text-slate-800">{value}</span>
        )}
      </div>
    </div>
  );
};

const LessonInfoSection: React.FC<LessonInfoSectionProps> = ({
  stats,
}) => {
  return (
    <section className="bg-[#F8F9FA] p-2 rounded-lg">
      <div className="flex divide-x divide-gray-200">
        {stats.map((stat) => (
          <StatDisplay key={stat.id} {...stat} />
        ))}
      </div>
    </section>
  );
};

export default LessonInfoSection; 
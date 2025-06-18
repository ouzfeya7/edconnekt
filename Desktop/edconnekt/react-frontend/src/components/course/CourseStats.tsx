import React from 'react';
import StatItem from '../ui/StatItem'; // Chemin ajusté
import Badge from '../ui/Badge'; // Chemin ajusté

interface CourseStatsProps {
  subjectTitle: string;
  studentAverage: number;
  skillAcquired: number;
  skillNotAcquired: number;
  remediationCount: number;
}

// Icônes simples pour les badges (à remplacer par des SVGs si disponibles)
const CheckIcon = () => <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>;
const ClockIcon = () => <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>;
const BookIcon = () => <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4A7.969 7.969 0 0011 4.804v10A7.968 7.968 0 0114.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4z"></path></svg>;

// Icône flèche verte
const GreenArrowUpIcon = () => <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>;

const CourseStats: React.FC<CourseStatsProps> = ({
  subjectTitle,
  studentAverage,
  skillAcquired,
  skillNotAcquired,
  remediationCount,
}) => {
  return (
    <section className="p-6 mb-6 md:mb-0">
      <h3 className="text-2xl font-semibold text-gray-800 mb-3">{subjectTitle}</h3>
      
      <div className="flex flex-wrap gap-3 items-center mb-6">
        <Badge text="EN CLASSE" bgColor="bg-blue-100" color="text-blue-700" icon={<ClockIcon />} />
        <Badge text="Terminé" bgColor="bg-green-100" color="text-green-700" icon={<CheckIcon />} />
        <Badge text="Evaluation - 10 Questions" bgColor="bg-yellow-100" color="text-yellow-700" icon={<BookIcon />} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <StatItem label="Moyenne de l\'élève" value={`${studentAverage}%`} icon={<GreenArrowUpIcon />} valueColor="text-green-600" />
        <StatItem label="Compétence acquise" value={`${skillAcquired}%`} icon={<GreenArrowUpIcon />} valueColor="text-green-600" />
        <StatItem label="Compétence non acquise" value={`${skillNotAcquired}%`} valueColor="text-red-600" />
        <StatItem label="Remédiation" value={remediationCount} />
      </div>
    </section>
  );
};

export default CourseStats; 
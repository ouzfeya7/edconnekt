import React from 'react';
import DateCard from '../Header/DateCard'; // Modifié le chemin relatif
import ClassNameCard from '../Header/ClassNameCard'; // Modifié le chemin relatif
import StatsCard from '../Header/StatsCard'; // Modifié le chemin relatif
// Si vous utilisez i18n, vous pourriez vouloir importer useTranslation ici
// import { useTranslation } from "react-i18next";

interface StudentStats {
  total: number;
  present: number;
  retard: number;
  absent: number;
}

interface ClassHeaderProps {
  currentDate: string;
  onDateChange: (date: string) => void;
  currentClasse: string;
  onClasseChange: (classe: string) => void;
  studentStats: StudentStats;
}

const ClassHeader: React.FC<ClassHeaderProps> = ({
  currentDate,
  onDateChange,
  currentClasse,
  onClasseChange,
  studentStats,
}) => {
  // Si vous utilisez i18n, décommentez la ligne suivante
  // const { t } = useTranslation();

  return (
    <div className="flex gap-4 items-stretch">
      <DateCard value={currentDate} onChange={onDateChange} />
      <ClassNameCard value={currentClasse} onChange={onClasseChange} />
      <div className="flex-grow">
        <StatsCard stats={studentStats} />
      </div>
    </div>
  );
};

export default ClassHeader; 
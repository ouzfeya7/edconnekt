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
  currentDate: Date;
  onDateChange: (date: Date) => void;
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
    <div className="flex flex-wrap gap-4 items-stretch">
      <div className="flex-grow flex-basis-0 min-w-[180px]">
        <DateCard value={currentDate} onChange={onDateChange} />
      </div>
      <div className="flex-grow flex-basis-0 min-w-[180px]">
        <ClassNameCard className={currentClasse} onClassChange={onClasseChange} />
      </div>
      <div className="flex-grow flex-basis-0 min-w-[180px]">
        <StatsCard stats={studentStats} />
      </div>
    </div>
  );
};

export default ClassHeader; 
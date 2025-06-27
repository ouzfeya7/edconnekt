import React, { useState, useEffect } from 'react';
import { useFilters } from '../../contexts/FilterContext';
import DateCard from './DateCard';
import ClassNameCard from './ClassNameCard';
import TrimestreCard from './TrimestreCard';
import EvaluationTypeCard from './EvaluationTypeCard';
import MonthCard from './MonthCard';

interface EvaluationHeaderProps {
  initialEvaluationType?: string;
  onEvaluationTypeChange: (type: string) => void;
  isClasseEditable?: boolean;
}

const EvaluationHeader: React.FC<EvaluationHeaderProps> = ({
  initialEvaluationType = "Continue",
  onEvaluationTypeChange,
  isClasseEditable = true,
}) => {
  const { 
    currentDate,
    setCurrentDate, 
    currentClasse, 
    setCurrentClasse, 
    currentTrimestre, 
    setCurrentTrimestre,
    currentMonth,
    setCurrentMonth
  } = useFilters();
  
  const [evaluationType, setEvaluationType] = useState(initialEvaluationType);

  useEffect(() => setEvaluationType(initialEvaluationType), [initialEvaluationType]);

  const handleEvaluationTypeChangeInternal = (type: string) => {
    setEvaluationType(type);
    onEvaluationTypeChange(type); 
  };

  const isDateDisabled = evaluationType === "Trimestrielle";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {evaluationType === 'Intégration' ? (
        <MonthCard value={currentMonth} onChange={setCurrentMonth} />
      ) : (
        <DateCard value={currentDate} onChange={setCurrentDate} disabled={isDateDisabled} />
      )}
      <ClassNameCard className={currentClasse} onClassChange={setCurrentClasse} isEditable={isClasseEditable} />
      <TrimestreCard value={currentTrimestre} onChange={setCurrentTrimestre} />
      <EvaluationTypeCard value={evaluationType} onChange={handleEvaluationTypeChangeInternal} />
    </div>
  );
};

export default EvaluationHeader; 
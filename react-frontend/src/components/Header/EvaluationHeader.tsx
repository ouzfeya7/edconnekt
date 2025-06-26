import React, { useState, useEffect } from 'react';
import { useFilters } from '../../contexts/FilterContext';
import DateCard from './DateCard';
import ClassNameCard from './ClassNameCard';
import TrimestreCard from './TrimestreCard';
import EvaluationTypeCard from './EvaluationTypeCard';

interface EvaluationHeaderProps {
  initialEvaluationType?: string;
  onEvaluationTypeChange: (type: string) => void;
}

const EvaluationHeader: React.FC<EvaluationHeaderProps> = ({
  initialEvaluationType = "Continue",
  onEvaluationTypeChange,
}) => {
  const { 
    currentDate,
    setCurrentDate, 
    currentClasse, 
    setCurrentClasse, 
    currentTrimestre, 
    setCurrentTrimestre 
  } = useFilters();
  
  const [evaluationType, setEvaluationType] = useState(initialEvaluationType);

  useEffect(() => setEvaluationType(initialEvaluationType), [initialEvaluationType]);

  const handleEvaluationTypeChangeInternal = (type: string) => {
    setEvaluationType(type);
    onEvaluationTypeChange(type); 
  };

  const showDateCard = evaluationType !== "Trimestrielle";

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${showDateCard ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 mb-6`}>
      {showDateCard && <DateCard value={currentDate} onChange={setCurrentDate} />}
      <ClassNameCard className={currentClasse} onClassChange={setCurrentClasse} />
      <TrimestreCard value={currentTrimestre} onChange={setCurrentTrimestre} />
      <EvaluationTypeCard value={evaluationType} onChange={handleEvaluationTypeChangeInternal} />
    </div>
  );
};

export default EvaluationHeader; 
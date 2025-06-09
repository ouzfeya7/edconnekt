import React, { useState, useEffect } from 'react';
import DateCard from './DateCard'; // Modifié
import ClassNameCard from './ClassNameCard'; // Modifié
import TrimestreCard from './TrimestreCard'; // Modifié
import EvaluationTypeCard from './EvaluationTypeCard'; // Modifié

interface EvaluationHeaderProps {
  initialDate?: string;
  initialClasse?: string;
  initialTrimestre?: string;
  initialEvaluationType?: string;
  isClasseEditable?: boolean;
  onDateChange?: (date: string) => void;
  onClasseChange?: (classe: string) => void;
  onTrimestreChange?: (trimestre: string) => void;
  onEvaluationTypeChange: (type: string) => void;
}

const EvaluationHeader: React.FC<EvaluationHeaderProps> = ({
  initialDate = "24 Mars 2025",
  initialClasse = "4e B",
  initialTrimestre = "Trimestre 1",
  initialEvaluationType = "Continue",
  isClasseEditable = true, 
  onDateChange,
  onClasseChange,
  onTrimestreChange,
  onEvaluationTypeChange,
}) => {
  const [date, setDate] = useState(initialDate);
  const [classe, setClasse] = useState(initialClasse);
  const [trimestre, setTrimestre] = useState(initialTrimestre);
  const [evaluationType, setEvaluationType] = useState(initialEvaluationType);

  useEffect(() => setDate(initialDate), [initialDate]);
  useEffect(() => setClasse(initialClasse), [initialClasse]);
  useEffect(() => setTrimestre(initialTrimestre), [initialTrimestre]);
  useEffect(() => setEvaluationType(initialEvaluationType), [initialEvaluationType]);

  const handleDateChangeInternal = (newDate: string) => {
    setDate(newDate);
    if (onDateChange) onDateChange(newDate);
  };

  const handleClasseChangeInternal = (newClasse: string) => {
    setClasse(newClasse);
    if (onClasseChange) onClasseChange(newClasse);
  };

  const handleTrimestreChangeInternal = (newTrimestre: string) => {
    setTrimestre(newTrimestre);
    if (onTrimestreChange) onTrimestreChange(newTrimestre);
  };

  const handleEvaluationTypeChangeInternal = (type: string) => {
    setEvaluationType(type);
    onEvaluationTypeChange(type); 
  };

  const showDateCard = evaluationType !== "Trimestrielle";

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${showDateCard ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 mb-6`}>
      {showDateCard && <DateCard value={date} onChange={handleDateChangeInternal} />}
      <ClassNameCard value={classe} onChange={handleClasseChangeInternal} isEditable={isClasseEditable} />
      <TrimestreCard value={trimestre} onChange={handleTrimestreChangeInternal} />
      <EvaluationTypeCard value={evaluationType} onChange={handleEvaluationTypeChangeInternal} />
    </div>
  );
};

export default EvaluationHeader; 
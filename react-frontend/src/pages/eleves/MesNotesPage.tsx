import React, { useState, useEffect } from 'react';
import EvaluationHeader from '../../components/Header/EvaluationHeader';
import ContinueView from '../../components/GestionDesNotes/ContinueView';
import IntegrationView from '../../components/GestionDesNotes/IntegrationView';
import TrimestrielleView from '../../components/GestionDesNotes/TrimestrielleView';
import { useUser } from '../../layouts/DashboardLayout';
import { useFilters } from '../../contexts/FilterContext';

// const NotesTrimestrielleView: React.FC = () => {
// return <div className="p-4 mt-6 bg-white rounded-lg shadow">Vue des notes "Trimestrielle" à implémenter...</div>;
// };

const MesNotesPage: React.FC = () => {
  const [evaluationType, setEvaluationType] = useState('Continue');
  const { user } = useUser();
  const { setCurrentClasse } = useFilters();

  // Initialiser la classe de l'élève lors du chargement initial
  useEffect(() => {
    if (user?.classId) {
      setCurrentClasse(user.classId);
    } else {
      // Valeur par défaut si l'utilisateur n'a pas de classe assignée
      setCurrentClasse("cp1");
    }
  }, [user?.classId, setCurrentClasse]);



  // Les données de l'élève sont gérées dans les composants enfants

  const handleEvaluationTypeChange = (type: string) => {
    setEvaluationType(type);
  };

  const renderSelectedView = () => {
    switch (evaluationType) {
      case 'Continue':
        return <ContinueView role="eleve" />;
      case 'Intégration':
        return <IntegrationView role="eleve" />;
      case 'Trimestrielle':
        return <TrimestrielleView role="eleve" />;
      default:
        return <p>Veuillez sélectionner un type d'évaluation.</p>;
    }
  };

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      {/* En-tête avec design moderne */}
      <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 shadow-sm border border-emerald-200/50 p-6">
        {/* Motifs décoratifs */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/8 rounded-full -translate-y-14 translate-x-14"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-teal-500/6 rounded-full translate-y-10 -translate-x-10"></div>
        
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">Mes notes</h1>
          <div className="flex items-center text-sm text-emerald-600 font-medium">
            <span>Evaluation</span>
            <span className="mx-2">/</span>
            <span>Gestion des notes</span>
          </div>
        </div>
      </div>

      <EvaluationHeader 
        initialEvaluationType={evaluationType}
        onEvaluationTypeChange={handleEvaluationTypeChange}
        isClasseEditable={false} // La classe n'est pas modifiable pour l'élève
      />

      {renderSelectedView()}
    </div>
  );
};

export default MesNotesPage; 
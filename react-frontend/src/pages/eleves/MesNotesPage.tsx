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

  // Fonction pour formater la date en "jour Mois Année"
  const formatDate = (date: Date): string => {
    const day = date.getDate();
    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Données de l'élève (pourrait venir d'un contexte ou d'un store)
  const studentData = {
    classe: user?.classId || 'Classe non définie', // Utiliser la classe de l'élève
    currentDate: formatDate(new Date()),
    currentTrimestre: "Trimestre 1",
  };

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
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">Mes notes</h1>
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <span>Evaluation</span>
        <span className="mx-2">/</span>
        <span>Gestion des notes</span>
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
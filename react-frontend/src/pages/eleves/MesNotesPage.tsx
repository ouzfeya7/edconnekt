import React, { useState } from 'react';
import EvaluationHeader from '../../components/Header/EvaluationHeader';
import ContinueView from '../../components/GestionDesNotes/ContinueView';
import IntegrationView from '../../components/GestionDesNotes/IntegrationView';
import TrimestrielleView from '../../components/GestionDesNotes/TrimestrielleView';
import { useUser } from '../../layouts/DashboardLayout';

// const NotesTrimestrielleView: React.FC = () => {
// return <div className="p-4 mt-6 bg-white rounded-lg shadow">Vue des notes "Trimestrielle" à implémenter...</div>;
// };

const MesNotesPage: React.FC = () => {
  const [evaluationType, setEvaluationType] = useState('Continue');
  const { user } = useUser();

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
    classe: user?.department || 'Classe non définie', // Utiliser une propriété de user ou une valeur par défaut
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
    <div className="bg-gray-100 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">Mes notes</h1>
      <p className="text-sm text-gray-500 mb-6">Evaluation / Gestion des notes</p>

      <EvaluationHeader 
        initialDate={studentData.currentDate}
        initialClasse={studentData.classe}
        initialTrimestre={studentData.currentTrimestre}
        initialEvaluationType={evaluationType} // Le type est géré par l'état local de MesNotesPage
        isClasseEditable={false} // La classe n'est pas modifiable pour l'élève
        // onDateChange, onClasseChange, onTrimestreChange ne sont pas nécessaires ici
        // car l'élève ne modifie pas ces valeurs directement (sauf peut-être le trimestre et le type d'éval)
        onEvaluationTypeChange={handleEvaluationTypeChange}
      />

      {renderSelectedView()}
    </div>
  );
};

export default MesNotesPage; 
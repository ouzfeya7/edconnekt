import EvaluationHeader from "../components/Header/EvaluationHeader";
import { ActionCard } from "../components/ui/ActionCard";
import { Plus, FileEdit, Mail, Calendar } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Importer les nouvelles vues pour l'enseignant
import ContinueView from "../components/GestionDesNotes/ContinueView";
import IntegrationView from "../components/GestionDesNotes/IntegrationView";
import TrimestrielleView from "../components/GestionDesNotes/TrimestrielleView";

const Evaluations = () => {
  const [evaluationType, setEvaluationType] = useState("Continue");
  const [currentClasse, setCurrentClasse] = useState("4e B");
  const [currentTrimestre, setCurrentTrimestre] = useState("Trimestre 1");
  const navigate = useNavigate();

  const handleEvaluationTypeChangeHeader = (type: string) => {
    setEvaluationType(type);
  };
  
  const handleClasseChangeHeader = (newClasse: string) => {
    setCurrentClasse(newClasse);
  };

  const handleTrimestreChangeHeader = (newTrimestre: string) => {
    setCurrentTrimestre(newTrimestre);
  };

  // Fonction pour rendre la vue sélectionnée pour l'enseignant
  const renderSelectedViewForEnseignant = () => {
    switch (evaluationType) {
      case "Continue":
        return <ContinueView role="enseignant" />;
      case "Intégration":
        return <IntegrationView role="enseignant" />;
      case "Trimestrielle":
        return <TrimestrielleView role="enseignant" />;
      default:
        return <p className="text-center text-gray-500 py-8">Veuillez sélectionner un type d'évaluation.</p>;
    }
  };

  return (
    <div className="text-gray-700">
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-semibold text-[#184867] mb-4">
          Evaluations
        </h1>
        <div className="flex items-center gap-2 text-gray-500 mb-6">
          <span>Evaluation</span>
          <span>/</span>
          <span className="text-gray-700">Gestion des notes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <ActionCard
            icon={<Plus className="text-orange-500" />}
            label="Ajouter une fiche"
            onClick={() => console.log("Ajouter une fiche")}
          />
          <ActionCard
            icon={<FileEdit className="text-orange-500" />}
            label="PDI"
            onClick={() => navigate('/pdi')}
          />
          <ActionCard
            icon={<Mail className="text-orange-500" />}
            label="Envoyer un message"
            onClick={() => navigate('/messages', { state: { composeNew: true } })}
          />
          <ActionCard
            icon={<Calendar className="text-orange-500" />}
            label="Ajouter un évenement"
            onClick={() => navigate('/calendar', { state: { showAddEventModal: true } })}
          />
        </div>
        <EvaluationHeader 
          initialClasse={currentClasse}
          initialTrimestre={currentTrimestre}
          initialEvaluationType={evaluationType}
          onClasseChange={handleClasseChangeHeader}
          onTrimestreChange={handleTrimestreChangeHeader}
          onEvaluationTypeChange={handleEvaluationTypeChangeHeader}
        />
        
        {/* Afficher la vue sélectionnée */} 
        {renderSelectedViewForEnseignant()}

      </div>
    </div>
  );
};

export default Evaluations;

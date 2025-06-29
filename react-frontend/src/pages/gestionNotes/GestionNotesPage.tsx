import EvaluationHeader from "../../components/Header/EvaluationHeader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CreateEvaluationModal, { NewEvaluationData } from "../../components/GestionDesNotes/CreateEvaluationModal";

// Importer les nouvelles vues pour l'enseignant
import ContinueView from "../../components/GestionDesNotes/ContinueView";
import IntegrationView from "../../components/GestionDesNotes/IntegrationView";
import TrimestrielleView from "../../components/GestionDesNotes/TrimestrielleView";

const GestionNotesPage = () => {
  const { t } = useTranslation();
  const [evaluationType, setEvaluationType] = useState("Continue");
  const [isCreateEvalModalOpen, setIsCreateEvalModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleEvaluationTypeChangeHeader = (type: string) => {
    setEvaluationType(type);
  };
  
  const handleCreateEvaluation = (data: NewEvaluationData) => {
    console.log("Nouvelle évaluation créée :", data);
    // TODO: Implémenter la logique pour ajouter la nouvelle évaluation
    // aux données du tableau de notes (ex: ajouter une colonne).
    setIsCreateEvalModalOpen(false);
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
        return <p className="text-center text-gray-500 py-8">{t('select_evaluation_type', 'Veuillez sélectionner un type d\'évaluation.')}</p>;
    }
  };

  return (
    <div className="text-gray-700">
      <CreateEvaluationModal
        isOpen={isCreateEvalModalOpen}
        onClose={() => setIsCreateEvalModalOpen(false)}
        onApply={handleCreateEvaluation}
      />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Gestion des notes
        </h1>
        <div className="flex items-center gap-2 text-gray-500 mb-6">
          <button onClick={() => navigate('/evaluations')} className="hover:underline">
            {t('evaluation')}
          </button>
          <span>/</span>
          <span className="text-gray-700">{t('grade_management')}</span>
        </div>

        <EvaluationHeader 
          initialEvaluationType={evaluationType}
          onEvaluationTypeChange={handleEvaluationTypeChangeHeader}
          isClasseEditable={true}
        />
        
        {/* Afficher la vue sélectionnée */} 
        {renderSelectedViewForEnseignant()}

      </div>
    </div>
  );
};

export default GestionNotesPage;

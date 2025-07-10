import React, { useState, useEffect } from 'react';
import EvaluationHeader from '../../components/Header/EvaluationHeader';
import ContinueView from '../../components/GestionDesNotes/ContinueView';
import IntegrationView from '../../components/GestionDesNotes/IntegrationView';
import TrimestrielleView from '../../components/GestionDesNotes/TrimestrielleView';
import ChildSelectorCard from '../../components/parents/ChildSelectorCard';
import ChildAverageCard from '../../components/parents/ChildAverageCard';
import { useAuth } from '../authentification/useAuth'; // Importer useAuth
import { useFilters } from '../../contexts/FilterContext';
import { mockParentData } from '../../lib/mock-parent-data';

// const NotesTrimestrielleView: React.FC = () => {
// return <div className="p-4 mt-6 bg-white rounded-lg shadow">Vue des notes "Trimestrielle" à implémenter...</div>;
// };

const MesNotesPage: React.FC = () => {
  const [evaluationType, setEvaluationType] = useState('Continue');
  const [selectedChildId, setSelectedChildId] = useState<string>(''); // Gestion de la sélection d'enfant pour les parents
  const { user, roles } = useAuth(); // Utiliser useAuth pour obtenir user et roles
  const { setCurrentClasse } = useFilters();

  // Déterminer le rôle principal
  const isParent = roles.includes('parent');

  // Initialiser la sélection du premier enfant pour les parents
  useEffect(() => {
    if (isParent && mockParentData.children.length > 0 && !selectedChildId) {
      setSelectedChildId(mockParentData.children[0].studentId);
    }
  }, [isParent, selectedChildId]);

  useEffect(() => {
    // La logique pour définir la classe reste la même
    if (user?.classId) {
      setCurrentClasse(user.classId);
    } else {
      setCurrentClasse("cp1"); 
    }
  }, [user?.classId, setCurrentClasse]);

  const handleEvaluationTypeChange = (type: string) => {
    setEvaluationType(type);
  };

  const renderSelectedView = () => {
    // Déterminer le rôle en fonction de l'utilisateur connecté
    const roleForView = isParent ? 'parent' : 'eleve';
    
    switch (evaluationType) {
      case 'Continue':
        return <ContinueView role={roleForView} selectedChildId={selectedChildId} />;
      case 'Intégration':
        return <IntegrationView role={roleForView} selectedChildId={selectedChildId} />;
      case 'Trimestrielle':
        return <TrimestrielleView role={roleForView} selectedChildId={selectedChildId} />;
      default:
        return <p>Veuillez sélectionner un type d'évaluation.</p>;
    }
  };

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      {/* En-tête avec design moderne */}
      <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 shadow-sm border border-emerald-200/50 p-6">
        {/* Motifs décoratifs */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/15 rounded-full -translate-y-14 translate-x-14"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-teal-500/15 rounded-full translate-y-10 -translate-x-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/5 rounded-full"></div>
        
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">
            {isParent ? 'Notes' : 'Mes notes'}
          </h1>
        </div>
      </div>

      <EvaluationHeader 
        initialEvaluationType={evaluationType}
        onEvaluationTypeChange={handleEvaluationTypeChange}
        isClasseEditable={false} // La classe n'est pas modifiable pour l'élève
      />

      {/* Sélecteur d'enfant et moyenne pour les parents */}
      {isParent && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ChildSelectorCard
              children={mockParentData.children}
              selectedChildId={selectedChildId}
              onSelectChild={setSelectedChildId}
            />
            <ChildAverageCard
              selectedChild={mockParentData.children.find(child => child.studentId === selectedChildId) || null}
            />
          </div>
        </div>
      )}

      {renderSelectedView()}
    </div>
  );
};

export default MesNotesPage; 
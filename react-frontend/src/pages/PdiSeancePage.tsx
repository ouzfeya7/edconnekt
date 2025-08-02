import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockFacilitators } from '../lib/mock-data';
import { useFilters } from '../contexts/FilterContext';
import { Users, Target, FileText } from 'lucide-react';

// Import des composants de l'en-tête
import TrimestreCard from '../components/Header/TrimestreCard';
import PdiCard from '../components/Header/PdiCard';

const PdiSeancePage: React.FC = () => {
  const { currentTrimestre, setCurrentTrimestre } = useFilters();
  const [pdi, setPdi] = useState('semaine-45'); // Semaine actuelle (21-25 Juil)

  const navigate = useNavigate();

  // Calcul des statistiques PDI spécifiques
  const pdiStats = {
    totalFacilitators: mockFacilitators.length,
    totalClasses: mockFacilitators.reduce((sum, f) => sum + f.classes.length, 0),
    averageScore: Math.round(mockFacilitators.reduce((sum, f) => sum + f.stats.avg, 0) / mockFacilitators.length),
    totalSessions: mockFacilitators.reduce((sum, f) => sum + f.stats.remediation, 0) + 15, // Simulation
    reportsGenerated: Math.round(mockFacilitators.length * 0.8), // 80% des facilitateurs ont généré des rapports
    studentsInDifficulty: mockFacilitators.reduce((sum, f) => sum + f.stats.remediation, 0)
  };

  const handleViewAllSessions = (facilitatorId: string) => {
    navigate(`/pdi/${facilitatorId}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Séances PDI</h1>
      
      {/* En-tête avec filtres et nouvelles statistiques PDI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TrimestreCard value={currentTrimestre} onChange={setCurrentTrimestre} />
          <PdiCard value={pdi} onChange={setPdi} />
        </div>
        
        {/* Nouvelles cartes de stats PDI */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {/* Facilitateurs actifs */}
          <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Users className="w-3 h-3 text-blue-600" />
              </div>
              <p className="text-xs font-medium text-blue-800">Facilitateurs</p>
            </div>
            <p className="text-xl font-bold text-blue-700">{pdiStats.totalFacilitators}</p>
            <p className="text-xs text-blue-600">actifs</p>
          </div>

          {/* Classes couvertes */}
          <div className="bg-white rounded-lg shadow-sm border border-green-200 p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <Target className="w-3 h-3 text-green-600" />
              </div>
              <p className="text-xs font-medium text-green-800">Classes</p>
            </div>
            <p className="text-xl font-bold text-green-700">{pdiStats.totalClasses}</p>
            <p className="text-xs text-green-600">couvertes</p>
          </div>

          {/* Rapports générés */}
          <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <FileText className="w-3 h-3 text-purple-600" />
              </div>
              <p className="text-xs font-medium text-purple-800">Rapports</p>
            </div>
            <p className="text-xl font-bold text-purple-700">{pdiStats.reportsGenerated}</p>
            <p className="text-xs text-purple-600">générés</p>
          </div>
        </div>
      </div>
      
      {/* Vue grille des facilitateurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockFacilitators.map(facilitator => (
          <div key={facilitator.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Photo de profil d'un facilitateur */}
            <div className="flex justify-center mb-4">
              <img 
                src={facilitator.avatarUrl} 
                alt={facilitator.name} 
                className="w-20 h-20 rounded-full object-cover border-4 border-orange-200"
              />
            </div>
            
            {/* Nom et rôle du facilitateur */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{facilitator.name}</h3>
              <span className="px-3 py-1 text-sm font-medium bg-orange-100 text-orange-800 rounded-full">
                {facilitator.role}
              </span>
            </div>
            
            {/* Classes gérées par le facilitateur */}
            <div className="text-center mb-6">
              <div className="text-xs text-gray-500 mb-2">Classes gérées</div>
              <div className="flex flex-wrap justify-center gap-1">
                {facilitator.classes.map((classe, index) => (
                  <span 
                    key={index} 
                    className="inline-block px-2 py-1 bg-pink-50 text-pink-700 text-xs font-medium rounded-full border border-pink-200"
                  >
                    {classe}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Bouton d'action pour voir toutes les séances du facilitateur */}
            <div className="text-center">
              <button
                onClick={() => handleViewAllSessions(facilitator.id)}
                className="w-full px-4 py-2 text-sm text-orange-600 hover:text-orange-700 font-medium border border-orange-200 rounded-md hover:bg-orange-50 transition-colors"
              >
                Voir toutes les séances
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PdiSeancePage; 
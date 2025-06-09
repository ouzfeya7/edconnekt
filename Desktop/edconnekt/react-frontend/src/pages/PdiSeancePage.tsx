import React, { useState } from 'react';
import FacilitatorCard from '../components/pdi/FacilitatorCard';
import { mockFacilitators, pdiSessionStats } from '../lib/mock-data';

// Import des composants de l'en-tête
import DateCard from '../components/Header/DateCard';
import TrimestreCard from '../components/Header/TrimestreCard';
import PdiCard from '../components/Header/PdiCard';
import StatsCard from '../components/Header/StatsCard';

const PdiSeancePage: React.FC = () => {
  const [date, setDate] = useState('12 Mars 2025');
  const [trimestre, setTrimestre] = useState('Trimestre 1');
  const [pdi, setPdi] = useState('PDI 08-13');

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Séance PDI</h1>
      
      {/* En-tête reconstruit avec les composants réutilisables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DateCard value={date} />
          <TrimestreCard value={trimestre} onChange={setTrimestre} />
          <PdiCard value={pdi} onChange={setPdi} />
        </div>
        <StatsCard stats={pdiSessionStats} />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mockFacilitators.map(facilitator => (
          <FacilitatorCard key={facilitator.id} facilitator={facilitator} />
        ))}
      </div>
    </div>
  );
};

export default PdiSeancePage; 
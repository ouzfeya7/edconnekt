import React from 'react';
import ProgressionChart from '../charts/ProgressionChart';
import { mockStudentProgression } from '../../lib/mock-data';

const StudentProgressionChart: React.FC = () => {
  return (
    <section className="p-6 mt-6 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Ma progression</h3>
        {/* Pas de filtres pour la vue élève */}
      </div>
      <div className="h-72"> {/* Hauteur fixe pour le conteneur du graphique */}
        <ProgressionChart data={mockStudentProgression} />
      </div>
    </section>
  );
};

export default StudentProgressionChart; 
import React from 'react';
import { useTranslation } from 'react-i18next';
import EvaluationItem from './EvaluationItem';
import { Link } from 'react-router-dom';

const mockEvaluations = [
  { id: '1', title: 'Lire un texte à voix haute', subject: 'Français', score: 75 },
  { id: '2', title: 'Résoudre une équation', subject: 'Mathématique', score: 91 },
  { id: '3', title: 'Dessiner un paysage', subject: 'Art et Créativité', score: 60 },
  { id: '4', title: 'Comprendre un article', subject: 'Français', score: 97 },
];

const RecentEvaluations: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">{t('evaluation', 'Évaluation')}</h3>
        <Link to="/mes-notes" className="text-sm font-semibold text-blue-600 hover:underline">
          {t('see_more', 'Voir plus')}
        </Link>
      </div>
      <div className="space-y-2">
        {mockEvaluations.map(eva => (
          <EvaluationItem 
            key={eva.id}
            title={eva.title}
            subject={eva.subject}
            score={eva.score}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentEvaluations; 
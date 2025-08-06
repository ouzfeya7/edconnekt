import React from 'react';
import { BookOpen, Calculator, Palette, Globe, Music, Book, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { mockParentData } from '../../lib/mock-parent-data';

const RecentEvaluations: React.FC = () => {
  const { t } = useTranslation();
  const childNotes = mockParentData.children[0].notes;
  
  // Transformer les notes en évaluations récentes
  const recentEvaluations = Object.entries(childNotes)
    .map(([competenceId, score]) => {
      const [, matiere, competence] = competenceId.split('-');
      
      // Mapper les matières
      const getSubjectFromMatiere = (matiere: string) => {
        switch (matiere) {
          case 'fr': return 'Français';
          case 'math': return 'Mathématique';
          case 'en': return 'Anglais';
          case 'hist': return 'Histoire';
          case 'geo': return 'Géographie';
          default: return 'Autre';
        }
      };

      const getCompetenceTitle = (competence: string) => {
        switch (competence) {
          case 'orale': return 'Expression orale';
          case 'vocab': return 'Vocabulaire';
          case 'gram': return 'Grammaire';
          case 'conj': return 'Conjugaison';
          case 'ortho': return 'Orthographe';
          case 'lect-comp': return 'Lecture et compréhension';
          case 'num': return 'Numération';
          case 'mesure': return 'Mesures';
          case 'geo': return 'Géométrie';
          case 'prob': return 'Problèmes';
          case 'speak-gram': return 'Expression et grammaire';
          case 'comp': return 'Compréhension';
          default: return competence;
        }
      };

      return {
        id: competenceId,
        title: getCompetenceTitle(competence),
        subject: getSubjectFromMatiere(matiere),
        score: score as number,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Date aléatoire dans les 30 derniers jours
        competenceId
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4); // Limiter à 4 évaluations

  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'français':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'mathématique':
        return <Calculator className="h-4 w-4 text-green-500" />;
      case 'art et créativité':
        return <Palette className="h-4 w-4 text-purple-500" />;
      case 'histoire':
        return <Book className="h-4 w-4 text-orange-500" />;
      case 'géographie':
        return <Globe className="h-4 w-4 text-indigo-500" />;
      case 'musique':
        return <Music className="h-4 w-4 text-pink-500" />;
      case 'anglais':
        return <BookOpen className="h-4 w-4 text-red-500" />;
      default:
        return <Award className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'français':
        return 'border-l-blue-500 bg-blue-50';
      case 'mathématique':
        return 'border-l-green-500 bg-green-50';
      case 'art et créativité':
        return 'border-l-purple-500 bg-purple-50';
      case 'histoire':
        return 'border-l-orange-500 bg-orange-50';
      case 'géographie':
        return 'border-l-indigo-500 bg-indigo-50';
      case 'musique':
        return 'border-l-pink-500 bg-pink-50';
      case 'anglais':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Bien';
    if (score >= 60) return 'Moyen';
    return 'À améliorer';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full overflow-hidden">
      {/* En-tête avec gradient */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {t('evaluation', 'Évaluations récentes')}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {recentEvaluations.length} évaluation{recentEvaluations.length > 1 ? 's' : ''} récente{recentEvaluations.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Link 
            to="/mes-notes" 
            className="text-sm font-medium text-green-600 hover:text-green-700 hover:underline transition-colors flex items-center gap-1"
          >
            {t('see_more', 'Voir plus')}
            <span className="text-xs">→</span>
          </Link>
        </div>
      </div>
      
      {/* Contenu des évaluations */}
      <div className="p-4">
        <div className="space-y-3">
          {recentEvaluations.length > 0 ? (
            recentEvaluations.map(eva => (
              <div 
                key={eva.id}
                className={`p-4 rounded-lg hover:shadow-md transition-colors cursor-pointer border-l-4 ${getSubjectColor(eva.subject)}`}
              >
                <div className="flex items-start gap-3">
                  {/* Icône de matière */}
                  <div className="flex-shrink-0 mt-0.5">
                    {getSubjectIcon(eva.subject)}
                  </div>
                  
                  {/* Contenu principal */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 text-sm leading-tight mb-2 line-clamp-2">
                      {eva.title}
                    </h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="font-medium">{eva.subject}</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span>{new Date(eva.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                      </div>
                      
                      {/* Score avec couleur */}
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${getScoreColor(eva.score)}`}>
                          {eva.score}%
                        </span>
                        <span className={`text-xs ${getScoreColor(eva.score)}`}>
                          {getScoreLabel(eva.score)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Indicateur de performance */}
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full ${getScoreColor(eva.score).replace('text-', 'bg-')}`}></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-sm text-gray-500 mb-2">
                Aucune évaluation disponible
              </p>
              <p className="text-xs text-gray-400">
                Les évaluations apparaîtront ici quand elles seront disponibles
              </p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default RecentEvaluations; 
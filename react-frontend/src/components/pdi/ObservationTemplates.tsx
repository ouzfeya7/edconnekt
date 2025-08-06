import React, { useState } from 'react';
import { FileText, Plus, X } from 'lucide-react';

interface ObservationTemplate {
  id: string;
  name: string;
  content: string;
  category: 'general' | 'difficulty' | 'progress' | 'behavior';
}

interface ObservationTemplatesProps {
  onTemplateSelect: (template: ObservationTemplate) => void;
  onClose: () => void;
}

const ObservationTemplates: React.FC<ObservationTemplatesProps> = ({
  onTemplateSelect,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const templates: ObservationTemplate[] = [
    {
      id: '1',
      name: 'Progrès notable',
      content: 'L\'élève a fait des progrès significatifs dans cette compétence. Sa participation était active et constructive.',
      category: 'progress'
    },
    {
      id: '2',
      name: 'Difficultés persistantes',
      content: 'L\'élève rencontre encore des difficultés avec cette compétence. Un suivi renforcé est recommandé.',
      category: 'difficulty'
    },
    {
      id: '3',
      name: 'Bonne participation',
      content: 'L\'élève a participé activement à la séance. Son engagement est positif.',
      category: 'behavior'
    },
    {
      id: '4',
      name: 'Nécessite remédiation',
      content: 'L\'élève a besoin d\'une remédiation spécifique pour cette compétence.',
      category: 'difficulty'
    },
    {
      id: '5',
      name: 'Compétence acquise',
      content: 'L\'élève maîtrise maintenant cette compétence. Excellent travail !',
      category: 'progress'
    }
  ];

  const categories = [
    { id: 'all', name: 'Tous' },
    { id: 'progress', name: 'Progrès' },
    { id: 'difficulty', name: 'Difficultés' },
    { id: 'behavior', name: 'Comportement' },
    { id: 'general', name: 'Général' }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Templates d'observations</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Liste des templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map(template => (
            <div 
              key={template.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => onTemplateSelect(template)}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-800">{template.name}</h4>
                <FileText size={16} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">{template.content}</p>
                              <div className="mt-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    template.category === 'progress' ? 'bg-green-100 text-green-800' :
                    template.category === 'difficulty' ? 'bg-red-100 text-red-800' :
                    template.category === 'behavior' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {template.category === 'progress' ? 'Progrès' :
                     template.category === 'difficulty' ? 'Difficulté' :
                     template.category === 'behavior' ? 'Comportement' : 'Général'}
                  </span>
                </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-8">
            <FileText size={48} className="text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Aucun template disponible pour cette catégorie</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ObservationTemplates; 
import React from 'react';
import ProgressSteps from '../ui/ProgressSteps';
// Retirer Edit3 et Eye d'ici, ils seront passés dynamiquement

// Interface pour une ligne de données du tableau
export interface NoteData {
  id: string;
  facilitator?: string; // Optionnel, car pas dans la vue Intégration directement
  facilitatorImage?: string;
  date: string;
  evaluationName?: string; // Pour la vue Intégration
  // Colonnes spécifiques aux matières (pourraient être un objet)
  francais?: number;
  anglais?: number;
  // ... autres matières si besoin pour d'autres contextes
  noteSur100?: number; // Pour la vue Intégration
  progression: number;
  [key: string]: string | number | undefined;
}

// Interface pour la configuration des colonnes de notes
export interface NoteColumn {
  key: string;
  label: string;
  render?: (value: string | number | undefined, note: NoteData, rowIndex?: number) => React.ReactNode;
}

// Interface pour une action de tableau configurable
export interface TableAction {
  id: string;
  icon: React.ReactNode; // Peut être n'importe quel JSX, y compris une icône Lucide
  onClick: (noteId: string) => void;
  tooltip?: string;
  colorClass?: string; // ex: 'text-indigo-600 hover:text-indigo-900'
}

interface NotesTableProps {
  data: NoteData[];
  noteColumns: NoteColumn[];
  actions?: TableAction[]; // Remplacer onEdit et onView
  showProgressionColumn?: boolean; // Nouvelle prop
  // Les props onEdit et onView sont maintenant gérées via 'actions'
}

const NotesTable: React.FC<NotesTableProps> = ({ data, noteColumns, actions, showProgressionColumn = true }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 py-8">Aucune note à afficher pour cette sélection.</p>;
  }

  const defaultFacilitatorImage = 'https://via.placeholder.com/40x40/CBD5E0/FFFFFF?text=P';

  return (
    <div className="overflow-x-auto shadow border-b border-gray-200 sm:rounded-lg mt-4">
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {/* Afficher Facilitateur (maintenant "Prénom et Nom") seulement si présent et non dans noteColumns */}
            {data[0]?.facilitator !== undefined && !noteColumns.find(col => col.key === 'facilitator') && (
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom et Nom</th>
            )}
            {noteColumns.map(col => (
              <th key={col.key} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {col.label}
              </th>
            ))}
            {showProgressionColumn && (
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progression</th>
            )}
            {actions && actions.length > 0 && (
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={item.id} className="hover:bg-gray-50">
                {item.facilitator !== undefined && !noteColumns.find(col => col.key === 'facilitator') && (
                    <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 w-6 text-left mr-2">{index + 1}</span>
                          <div className="flex-shrink-0 h-8 w-8">
                            <img
                            className="h-8 w-8 rounded-full object-cover bg-gray-200"
                            src={item.facilitatorImage || `${defaultFacilitatorImage.slice(0, -1)}${item.facilitator?.charAt(0) || 'P'}`}
                            alt={item.facilitator || 'Facilitateur'}
                            />
                        </div>
                        <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{item.facilitator}</div>
                        </div>
                        </div>
                    </td>
                )}
              {noteColumns.map(col => {
                const cellValue = item[col.key];
                let displayValue: React.ReactNode = '-';

                if (col.render) {
                  displayValue = col.render(cellValue, item, index);
                } else if (cellValue !== undefined) {
                  if (col.key === 'date') {
                    displayValue = cellValue;
                  } else if (typeof cellValue === 'number' &&
                             (col.label.toLowerCase().includes('note') ||
                              col.label.toLowerCase().includes('français') ||
                              col.label.toLowerCase().includes('anglais')) &&
                             !col.label.toLowerCase().includes('sur')) {
                    displayValue = `${cellValue}%`;
                  } else if (cellValue) {
                    displayValue = cellValue.toString();
                  }
                }

                return (
                  <td key={`${item.id}-${col.key}`} className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {displayValue}
                  </td>
                );
              })}
              {showProgressionColumn && (
                <td className="px-4 py-3 whitespace-nowrap">
                  <ProgressSteps progress={item.progression} />
                </td>
              )}
              {actions && actions.length > 0 && (
                <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                  {actions.map((action, index) => (
                    <button
                        key={action.id}
                        onClick={() => action.onClick(item.id)}
                        className={`${action.colorClass || 'text-gray-500 hover:text-gray-700'} p-1 ${index > 0 ? 'ml-2' : ''}`}
                        title={action.tooltip}
                    >
                      {action.icon}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotesTable; 
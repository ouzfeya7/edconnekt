import React, { useState } from 'react';
import ProgressSteps from '../ui/ProgressSteps';
import { getGradingStatus } from '../../lib/notes-data';
// Retirer Edit3 et Eye d'ici, ils seront passés dynamiquement

// Interface pour une ligne de données du tableau (plus générique)
export interface NoteData {
  id: string;
  [key: string]: any; // Accepte n'importe quelle autre propriété
}

// Interface pour la configuration des colonnes de notes
export interface NoteColumn {
  key: string;
  label: string;
  render?: (value: any, item: NoteData, rowIndex?: number) => React.ReactNode;
}

interface NotesTableProps {
  data: NoteData[];
  noteColumns: NoteColumn[];
  onNoteUpdate: (studentId: string, competenceId: string, value: number) => void;
}

const NotesTable: React.FC<NotesTableProps> = ({ data, noteColumns, onNoteUpdate }) => {
  const [editingCell, setEditingCell] = useState<{ studentId: string; competenceId: string } | null>(null);

  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 py-8">Aucune note à afficher pour cette sélection.</p>;
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, studentId: string, competenceId: string) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      const newValue = parseInt(target.value, 10);
      if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
        onNoteUpdate(studentId, competenceId, newValue);
      }
      setEditingCell(null);
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const defaultFacilitatorImage = 'https://via.placeholder.com/40x40/CBD5E0/FFFFFF?text=P';

  return (
    <div className="overflow-x-auto shadow border-b border-gray-200 sm:rounded-lg mt-4">
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {noteColumns.map(col => (
              <th key={col.key} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={item.id} className="hover:bg-gray-50">
              {noteColumns.map(col => {
                const cellValue = item[col.key];
                const isEditing = editingCell?.studentId === item.id && editingCell?.competenceId === col.key;
                
                return (
                  <td 
                    key={`${item.id}-${col.key}`} 
                    className="px-4 py-3 whitespace-nowrap text-sm text-gray-700"
                    onDoubleClick={() => {
                      if (col.key !== 'studentName') {
                        setEditingCell({ studentId: item.id, competenceId: col.key });
                      }
                    }}
                  >
                    {isEditing ? (
                       <input
                         type="number"
                         defaultValue={cellValue}
                         onKeyDown={(e) => handleKeyDown(e, item.id, col.key)}
                         onBlur={() => setEditingCell(null)}
                         autoFocus
                         className="w-20 text-center bg-yellow-50 border-2 border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                       />
                    ) : (
                      col.render ? col.render(cellValue, item, index) : cellValue
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotesTable; 
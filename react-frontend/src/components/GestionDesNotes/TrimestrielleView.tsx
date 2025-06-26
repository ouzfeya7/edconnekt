import React, { useState, useMemo } from 'react';
import NotesTable, { NoteData, NoteColumn } from './NotesTable';
import Toolbar from '../ui/Toolbar';
import { useStudents } from '../../contexts/StudentContext';

type Role = 'eleve' | 'enseignant';

interface TrimestrielleViewProps {
  role: Role;
}

// Interface pour les données de cette vue
interface TrimestrielleNoteData extends NoteData {
    studentName: string;
    studentAvatar: string;
    trimestre1?: string;
    trimestre2?: string;
    trimestre3?: string;
}

const ITEMS_PER_PAGE = 10;

const TrimestrielleView: React.FC<TrimestrielleViewProps> = ({ role }) => {
  const { students } = useStudents();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const isEnseignant = role === 'enseignant';

  const filteredStudents = useMemo(() => {
    return students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, students]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredStudents, currentPage]);

  const noteColumns: NoteColumn[] = [
    {
        key: 'student',
        label: 'Élève',
        render: (_, item) => {
            const studentItem = item as TrimestrielleNoteData;
            return (
                <div className="flex items-center">
                    <img
                        src={studentItem.studentAvatar || 'https://via.placeholder.com/40'}
                        alt="avatar"
                        className="w-8 h-8 rounded-full mr-3 object-cover"
                    />
                    <span>{studentItem.studentName}</span>
                </div>
            )
        }
    },
    { key: 'trimestre1', label: 'Trimestre 1', render: (value) => value ? <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline">{value as string}</a> : <span className="text-gray-400">-</span> },
    { key: 'trimestre2', label: 'Trimestre 2', render: (value) => value ? <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline">{value as string}</a> : <span className="text-gray-400">-</span> },
    { key: 'trimestre3', label: 'Trimestre 3', render: (value) => value ? <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline">{value as string}</a> : <span className="text-gray-400">-</span> },
  ];
  
  const notesTableData: TrimestrielleNoteData[] = paginatedStudents.map(student => ({
      id: student.id,
      studentName: student.name,
      studentAvatar: student.avatar,
      // Les rapports seront ajoutés plus tard
  }));

  if (!isEnseignant) {
    return <div className="text-center p-8">Vue non disponible pour ce rôle.</div>;
  }

  return (
    <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-md">
      <Toolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Rechercher par nom..."
        showPagination={true}
        currentPage={currentPage}
        totalItems={filteredStudents.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
      <NotesTable 
        data={notesTableData} 
        noteColumns={noteColumns} 
      />
    </div>
  );
};

export default TrimestrielleView; 
import React, { useState, useMemo } from 'react';
import NotesTable, { NoteData, NoteColumn, TableAction } from './NotesTable';
import Toolbar from '../ui/Toolbar';
import { Eye, Download, Edit3 } from 'lucide-react';

type Role = 'eleve' | 'enseignant';

interface TrimestrielleViewProps {
  role: Role;
}

// Interfaces de données spécifiques
interface EleveTrimestrielleData extends NoteData {
    eleveName: string;
    eleveImage?: string;
    dateNaissance: string;
    trimestre1?: string;
    trimestre2?: string;
    trimestre3?: string;
}

interface EnseignantTrimestrielleData extends NoteData {
    studentName: string;
    studentAvatar?: string;
    dateNaissance: string;
    trimestre1?: string;
    trimestre2?: string;
    trimestre3?: string;
}

// Données Mock (pourrait être remplacé par un fetch)
const mockEleveNotes: EleveTrimestrielleData[] = [
    { id: '1', eleveName: 'Khadija Ndiaye', eleveImage: 'https://randomuser.me/api/portraits/women/70.jpg', dateNaissance: '2 Mars 2025', trimestre1: 'rapportT1_khadija.pdf', trimestre2: 'rapportT2_khadija.pdf', trimestre3: 'rapportT3_khadija.pdf', date: '2 Mars 2025', progression: 0, subjectId: 'trimestriel', facilitator: 'Khadija Ndiaye' },
    { id: '2', eleveName: 'Mamadou Sow', eleveImage: 'https://randomuser.me/api/portraits/men/70.jpg', dateNaissance: '15 Mai 2024', trimestre1: 'rapportT1_mamadou.pdf', trimestre3: 'rapportT3_mamadou.pdf', date: '15 Mai 2024', progression: 0, subjectId: 'trimestriel', facilitator: 'Mamadou Sow' },
];

const mockEnseignantNotes: EnseignantTrimestrielleData[] = [
    { id: 's1-trim', studentName: 'Khadija Ndiaye', studentAvatar: 'https://randomuser.me/api/portraits/women/1.jpg', dateNaissance: '2 Mars 2025', trimestre1: 'rapportT1.pdf', trimestre2: 'rapportT2.pdf', trimestre3: 'rapportT3.pdf', date: 'N/A', progression: 0, subjectId:'trim', facilitator:'Khadija Ndiaye', facilitatorImage:'https://randomuser.me/api/portraits/women/1.jpg'},
    { id: 's2-trim', studentName: 'Maty Diop', studentAvatar: 'https://randomuser.me/api/portraits/women/2.jpg', dateNaissance: '15 Avril 2025', trimestre1: 'rapportT1.pdf', trimestre3: 'rapportT3.pdf', date: 'N/A', progression: 0, subjectId:'trim', facilitator:'Maty Diop', facilitatorImage:'https://randomuser.me/api/portraits/women/2.jpg'},
];


const ITEMS_PER_PAGE = 5;

const TrimestrielleView: React.FC<TrimestrielleViewProps> = ({ role }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const isEnseignant = role === 'enseignant';

  const notesData = isEnseignant ? mockEnseignantNotes : mockEleveNotes;

  const filteredNotes = useMemo(() => {
    return notesData.filter(note => {
        const name = isEnseignant ? (note as EnseignantTrimestrielleData).studentName : (note as EleveTrimestrielleData).eleveName;
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               note.dateNaissance.toLowerCase().includes(searchTerm.toLowerCase())
    });
  }, [searchTerm, notesData, isEnseignant]);

  const paginatedNotes = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNotes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredNotes, currentPage]);

  // Handlers
  const handleViewReport = (id: string) => console.log(`View report for: ${id}, Role: ${role}`);
  const handleDownloadReport = (id: string) => console.log(`Download report for: ${id}, Role: ${role}`);
  const handleEditAccess = (id: string) => console.log(`Edit access for: ${id}`);

  // Définition des actions de base
  const baseActions: TableAction[] = [
    { id: 'view', icon: <Eye size={16} />, onClick: handleViewReport, tooltip: 'Voir rapports' },
    { id: 'download', icon: <Download size={16} />, onClick: handleDownloadReport, tooltip: 'Télécharger les rapports' }
  ];

  // Ajout des actions spécifiques à l'enseignant
  const tableActions: TableAction[] = isEnseignant 
    ? [
        ...baseActions,
        { id: 'editAccess', icon: <Edit3 size={16} />, onClick: handleEditAccess, tooltip: 'Modifier accès/rapports' }
      ]
    : baseActions;

  const noteColumns: NoteColumn[] = [
    { key: 'dateNaissance', label: 'Date de naissance' },
    { key: 'trimestre1', label: 'Trimestre 1', render: (value, note) => value ? <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline">{value as string}</a> : <span className="text-gray-400">-</span> },
    { key: 'trimestre2', label: 'Trimestre 2', render: (value, note) => value ? <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline">{value as string}</a> : <span className="text-gray-400">-</span> },
    { key: 'trimestre3', label: 'Trimestre 3', render: (value, note) => value ? <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline">{value as string}</a> : <span className="text-gray-400">-</span> },
    { key: 'placeholder', label: '-', render: () => <span className="text-gray-400">-</span> }
  ];
  
  const notesTableData = paginatedNotes.map(note => {
    const eleveNote = note as EleveTrimestrielleData;
    const enseignantNote = note as EnseignantTrimestrielleData;
    return {
      ...note,
      facilitator: isEnseignant ? enseignantNote.studentName : eleveNote.eleveName,
      facilitatorImage: isEnseignant ? enseignantNote.studentAvatar : eleveNote.eleveImage
  }});

  return (
    <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-md">
      <Toolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Rechercher par nom, date de naissance..."
        showPagination={true}
        currentPage={currentPage}
        totalItems={filteredNotes.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
      <NotesTable 
        data={notesTableData} 
        noteColumns={noteColumns} 
        actions={tableActions} 
        showProgressionColumn={false}
      />
    </div>
  );
};

export default TrimestrielleView; 
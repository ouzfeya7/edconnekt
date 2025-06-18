import React, { useState, useMemo, useEffect } from 'react';
import NotesTable, { NoteData, NoteColumn, TableAction } from './NotesTable';
import Toolbar from '../ui/Toolbar';
import { Eye, Edit3, UserCog, Filter, MoreHorizontal } from 'lucide-react';

type Role = 'eleve' | 'enseignant';

interface IntegrationViewProps {
  role: Role;
}

// Interfaces de données
interface BaseIntegrationData extends NoteData {
    date: string;
    langage?: number;
    conte?: number;
    vocabulaire?: number;
    lecture?: number;
    graphisme?: number;
    month: string;
}

interface EleveIntegrationData extends BaseIntegrationData {
  facilitator: string;
  facilitatorImage?: string;
}

interface EnseignantIntegrationData extends BaseIntegrationData {
  studentName: string;
  studentAvatar?: string;
}


// Mocks
const mockEleveNotes: EleveIntegrationData[] = [
    { id: 'integS1', facilitator: 'Khadija Ndiaye', facilitatorImage: 'https://randomuser.me/api/portraits/women/65.jpg', date: '2 Mars 2025', langage: 75, conte: 79, vocabulaire: 68, lecture: 40, graphisme: 79, progression: 70, month: "Septembre", subjectId: 'integration-sept' },
    { id: 'integS2', facilitator: 'Maty Diop', facilitatorImage: 'https://randomuser.me/api/portraits/women/60.jpg', date: '2 Mars 2025', langage: 86, conte: 83, vocabulaire: 56, lecture: 82, graphisme: 28, progression: 75, month: "Septembre", subjectId: 'integration-sept' },
    { id: 'integO1', facilitator: 'Awa Gueye', facilitatorImage: 'https://randomuser.me/api/portraits/women/61.jpg', date: '10 Octobre 2025', langage: 88, conte: 92, vocabulaire: 85, lecture: 90, graphisme: 88, progression: 89, month: "Octobre", subjectId: 'integration-oct' },
];

const mockEnseignantNotes: EnseignantIntegrationData[] = [
    { id: 's1-int-sep', studentName: 'Khadija Ndiaye', studentAvatar: 'https://randomuser.me/api/portraits/women/1.jpg', date: '15 Septembre 2024', langage: 70, conte: 65, vocabulaire: 72, lecture: 78, graphisme: 60, progression: 70, month: "Septembre", subjectId: 'integration-sept' },
    { id: 's2-int-sep', studentName: 'Maty Diop', studentAvatar: 'https://randomuser.me/api/portraits/women/2.jpg', date: '18 Septembre 2024', langage: 80, conte: 75, vocabulaire: 82, lecture: 88, graphisme: 70, progression: 80, month: "Septembre", subjectId: 'integration-sept' },
    { id: 's1-int-oct', studentName: 'Khadija Ndiaye', studentAvatar: 'https://randomuser.me/api/portraits/women/1.jpg', date: '12 Octobre 2024', langage: 75, conte: 70, vocabulaire: 77, lecture: 83, graphisme: 65, progression: 75, month: "Octobre", subjectId: 'integration-oct' },
];

const ITEMS_PER_PAGE = 5;
const MONTHS = ["Septembre", "Octobre", "Novembre", "Décembre", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août"];


const IntegrationView: React.FC<IntegrationViewProps> = ({ role }) => {
    const [activeMonth, setActiveMonth] = useState(MONTHS[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const isEnseignant = role === 'enseignant';
    const notesData = isEnseignant ? mockEnseignantNotes : mockEleveNotes;

    const filteredAndSortedNotes = useMemo(() => {
        return notesData
            .filter(note => {
                const searchLower = searchTerm.toLowerCase();
                const name = isEnseignant ? (note as EnseignantIntegrationData).studentName : (note as EleveIntegrationData).facilitator;

                const matchesSearch =
                    name.toLowerCase().includes(searchLower) ||
                    note.date.toLowerCase().includes(searchLower);

                const matchesMonth = note.month === activeMonth;
                return matchesSearch && matchesMonth;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [searchTerm, activeMonth, notesData, isEnseignant]);

    const paginatedNotes = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedNotes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAndSortedNotes, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeMonth, searchTerm]);

    // Handlers
    const handleEditNote = (noteId: string) => console.log("Edit integration note:", noteId);
    const handleViewDetails = (noteId: string) => console.log("View details for note:", noteId);
    const handleViewStudent = (noteId: string) => console.log("View student profile for note:", noteId);

    // Actions
    const baseActions: TableAction[] = [
        { id: 'edit', icon: <div className="w-5 h-5 bg-orange-400 rounded-sm flex items-center justify-center"><Edit3 size={12} className="text-white"/></div>, onClick: handleEditNote, tooltip: 'Modifier' },
        { id: 'view', icon: <Eye size={16} />, onClick: handleViewDetails, tooltip: 'Voir Détails' }
    ];

    const tableActions: TableAction[] = isEnseignant
        ? [ ...baseActions, { id: 'viewStudent', icon: <UserCog size={16} />, onClick: handleViewStudent, tooltip: 'Voir profil élève' } ]
        : baseActions;

    // Colonnes
    const noteColumns: NoteColumn[] = [
        { key: 'langage', label: "Langage" },
        { key: 'conte', label: "Conte" },
        { key: 'vocabulaire', label: "Vocabulaire" },
        { key: 'lecture', label: "Lecture" },
        { key: 'graphisme', label: "Graphisme" },
    ];
    
    const notesTableData = paginatedNotes.map(note => {
        const eleveNote = note as EleveIntegrationData;
        const enseignantNote = note as EnseignantIntegrationData;
        return {
            ...note,
            facilitator: isEnseignant ? enseignantNote.studentName : eleveNote.facilitator,
            facilitatorImage: isEnseignant ? enseignantNote.studentAvatar : eleveNote.facilitatorImage,
        }
    });

    const monthTabs = (
        <div className="flex flex-wrap gap-2 items-center justify-center">
            {MONTHS.map(month => (
                <button
                    key={month}
                    onClick={() => { setActiveMonth(month); }}
                    className={`px-4 py-1.5 text-sm font-medium focus:outline-none whitespace-nowrap transition-all duration-150 ease-in-out 
                                ${activeMonth === month 
                                ? 'border-orange-500 text-orange-600 border-b-2 font-semibold' 
                                : 'text-gray-600 hover:text-orange-500 border-b-2 border-transparent'}`}
                >
                    {month.toUpperCase()}
                </button>
            ))}
        </div>
    );

    return (
        <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-md">
            <div className="flex border-b-2 border-gray-200 mb-4 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {monthTabs}
            </div>
            <Toolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder={isEnseignant ? "Rechercher élève, date..." : "Rechercher facilitateur, date..."}
                centerSlot={<button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"><Filter size={16}/> Filtre</button>}
                showPagination={true}
                currentPage={currentPage}
                totalItems={filteredAndSortedNotes.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
                rightActions={<button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100" title="Plus d'options"><MoreHorizontal size={18} /></button>}
            />
            <NotesTable 
                data={notesTableData} 
                noteColumns={noteColumns} 
                actions={tableActions} 
                showProgressionColumn={true}
            />
        </div>
    );
};

export default IntegrationView; 
import React, { useState, useMemo, useEffect } from 'react';
import NotesTable, { NoteData, NoteColumn, TableAction } from './NotesTable';
import Toolbar from '../ui/Toolbar';
import { Search, Edit3, Eye, ArrowDownToLine, MoreHorizontal, UserCog } from 'lucide-react';

type Role = 'eleve' | 'enseignant';

interface ContinueViewProps {
  role: Role;
}

// Interfaces de données
interface BaseContinueData extends NoteData {
    subjectId: string;
    date: string;
}
interface EleveContinueData extends BaseContinueData {
  facilitator: string;
  facilitatorImage?: string;
}
interface EnseignantContinueData extends BaseContinueData {
  studentName: string;
  studentAvatar?: string;
}

// Data structure for subjects
const mainSubjectsData = [
  {
    id: 'langComm', name: "Langue et communication",
    subSubjects: [
      { id: 'francais', name: "Français", noteColumns: [{ key: 'langage', label: "Langage" }, { key: 'conte', label: "Conte" }, { key: 'vocabulaire', label: "Vocabulaire" }, { key: 'lecture', label: "Lecture" }, { key: 'graphisme', label: "Graphisme" }] },
      { id: 'anglais', name: "Anglais", noteColumns: [{ key: 'speaking', label: "Speaking" }, { key: 'reading', label: "Reading" }, { key: 'writing', label: "Writing" }] },
    ],
  },
  {
    id: 'sciSoc', name: "Sciences Sociales",
    subSubjects: [
      { id: 'histoire', name: "Histoire", noteColumns: [{key: 'connaissances', label: 'Connaissances'}, {key: 'analyse', label: 'Analyse'}] },
      { id: 'geographie', name: "Géographie", noteColumns: [{key: 'reperage', label: 'Repérage'}, {key: 'etudeCas', label: 'Étude de cas'}] },
    ],
  },
];

// Mock Data
const mockEleveNotes: EleveContinueData[] = [
  { id: '1', subjectId: 'francais', facilitator: 'Maty Diop', facilitatorImage: 'https://randomuser.me/api/portraits/women/60.jpg', date: '2 Mars 2025', langage: 75, conte: 79, vocabulaire: 68, lecture: 80, graphisme: 72, progression: 75 },
  { id: '4', subjectId: 'anglais', facilitator: 'John Smith', facilitatorImage: 'https://randomuser.me/api/portraits/men/62.jpg', date: '5 Mars 2025', speaking: 80, reading: 75, writing: 70, progression: 75 },
];
const mockEnseignantNotes: EnseignantContinueData[] = [
  { id: 's1-fr-1', studentName: 'Khadija Ndiaye', studentAvatar: 'https://randomuser.me/api/portraits/women/1.jpg', subjectId: 'francais', date: '2 Mars 2025', langage: 75, conte: 79, vocabulaire: 68, lecture: 80, graphisme: 72, progression: 75, facilitator: 'Khadija Ndiaye' },
  { id: 's2-fr-1', studentName: 'Maty Diop', studentAvatar: 'https://randomuser.me/api/portraits/women/2.jpg', subjectId: 'francais', date: '2 Mars 2025', langage: 88, conte: 53, vocabulaire: 14, lecture: 60, graphisme: 40, progression: 52, facilitator: 'Maty Diop' },
  { id: 's1-en-1', studentName: 'Khadija Ndiaye', studentAvatar: 'https://randomuser.me/api/portraits/women/1.jpg', subjectId: 'anglais', date: '3 Mars 2025', speaking: 80, reading: 75, writing: 70, progression: 75, facilitator: 'Khadija Ndiaye' },
];

const ITEMS_PER_PAGE = 5;

const ContinueView: React.FC<ContinueViewProps> = ({ role }) => {
    const [activeMainSubjectId, setActiveMainSubjectId] = useState(mainSubjectsData[0].id);
    const [activeSubSubjectId, setActiveSubSubjectId] = useState(mainSubjectsData[0].subSubjects[0].id);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    const isEnseignant = role === 'enseignant';
    const notesData = isEnseignant ? mockEnseignantNotes : mockEleveNotes;

    const currentMainSubject = useMemo(() => mainSubjectsData.find(ms => ms.id === activeMainSubjectId), [activeMainSubjectId]);
    const subSubjectsForCurrentMain = currentMainSubject?.subSubjects || [];

    useEffect(() => {
        if (currentMainSubject?.subSubjects.length) {
            const subIsValid = currentMainSubject.subSubjects.some(ss => ss.id === activeSubSubjectId);
            if (!subIsValid) setActiveSubSubjectId(currentMainSubject.subSubjects[0].id);
        } else {
            setActiveSubSubjectId('');
        }
        setCurrentPage(1);
    }, [currentMainSubject, activeSubSubjectId]);

    const currentNoteColumns = useMemo(() => {
        return mainSubjectsData.flatMap(ms => ms.subSubjects).find(ss => ss.id === activeSubSubjectId)?.noteColumns || [];
    }, [activeSubSubjectId]);

    const filteredAndSortedNotes = useMemo(() => {
        return notesData
            .filter(note => {
                const searchLower = searchTerm.toLowerCase();
                const name = isEnseignant ? (note as EnseignantContinueData).studentName : (note as EleveContinueData).facilitator;
                const matchesSearch = name.toLowerCase().includes(searchLower) || note.date.toLowerCase().includes(searchLower);
                return matchesSearch && note.subjectId === activeSubSubjectId;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [searchTerm, activeSubSubjectId, notesData, isEnseignant]);

    const paginatedNotes = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedNotes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAndSortedNotes, currentPage]);
    
    // Actions
    const handleEditNote = (noteId: string) => console.log("Edit note:", noteId);
    const handleViewNote = (noteId: string) => console.log("View note:", noteId);
    const handleViewStudentProfile = (noteId: string) => console.log("View student profile for note:", noteId);
    
    const baseActions: TableAction[] = [
        { id: 'edit', icon: <div className="w-5 h-5 bg-orange-400 rounded-sm flex items-center justify-center"><Edit3 size={12} className="text-white"/></div>, onClick: handleEditNote, tooltip: 'Modifier' },
        { id: 'view', icon: <Eye size={16} />, onClick: handleViewNote, tooltip: 'Voir Détails' }
    ];

    const tableActions: TableAction[] = isEnseignant
        ? [ ...baseActions, { id: 'viewStudent', icon: <UserCog size={16} />, onClick: handleViewStudentProfile, tooltip: 'Voir profil élève' } ]
        : baseActions;

    const tableColumns: NoteColumn[] = [
        ...currentNoteColumns
    ];

    const notesTableData = paginatedNotes.map(note => {
        const eleveNote = note as EleveContinueData;
        const enseignantNote = note as EnseignantContinueData;
        return {
            ...note,
            facilitator: isEnseignant ? enseignantNote.studentName : eleveNote.facilitator,
            facilitatorImage: isEnseignant ? enseignantNote.studentAvatar : eleveNote.facilitatorImage,
        }
    });

    return (
        <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-md">
            <div className="flex border-b-2 border-gray-200 mb-2 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {mainSubjectsData.map(subject => (
                    <button key={subject.id} onClick={() => setActiveMainSubjectId(subject.id)}
                        className={`px-5 py-3 text-sm font-medium focus:outline-none transition-all ${activeMainSubjectId === subject.id ? 'border-orange-500 text-orange-600 border-b-[3px] font-semibold bg-orange-50' : 'text-gray-600 hover:text-gray-800 border-b-[3px] border-transparent'}`}>
                        {subject.name.toUpperCase()}
                    </button>
                ))}
            </div>
            <Toolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder={isEnseignant ? "Rechercher élève, date..." : "Rechercher facilitateur, date..."}
                centerSlot={
                    <div className="flex flex-wrap gap-2 items-center">
                        {subSubjectsForCurrentMain.map(subSubject => (
                            <button key={subSubject.id} onClick={() => setActiveSubSubjectId(subSubject.id)}
                                className={`px-4 py-1.5 text-sm rounded-full font-medium focus:outline-none transition-colors ${activeSubSubjectId === subSubject.id ? 'bg-sky-700 text-white shadow-md' : 'bg-gray-100 text-gray-700 border hover:bg-gray-200'}`}>
                                {subSubject.name}
                            </button>
                        ))}
                    </div>
                }
                showPagination={true}
                currentPage={currentPage}
                totalItems={filteredAndSortedNotes.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
                rightActions={
                    <>
                        <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100"><ArrowDownToLine size={18} /></button>
                        <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100"><MoreHorizontal size={18} /></button>
                    </>
                }
            />
            <NotesTable 
                data={notesTableData} 
                noteColumns={tableColumns}
                actions={tableActions}
                showProgressionColumn={true}
            />
        </div>
    );
};

export default ContinueView; 
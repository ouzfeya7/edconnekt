import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import NotesTable from './NotesTable';
import type { NoteColumn } from './NotesTable';
import Toolbar from '../ui/Toolbar';
import { useFilters } from '../../contexts/FilterContext';
import { useStudents } from '../../contexts/StudentContext';
import { getSubjectsForClass, getNotesForClass, getGradingStatus } from '../../lib/notes-data';
import type { StudentNote, Domain } from '../../lib/notes-data';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { MoreHorizontal, FileSpreadsheet, FileText, Library, ArrowDownToLine } from 'lucide-react';

interface jsPDFWithAutoTable extends jsPDF {
    lastAutoTable?: {
        finalY?: number;
    };
}

const ITEMS_PER_PAGE = 10;

interface IntegrationViewProps {
  role: 'enseignant' | 'eleve';
}

const IntegrationView: React.FC<IntegrationViewProps> = ({ role }) => {
    const { currentClasse, currentMonth } = useFilters();
    const { students } = useStudents();
    
    const [domains, setDomains] = useState<Domain[]>([]);
    const [notes, setNotes] = useState<StudentNote[]>([]);
    const [activeDomainId, setActiveDomainId] = useState<string>('');
    const [activeSubjectId, setActiveSubjectId] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const classDomains = getSubjectsForClass(currentClasse);
        setDomains(classDomains);
        const classNotes = getNotesForClass(currentClasse, students.map(s => ({ id: s.id, name: s.name, avatar: s.avatar })));
        setNotes(classNotes);

        if (classDomains.length > 0) {
            const firstDomain = classDomains[0];
            setActiveDomainId(firstDomain.id);
            if (firstDomain.subjects.length > 0) {
                setActiveSubjectId(firstDomain.subjects[0].id);
            }
        }
    }, [currentClasse, students]);
    
    const handleNoteUpdate = (studentId: string, competenceId: string, newValue: number | 'absent' | 'non-evalue') => {
        setNotes(currentNotes =>
            currentNotes.map(note => {
                if (note.studentId === studentId) {
                    return { ...note, notes: { ...note.notes, [competenceId]: newValue } };
                }
                return note;
            })
        );
    };
    
    const handleExport = () => {
        if (!activeSubject) return;

        const dataToExport = filteredNotes.map(note => {
            const studentData: {[key: string]: string | number} = {
                'Prénom et Nom': note.studentName,
            };
            activeSubject.competences.forEach(c => {
                const noteValue = note.notes[c.id];
                if (typeof noteValue === 'number') {
                    studentData[c.label] = `${noteValue}%`;
                } else if (noteValue === 'absent') {
                    studentData[c.label] = 'Absent';
                } else if (noteValue === 'non-evalue') {
                    studentData[c.label] = 'Non évalué';
                } else {
                    studentData[c.label] = '-';
                }
            });
            return studentData;
        });

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, activeSubject.name);
        
        const colWidths = Object.keys(dataToExport[0] || {}).map(key => ({
            wch: Math.max(key.length, ...dataToExport.map(row => (row[key] || '').toString().length)) + 2
        }));
        worksheet['!cols'] = colWidths;

        XLSX.writeFile(workbook, `Notes_Integration_${currentClasse}_${currentMonth}_${activeSubject.name}.xlsx`);
    };

    const handleExportAll = () => {
        const workbook = XLSX.utils.book_new();

        domains.forEach(domain => {
            domain.subjects.forEach(subject => {
                const dataToExport = filteredNotes.map(note => {
                    const studentData: { [key: string]: string | number } = {
                        'Prénom et Nom': note.studentName,
                    };
                    subject.competences.forEach(c => {
                        const noteValue = note.notes[c.id];
                        if (typeof noteValue === 'number') {
                            studentData[c.label] = `${noteValue}%`;
                        } else if (noteValue === 'absent') {
                            studentData[c.label] = 'Absent';
                        } else if (noteValue === 'non-evalue') {
                            studentData[c.label] = 'Non évalué';
                        } else {
                            studentData[c.label] = '-';
                        }
                    });
                    return studentData;
                });
                
                if (dataToExport.length > 0) {
                    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
                    
                    const sheetName = subject.name.replace(/[:\\/?*[\]]/g, '').substring(0, 31);

                    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
                    
                    const colWidths = Object.keys(dataToExport[0] || {}).map(key => ({
                        wch: Math.max(key.length, ...dataToExport.map(row => (row[key] || '').toString().length)) + 2
                    }));
                    worksheet['!cols'] = colWidths;
                }
            });
        });

        if (workbook.SheetNames.length > 0) {
            XLSX.writeFile(workbook, `Notes_Integration_${currentClasse}_${currentMonth}_Toutes_Matieres.xlsx`);
        } else {
            console.warn("Aucune donnée à exporter.");
        }
    };

    const handleExportPdf = () => {
        if (!activeSubject) {
            console.error("Export PDF annulé : aucune matière active.");
            return;
        }

        try {
            const doc = new jsPDF();
            const tableColumns = ["Prénom et Nom", ...activeSubject.competences.map(c => c.label)];
            const tableRows = filteredNotes.map(note => [
                note.studentName,
                ...activeSubject.competences.map(c => {
                    const noteValue = note.notes[c.id];
                    if (typeof noteValue === 'number') return `${noteValue}%`;
                    if (noteValue === 'absent') return 'Absent';
                    if (noteValue === 'non-evalue') return 'Non évalué';
                    return '-';
                })
            ]);

            doc.setFontSize(16);
            doc.text(`Notes Intégration - ${activeSubject.name} (${currentClasse} - ${currentMonth})`, 14, 15);

            autoTable(doc, {
                head: [tableColumns],
                body: tableRows,
                startY: 20,
            });

            doc.save(`Notes_Integration_${currentClasse}_${currentMonth}_${activeSubject.name}.pdf`);
        } catch (error) {
            console.error("Erreur lors de la génération du PDF :", error);
            alert("Une erreur est survenue lors de la création du PDF. Veuillez consulter la console pour plus de détails.");
        }
    };

    const handleExportAllPdf = () => {
        try {
            const doc: jsPDFWithAutoTable = new jsPDF();
            doc.setFontSize(18);
            doc.text(`Rapport d'intégration complet - Classe: ${currentClasse} (${currentMonth})`, 14, 22);

            let startY = 30;

            domains.forEach(domain => {
                domain.subjects.forEach(subject => {
                    if (subject.competences.length === 0) return;

                    const tableColumns = ["Prénom et Nom", ...subject.competences.map(c => c.label)];
                    const tableRows = filteredNotes.map(note => [
                        note.studentName,
                        ...subject.competences.map(c => {
                            const noteValue = note.notes[c.id];
                            if (typeof noteValue === 'number') return `${noteValue}%`;
                            if (noteValue === 'absent') return 'Absent';
                            if (noteValue === 'non-evalue') return 'Non évalué';
                            return '-';
                        })
                    ]);

                    autoTable(doc, {
                        head: [[`${domain.name} - ${subject.name}`]],
                        startY: startY,
                        theme: 'plain',
                        styles: { fontStyle: 'bold', fontSize: 12, halign: 'left' }
                    });

                    autoTable(doc, {
                        head: [tableColumns],
                        body: tableRows,
                        startY: doc.lastAutoTable?.finalY,
                    });

                    startY = (doc.lastAutoTable?.finalY || startY) + 10;
                });
            });

            doc.save(`Rapport_Integration_Complet_${currentClasse}_${currentMonth}.pdf`);

        } catch (error) {
            console.error("Erreur lors de la génération du PDF complet :", error);
            alert("Une erreur est survenue lors de la création du PDF. Veuillez consulter la console pour plus de détails.");
        }
    };

    const activeDomain = useMemo(() => domains.find(d => d.id === activeDomainId), [domains, activeDomainId]);
    const subjectsForActiveDomain = useMemo(() => activeDomain?.subjects || [], [activeDomain]);
    const activeSubject = useMemo(() => subjectsForActiveDomain.find(s => s.id === activeSubjectId), [subjectsForActiveDomain, activeSubjectId]);

    const noteColumns: NoteColumn[] = useMemo(() => {
        const studentColumn: NoteColumn = {
            key: 'studentName', label: 'Prénom et Nom',
            render: (_, item) => (
                <div className="flex items-center"><img className="h-8 w-8 rounded-full object-cover" src={item.studentAvatar} alt={item.studentName} /><div className="ml-3"><div className="text-sm font-medium">{item.studentName}</div></div></div>
            )
        };
        const competenceColumns: NoteColumn[] = activeSubject?.competences.map(c => ({
            key: c.id, label: c.label,
            render: (value) => {
                const status = getGradingStatus(value);
                return <span className={`font-semibold ${status.color}`}>{status.text}{typeof value === 'number' ? '%' : ''}</span>;
            }
        })) || [];
        return [studentColumn, ...competenceColumns];
    }, [activeSubject]);

    const filteredNotes = useMemo(() => notes.filter(note => note.studentName.toLowerCase().includes(searchTerm.toLowerCase())), [notes, searchTerm]);
    const paginatedNotes = useMemo(() => filteredNotes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE), [filteredNotes, currentPage]);
    const notesTableData = useMemo(() => paginatedNotes.map(note => ({ id: note.studentId, studentName: note.studentName, studentAvatar: note.studentAvatar, ...note.notes })), [paginatedNotes]);

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="flex border-b border-gray-200 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {domains.map(domain => (
                <button
                        key={domain.id}
                        onClick={() => setActiveDomainId(domain.id)}
                        className={`px-4 py-3 text-sm font-medium focus:outline-none transition-colors duration-150 ${
                            activeDomainId === domain.id
                                ? 'border-orange-500 text-orange-600 border-b-2'
                                : 'text-gray-500 hover:text-orange-500 border-b-2 border-transparent'
                        }`}
                    >
                        {domain.name.toUpperCase()}
                </button>
            ))}
            </div>
            <div className="p-4 md:p-6">
            <Toolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                    searchPlaceholder={'Rechercher par nom...'}
                    centerSlot={
                        <div className="flex flex-wrap items-center gap-2">
                            {subjectsForActiveDomain.map(subject => (
                                <button
                                    key={subject.id}
                                    onClick={() => setActiveSubjectId(subject.id)}
                                    className={`px-4 py-1.5 text-sm rounded-full font-medium focus:outline-none transition-colors ${
                                        activeSubjectId === subject.id
                                            ? 'bg-sky-700 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 border hover:bg-gray-200'
                                    }`}
                                >
                                    {subject.name}
                                </button>
                            ))}
                        </div>
                    }
                showPagination={true}
                currentPage={currentPage}
                    totalItems={filteredNotes.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
                    rightActions={
                        role === 'enseignant' ? (
                            <Menu as="div" className="relative">
                                <MenuButton className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <MoreHorizontal className="w-5 h-5" />
                                </MenuButton>
                                <MenuItems anchor="bottom end" className="w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                    <div className="px-1 py-1">
                                        <MenuItem>
                                            {({ active }) => (
                                                <button onClick={handleExport} className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}>
                                                    <FileSpreadsheet className="w-5 h-5 mr-2" /> Exporter Excel (Matière)
                                                </button>
                                            )}
                                        </MenuItem>
                                        <MenuItem>
                                            {({ active }) => (
                                                <button onClick={handleExportAll} className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}>
                                                    <Library className="w-5 h-5 mr-2" /> Exporter Excel (Tout)
                                                </button>
                                            )}
                                        </MenuItem>
                                    </div>
                                    <div className="px-1 py-1">
                                        <MenuItem>
                                            {({ active }) => (
                                                <button onClick={handleExportPdf} className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}>
                                                    <FileText className="w-5 h-5 mr-2" /> Exporter PDF (Matière)
                                                </button>
                                            )}
                                        </MenuItem>
                                        <MenuItem>
                                            {({ active }) => (
                                                <button onClick={handleExportAllPdf} className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}>
                                                    <ArrowDownToLine className="w-5 h-5 mr-2" /> Exporter PDF (Tout)
                                                </button>
                                            )}
                                        </MenuItem>
                                    </div>
                                </MenuItems>
                            </Menu>
                        ) : null
                    }
            />
            <NotesTable 
                data={notesTableData} 
                noteColumns={noteColumns} 
                    onNoteUpdate={role === 'enseignant' ? handleNoteUpdate : undefined}
            />
            </div>
        </div>
    );
};

export default IntegrationView; 
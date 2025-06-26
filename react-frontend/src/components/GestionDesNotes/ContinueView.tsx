import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import NotesTable, { NoteColumn } from './NotesTable';
import Toolbar from '../ui/Toolbar';
import { ArrowDownToLine, FileSpreadsheet, FileText, Library, MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFilters } from '../../contexts/FilterContext';
import { getSubjectsForClass, getNotesForClass, StudentNote, Domain, getGradingStatus } from '../../lib/notes-data';

interface jsPDFWithAutoTable extends jsPDF {
    lastAutoTable?: {
        finalY?: number;
    };
}

const ITEMS_PER_PAGE = 10;

const ContinueView: React.FC = () => {
    const { t } = useTranslation();
    const { currentClasse } = useFilters();
    
    const [domains, setDomains] = useState<Domain[]>([]);
    const [notes, setNotes] = useState<StudentNote[]>([]);

    const [activeDomainId, setActiveDomainId] = useState<string>('');
    const [activeSubjectId, setActiveSubjectId] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const classDomains = getSubjectsForClass(currentClasse);
        setDomains(classDomains);

        const classNotes = getNotesForClass(currentClasse);
        setNotes(classNotes);

        if (classDomains.length > 0) {
            const firstDomain = classDomains[0];
            setActiveDomainId(firstDomain.id);
            if (firstDomain.subjects.length > 0) {
                setActiveSubjectId(firstDomain.subjects[0].id);
            } else {
                setActiveSubjectId('');
            }
        } else {
            setActiveDomainId('');
            setActiveSubjectId('');
        }
        setCurrentPage(1);
    }, [currentClasse]);

    const handleNoteUpdate = (studentId: string, competenceId: string, newValue: number) => {
        setNotes(currentNotes =>
            currentNotes.map(note => {
                if (note.studentId === studentId) {
                    const newNotes = { ...note.notes, [competenceId]: newValue };
                    return { ...note, notes: newNotes };
                }
                return note;
            })
        );
    };
    
    const activeDomain = useMemo(() => domains.find(d => d.id === activeDomainId), [domains, activeDomainId]);
    const subjectsForActiveDomain = useMemo(() => activeDomain?.subjects || [], [activeDomain]);

    useEffect(() => {
        if(subjectsForActiveDomain.length > 0 && !subjectsForActiveDomain.some(s => s.id === activeSubjectId)) {
            setActiveSubjectId(subjectsForActiveDomain[0].id);
            setCurrentPage(1);
        }
    }, [subjectsForActiveDomain, activeSubjectId]);

    const activeSubject = useMemo(() => {
        return subjectsForActiveDomain.find(s => s.id === activeSubjectId);
    }, [subjectsForActiveDomain, activeSubjectId]);

    const noteColumns: NoteColumn[] = useMemo(() => {
        const studentColumn: NoteColumn = {
            key: 'studentName',
            label: 'Prénom et Nom',
            render: (_, item) => (
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                        <img
                            className="h-8 w-8 rounded-full object-cover bg-gray-200"
                            src={item.studentAvatar || `https://via.placeholder.com/40x40/CBD5E0/FFFFFF?text=${item.studentName?.charAt(0) || 'P'}`}
                            alt={item.studentName || 'Avatar'}
                        />
                    </div>
                    <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{item.studentName}</div>
                    </div>
                </div>
            )
        };
        
        const competenceColumns: NoteColumn[] = activeSubject?.competences.map(c => ({
            key: c.id,
            label: c.label,
            render: (value) => {
                if (value === null || value === undefined) return <span className="text-gray-400">-</span>;
                const status = getGradingStatus(value);
                const isNumeric = typeof value === 'number';
                
                return (
                    <span className={`font-semibold ${status.color}`}>
                        {status.text}{isNumeric ? '%' : ''}
                    </span>
                );
            }
        })) || [];

        return [studentColumn, ...competenceColumns];
    }, [activeSubject]);

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
                const searchLower = searchTerm.toLowerCase();
            return note.studentName.toLowerCase().includes(searchLower);
        });
    }, [notes, searchTerm]);

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
        
        // Auto-size columns
        const colWidths = Object.keys(dataToExport[0] || {}).map(key => ({
            wch: Math.max(key.length, ...dataToExport.map(row => (row[key] || '').toString().length)) + 2
        }));
        worksheet['!cols'] = colWidths;

        XLSX.writeFile(workbook, `Notes_${currentClasse}_${activeSubject.name}.xlsx`);
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
                    
                    // Sanitize sheet name
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
            XLSX.writeFile(workbook, `Notes_Toutes_Matieres_${currentClasse}.xlsx`);
        } else {
            // Maybe show a notification to the user
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
            doc.text(`Notes - ${activeSubject.name} (${currentClasse})`, 14, 15);

            autoTable(doc, {
                head: [tableColumns],
                body: tableRows,
                startY: 20,
            });

            doc.save(`Notes_${currentClasse}_${activeSubject.name}.pdf`);
        } catch (error) {
            console.error("Erreur lors de la génération du PDF :", error);
            alert("Une erreur est survenue lors de la création du PDF. Veuillez consulter la console pour plus de détails.");
        }
    };

    const handleExportAllPdf = () => {
        try {
            const doc: jsPDFWithAutoTable = new jsPDF();
            doc.setFontSize(18);
            doc.text(`Rapport de notes complet - Classe: ${currentClasse}`, 14, 22);

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

            doc.save(`Rapport_Complet_${currentClasse}.pdf`);

        } catch (error) {
            console.error("Erreur lors de la génération du PDF complet :", error);
            alert("Une erreur est survenue lors de la création du PDF. Veuillez consulter la console pour plus de détails.");
        }
    };

    const paginatedNotes = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredNotes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredNotes, currentPage]);
    
    const notesTableData = paginatedNotes.map(note => ({
        id: note.studentId,
        studentName: note.studentName,
        studentAvatar: note.studentAvatar,
        ...note.notes,
    }));

    return (
        <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-md">
            <div className="flex border-b-2 border-gray-200 mb-2 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {domains.map(domain => (
                    <button key={domain.id} onClick={() => setActiveDomainId(domain.id)}
                        className={`px-5 py-3 text-sm font-medium focus:outline-none transition-all ${activeDomainId === domain.id ? 'border-orange-500 text-orange-600 border-b-[3px] bg-orange-50' : 'text-gray-600 hover:text-gray-800 border-b-[3px] border-transparent'}`}>
                        {domain.name.toUpperCase()}
                    </button>
                ))}
            </div>
            <Toolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder={t('search_student_name', 'Rechercher par nom...')}
                centerSlot={
                    <div className="flex flex-wrap gap-2 items-center">
                        {subjectsForActiveDomain.map(subject => (
                            <button key={subject.id} onClick={() => setActiveSubjectId(subject.id)}
                                className={`px-4 py-1.5 text-sm rounded-full font-medium focus:outline-none transition-colors ${activeSubjectId === subject.id ? 'bg-sky-700 text-white shadow-md' : 'bg-gray-100 text-gray-700 border hover:bg-gray-200'}`}>
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
                    <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <MenuButton className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100" title="Plus d'options">
                                <MoreHorizontal size={18} />
                            </MenuButton>
                        </div>
                        <MenuItems
                            anchor="bottom end"
                            className="w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                        >
                            <div className="py-1">
                                <MenuItem>
                                    <button
                                        onClick={handleExport}
                                        className='group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-gray-100'
                                    >
                                        <ArrowDownToLine size={16} className="text-gray-500" />
                                        <span>Exporter la matière (Excel)</span>
                                    </button>
                                </MenuItem>
                                <MenuItem>
                                    <button
                                        onClick={handleExportAll}
                                        className='group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-gray-100'
                                    >
                                        <FileSpreadsheet size={16} className="text-gray-500" />
                                        <span>Exporter tout (Excel)</span>
                                    </button>
                                </MenuItem>
                                <MenuItem>
                                    <button
                                        onClick={handleExportPdf}
                                        className='group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-gray-100'
                                    >
                                        <FileText size={16} className="text-gray-500" />
                                        <span>Exporter la matière (PDF)</span>
                                    </button>
                                </MenuItem>
                                <MenuItem>
                                    <button
                                        onClick={handleExportAllPdf}
                                        className='group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-gray-100'
                                    >
                                        <Library size={16} className="text-gray-500" />
                                        <span>Exporter tout (PDF)</span>
                                    </button>
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </Menu>
                }
            />
            <NotesTable 
                data={notesTableData} 
                noteColumns={noteColumns}
                onNoteUpdate={handleNoteUpdate}
            />
        </div>
    );
};

export default ContinueView; 
import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable, { Table } from 'jspdf-autotable';
import { Menu, Transition } from '@headlessui/react';
import NotesTable, { NoteColumn } from './NotesTable';
import StudentTrimestrielleCards from './StudentTrimestrielleCards';
import Toolbar from '../ui/Toolbar';
import { ArrowDownToLine, FileSpreadsheet, FileText, Library, MoreHorizontal } from 'lucide-react';
import { useFilters } from '../../contexts/FilterContext';
import { useStudents } from '../../contexts/StudentContext';
import { getSubjectsForClass, getNotesForClass, StudentNote, Domain, getGradingStatus, calculateTrimesterAverages } from '../../lib/notes-data';
import { getCurrentStudentNotes } from '../../lib/mock-student-notes';
import { getPdfTableStyles } from './pdfStyles';
import schoolLogo from '../../assets/logo-yka-1.png';
import { useUser } from '../../layouts/DashboardLayout';

interface jsPDFWithAutoTable extends jsPDF {
    lastAutoTable?: Table;
}

const ITEMS_PER_PAGE = 10;

const schoolInfo = {
    name: "Yenne Kids' Academy",
    address: "Kel, Rte de Toubab Dialaw, Yenne BP 20000, Dakar, Senegal",
    phone1: "+221 77 701 52 52",
    phone2: "+221 33 871 27 82",
    email: "hello@yennekidsacademy.com",
    website: "www.yennekidsacademy.com",
    academicYear: "2023-2024"
};

const addPdfHeader = (doc: jsPDF, classe: string, title: string, studentName?: string) => {
    // Logo
    doc.addImage(schoolLogo, 'PNG', 25, 15, 30, 30);

    // School Info
    doc.setFontSize(14);
    doc.setFont("times", 'bold');
    doc.text(schoolInfo.name, 65, 22);
    
    doc.setFontSize(8);
    doc.setFont("times", 'normal');
    doc.text(schoolInfo.address, 65, 28);
    doc.text(`Tél: ${schoolInfo.phone1} / ${schoolInfo.phone2}`, 65, 32);
    doc.text(`Email: ${schoolInfo.email} | Site: ${schoolInfo.website}`, 65, 36);
    doc.text(`Année Scolaire: ${schoolInfo.academicYear}`, 65, 40);

    // Student Info (right-aligned)
    if (studentName) {
        const rightMargin = doc.internal.pageSize.getWidth() - 25;
        doc.setFontSize(10);
        doc.setFont("times", 'bold');
        doc.text(studentName, rightMargin, 28, { align: 'right' });
        
        doc.setFontSize(9);
        doc.setFont("times", 'normal');
        doc.text(`Classe: ${classe.toUpperCase()}`, rightMargin, 36, { align: 'right' });
    }

    // Main Title
    let currentY = 55;
    doc.setFontSize(16);
    doc.setFont("times", 'bold');
    doc.text(title, doc.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });
    currentY += 7;

    // Class subtitle (only if no student name)
    if (!studentName) {
        doc.setFontSize(12);
        doc.setFont("times", 'normal');
        doc.text(`Classe: ${classe.toUpperCase()}`, doc.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });
        currentY += 7;
    }

    // Header Line
    doc.setDrawColor(0);
    doc.line(25, currentY, doc.internal.pageSize.getWidth() - 25, currentY);
    
    return currentY + 10;
};

interface TrimestrielleViewProps {
  role: 'enseignant' | 'eleve';
}

const TrimestrielleView: React.FC<TrimestrielleViewProps> = ({ role }) => {
    const { currentClasse, currentTrimestre } = useFilters();
  const { students } = useStudents();
  const { user } = useUser();
    
    const [domains, setDomains] = useState<Domain[]>([]);
    const [notes, setNotes] = useState<StudentNote[]>([]);

    const [activeDomainId, setActiveDomainId] = useState<string>('');
    const [activeSubjectId, setActiveSubjectId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

    // Helper function to extract trimester number from string (e.g., "Trimestre 1" -> 1)
    const extractTrimesterNumber = (trimestre: string): number => {
        const match = trimestre.match(/\d+/);
        return match ? parseInt(match[0], 10) : 1;
    };

  useEffect(() => {
        const classDomains = getSubjectsForClass(currentClasse);
        setDomains(classDomains);

        const classNotes = getNotesForClass(currentClasse, students);
        
        if (role === 'eleve' && user) {
            // Utiliser les données fictives avec moyennes pour l'élève connecté
            const mockNotes = getCurrentStudentNotes(currentClasse);
            const trimesterNumber = extractTrimesterNumber(currentTrimestre);
            const averagedMockNotes = calculateTrimesterAverages(mockNotes, trimesterNumber);
            setNotes(averagedMockNotes);
            // Désactiver la recherche pour l'élève
        setSearchTerm('');
      } else {
            // Pour les enseignants, utiliser des notes vides à remplir manuellement
            setNotes(classNotes);
        }

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
    }, [currentClasse, students, role, user, currentTrimestre]);

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

    const activeSubject = useMemo(() => subjectsForActiveDomain.find(s => s.id === activeSubjectId), [subjectsForActiveDomain, activeSubjectId]);

    const noteColumns: NoteColumn[] = useMemo(() => {
        const studentColumn: NoteColumn = {
            key: 'lastName',
            label: 'Nom',
            render: (_, item) => (
                <div className="text-sm font-medium text-gray-900">{item.lastName}</div>
            )
        };
        
        const firstNameColumn: NoteColumn = {
            key: 'firstName',
            label: 'Prénom',
            render: (firstName) => <div className="text-sm font-medium text-gray-900">{firstName}</div>
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

        return [studentColumn, firstNameColumn, ...competenceColumns];
    }, [activeSubject]);

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            const searchLower = searchTerm.toLowerCase();
            const fullName = `${note.firstName || ''} ${note.lastName || ''}`;
            return fullName.toLowerCase().includes(searchLower);
        }).sort((a, b) => (a.lastName || '').localeCompare(b.lastName || ''));
    }, [notes, searchTerm]);

    const paginatedNotes = useMemo(() => filteredNotes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE), [filteredNotes, currentPage]);
    
    const notesTableData = useMemo(() => paginatedNotes.map(note => ({
        id: note.studentId,
        firstName: note.firstName,
        lastName: note.lastName,
        ...note.notes
    })), [paginatedNotes]);

  const handleExportExcel = () => {
        if (!activeSubject) return;

        const dataToExport = filteredNotes.map(note => {
            const studentData: {[key: string]: string | number} = {
                'Nom': note.lastName,
                'Prénom': note.firstName,
            };
            activeSubject.competences.forEach(c => {
                const noteValue = note.notes[c.id];
                if (typeof noteValue === 'number') {
                    studentData[c.label] = `${Math.round(noteValue)}%`;
                } else if (noteValue === 'absent') {
                    studentData[c.label] = 'Absent';
                } else if (noteValue === 'non-evalue') {
                    studentData[c.label] = '-';
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

        XLSX.writeFile(workbook, `Moyennes_${currentTrimestre}_${currentClasse}_${activeSubject.name}.xlsx`);
  };

  const handleExportPdf = () => {
        if (!activeSubject) return;

    try {
            const doc = new jsPDF({ orientation: 'landscape' }) as jsPDFWithAutoTable;
            const title = `Rapport ${currentTrimestre} - ${activeSubject.name}`;
        const startY = addPdfHeader(doc, currentClasse, title, user.name);
        const baseStyles = getPdfTableStyles(doc);
        
            const tableColumns = ["Nom", "Prénom", ...activeSubject.competences.map(c => c.label)];
            const tableRows = filteredNotes.map(note => [
                note.lastName,
                note.firstName,
                ...activeSubject.competences.map(c => {
                    const noteValue = note.notes[c.id];
                    if (typeof noteValue === 'number') return `${Math.round(noteValue)}%`;
                    if (noteValue === 'absent') return 'Absent';
                    return '-';
                })
        ]);

        autoTable(doc, {
            ...baseStyles,
            head: [tableColumns],
            body: tableRows,
                startY: startY,
                styles: { ...baseStyles.styles, fontSize: 8, cellPadding: 2 },
                columnStyles: {
                    0: { cellWidth: 30 }, // Nom
                    1: { cellWidth: 30 }, // Prénom
                }
            });

            doc.save(`Moyennes_${currentTrimestre}_${currentClasse}_${activeSubject.name}.pdf`);
    } catch (error) {
            console.error("Erreur PDF:", error);
        }
    };

    const handleExportAllExcel = () => {
        const workbook = XLSX.utils.book_new();
        domains.forEach(domain => {
            domain.subjects.forEach(subject => {
                const dataToExport = filteredNotes.map(note => {
                    const studentData: { [key: string]: string | number } = { 'Nom': note.lastName, 'Prénom': note.firstName };
                    subject.competences.forEach(c => {
                        const noteValue = note.notes[c.id];
                        if (typeof noteValue === 'number') {
                            studentData[c.label] = `${Math.round(noteValue)}%`;
                        } else if (noteValue === 'absent') {
                            studentData[c.label] = 'Absent';
                        } else if (noteValue === 'non-evalue') {
                            studentData[c.label] = '-';
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
                }
            });
        });
        if (workbook.SheetNames.length > 0) {
            XLSX.writeFile(workbook, `Moyennes_${currentTrimestre}_${currentClasse}_Toutes_Matieres.xlsx`);
        }
    };

    const handleExportAllPdf = () => {
        try {
            const doc = new jsPDF({ orientation: 'landscape' }) as jsPDFWithAutoTable;
            const title = `Rapport Complet ${currentTrimestre}`;
            let startY = addPdfHeader(doc, currentClasse, title, user.name);
            const baseStyles = getPdfTableStyles(doc);

            domains.forEach(domain => {
                startY += 5;
                if (startY > 250) { 
                    doc.addPage(); 
                    startY = addPdfHeader(doc, currentClasse, title, user.name); 
                }
                doc.setFontSize(14);
                doc.text(domain.name, 25, startY);
                startY += 7;

                domain.subjects.forEach(subject => {
                    if (subject.competences.length === 0) return;
                    autoTable(doc, { head: [[subject.name]], startY: startY, theme: "plain", styles: { fontStyle: 'bold' } });
                    startY = doc.lastAutoTable?.finalY ?? startY;
                    
                    const tableColumns = ["Nom", "Prénom", ...subject.competences.map(c => c.label)];
                    const tableRows = filteredNotes.map(note => [
                        note.lastName,
                        note.firstName,
                        ...subject.competences.map(c => {
                            const noteValue = note.notes[c.id];
                            if (typeof noteValue === 'number') return `${Math.round(noteValue)}%`;
                            if (noteValue === 'absent') return 'Absent';
                            return '-';
                        })
                    ]);
        autoTable(doc, {
            ...baseStyles,
            head: [tableColumns],
            body: tableRows,
                        startY: startY,
                        styles: { ...baseStyles.styles, fontSize: 8, cellPadding: 2 },
            columnStyles: {
                            0: { cellWidth: 30 }, // Nom
                            1: { cellWidth: 30 }, // Prénom
                        }
                    });
                    startY = (doc.lastAutoTable?.finalY ?? startY) + 10;
                    if (startY > 180) { // Ajustement pour le format paysage
                        doc.addPage(); 
                        startY = addPdfHeader(doc, currentClasse, title, user.name); 
                    }
                });
            });
            doc.save(`Moyennes_${currentTrimestre}_${currentClasse}_Complet.pdf`);
        } catch (error) { console.error("Erreur PDF:", error); }
    };

    // === FONCTIONS D'EXPORT PDF POUR LES ÉLÈVES ===
    
    const handleStudentExportPdf = () => {
        if (!activeSubject || !user || !notes[0]) {
            console.error("Matière active ou notes de l'élève non trouvées.");
            return;
        }

        const doc = new jsPDF() as jsPDFWithAutoTable;
        const title = `Bulletin Trimestriel - ${activeSubject.name}`;
        let startY = addPdfHeader(doc, currentClasse, title, user.name);

        const tableBody = activeSubject.competences.map(c => {
            const noteValue = notes[0].notes[c.id];
            let displayValue: string = '-';
            let statut = 'Non évalué';
            
            if (typeof noteValue === 'number') {
                displayValue = `${Math.round(noteValue)}%`;
                if (noteValue >= 75) statut = 'Excellent';
                else if (noteValue >= 50) statut = 'En progrès';
                else statut = 'À améliorer';
            } else if (noteValue === 'absent') {
                displayValue = 'Absent';
                statut = 'Absent';
            } else if (noteValue === 'non-evalue') {
                displayValue = '-';
                statut = 'En attente';
            }
            
            return [c.label, displayValue, statut];
        });

        autoTable(doc, {
            ...getPdfTableStyles(doc),
            head: [["Compétence", "Moyenne", "Statut"]],
            body: tableBody,
            startY: startY,
            margin: { left: 25, right: 25 }
        });

        // Ajouter des informations supplémentaires spécifiques à l'élève
        const finalY = doc.lastAutoTable?.finalY || startY + 50;
        const notesNumeriques = activeSubject.competences
            .map(c => notes[0].notes[c.id])
            .filter(note => typeof note === 'number') as number[];
        
        if (notesNumeriques.length > 0) {
            const moyenne = notesNumeriques.reduce((sum, note) => sum + note, 0) / notesNumeriques.length;
            const meilleureNote = Math.max(...notesNumeriques);
            const competencesReussies = notesNumeriques.filter(note => note >= 50).length;
            
            doc.setFontSize(12);
            doc.setFont("times", "bold");
            doc.text("Résumé des performances", 25, finalY + 20);
            
            doc.setFont("times", "normal");
            doc.text(`Élève : ${user.name}`, 25, finalY + 35);
            doc.text(`Trimestre : ${currentTrimestre}`, 25, finalY + 45);
            doc.text(`Moyenne de la matière : ${moyenne.toFixed(1)}%`, 25, finalY + 55);
            doc.text(`Meilleure note : ${meilleureNote}%`, 25, finalY + 65);
            doc.text(`Compétences évaluées : ${notesNumeriques.length}/${activeSubject.competences.length}`, 25, finalY + 75);
            doc.text(`Compétences réussies : ${competencesReussies}/${activeSubject.competences.length}`, 25, finalY + 85);
        }

        doc.save(`Bulletin_${currentTrimestre}_${user.name.replace(/\s+/g, '_')}_${activeSubject.name}.pdf`);
    };

    const handleStudentExportAllPdf = () => {
        if (!user || !notes[0]) {
            console.error("Notes de l'élève non trouvées.");
            return;
        }

        const doc = new jsPDF() as jsPDFWithAutoTable;
        let startY = addPdfHeader(doc, currentClasse, `Bulletin Trimestriel Complet`, user.name);

        domains.forEach(domain => {
            if (doc.internal.pageSize.height - startY < 50) {
                doc.addPage();
                startY = 25; // Reset to top margin
            }
            doc.setFontSize(14);
            doc.setFont("times", "bold");
            doc.text(domain.name, 25, startY);
            startY += 7;

            domain.subjects.forEach(subject => {
                if (subject.competences.length === 0) return;
                
                autoTable(doc, {
                    ...getPdfTableStyles(doc),
                    head: [[subject.name]],
                    startY: startY,
                    margin: { left: 25, right: 25 },
                    theme: "plain",
                    styles: { fontStyle: 'bold', fontSize: 11, halign: 'left' }
                });

                startY = doc.lastAutoTable?.finalY || startY;
                
                const tableColumns = ["Compétence", "Moyenne", "Statut"];
                const tableRows = subject.competences.map(competence => {
                    const note = notes[0].notes[competence.id];
                    let noteDisplay = '-';
                    let statut = 'Non évalué';
                    
                    if (typeof note === 'number') {
                        noteDisplay = `${Math.round(note)}%`;
                        if (note >= 75) statut = 'Excellent';
                        else if (note >= 50) statut = 'En progrès';
                        else statut = 'À améliorer';
                    } else if (note === 'absent') {
                        noteDisplay = 'Absent';
                        statut = 'Absent';
                    } else if (note === 'non-evalue') {
                        noteDisplay = '-';
                        statut = 'En attente';
                    }
                    
                    return [competence.label, noteDisplay, statut];
                });

                autoTable(doc, {
                    ...getPdfTableStyles(doc),
                    head: [tableColumns],
                    body: tableRows,
                    startY: startY,
                    margin: { left: 25, right: 25 }
                });
                
                startY = (doc.lastAutoTable?.finalY || startY) + 10;
                
                if (startY > 250) {
                    doc.addPage();
                    startY = 25; // Reset to top margin
                }
            });
            
            startY += 5;
        });

        // Page de résumé final
        if (Object.keys(notes[0].notes).length > 0) {
            doc.addPage();
            const summaryStartY = addPdfHeader(doc, currentClasse, `Résumé Trimestriel - ${user.name}`, user.name);
            
            const totalNotesNumeriques = Object.values(notes[0].notes)
                .filter(note => typeof note === 'number') as number[];
            
            if (totalNotesNumeriques.length > 0) {
                const moyenneGenerale = totalNotesNumeriques.reduce((sum, note) => sum + note, 0) / totalNotesNumeriques.length;
                const meilleureNote = Math.max(...totalNotesNumeriques);
                const plusBasseNote = Math.min(...totalNotesNumeriques);
                const competencesReussies = totalNotesNumeriques.filter(note => note >= 50).length;
                
                doc.setFontSize(12);
                doc.setFont("times", "bold");
                doc.text("Statistiques Générales", 25, summaryStartY + 20);
                
                doc.setFont("times", "normal");
                doc.text(`Moyenne générale : ${moyenneGenerale.toFixed(1)}%`, 25, summaryStartY + 35);
                doc.text(`Meilleure note : ${meilleureNote}%`, 25, summaryStartY + 45);
                doc.text(`Note la plus basse : ${plusBasseNote}%`, 25, summaryStartY + 55);
                doc.text(`Total des compétences évaluées : ${totalNotesNumeriques.length}`, 25, summaryStartY + 65);
                doc.text(`Compétences réussies : ${competencesReussies}`, 25, summaryStartY + 75);
            }
        }

        doc.save(`Bulletin_Complet_${currentTrimestre}_${user.name.replace(/\s+/g, '_')}.pdf`);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm mt-6 border border-gray-200">
            <div className="flex border-b border-gray-200 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {domains.map(domain => (
                    <button
                        key={domain.id}
                        onClick={() => {
                            setActiveDomainId(domain.id);
                            if (domain.subjects.length > 0) {
                                setActiveSubjectId(domain.subjects[0].id);
                            }
                            setCurrentPage(1);
                        }}
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
                    {...(role === 'enseignant' ? {
                        searchTerm: searchTerm,
                        onSearchChange: setSearchTerm,
                        searchPlaceholder: "Rechercher par nom...",
                        showPagination: true,
                        currentPage: currentPage,
                        totalItems: filteredNotes.length,
                        itemsPerPage: ITEMS_PER_PAGE,
                        onPageChange: setCurrentPage
                    } : {
                        searchTerm: '',
                        onSearchChange: () => {},
                        showPagination: false
                    })}
                    centerSlot={
                        <div className="flex flex-wrap gap-2 items-center">
                            {subjectsForActiveDomain.map(subject => (
                                <button key={subject.id} onClick={() => {
                                    setActiveSubjectId(subject.id);
                                    setCurrentPage(1);
                                }}
                                    className={`px-4 py-1.5 text-sm rounded-full font-medium focus:outline-none transition-colors ${activeSubjectId === subject.id ? 'bg-sky-700 text-white shadow-md' : 'bg-gray-100 text-gray-700 border hover:bg-gray-200'}`}>
                                    {subject.name}
                                </button>
                            ))}
                        </div>
                    }
              rightActions={
                    role === 'enseignant' ? (
                <div className="flex items-center space-x-2">
                    <Menu as="div" className="relative">
                        <Menu.Button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <MoreHorizontal size={20} />
                        </Menu.Button>
                        <Transition
                            as={React.Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={handleExportExcel}
                                                className={`${
                                                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-200`}
                                            >
                                                <FileSpreadsheet size={16} className="mr-2" />
                                                Exporter en Excel
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={handleExportPdf}
                                                className={`${
                                                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-200`}
                                            >
                                                <FileText size={16} className="mr-2" />
                                                Exporter en PDF
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={handleExportAllExcel}
                                                className={`${
                                                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-200`}
                                            >
                                                <Library size={16} className="mr-2" />
                                                Tout Exporter (Excel)
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={handleExportAllPdf}
                                                className={`${
                                                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-200`}
                                            >
                                                <Library size={16} className="mr-2" />
                                                Tout Exporter (PDF)
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
                    ) : (role === 'eleve' && notes.length > 0) ? (
                        <div className="flex items-center justify-end w-full">
                            <Menu as="div" className="relative">
                                <Menu.Button className="p-2 rounded-full bg-white border border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
                                    <ArrowDownToLine className="h-5 w-5" />
                                </Menu.Button>
                                <Menu.Items className="absolute right-0 mt-2 w-72 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                    <div className="px-1 py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={handleStudentExportPdf}
                                                    className={`${
                                                        active ? 'bg-gray-100' : ''
                                                    } group flex rounded-md items-center w-full px-4 py-2 text-sm text-gray-700 font-medium`}
                                                >
                                                    <FileText className="w-5 h-5 mr-3 text-gray-500" />
                                                    Mon Bulletin (Matière actuelle)
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </div>
                                    <div className="px-1 py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={handleStudentExportAllPdf}
                                                    className={`${
                                                        active ? 'bg-gray-100' : ''
                                                    } group flex rounded-md items-center w-full px-4 py-2 text-sm text-gray-700 font-medium`}
                                                >
                                                    <FileText className="w-5 h-5 mr-3 text-gray-500" />
                                                    Mon Bulletin Complet
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Menu>
                        </div>
                    ) : null
                }
            />
                
                {/* Affichage conditionnel : cartes pour les élèves, tableau pour les enseignants */}
                {role === 'eleve' && activeSubject && user ? (
                    <div className="border border-gray-200 rounded-lg p-4">
                        <StudentTrimestrielleCards
                            competences={activeSubject.competences}
                            notes={activeSubject.competences.reduce((acc, c) => {
                                const note = paginatedNotes.find(n => n.studentId === user.name || n.studentId === user.classId)?.notes[c.id];
                                acc[c.id] = note !== undefined ? note : 'non-evalue';
                                return acc;
                            }, {} as { [key: string]: number | 'absent' | 'non-evalue' })}
                            subjectName={activeSubject.name}
                            trimestre={`T${extractTrimesterNumber(currentTrimestre)}`}
                        />
                    </div>
                ) : role === 'enseignant' ? (
      <NotesTable 
                    noteColumns={noteColumns}
        data={notesTableData} 
                        onUpdateNote={handleNoteUpdate}
                        isEditable={true} // Les enseignants peuvent saisir les moyennes trimestrielles
      />
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Aucune donnée disponible pour cette sélection.</p>
                    </div>
                )}
      </div>
    </div>
  );
};

export default TrimestrielleView; 
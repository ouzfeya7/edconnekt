import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import JSZip from 'jszip';
import NotesTable from './NotesTable';
import type { NoteColumn } from './NotesTable';
import Toolbar from '../ui/Toolbar';
import { useFilters } from '../../contexts/FilterContext';
import { useStudents } from '../../contexts/StudentContext';
import { getSubjectsForClass, getNotesForClass, getGradingStatus } from '../../lib/notes-data';
import type { StudentNote, Domain } from '../../lib/notes-data';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { MoreHorizontal, FileSpreadsheet, FileText, Library, ArrowDownToLine } from 'lucide-react';
import { CellHookData, UserOptions } from 'jspdf-autotable';
import schoolLogo from '../../assets/logo-yka-1.png';

interface jsPDFWithAutoTable extends jsPDF {
    lastAutoTable?: {
        finalY?: number;
    };
}

const ITEMS_PER_PAGE = 10;

interface IntegrationViewProps {
  role: 'enseignant' | 'eleve';
}

const schoolInfo = {
    name: "Yenne Kids' Academy",
    address: "Kel, Rte de Toubab Dialaw, Yenne BP 20000, Dakar, Senegal",
    phone1: "+221 77 701 52 52",
    phone2: "+221 33 871 27 82",
    email: "hello@yennekidsacademy.com",
    website: "www.yennekidsacademy.com",
    academicYear: "2023-2024"
};

const addPdfHeader = (doc: jsPDF, classe: string, title: string) => {
    // Logo
    doc.addImage(schoolLogo, 'PNG', 25, 15, 30, 30);

    // School Info
    doc.setFontSize(14);
    doc.setFont("helvetica", 'bold');
    doc.text(schoolInfo.name, 65, 22);
    
    doc.setFontSize(8);
    doc.setFont("helvetica", 'normal');
    doc.text(schoolInfo.address, 65, 28);
    doc.text(`Tél: ${schoolInfo.phone1} / ${schoolInfo.phone2}`, 65, 32);
    doc.text(`Email: ${schoolInfo.email} | Site: ${schoolInfo.website}`, 65, 36);
    doc.text(`Année Scolaire: ${schoolInfo.academicYear}`, 65, 40);

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", 'bold');
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 55, { align: 'center' });
    
    // Class Subtitle
    doc.setFontSize(12);
    doc.setFont("helvetica", 'normal');
    doc.text(`Classe: ${classe}`, doc.internal.pageSize.getWidth() / 2, 62, { align: 'center' });

    // Header Line
    doc.setDrawColor(0);
    doc.line(25, 70, doc.internal.pageSize.getWidth() - 25, 70);
    
    return 80; // Return the start Y position for the content
};

const getPdfTableStyles = (doc: jsPDF): Partial<UserOptions> => ({
    theme: 'grid',
    headStyles: {
        fillColor: [230, 230, 230],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
    },
    styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
    },
    didDrawCell: (data: CellHookData) => {
        if (data.section === 'body' && data.column.index >= 2) { // Competence columns
            const cellText = data.cell.text[0];
            if (cellText && cellText.endsWith('%')) {
                const grade = parseInt(cellText, 10);
                if (!isNaN(grade)) {
                    let textColor: [number, number, number] = [0, 0, 0]; // Default black
                    if (grade >= 75) textColor = [5, 150, 105]; // Green for success
                    else if (grade >= 50) textColor = [249, 115, 22]; // Orange for warning
                    else textColor = [220, 38, 38]; // Red for failure
                    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
                    doc.setFont(doc.getFont().fontName, 'bold');
                }
            }
        }
    },
    willDrawCell: () => {
        doc.setTextColor(0, 0, 0);
        doc.setFont(doc.getFont().fontName, 'normal');
    }
});

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
        const classNotes = getNotesForClass(currentClasse, students.map(s => ({ id: s.id, firstName: s.firstName, lastName: s.lastName, avatar: s.avatar })));
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
                'Nom': note.lastName,
                'Prénom': note.firstName,
            };
            activeSubject.competences.forEach(c => {
                const noteValue = note.notes[c.id];
                if (typeof noteValue === 'number') {
                    studentData[c.label] = `${noteValue}%`;
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

        XLSX.writeFile(workbook, `Notes_Integration_${currentClasse}_${currentMonth}_${activeSubject.name}.xlsx`);
    };

    const handleExportAll = () => {
        const workbook = XLSX.utils.book_new();

        domains.forEach(domain => {
            domain.subjects.forEach(subject => {
                const dataToExport = filteredNotes.map(note => {
                    const studentData: { [key: string]: string | number } = {
                        'Nom': note.lastName,
                        'Prénom': note.firstName,
                    };
                    subject.competences.forEach(c => {
                        const noteValue = note.notes[c.id];
                        if (typeof noteValue === 'number') {
                            studentData[c.label] = `${noteValue}%`;
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
            const doc = new jsPDF() as jsPDFWithAutoTable;
            const title = `Rapport d'évaluation - ${activeSubject.name} (${currentMonth})`;
            const startY = addPdfHeader(doc, currentClasse, title);
            
            const tableColumns = ["Nom", "Prénom", ...activeSubject.competences.map(c => c.label)];
            const tableRows = filteredNotes.map(note => [
                note.lastName,
                note.firstName,
                ...activeSubject.competences.map(c => {
                    const noteValue = note.notes[c.id];
                    if (typeof noteValue === 'number') return `${noteValue}%`;
                    if (noteValue === 'absent') return 'Absent';
                    if (noteValue === 'non-evalue') return '-';
                    return '-';
                })
            ]);

            autoTable(doc, {
                ...getPdfTableStyles(doc),
                head: [tableColumns],
                body: tableRows,
                startY: startY,
                margin: { left: 25, right: 25 }
            });

            doc.save(`Notes_Integration_${currentClasse}_${currentMonth}_${activeSubject.name}.pdf`);
        } catch (error) {
            console.error("Erreur lors de la génération du PDF :", error);
            alert("Une erreur est survenue lors de la création du PDF. Veuillez consulter la console pour plus de détails.");
        }
    };

    const handleExportAllPdf = () => {
        try {
            const doc = new jsPDF() as jsPDFWithAutoTable;
            
            const title = `Rapport d'évaluation d'Intégration Complet (${currentMonth})`;
            let startY = addPdfHeader(doc, currentClasse, title);

            domains.forEach(domain => {
                startY += 5;
                doc.setFontSize(14);
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

                    startY = (doc as jsPDFWithAutoTable).lastAutoTable?.finalY ?? startY;

                    const tableColumns = ["Nom", "Prénom", ...subject.competences.map(c => c.label)];
                    const tableRows = filteredNotes.map(note => [
                        note.lastName,
                        note.firstName,
                        ...subject.competences.map(c => {
                            const noteValue = note.notes[c.id];
                            if (typeof noteValue === 'number') return `${noteValue}%`;
                            if (noteValue === 'absent') return 'Absent';
                            if (noteValue === 'non-evalue') return '-';
                            return '-';
                        })
                    ]);

                    autoTable(doc, {
                        ...getPdfTableStyles(doc),
                        head: [tableColumns],
                        body: tableRows,
                        startY: startY,
                        margin: { left: 25, right: 25 },
                    });
                    
                    startY = ((doc as jsPDFWithAutoTable).lastAutoTable?.finalY ?? startY) + 10;
                    
                    if (startY > 250) { 
                        doc.addPage();
                        startY = addPdfHeader(doc, currentClasse, title);
                    }
                });
            });

            doc.save(`Rapport_Integration_Complet_${currentClasse}_${currentMonth}.pdf`);
        } catch (error) {
            console.error("Erreur lors de la génération du PDF complet :", error);
            alert("Une erreur est survenue lors de la création du PDF. Veuillez consulter la console pour plus de détails.");
        }
    };

    const handleExportByDomainPdf = async () => {
        const zip = new JSZip();
        const domains = getDomains();

        for (const domain of domains) {
            const doc = new jsPDF() as jsPDFWithAutoTable;
            const title = `Rapport - ${domain.name} (${currentMonth})`;
            let startY = addPdfHeader(doc, currentClasse, title);

            for (const subject of domain.subjects) {
                if (subject.competences.length === 0) continue;

                autoTable(doc, {
                    ...getPdfTableStyles(doc),
                    head: [[subject.name]],
                    startY: startY,
                    margin: { left: 25, right: 25 },
                    theme: "plain",
                    styles: { fontStyle: 'bold', fontSize: 11, halign: 'left' }
                });

                startY = (doc as jsPDFWithAutoTable).lastAutoTable?.finalY ?? startY;

                const tableColumns = ["Nom", "Prénom", ...subject.competences.map(c => c.label)];
                const tableRows = filteredNotes.map(note => [
                    note.lastName,
                    note.firstName,
                    ...subject.competences.map(c => {
                        const noteValue = note.notes[c.id];
                        if (typeof noteValue === 'number') return `${noteValue}%`;
                        if (noteValue === 'absent') return 'Absent';
                        if (noteValue === 'non-evalue') return '-';
                        return '-';
                    })
                ]);
                autoTable(doc, {
                    ...getPdfTableStyles(doc),
                    head: [tableColumns],
                    body: tableRows,
                    startY: startY,
                    margin: { left: 25, right: 25 },
                });
                
                startY = ((doc as jsPDFWithAutoTable).lastAutoTable?.finalY ?? startY) + 10;
                
                if (startY > 250) { 
                    doc.addPage();
                    startY = addPdfHeader(doc, currentClasse, title);
                }
            }
            const pdfBlob = doc.output('blob');
            const sanitizedDomainName = domain.name.replace(/[/\\?%*:|"<>]/g, '-');
            zip.file(`Rapport_${sanitizedDomainName}_${currentClasse}.pdf`, pdfBlob);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = `Rapports_Integration_Par_Domaine_${currentClasse}_${currentMonth}.zip`;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const handleExportByDomainXlsx = async () => {
        const zip = new JSZip();

        for (const domain of domains) {
            const workbook = XLSX.utils.book_new();
            domain.subjects.forEach(subject => {
                const dataToExport = filteredNotes.map(note => {
                    const studentData: { [key: string]: string | number } = {
                        'Nom': note.lastName,
                        'Prénom': note.firstName,
                    };
                    subject.competences.forEach(c => {
                        const noteValue = note.notes[c.id];
                        if (typeof noteValue === 'number') {
                            studentData[c.label] = `${noteValue}%`;
                        } else {
                            studentData[c.label] = noteValue === 'absent' ? 'Absent' : '-';
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

            if (workbook.SheetNames.length > 0) {
                const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const sanitizedDomainName = domain.name.replace(/[/\\?%*:|"<>]/g, '-');
                zip.file(`${sanitizedDomainName}.xlsx`, wbout);
            }
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = `Rapport_Integration_Par_Domaine_${currentClasse}_${currentMonth}.zip`;
        link.click();
    };

    const activeDomain = useMemo(() => domains.find(d => d.id === activeDomainId), [domains, activeDomainId]);
    const subjectsForActiveDomain = useMemo(() => activeDomain?.subjects || [], [activeDomain]);
    const activeSubject = useMemo(() => subjectsForActiveDomain.find(s => s.id === activeSubjectId), [subjectsForActiveDomain, activeSubjectId]);

    const noteColumns: NoteColumn[] = useMemo(() => {
        const studentColumn: NoteColumn = {
            key: 'lastName',
            label: 'Nom',
            render: (_, item) => (
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                        <img
                            className="h-8 w-8 rounded-full object-cover bg-gray-200"
                            src={item.studentAvatar || `https://via.placeholder.com/40x40/CBD5E0/FFFFFF?text=${item.lastName?.charAt(0) || 'P'}`}
                            alt={`${item.firstName} ${item.lastName}`}
                        />
                    </div>
                    <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{item.lastName}</div>
                    </div>
                </div>
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
                const status = getGradingStatus(value);
                return <span className={`font-semibold ${status.color}`}>{status.text}{typeof value === 'number' ? '%' : ''}</span>;
            }
        })) || [];

        return [studentColumn, firstNameColumn, ...competenceColumns];
    }, [activeSubject]);

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            const searchLower = searchTerm.toLowerCase();
            const fullName = `${note.firstName} ${note.lastName}`;
            return fullName.toLowerCase().includes(searchLower);
        }).sort((a, b) => a.lastName.localeCompare(b.lastName));
    }, [notes, searchTerm]);

    const paginatedNotes = useMemo(() => filteredNotes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE), [filteredNotes, currentPage]);
    const notesTableData = useMemo(() => paginatedNotes.map(note => ({
        id: note.studentId,
        firstName: note.firstName,
        lastName: note.lastName,
        studentAvatar: note.studentAvatar,
        ...note.notes
    })), [paginatedNotes]);

    const getDomains = () => {
        return domains;
    }

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
                                    <div className="px-1 py-1">
                                        <MenuItem>
                                            {({ active }) => (
                                                <button onClick={handleExportByDomainXlsx} className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}>
                                                    <FileSpreadsheet className="w-5 h-5 mr-2" /> Exporter Domaines (XLSX)
                                                </button>
                                            )}
                                        </MenuItem>
                                        <MenuItem>
                                            {({ active }) => (
                                                <button onClick={handleExportByDomainPdf} className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}>
                                                    <FileText className="w-5 h-5 mr-2" /> Exporter Domaines (PDF)
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
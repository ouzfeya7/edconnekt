import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable, { Table } from 'jspdf-autotable';
import JSZip from 'jszip';
import { Menu } from '@headlessui/react';
import NotesTable, { NoteColumn } from './NotesTable';
import StudentCompetenceCards from './StudentCompetenceCards';
import Toolbar from '../ui/Toolbar';
import { ArrowDownToLine, FileSpreadsheet, FileText, Library, MoreHorizontal } from 'lucide-react';
import { useFilters } from '../../contexts/FilterContext';
import { useStudents } from '../../contexts/StudentContext';
import { getSubjectsForClass, getNotesForClass, StudentNote, Domain, getGradingStatus } from '../../lib/notes-data';
import { getCurrentStudentNotes } from '../../lib/mock-student-notes';
import { mockParentData } from '../../lib/mock-parent-data';
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

interface ContinueViewProps {
  role: 'enseignant' | 'eleve' | 'parent';
  selectedChildId?: string;
}

const ContinueView: React.FC<ContinueViewProps> = ({ role, selectedChildId }) => {
    const { currentClasse, formattedCurrentDate } = useFilters();
    const { students } = useStudents();
    const { user } = useUser();
    
    const [domains, setDomains] = useState<Domain[]>([]);
    const [notes, setNotes] = useState<StudentNote[]>([]);

    const [activeDomainId, setActiveDomainId] = useState<string>('');
    const [activeSubjectId, setActiveSubjectId] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const classDomains = getSubjectsForClass(currentClasse);
        setDomains(classDomains);

        let notesToUse: StudentNote[] = [];
        
        if (role === 'eleve' && user) {
            // Utiliser les données fictives pour l'élève connecté
            notesToUse = getCurrentStudentNotes(currentClasse);
            setSearchTerm('');
        } else if (role === 'parent') {
            // Utiliser les données des enfants du parent depuis mock-parent-data
            notesToUse = mockParentData.children;
            setSearchTerm('');
        } else {
            // Pour les enseignants
            notesToUse = getNotesForClass(currentClasse, students);
        }
        
        setNotes(notesToUse);

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
    }, [currentClasse, students, role, user]);

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

    const paginatedNotes = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredNotes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredNotes, currentPage]);
    
    const notesTableData = useMemo(() => paginatedNotes.map(note => ({
        id: note.studentId,
        firstName: note.firstName,
        lastName: note.lastName,
        ...note.notes
    })), [paginatedNotes]);

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
        
        // Auto-size columns
        const colWidths = Object.keys(dataToExport[0] || {}).map(key => ({
            wch: Math.max(key.length, ...dataToExport.map(row => (row[key] || '').toString().length)) + 2
        }));
        worksheet['!cols'] = colWidths;

        XLSX.writeFile(workbook, `Notes_Continue_${currentClasse}_${formattedCurrentDate}_${activeSubject.name}.xlsx`);
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
            XLSX.writeFile(workbook, `Notes_Continue_Toutes_Matieres_${currentClasse}_${formattedCurrentDate}.xlsx`);
        } else {
            // Maybe show a notification to the user
            console.warn("Aucune donnée à exporter.");
        }
    };

    const handleExportPdf = () => {
        if (!activeSubject) return;

        try {
            const doc = new jsPDF({ orientation: 'landscape' }) as jsPDFWithAutoTable;
            const title = `Rapport de Notes Continues - ${activeSubject.name}`;
            const startY = addPdfHeader(doc, currentClasse, title, user.name);
            const baseStyles = getPdfTableStyles(doc);

            const tableColumns = ["Nom", "Prénom", ...activeSubject.competences.map(c => c.label)];
            const tableRows = filteredNotes.map(note => [
                note.lastName,
                note.firstName,
                ...activeSubject.competences.map(c => {
                    const noteValue = note.notes[c.id];
                    if (typeof noteValue === 'number') return `${noteValue}%`;
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

            doc.save(`Notes_Continue_${currentClasse}_${formattedCurrentDate}_${activeSubject.name}.pdf`);
        } catch (error) {
            console.error("Erreur PDF:", error);
        }
    };

    const handleExportAllPdf = () => {
        try {
            const doc = new jsPDF({ orientation: 'landscape' }) as jsPDFWithAutoTable;
            const title = `Rapport Complet des Notes Continues`;
            let startY = addPdfHeader(doc, currentClasse, title, user.name);
            const baseStyles = getPdfTableStyles(doc);

            domains.forEach(domain => {
                startY += 5;
                if (startY > 180) { doc.addPage(); startY = addPdfHeader(doc, currentClasse, title, user.name); }
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
                            if (typeof noteValue === 'number') return `${noteValue}%`;
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
                    if (startY > 180) { 
                        doc.addPage(); 
                        startY = addPdfHeader(doc, currentClasse, title, user.name); 
                    }
                });
            });

            doc.save(`Notes_Continue_Toutes_Matieres_${currentClasse}_${formattedCurrentDate}.pdf`);
        } catch (error) {
            console.error("Erreur PDF:", error);
        }
    };

    const handleExportByDomainXlsx = async () => {
        const zip = new JSZip();

        for (const domain of domains) {
            const workbook = XLSX.utils.book_new();
            let hasData = false;

            for (const subject of domain.subjects) {
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
                    hasData = true;
                    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
                    const sanitizedSheetName = subject.name.replace(/[:\\/?*[\]]/g, '').substring(0, 31);
                    XLSX.utils.book_append_sheet(workbook, worksheet, sanitizedSheetName);
                    
                    const colWidths = Object.keys(dataToExport[0] || {}).map(key => ({
                        wch: Math.max(key.length, ...dataToExport.map(row => (row[key] || '').toString().length)) + 2
                    }));
                    worksheet['!cols'] = colWidths;
                }
            }
            
            if (hasData) {
                const xlsxData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const xlsxBlob = new Blob([xlsxData], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                const sanitizedDomainName = domain.name.replace(/[/\\?%*:|"<>]/g, '-');
                zip.file(`Rapport_${sanitizedDomainName}_${currentClasse}.xlsx`, xlsxBlob);
            }
        }
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = `Rapports_Excel_Par_Domaine_${currentClasse}_${formattedCurrentDate}.zip`;
        link.click();
        URL.revokeObjectURL(link.href);
    };
    
    const handleExportByDomainPdf = async () => {
        const zip = new JSZip();

        for (const domain of domains) {
            const doc = new jsPDF() as jsPDFWithAutoTable;
            const title = `Rapport - ${domain.name} (${formattedCurrentDate})`;
            let startY = addPdfHeader(doc, currentClasse, title, user.name);

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

                 startY = doc.lastAutoTable?.finalY || startY;

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
                
                startY = (doc.lastAutoTable?.finalY || startY) + 10;
                
                if (startY > 250) { 
                    doc.addPage();
                    startY = addPdfHeader(doc, currentClasse, title, user.name);
                }
            }
            const pdfBlob = doc.output('blob');
            const sanitizedDomainName = domain.name.replace(/[/\\?%*:|"<>]/g, '-');
            zip.file(`Rapport_${sanitizedDomainName}_${currentClasse}.pdf`, pdfBlob);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = `Rapports_Continue_Par_Domaine_${currentClasse}_${formattedCurrentDate}.zip`;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    // === FONCTIONS D'EXPORT PDF POUR LES ÉLÈVES ===
    
    const handleStudentExportPdf = () => {
        if (!activeSubject || !user) return;
        
        // Pour les parents, utiliser les données de l'enfant sélectionné
        const studentData = role === 'parent' && selectedChildId 
            ? notes.find(n => n.studentId === selectedChildId)
            : notes[0];
            
        if (!studentData) return;
        
        const doc = new jsPDF() as jsPDFWithAutoTable;
        const title = `Bulletin de Notes - ${activeSubject.name}`;
        const studentName = role === 'parent' ? `${studentData.firstName} ${studentData.lastName}` : user.name;
        const startY = addPdfHeader(doc, currentClasse, title, studentName);
        
        const tableBody = activeSubject.competences.map(c => {
            const noteValue = studentData.notes[c.id];
            let displayValue: string = '-';
            let statut = 'Non évalué';
            
            if (typeof noteValue === 'number') {
                displayValue = `${noteValue}%`;
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
            head: [["Compétence", "Note", "Statut"]],
            body: tableBody,
            startY: startY,
            margin: { left: 25, right: 25 }
        });

        // Ajouter des informations supplémentaires spécifiques à l'élève
        const finalY = doc.lastAutoTable?.finalY || startY + 50;
        const notesNumeriques = activeSubject.competences
            .map(c => studentData.notes[c.id])
            .filter(note => typeof note === 'number') as number[];
        
        if (notesNumeriques.length > 0) {
            const moyenne = notesNumeriques.reduce((sum, note) => sum + note, 0) / notesNumeriques.length;
            const meilleureNote = Math.max(...notesNumeriques);
            const competencesReussies = notesNumeriques.filter(note => note >= 50).length;
            
            // Utiliser la même police que dans l'en-tête
            doc.setFontSize(12);
            doc.setFont("times", "bold");
            doc.text("Résumé des performances", 25, finalY + 20);
            
            doc.setFont("times", "normal");
            doc.text(`Élève : ${studentName}`, 25, finalY + 35);
            doc.text(`Moyenne de la matière : ${moyenne.toFixed(1)}%`, 25, finalY + 45);
            doc.text(`Meilleure note : ${meilleureNote}%`, 25, finalY + 55);
            doc.text(`Compétences évaluées : ${notesNumeriques.length}/${activeSubject.competences.length}`, 25, finalY + 65);
            doc.text(`Compétences réussies : ${competencesReussies}/${activeSubject.competences.length}`, 25, finalY + 75);
        }

        doc.save(`Bulletin_Continue_${studentName.replace(/\s+/g, '_')}_${activeSubject.name}.pdf`);
    };

    const handleStudentExportAllPdf = () => {
        if (!user) return;
        
        // Pour les parents, utiliser les données de l'enfant sélectionné
        const studentData = role === 'parent' && selectedChildId 
            ? notes.find(n => n.studentId === selectedChildId)
            : notes[0];
            
        if (!studentData) return;
        
        const doc = new jsPDF() as jsPDFWithAutoTable;
        const studentName = role === 'parent' ? `${studentData.firstName} ${studentData.lastName}` : user.name;
        let startY = addPdfHeader(doc, currentClasse, `Bulletin Complet`, studentName);
        
        domains.forEach(domain => {
            if (doc.internal.pageSize.height - startY < 50) {
                doc.addPage();
                startY = 25; // Reset to top margin instead of adding header
            }
            startY += 5;
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
                
                const tableColumns = ["Compétence", "Note", "Statut"];
                const tableRows = subject.competences.map(c => {
                    const note = studentData.notes[c.id];
                    let displayValue = '-';
                    let statut = 'Non évalué';
                    
                    if (typeof note === 'number') {
                        displayValue = `${note}%`;
                        if (note >= 75) statut = 'Excellent';
                        else if (note >= 50) statut = 'En progrès';
                        else statut = 'À améliorer';
                    } else if (note === 'absent') {
                        displayValue = 'Absent';
                        statut = 'Absent';
                    } else if (note === 'non-evalue') {
                        displayValue = '-';
                        statut = 'En attente';
                    }
                    
                    return [c.label, displayValue, statut];
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
                    startY = 25; // Reset to top margin instead of adding header
                }
            });
            
            startY += 5;
        });

        // Page de résumé final
        if (Object.keys(studentData.notes).length > 0) {
            doc.addPage();
            const summaryStartY = addPdfHeader(doc, currentClasse, `Résumé Général - ${studentName}`, studentName);
            
            const totalNotesNumeriques = Object.values(studentData.notes)
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

        doc.save(`Bulletin_Continue_Complet_${studentName.replace(/\s+/g, '_')}.pdf`);
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
                        <Menu as="div" className="relative">
                            <Menu.Button className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <MoreHorizontal className="w-5 h-5" />
                            </Menu.Button>
                            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
                                <div className="px-1 py-1">
                                    <Menu.Item>
                                        {({ active }: { active: boolean }) => (
                                            <button onClick={handleExport} className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}>
                                                <FileSpreadsheet className="w-5 h-5 mr-2" /> Exporter Excel (Matière)
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }: { active: boolean }) => (
                                            <button onClick={handleExportAll} className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}>
                                                <Library className="w-5 h-5 mr-2" /> Exporter Excel (Tout)
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }: { active: boolean }) => (
                                            <button onClick={handleExportPdf} className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}>
                                                <FileText className="w-5 h-5 mr-2" /> Exporter PDF (Matière)
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }: { active: boolean }) => (
                                            <button onClick={handleExportAllPdf} className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}>
                                                <ArrowDownToLine className="w-5 h-5 mr-2" /> Exporter PDF (Tout)
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }: { active: boolean }) => (
                                            <button onClick={handleExportByDomainXlsx} className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}>
                                                <FileSpreadsheet className="w-5 h-5 mr-2" /> Exporter Domaines (XLSX)
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }: { active: boolean }) => (
                                            <button onClick={handleExportByDomainPdf} className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}>
                                                <FileText className="w-5 h-5 mr-2" /> Exporter Domaines (PDF)
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Menu>
                    ) : (role === 'eleve' || (role === 'parent' && selectedChildId)) ? (
                        <Menu as="div" className="relative">
                            <Menu.Button className="inline-flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
                                <ArrowDownToLine className="w-5 h-5" />
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
                                                {role === 'parent' ? 'Bulletin de l\'enfant (Matière actuelle)' : 'Mon Bulletin (Matière actuelle)'}
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
                                                {role === 'parent' ? 'Bulletin Complet de l\'enfant' : 'Mon Bulletin Complet'}
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Menu>
                    ) : null
                }
            />
                
            {/* Affichage conditionnel : cartes pour les élèves et parents avec enfant sélectionné, tableau pour les autres */}
            {(role === 'eleve' || (role === 'parent' && selectedChildId)) && activeSubject && notes.length > 0 ? (
                <div className="border border-gray-200 rounded-lg p-4">
                    <StudentCompetenceCards
                        competences={activeSubject.competences}
                        notes={role === 'eleve' 
                            ? notes[0]?.notes || {} 
                            : notes.find(n => n.studentId === selectedChildId)?.notes || {}
                        }
                        subjectName={activeSubject.name}
                    />
                </div>
            ) : (role === 'enseignant' || role === 'parent') && activeSubject && notes.length > 0 ? (
                <NotesTable 
                    noteColumns={noteColumns}
                    data={notesTableData} 
                    onUpdateNote={handleNoteUpdate}
                    isEditable={role === 'enseignant'}
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

export default ContinueView; 
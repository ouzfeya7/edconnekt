import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable, { Table } from 'jspdf-autotable';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
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

const addPdfHeader = (doc: jsPDF, classe: string, title: string) => {
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

    // Title
    doc.setFontSize(16);
    doc.setFont("times", 'bold');
    // @ts-expect-error: La surcharge de type de jspdf pour les options d'alignement est incorrecte.
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 55, { align: 'center' });
    
    // Class Subtitle
    doc.setFontSize(12);
    doc.setFont("times", 'normal');
    // @ts-expect-error: La surcharge de type de jspdf pour les options d'alignement est incorrecte.
    doc.text(`Classe: ${classe.toUpperCase()}`, doc.internal.pageSize.getWidth() / 2, 62, { align: 'center' });

    // Header Line
    doc.setDrawColor(0);
    doc.line(25, 70, doc.internal.pageSize.getWidth() - 25, 70);
    
    return 80;
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

  useEffect(() => {
        const classDomains = getSubjectsForClass(currentClasse);
        setDomains(classDomains);

        const allNotes = getNotesForClass(currentClasse, students);
        const averagedNotes = calculateTrimesterAverages(allNotes, currentTrimestre);
        
        if (role === 'eleve' && user) {
            const mockNotes = getCurrentStudentNotes(currentClasse);
            const averagedMockNotes = calculateTrimesterAverages(mockNotes, currentTrimestre);
            setNotes(averagedMockNotes);
        setSearchTerm('');
      } else {
            setNotes(averagedNotes);
        }

        if (classDomains.length > 0) {
            const firstDomain = classDomains[0];
            setActiveDomainId(firstDomain.id);
            if (firstDomain.subjects.length > 0) {
                setActiveSubjectId(firstDomain.subjects[0].id);
            }
        }
        setCurrentPage(1);
    }, [currentClasse, students, role, user, currentTrimestre]);
    
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
        const studentColumn: NoteColumn = { key: 'lastName', label: 'Nom', render: (_, item) => (<div className="text-sm font-medium text-gray-900">{item.lastName}</div>) };
        const firstNameColumn: NoteColumn = { key: 'firstName', label: 'Prénom', render: (firstName) => <div className="text-sm font-medium text-gray-900">{firstName}</div> };
        const competenceColumns: NoteColumn[] = activeSubject?.competences.map(c => ({
            key: c.id,
            label: c.label,
            render: (value) => {
                const status = getGradingStatus(value);
                return <span className={`font-semibold ${status.color}`}>{typeof value === 'number' ? `${Math.round(value)}%` : status.text}</span>;
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
        const startY = addPdfHeader(doc, currentClasse, title);
        const baseStyles = getPdfTableStyles(doc);
        
            const tableColumns = ["Nom", "Prénom", ...activeSubject.competences.map(c => c.label)];
            const tableRows = filteredNotes.map(note => [
                note.lastName,
                note.firstName,
                ...activeSubject.competences.map(c => {
                    const noteValue = note.notes[c.id];
                    return typeof noteValue === 'number' ? `${Math.round(noteValue)}%` : '-';
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
                        studentData[c.label] = typeof noteValue === 'number' ? `${Math.round(noteValue)}%` : '-';
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
            let startY = addPdfHeader(doc, currentClasse, title);
            const baseStyles = getPdfTableStyles(doc);

            domains.forEach(domain => {
                startY += 5;
                if (startY > 250) { 
                    doc.addPage(); 
                    startY = addPdfHeader(doc, currentClasse, title); 
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
                            return typeof noteValue === 'number' ? `${Math.round(noteValue)}%` : '-';
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
                        startY = addPdfHeader(doc, currentClasse, title); 
                    }
                });
            });
            doc.save(`Moyennes_${currentTrimestre}_${currentClasse}_Complet.pdf`);
        } catch (error) { console.error("Erreur PDF:", error); }
    };

    if (role === 'eleve' && user) {
  return (
            <StudentTrimestrielleCards 
                studentName={user.name || ''}
                classLabel={user.classLabel || ''}
              currentTrimestre={currentTrimestre}
            />
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm mt-6">
            <div className="flex border-b border-gray-200 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {domains.map(domain => (
                    <button key={domain.id} onClick={() => setActiveDomainId(domain.id)} className={`px-4 py-3 text-sm font-medium focus:outline-none transition-colors duration-150 ${activeDomainId === domain.id ? 'border-orange-500 text-orange-600 border-b-2' : 'text-gray-500 hover:text-orange-500 border-b-2 border-transparent'}`}>
                        {domain.name.toUpperCase()}
                    </button>
                ))}
            </div>
            <div className="p-4 md:p-6">
      <Toolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Rechercher par nom..."
        showPagination={true}
        currentPage={currentPage}
                    totalItems={filteredNotes.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
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
              rightActions={
                <Menu as="div" className="relative">
                            <MenuButton className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500">
                    <MoreHorizontal className="w-5 h-5" />
                  </MenuButton>
                            <MenuItems anchor="bottom end" className="w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                    <div className="px-1 py-1">
                      <MenuItem>
                        {({ active }) => (
                          <button onClick={handleExportExcel} className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}>
                                                <FileSpreadsheet className="w-5 h-5 mr-2" /> Exporter Excel (Matière)
                                            </button>
                                        )}
                                    </MenuItem>
                                    <MenuItem>
                                        {({ active }) => (
                                            <button onClick={handleExportAllExcel} className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}>
                                                <Library className="w-5 h-5 mr-2" /> Exporter Excel (Tout)
                          </button>
                        )}
                      </MenuItem>
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
              }
            />
      <NotesTable 
                    noteColumns={noteColumns}
        data={notesTableData} 
                    isEditable={false} // Les moyennes trimestrielles ne sont pas éditables
      />
      </div>
    </div>
  );
};

export default TrimestrielleView; 
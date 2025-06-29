import React, { useState, useMemo, useEffect } from 'react';
import NotesTable, { NoteData, NoteColumn } from './NotesTable';
import Toolbar from '../ui/Toolbar';
import StudentTrimestrielleCards from './StudentTrimestrielleCards';
import { useStudents } from '../../contexts/StudentContext';
import { useUser } from '../../layouts/DashboardLayout';
import { useFilters } from '../../contexts/FilterContext';
import { getCurrentStudentNotes } from '../../lib/mock-student-notes';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { MoreHorizontal, FileSpreadsheet, FileText, ArrowDownToLine, Library } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';

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

interface jsPDFWithAutoTable extends jsPDF {
    lastAutoTable?: {
        finalY?: number;
    };
}

const ITEMS_PER_PAGE = 10;

// Fonction pour ajouter l'en-tête PDF (même style que les autres vues)
const addPdfHeader = (doc: jsPDF, classe: string, title: string) => {
    // Logo et en-tête de l'école
    doc.setFontSize(20);
    doc.setFont("times", "bold");
    doc.text("École Primaire EdConnekt", 25, 25);
    
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text(`Classe: ${classe}`, 25, 35);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 25, 42);
    
    // Titre du rapport
    doc.setFontSize(16);
    doc.setFont("times", "bold");
    doc.text(title, 25, 55);
    
    // Ligne de séparation
    doc.setLineWidth(0.5);
    doc.line(25, 62, 185, 62);
    
    return 70; // Position Y de départ pour le contenu
};

// Style des tableaux PDF (cohérent avec les autres vues)
const getPdfTableStyles = (doc: jsPDF): Partial<UserOptions> => ({
    theme: 'striped',
    headStyles: {
        fillColor: [79, 70, 229], // indigo-600
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10
    },
    bodyStyles: {
        fontSize: 9,
        cellPadding: 3
    },
    alternateRowStyles: {
        fillColor: [249, 250, 251] // gray-50
    },
    styles: {
        font: 'times',
        overflow: 'linebreak',
        cellWidth: 'wrap'
    },
    columnStyles: {
        0: { cellWidth: 30 }, // Nom
        1: { cellWidth: 30 }, // Prénom
        2: { cellWidth: 40, halign: 'center' }, // Trimestre 1
        3: { cellWidth: 40, halign: 'center' }, // Trimestre 2
        4: { cellWidth: 40, halign: 'center' }  // Trimestre 3
    },
    margin: { top: 70, left: 25, right: 25, bottom: 25 },
    didDrawPage: (data) => {
        // Numéro de page
        const pageNumber = (doc as any).internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setFont("times", "normal");
        doc.text(`Page ${data.pageNumber}/${pageNumber}`, 185, 280, { align: 'right' });
    }
});

const TrimestrielleView: React.FC<TrimestrielleViewProps> = ({ role }) => {
  const { students } = useStudents();
  const { user } = useUser();
  const { currentClasse } = useFilters();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredStudents, setFilteredStudents] = useState(students);

  // Déterminer le trimestre actuel (fictif)
  const getCurrentTrimestre = () => {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    if (month >= 9 || month <= 12) return 1; // Sept-Déc
    if (month >= 1 && month <= 3) return 2; // Jan-Mars
    return 3; // Avril-Juin
  };

  const currentTrimestre = getCurrentTrimestre();

  useEffect(() => {
    try {
      if (role === 'eleve' && user) {
        // Utiliser les données fictives pour l'élève connecté
        const mockNotes = getCurrentStudentNotes(user.classId || 'cp1');
        
        // Convertir les notes en format d'étudiants pour l'affichage trimestriel
        const mockStudents = mockNotes.map(note => ({
          id: note.studentId,
          firstName: note.firstName,
          lastName: note.lastName,
          avatar: note.studentAvatar,
          status: 'Présent' as const,
          comment: '',
          classId: user.classId || 'cp1'
        }));
        
        setFilteredStudents(mockStudents);
        setSearchTerm('');
      } else {
        // Pour l'enseignant, appliquer le filtre de recherche
        const filtered = students.filter(student => {
          if (!student) return false;
          
          const firstName = student.firstName || '';
          const lastName = student.lastName || '';
          const fullName = `${firstName} ${lastName}`.toLowerCase();
          return fullName.includes(searchTerm.toLowerCase());
        });
        setFilteredStudents(filtered);
      }
    } catch (error) {
      console.error("Erreur lors du filtrage des étudiants:", error);
      setFilteredStudents([]);
    }
  }, [searchTerm, students, role, user]);

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
    { 
        key: 'trimestre1', 
        label: 'Trimestre 1', 
        render: (value) => value ? (
            <button 
                onClick={() => handleViewBulletin(1)} 
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
                {value as string}
            </button>
        ) : (
            <span className="text-gray-400">-</span>
        ) 
    },
    { 
        key: 'trimestre2', 
        label: 'Trimestre 2', 
        render: (value) => value ? (
            <button 
                onClick={() => handleViewBulletin(2)} 
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
                {value as string}
            </button>
        ) : (
            <span className="text-gray-400">-</span>
        ) 
    },
    { 
        key: 'trimestre3', 
        label: 'Trimestre 3', 
        render: (value) => value ? (
            <button 
                onClick={() => handleViewBulletin(3)} 
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
                {value as string}
            </button>
        ) : (
            <span className="text-gray-400">-</span>
        ) 
    },
  ];
  
  const notesTableData: TrimestrielleNoteData[] = paginatedStudents.map(student => ({
      id: student.id,
      studentName: `${student.firstName || ''} ${student.lastName || ''}`.trim(),
      studentAvatar: student.avatar,
      // Afficher "Voir" pour les trimestres terminés, "En cours" pour le trimestre actuel, "-" pour les futurs
      trimestre1: currentTrimestre > 1 ? 'Voir le bulletin' : currentTrimestre === 1 ? 'En cours' : '-',
      trimestre2: currentTrimestre > 2 ? 'Voir le bulletin' : currentTrimestre === 2 ? 'En cours' : '-',
      trimestre3: currentTrimestre > 3 ? 'Voir le bulletin' : currentTrimestre === 3 ? 'En cours' : '-',
  }));

  // === FONCTIONS D'EXPORT ===

  const handleExportExcel = () => {
    const dataToExport = filteredStudents.map(student => ({
        'Nom': student.lastName,
        'Prénom': student.firstName,
        'Trimestre 1': currentTrimestre > 1 ? 'Terminé' : currentTrimestre === 1 ? 'En cours' : 'À venir',
        'Trimestre 2': currentTrimestre > 2 ? 'Terminé' : currentTrimestre === 2 ? 'En cours' : 'À venir',
        'Trimestre 3': currentTrimestre > 3 ? 'Terminé' : currentTrimestre === 3 ? 'En cours' : 'À venir',
        'Moyenne Annuelle': '14.5/20', // Valeur fictive
        'Rang': '8/25' // Valeur fictive
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rapports Trimestriels');
    
    // Auto-size columns
    const colWidths = Object.keys(dataToExport[0] || {}).map(key => ({
        wch: Math.max(key.length, ...dataToExport.map(row => (row[key] || '').toString().length)) + 2
    }));
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, `Rapports_Trimestriels_${currentClasse}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleExportPdf = () => {
    try {
        const doc = new jsPDF() as jsPDFWithAutoTable;
        const title = `Rapports Trimestriels - Classe ${currentClasse}`;
        const startY = addPdfHeader(doc, currentClasse, title);
        
        const tableColumns = ["Nom", "Prénom", "Trimestre 1", "Trimestre 2", "Trimestre 3"];
        const tableRows = filteredStudents.map(student => [
            student.lastName,
            student.firstName,
            currentTrimestre > 1 ? 'Terminé' : currentTrimestre === 1 ? 'En cours' : 'À venir',
            currentTrimestre > 2 ? 'Terminé' : currentTrimestre === 2 ? 'En cours' : 'À venir',
            currentTrimestre > 3 ? 'Terminé' : currentTrimestre === 3 ? 'En cours' : 'À venir'
        ]);

        autoTable(doc, {
            ...getPdfTableStyles(doc),
            head: [tableColumns],
            body: tableRows,
            startY: startY
        });

        doc.save(`Rapports_Trimestriels_${currentClasse}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
        console.error("Erreur lors de la génération du PDF :", error);
        alert("Une erreur est survenue lors de la création du PDF. Veuillez consulter la console pour plus de détails.");
    }
  };

  const handleStudentExportPdf = () => {
    if (!user) {
        console.error("Export PDF annulé : utilisateur non disponible.");
        return;
    }

    try {
        const doc = new jsPDF() as jsPDFWithAutoTable;
        const title = `Bulletin Annuel - ${user.name} (Année 2024-2025)`;
        const startY = addPdfHeader(doc, user.classLabel || 'Non définie', title);
        
        // Informations de l'élève
        doc.setFontSize(12);
        doc.setFont("times", "bold");
        doc.text("Informations de l'élève", 25, startY + 10);
        
        doc.setFont("times", "normal");
        doc.text(`Nom complet : ${user.name}`, 25, startY + 25);
        doc.text(`Classe : ${user.classLabel}`, 25, startY + 35);
        doc.text(`Année scolaire : 2024-2025`, 25, startY + 45);
        
        // Tableau des résultats trimestriels
        const tableColumns = ["Trimestre", "Période", "Moyenne", "Rang", "Commentaire"];
        const tableRows = [
            [
                "1er Trimestre", 
                "Sept - Déc", 
                currentTrimestre > 1 ? "14.5/20" : "En cours", 
                currentTrimestre > 1 ? "8/25" : "-",
                currentTrimestre > 1 ? "Bon début d'année" : "Trimestre en cours"
            ],
            [
                "2ème Trimestre", 
                "Jan - Mars", 
                currentTrimestre > 2 ? "15.2/20" : currentTrimestre === 2 ? "En cours" : "À venir", 
                currentTrimestre > 2 ? "6/25" : "-",
                currentTrimestre > 2 ? "Progression notable" : currentTrimestre === 2 ? "En cours" : "À venir"
            ],
            [
                "3ème Trimestre", 
                "Avr - Juin", 
                currentTrimestre > 3 ? "15.8/20" : currentTrimestre === 3 ? "En cours" : "À venir", 
                currentTrimestre > 3 ? "4/25" : "-",
                currentTrimestre > 3 ? "Excellente fin d'année" : currentTrimestre === 3 ? "En cours" : "À venir"
            ]
        ];

        autoTable(doc, {
            ...getPdfTableStyles(doc),
            head: [tableColumns],
            body: tableRows,
            startY: startY + 60,
            columnStyles: {
                0: { cellWidth: 35 },
                1: { cellWidth: 30 },
                2: { cellWidth: 25, halign: 'center' },
                3: { cellWidth: 25, halign: 'center' },
                4: { cellWidth: 70 }
            }
        });

        // Résumé général
        const finalY = doc.lastAutoTable?.finalY || startY + 120;
        doc.setFontSize(12);
        doc.setFont("times", "bold");
        doc.text("Bilan de l'année scolaire", 25, finalY + 20);
        
        doc.setFont("times", "normal");
        if (currentTrimestre > 1) {
            doc.text("Moyenne générale annuelle : 15.2/20", 25, finalY + 35);
            doc.text("Rang dans la classe : 6ème sur 25 élèves", 25, finalY + 45);
            doc.text("Progression : +1.3 points par rapport au 1er trimestre", 25, finalY + 55);
            
            doc.text("Commentaire général :", 25, finalY + 70);
            const commentaire = "Excellente année scolaire ! L'élève a montré une progression constante et régulière dans tous les domaines. Les efforts fournis ont été récompensés par de très bons résultats. Félicitations !";
            
            // Découper le commentaire en lignes
            const lignes = doc.splitTextToSize(commentaire, 160);
            doc.text(lignes, 25, finalY + 80);
        } else {
            doc.text("Année scolaire en cours - Bilan intermédiaire non disponible", 25, finalY + 35);
        }

        doc.save(`Bulletin_Annuel_${user.name.replace(/\s+/g, '_')}_2024-2025.pdf`);
    } catch (error) {
        console.error("Erreur lors de la génération du PDF :", error);
        alert("Une erreur est survenue lors de la création du PDF. Veuillez consulter la console pour plus de détails.");
    }
  };

  const handleViewBulletin = (trimestre: number) => {
    // Fonction pour voir un bulletin spécifique
    console.log(`Voir bulletin du trimestre ${trimestre}`);
    // TODO: Implémenter la modal ou la navigation vers le détail du bulletin
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 md:p-6">
        {/* Affichage conditionnel : cartes pour les élèves, tableau pour les enseignants */}
        {role === 'eleve' && user ? (
          <>
            {/* En-tête avec informations de l'élève et bouton télécharger */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
                <p className="text-slate-600">Classe {user.classLabel || 'Non définie'}</p>
              </div>
              <Menu as="div" className="relative">
                <MenuButton className="inline-flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
                  <ArrowDownToLine className="w-5 h-5" />
                </MenuButton>
                <MenuItems anchor="bottom end" className="w-64 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="px-1 py-1">
                    <MenuItem>
                      {({ active }) => (
                        <button 
                          onClick={handleStudentExportPdf} 
                          className={`${active ? 'bg-slate-50' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}
                        >
                          <FileText className="w-5 h-5 mr-2 text-slate-600" /> 
                          Mon Bulletin Annuel
                        </button>
                      )}
                    </MenuItem>
                  </div>
                </MenuItems>
              </Menu>
            </div>
            
            <StudentTrimestrielleCards 
              studentName={user.name} 
              classLabel={user.classLabel || 'Non définie'} 
              currentTrimestre={currentTrimestre}
            />
          </>
        ) : (
          <>
            {/* Interface enseignant avec tableau */}
      <Toolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Rechercher par nom..."
        showPagination={true}
        currentPage={currentPage}
        totalItems={filteredStudents.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
              rightActions={
                <Menu as="div" className="relative">
                  <MenuButton className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <MoreHorizontal className="w-5 h-5" />
                  </MenuButton>
                  <MenuItems anchor="bottom end" className="w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="px-1 py-1">
                      <MenuItem>
                        {({ active }) => (
                          <button onClick={handleExportExcel} className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}>
                            <FileSpreadsheet className="w-5 h-5 mr-2" /> 
                            Exporter Excel
                          </button>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <button onClick={handleExportPdf} className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}>
                            <FileText className="w-5 h-5 mr-2" /> 
                            Exporter PDF
                          </button>
                        )}
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>
              }
            />
            
      <NotesTable 
        data={notesTableData} 
        noteColumns={noteColumns} 
      />
          </>
        )}
      </div>
    </div>
  );
};

export default TrimestrielleView; 
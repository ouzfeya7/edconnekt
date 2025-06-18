import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockFacilitators, pdiSessionStats, Facilitator } from '../lib/mock-data';

// Import des composants réutilisables
import DateCard from '../components/Header/DateCard';
import TrimestreCard from '../components/Header/TrimestreCard';
import PdiCard from '../components/Header/PdiCard';
import StatsCard from '../components/Header/StatsCard';
import CircularProgress from '../components/ui/CircularProgress';
import ClassTabs from '../components/pdi/ClassTabs';
import { Briefcase, MoreHorizontal, Filter } from 'lucide-react';

// Nouveaux imports pour le tableau et la toolbar
import Toolbar from '../components/ui/Toolbar';
import NotesTable, { NoteData, NoteColumn } from '../components/GestionDesNotes/NotesTable';
import { mockPdiStudents } from '../lib/mock-data';

const PdiDetailPage: React.FC = () => {
  const { facilitatorId } = useParams<{ facilitatorId: string }>();
  const facilitator = mockFacilitators.find((f: Facilitator) => f.id === facilitatorId);

  // États pour les filtres de l'en-tête
  const [date] = useState('12 Mars 2025'); 
  const [trimestre, setTrimestre] = useState('Trimestre 1');
  const [pdi, setPdi] = useState('PDI 08-13');
  
  // États pour le tableau (recherche et pagination)
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (!facilitator) {
    return <div className="p-6">Facilitateur non trouvé.</div>;
  }

  const handleTabChange = (selectedClass: string) => {
    console.log("Classe sélectionnée :", selectedClass);
    // Ici, on pourrait filtrer les données du tableau des élèves par classe
  };

  // Filtrage et pagination des élèves
  const filteredStudents = mockPdiStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Transformation des données pour le NotesTable
  const tableData: NoteData[] = paginatedStudents.map(student => ({
    id: student.id,
    facilitator: student.name, // Le champ 'facilitator' est utilisé pour afficher le nom et l'avatar
    facilitatorImage: student.avatarUrl,
    date: student.evaluationDate,
    langage: student.langage,
    conte: student.conte,
    vocabulaire: student.vocabulaire,
    lecture: student.lecture,
    graphisme: student.graphisme,
    progression: (student.progression.filter(p => p === 1).length / student.progression.length) * 100,
    remarques: student.remarques,
  }));

  // Définition des colonnes pour le NotesTable
  const noteColumns: NoteColumn[] = [
    { key: 'date', label: "Date d'évaluation" },
    { key: 'langage', label: 'Langage', render: (value) => value !== undefined ? `${value}%` : '-' },
    { key: 'conte', label: 'Conte', render: (value) => value !== undefined ? `${value}%` : '-' },
    { key: 'vocabulaire', label: 'Vocabulaire', render: (value) => value !== undefined ? `${value}%` : '-' },
    { key: 'lecture', label: 'Lecture', render: (value) => value !== undefined ? `${value}%` : '-' },
    { key: 'graphisme', label: 'Graphisme', render: (value) => value !== undefined ? `${value}%` : '-' },
    { key: 'remarques', label: 'Remarques' },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Fil d'Ariane */}
      <div className="text-sm text-gray-500 mb-4">
        <span>Séance PDI</span>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{facilitator.name}</span>
      </div>

      {/* En-tête avec filtres et stats générales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DateCard value={date} />
          <TrimestreCard value={trimestre} onChange={setTrimestre} />
          <PdiCard value={pdi} onChange={setPdi} />
        </div>
        <StatsCard stats={pdiSessionStats} />
      </div>

      {/* Section d'information du facilitateur */}
      <div className="bg-white p-6 rounded-lg shadow-sm flex items-start gap-8 mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">{facilitator.name}</h2>
          <div className="flex items-center gap-2 text-gray-500 text-sm mt-1 mb-6">
            <Briefcase size={16} />
            <span>{facilitator.role.toUpperCase()}</span>
          </div>
          
          <div className="flex items-center divide-x divide-gray-200">
            <div className="text-center px-4 first:pl-0">
              <p className="text-sm text-gray-500 mb-2">Moyenne de la classe</p>
              <CircularProgress percentage={facilitator.stats.avg} colorClass="text-green-500" />
            </div>
            <div className="text-center px-4">
              <p className="text-sm text-gray-500 mb-2">Compétence acquise</p>
              <CircularProgress percentage={facilitator.stats.acquired} colorClass="text-green-500" />
            </div>
            <div className="text-center px-4">
              <p className="text-sm text-gray-500 mb-2">Compétence non acquise</p>
              <CircularProgress percentage={facilitator.stats.notAcquired} colorClass="text-red-500" />
            </div>
            <div className="text-center px-4 last:pr-0">
              <p className="text-sm text-gray-500 mb-2">Nombre d'élève à remedier</p>
              <span className="text-3xl font-bold text-slate-800">{facilitator.stats.remediation}</span>
            </div>
          </div>
        </div>
        <div className="w-1/3 max-w-xs flex-shrink-0">
          <img 
            src={facilitator.avatarUrl} 
            alt={facilitator.name} 
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>
      </div>
      
      {/* Onglets des classes et tableau des élèves */}
      <ClassTabs classes={facilitator.classes} onTabChange={handleTabChange} />

      {/* Nouveau conteneur pour la barre d'outils et le tableau */}
      <div className="bg-white rounded-b-lg shadow-sm">
        <Toolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Rechercher un élève..."
          showPagination={true}
          currentPage={currentPage}
          totalItems={filteredStudents.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          rightActions={
            <div className="flex items-center gap-2 sm:gap-4">
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
                <Filter size={16} />
                Filtre
              </button>
              <button className="p-1 rounded-md hover:bg-gray-100">
                <MoreHorizontal size={16} />
              </button>
            </div>
          }
        />
        <NotesTable
          data={tableData}
          noteColumns={noteColumns}
          showProgressionColumn={true}
        />
      </div>
    </div>
  );
};

export default PdiDetailPage; 
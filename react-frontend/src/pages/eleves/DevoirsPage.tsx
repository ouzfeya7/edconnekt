import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getStudentAssignments, StudentAssignment } from '../../lib/mock-student-data';
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  Calendar,
  BookOpen,
  ArrowRight,
  Grid,
  List,
  Calculator,
  FileText,
  Beaker,
  Globe,
  MapPin,
  Book,
  Users,
  Palette,
  Activity
} from 'lucide-react';

// Fonction pour obtenir l'icône selon la matière
const getSubjectIcon = (subject: string) => {
  switch (subject.toLowerCase()) {
    case 'mathématiques': return Calculator;
    case 'français': return FileText;
    case 'sciences': return Beaker;
    case 'anglais': return Globe;
    case 'histoire': return BookOpen;
    case 'géographie': return MapPin;
    case 'études islamiques': return Book;
    case 'quran': return Book;
    case 'vivre ensemble': return Users;
    case 'arts plastiques': return Palette;
    case 'eps': return Activity;
    default: return BookOpen;
  }
};

// Fonction pour obtenir la couleur selon le domaine
const getDomainColor = (domain: string) => {
  switch (domain) {
    case 'Langues et Communication': return 'bg-slate-100';
    case 'STEM': return 'bg-slate-100';
    case 'Sciences Humaines': return 'bg-slate-100';
    case 'Créativité & Sport': return 'bg-slate-100';
    default: return 'bg-slate-100';
  }
};

// Fonction pour obtenir la couleur selon le score attendu
const getScoreColor = (expectedScore?: number) => {
  if (!expectedScore) return 'text-gray-500';
  if (expectedScore >= 75) return 'text-green-600';
  if (expectedScore >= 50) return 'text-orange-500';
  return 'text-red-600';
};

// Composant carte de devoir pour la vue en liste
const DevoirListCard: React.FC<{ assignment: StudentAssignment }> = ({ assignment }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'overdue': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'overdue': return 'En retard';
      default: return 'En attente';
    }
  };

  const SubjectIcon = getSubjectIcon(assignment.subject);

  return (
    <Link 
      to={`/devoirs/${assignment.id}`} 
      className="bg-white rounded-lg border border-rose-200/50 p-4 hover:border-rose-300/70 hover:shadow-md transition-all duration-200 flex items-center gap-4 shadow-sm"
    >
      {/* Icône de matière */}
      <div className="flex-shrink-0">
        <div className={`w-12 h-12 rounded-lg ${getDomainColor(assignment.domain)} flex items-center justify-center`}>
          <SubjectIcon className="w-6 h-6 text-slate-600" />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-slate-800 truncate">
            {assignment.title}
          </h3>
          <div className={`px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0 ml-2 ${getStatusColor(assignment.status)}`}>
            {getStatusText(assignment.status)}
          </div>
        </div>
        
        <p className="text-sm text-slate-600 mb-3 line-clamp-1">
          {assignment.description}
        </p>

        <div className="flex items-center justify-between">
          {/* Matière et compétence */}
          <div className="flex flex-col gap-1">
            <span className="text-sm text-slate-700 font-medium">{assignment.subject}</span>
            <span className="text-xs text-slate-500">{assignment.competence}</span>
          </div>

          {/* Score attendu et date */}
          <div className="flex flex-col items-end gap-1">
            {assignment.expectedScore && (
              <span className={`text-sm font-medium ${getScoreColor(assignment.expectedScore)}`}>
                {assignment.expectedScore}%
              </span>
            )}
            <div className="flex items-center gap-1 text-sm text-slate-600">
              <Calendar className="w-4 h-4" />
              <span>{assignment.dueDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flèche */}
      <ArrowRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
    </Link>
  );
};

// Composant carte de devoir simple pour la grille
const EnhancedDevoirCard: React.FC<{ assignment: StudentAssignment }> = ({ assignment }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'overdue': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'overdue': return 'En retard';
      default: return 'En attente';
    }
  };

  const SubjectIcon = getSubjectIcon(assignment.subject);

  return (
    <Link 
      to={`/devoirs/${assignment.id}`} 
      className="bg-white rounded-lg border border-rose-200/50 hover:border-rose-300/70 hover:shadow-md transition-all duration-200 flex flex-col shadow-sm"
    >
      {/* En-tête avec icône */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 rounded-lg ${getDomainColor(assignment.domain)} flex items-center justify-center`}>
            <SubjectIcon className="w-5 h-5 text-slate-600" />
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(assignment.status)}`}>
            {getStatusText(assignment.status)}
          </div>
        </div>

        <h3 className="font-semibold text-slate-800 mb-1">
          {assignment.title}
        </h3>
        <p className="text-sm text-slate-600">{assignment.subject}</p>
        <p className="text-xs text-slate-500 mt-1">{assignment.competence}</p>
      </div>

      {/* Corps de la carte */}
      <div className="p-4 flex-1">
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {assignment.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>{assignment.dueDate}</span>
          </div>
          
          {assignment.expectedScore && (
            <span className={`text-sm font-medium ${getScoreColor(assignment.expectedScore)}`}>
              {assignment.expectedScore}%
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

const DevoirsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Utilisation directe des nouvelles données
  const assignments = getStudentAssignments();

  // Filtrage des devoirs
  const filteredAssignments = useMemo(() => {
    return assignments.filter(assignment => {
      const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          assignment.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          assignment.competence.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || assignment.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [assignments, searchQuery, selectedStatus]);

  // Statistiques
  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'pending').length,
    completed: assignments.filter(a => a.status === 'completed').length,
    overdue: assignments.filter(a => a.status === 'overdue').length
  };

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      {/* En-tête avec design moderne */}
      <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 shadow-sm border border-rose-200/50 p-6">
        {/* Motifs décoratifs */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-rose-500/8 rounded-full -translate-y-14 translate-x-14"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-pink-500/6 rounded-full translate-y-10 -translate-x-10"></div>
        
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">Mes devoirs</h1>
          <div className="flex items-center text-sm text-rose-600 font-medium">
            <span>Classe Cours Préparatoire 1</span>
          </div>
        </div>
      </div>

      {/* Statistiques compactes en ligne */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-rose-200/50 shadow-sm">
          <BookOpen className="w-4 h-4 text-rose-600" />
          <span className="text-sm font-medium text-gray-800">{stats.total} devoirs</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-amber-200/50 shadow-sm">
          <Clock className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-800">{stats.pending} en attente</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-green-200/50 shadow-sm">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">{stats.completed} terminés</span>
        </div>
        {stats.overdue > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-red-200/50 shadow-sm">
            <Clock className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">{stats.overdue} en retard</span>
          </div>
        )}
      </div>

      {/* Barre de recherche, filtres et boutons de vue */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Recherche - étendue pour utiliser l'espace disponible */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher un devoir, matière ou description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-rose-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 bg-white shadow-sm"
          />
        </div>
        
        {/* Filtres - largeur adaptée au contenu */}
        <div className="flex gap-2 flex-shrink-0">
          {[
            { key: 'all', label: 'Tous les statuts', count: stats.total },
            { key: 'pending', label: 'En attente', count: stats.pending },
            { key: 'completed', label: 'Terminés', count: stats.completed },
            { key: 'overdue', label: 'En retard', count: stats.overdue },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setSelectedStatus(option.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                selectedStatus === option.key
                  ? 'bg-white text-gray-700 shadow-md border-2 border-rose-500'
                  : 'bg-white text-gray-700 hover:bg-rose-50 border border-rose-200/50'
              }`}
            >
              <Filter className={`w-3 h-3 ${selectedStatus === option.key ? 'text-rose-500' : 'text-gray-500'}`} />
              {option.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                selectedStatus === option.key 
                  ? 'bg-rose-100 text-rose-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {option.count}
              </span>
            </button>
          ))}
        </div>

        {/* Boutons de vue */}
        <div className="flex bg-white border border-gray-200 rounded-lg shadow flex-shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-l-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-rose-50 text-rose-600 border-2 border-rose-500'
                : 'text-gray-500 hover:bg-rose-50'
            }`}
            title="Vue grille"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-r-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-rose-50 text-rose-600 border-2 border-rose-500'
                : 'text-gray-500 hover:bg-rose-50'
            }`}
            title="Vue liste"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

              {/* Liste des devoirs */}
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-50/30 to-pink-50/20 rounded-xl p-6 border border-rose-200/30">
        {/* Motifs décoratifs subtils */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full -translate-y-12 translate-x-12"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-pink-500/4 rounded-full translate-y-8 -translate-x-8"></div>
        
        <div className="relative">
          {filteredAssignments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-rose-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun devoir trouvé</h3>
          <p className="text-gray-600">
            {searchQuery 
              ? `Aucun devoir ne correspond à "${searchQuery}"`
              : 'Aucun devoir disponible pour les critères sélectionnés'
            }
          </p>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAssignments.map((assignment) => (
                <EnhancedDevoirCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => (
                <DevoirListCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
            )}
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default DevoirsPage; 
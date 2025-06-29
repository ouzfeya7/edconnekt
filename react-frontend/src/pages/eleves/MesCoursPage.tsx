import React, { useState, useMemo } from 'react';
import DashboardCourseCard from '../../components/course/DashboardCourseCard';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '../../contexts/FilterContext';
import { useUser } from '../../layouts/DashboardLayout';
import { getEnrichedCourses } from '../../lib/mock-student-data';
import { BookOpen, Clock, CheckCircle, Filter, Search, Grid3X3, List } from 'lucide-react';

const MesCoursPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentClasse } = useFilters();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'completed' | 'upcoming'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Utiliser les données centralisées synchronisées avec le dashboard
  const enrichedCourses = useMemo(() => {
    return getEnrichedCourses(navigate).filter(course => course.classId === currentClasse);
  }, [currentClasse, navigate]);

  // Filtrer les cours selon les critères
  const filteredCourses = useMemo(() => {
    return enrichedCourses.filter(course => {
      const matchesSearch = course.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.theme.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = selectedFilter === 'all' || course.status === selectedFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [enrichedCourses, searchTerm, selectedFilter]);

  // Calculer les statistiques
  const stats = useMemo(() => {
    const total = enrichedCourses.length;
    const active = enrichedCourses.filter(c => c.status === 'active').length;
    const completed = enrichedCourses.filter(c => c.status === 'completed').length;
    const upcoming = enrichedCourses.filter(c => c.status === 'upcoming').length;
    const avgProgress = enrichedCourses.reduce((sum, c) => sum + c.progress, 0) / total || 0;
    
    return { total, active, completed, upcoming, avgProgress: Math.round(avgProgress) };
  }, [enrichedCourses]);

  const filterOptions = [
    { key: 'all', label: 'Tous les cours', count: stats.total },
    { key: 'active', label: 'En cours', count: stats.active },
    { key: 'completed', label: 'Terminés', count: stats.completed },
    { key: 'upcoming', label: 'À venir', count: stats.upcoming },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">Mes cours</h1>
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <span>Classe {user?.classLabel || currentClasse}</span>
      </div>

      {/* Statistiques compactes en ligne */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200">
          <BookOpen className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium text-gray-700">{stats.total} cours</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200">
          <Clock className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium text-gray-700">{stats.active} en cours</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">{stats.completed} terminés</span>
        </div>
      </div>

      {/* Barre de recherche, filtres et boutons de vue */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Recherche - étendue pour utiliser l'espace disponible */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher un cours, enseignant ou thème..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent bg-white"
          />
        </div>
        
        {/* Filtres - largeur adaptée au contenu */}
        <div className="flex gap-2 flex-shrink-0">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => setSelectedFilter(option.key as 'all' | 'active' | 'completed' | 'upcoming')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                selectedFilter === option.key
                  ? 'bg-white text-gray-700 shadow-md border-2 border-orange-500'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Filter className={`w-3 h-3 ${selectedFilter === option.key ? 'text-orange-500' : 'text-gray-500'}`} />
              {option.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                selectedFilter === option.key 
                  ? 'bg-orange-100 text-orange-700' 
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
                ? 'bg-white text-orange-500 border-2 border-orange-500'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
            title="Vue grille"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-r-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-orange-500 border-2 border-orange-500'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
            title="Vue liste"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Affichage des cours selon le mode de vue */}
      {filteredCourses.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCourses.map((course) => (
              <DashboardCourseCard
                key={course.id}
                subject={course.subject}
                teacher={course.teacher}
                progress={course.progress}
                status={course.status}
                nextLessonDate={course.nextLessonDate}
                onViewDetails={course.onViewDetails}
                title={course.title}
                time={course.time}
                presentCount={course.presentCount}
                remediationCount={course.remediationCount}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{course.subject}</h3>
                      <p className="text-sm text-gray-600">{course.teacher}</p>
                      <p className="text-xs text-gray-500 mt-1">{course.theme}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        course.status === 'active' ? 'bg-green-100 text-green-800' :
                        course.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {course.status === 'active' ? 'En cours' :
                         course.status === 'completed' ? 'Terminé' : 'À venir'}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{course.nextLessonDate}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-800">{course.progress}%</div>
                      <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-gray-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={course.onViewDetails}
                      className="px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors text-sm font-medium shadow"
                    >
                      Voir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun cours trouvé</h3>
          <p className="text-gray-600">
            {searchTerm 
              ? `Aucun cours ne correspond à "${searchTerm}"`
              : 'Aucun cours disponible pour les critères sélectionnés'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default MesCoursPage; 
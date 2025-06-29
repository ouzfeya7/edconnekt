import React, { useState } from 'react';
import DashboardLessonCard from './DashboardLessonCard';
import { Search, CalendarDays, BookOpen, Filter } from 'lucide-react';
import { Lesson } from '../../lib/mock-data'; // Importer le type Lesson


interface CourseLessonsListProps {
  lessons: Lesson[]; // Accepter les leçons comme prop
}

const CourseLessonsList: React.FC<CourseLessonsListProps> = ({ lessons }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange] = useState('31/03/2025 - 04/04/2025');

  const filteredLessons = lessons.filter(lesson => 
    lesson.lessonTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section>
      {/* En-tête de la section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <BookOpen className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Leçons du cours</h2>
            <p className="text-slate-500 text-sm mt-0.5">
              {filteredLessons.length} leçon{filteredLessons.length > 1 ? 's' : ''} disponible{filteredLessons.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <input 
              type="text"
              placeholder="Rechercher une leçon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-sm w-full sm:w-80 bg-white"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg shadow-sm text-sm bg-white hover:bg-slate-50 text-slate-600 transition-colors">
            <CalendarDays className="w-4 h-4" />
            <span className="hidden sm:inline">{dateRange}</span>
            <span className="sm:hidden">Période</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg shadow-sm text-sm bg-white hover:bg-slate-50 text-slate-600 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filtres</span>
          </button>
        </div>
      </div>

      {/* Liste des leçons */}
      {filteredLessons.length === 0 ? (
        <div className="text-center py-12">
          <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-600 mb-2">Aucune leçon trouvée</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            {searchTerm 
              ? `Aucune leçon ne correspond à "${searchTerm}". Essayez de modifier votre recherche.`
              : "Il n'y a pas encore de leçons pour ce cours."
            }
          </p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
            >
              Effacer la recherche
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredLessons.map(lesson => (
            <DashboardLessonCard 
              key={lesson.id}
              id={lesson.id}
              title={lesson.lessonTitle}
              subject={lesson.remediation?.subject || 'Mathématique'}
              time={lesson.remediation?.time || '12H30 - 13H00'}
              teacher={lesson.remediation?.teacher || 'Mouhamed Sall'}
              status="active"
              onViewDetails={() => {
                // Navigation vers le détail de la leçon
                window.location.href = `/lecons/${lesson.id}`;
              }}
            />
          ))}
        </div>
      )}


    </section>
  );
};

export default CourseLessonsList; 
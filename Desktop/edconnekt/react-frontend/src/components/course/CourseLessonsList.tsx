import React, { useState } from 'react';
import LessonCard from './LessonCard';
import { Search, CalendarDays } from 'lucide-react';
import { Lesson } from '../../lib/mock-data'; // Importer le type Lesson

interface CourseLessonsListProps {
  lessons: Lesson[]; // Accepter les leçons comme prop
}

const CourseLessonsList: React.FC<CourseLessonsListProps> = ({ lessons }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('31/03/2025 - 04/04/2025');

  const filteredLessons = lessons.filter(lesson => 
    lesson.lessonTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="mt-4">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <h3 className="text-xl font-semibold text-gray-800">Leçons</h3>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <input 
              type="text"
              placeholder="Rechercher"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm w-full sm:w-auto min-w-[200px]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm bg-white">
            <CalendarDays className="w-4 h-4 text-gray-500 mr-2" />
            <span>{dateRange}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredLessons.map(lesson => (
          <LessonCard 
            key={lesson.id}
            id={lesson.id}
            title={lesson.lessonTitle}
            subject={lesson.remediation?.subject || 'N/A'}
            time={lesson.remediation?.time || 'N/A'}
            teacher={lesson.remediation?.teacher || 'N/A'}
            teacherImage={lesson.remediation?.teacherImage}
            // Ces valeurs ne sont pas dans le modèle Lesson, j'utilise des valeurs par défaut
            presentCount={lesson.statsData.skillAcquired}
            absentCount={lesson.statsData.skillNotAcquired}
          />
        ))}
      </div>
    </section>
  );
};

export default CourseLessonsList; 
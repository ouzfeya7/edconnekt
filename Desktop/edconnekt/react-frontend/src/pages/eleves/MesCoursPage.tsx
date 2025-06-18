import React from 'react';
import CourseCard from '../../components/course/CourseCard';
import { useNavigate } from 'react-router-dom';
import { mockCourses } from '../../lib/mock-data'; // Importer les données centralisées

const MesCoursPage: React.FC = () => {
  const navigate = useNavigate();

  // Utiliser les données depuis le fichier centralisé
  const courses = mockCourses.map(course => ({
    ...course,
    onViewDetails: () => navigate(`/mes-cours/${course.id}`),
  }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Mes cours</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            subject={course.subject}
            teacher={course.teacher}
            onViewDetails={course.onViewDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default MesCoursPage; 
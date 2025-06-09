import React from 'react';
import { useParams } from 'react-router-dom'; 
import { mockCourses } from '../../lib/mock-data';

import CourseDetailHeader from '../../components/course/CourseDetailHeader';
import LessonInfoSection, { StatItem } from '../../components/course/LessonInfoSection'; 
import CourseLessonsList from '../../components/course/CourseLessonsList';
import { useAuth } from '../authentification/useAuth';

// Répéter la logique de rôle ici. Idéalement, à partager.
type Role = "enseignant" | "directeur" | "eleve" | "parent" | "administrateur" | "espaceFamille";
const rolesPriority: Role[] = ["administrateur", "directeur", "enseignant", "eleve", "parent", "espaceFamille"];

const DetailCoursPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>(); 
  const { roles } = useAuth();
  const userRole = rolesPriority.find(r => roles.includes(r));

  const courseData = mockCourses.find(c => c.id === courseId);

  if (!courseData) {
    return <div className="p-6">Cours non trouvé.</div>;
  }

  // Construire les stats dynamiquement
  const courseStats: StatItem[] = [
    { 
      id: 'avgStudent', 
      title: userRole === 'eleve' ? "Moyenne de l'élève" : "Moyenne de la classe", 
      value: courseData.statsData.studentAverage, 
      percentage: courseData.statsData.studentAverage, 
      progressColor: 'text-green-500' 
    },
    { 
      id: 'skillAcq', 
      title: userRole === 'eleve' ? "Mes compétences acquises" : "Compétence acquise", 
      value: courseData.statsData.skillAcquired, 
      percentage: courseData.statsData.skillAcquired, 
      progressColor: 'text-green-500' 
    },
    { 
      id: 'skillNotAcq', 
      title: userRole === 'eleve' ? "Mes compétences non acquises" : "Compétence non acquise", 
      value: courseData.statsData.skillNotAcquired, 
      percentage: courseData.statsData.skillNotAcquired, 
      progressColor: 'text-red-500' 
    },
  ];

  if (userRole !== 'eleve') {
    courseStats.push({ id: 'remediation', title: "Remédiation", value: courseData.statsData.remediationCount });
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <CourseDetailHeader 
        title={courseData.theme} 
      />
      
      <div className="p-4 md:p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-stretch gap-8 mb-6">
          
          <div className="flex-1 flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
              {courseData.courseTitle}
            </h1>

            <div className="flex flex-wrap gap-2 mb-4">
              {courseData.statusTags.map(tag => (
                <span 
                  key={tag.id} 
                  className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-md ${tag.bgColor} ${tag.textColor} ${tag.borderColor ? tag.borderColor : ''}`}
                >
                  {tag.Icon && <tag.Icon className="w-3.5 h-3.5 mr-1.5" />}
                  {tag.label}
                </span>
              ))}
            </div>

            <LessonInfoSection 
              stats={courseStats}
            />
          </div> 

          <div className="w-1/3 flex-shrink-0">
            <img 
              src={courseData.illustrationImage} 
              alt="Illustration" 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        <CourseLessonsList lessons={courseData.lessons} /> 
      </div>
    </div>
  );
};

export default DetailCoursPage; 
import React from 'react';
import { useParams } from 'react-router-dom';
import { mockCourses } from '../../lib/mock-data';
import CourseDetailHeader from '../../components/course/CourseDetailHeader';
import LessonInfoSection, { StatItem } from '../../components/course/LessonInfoSection';
import LessonResourcesSection from '../../components/course/LessonResourcesSection';
import RemediationCard from '../../components/course/RemediationCard';
import { useAuth } from '../authentification/useAuth';
import { Pencil } from 'lucide-react';

// Ces types et cette constante devraient idéalement être dans un fichier partagé
type Role = "enseignant" | "directeur" | "eleve" | "parent" | "administrateur" | "espaceFamille";
const rolesPriority: Role[] = ["administrateur", "directeur", "enseignant", "eleve", "parent", "espaceFamille"];

const DetailLeconPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { roles } = useAuth();

  // Déterminer le rôle principal de l'utilisateur
  const userRole = rolesPriority.find(r => roles.includes(r));

  // Trouver la leçon dans tous les cours
  let lessonData = null;
  let courseTheme = '';
  for (const course of mockCourses) {
    const foundLesson = course.lessons.find(l => l.id === lessonId);
    if (foundLesson) {
      lessonData = foundLesson;
      courseTheme = course.theme;
      break;
    }
  }

  if (!lessonData) {
    return <div className="p-6">Leçon non trouvée.</div>;
  }

  // Construire les statistiques en fonction du rôle de l'utilisateur
  const lessonStats: StatItem[] = [
    { 
      id: 'evalNote', 
      title: userRole === 'eleve' ? "Moyenne de l'élève" : "Moyenne de la classe", 
      value: lessonData.statsData.evaluationNote, 
      percentage: lessonData.statsData.evaluationNote, 
      progressColor: 'text-green-500' 
    },
    { 
      id: 'skillAcq', 
      title: userRole === 'eleve' ? "Mes compétences acquises" : "Compétence acquise", 
      value: lessonData.statsData.skillAcquired, 
      percentage: lessonData.statsData.skillAcquired, 
      progressColor: 'text-green-500' 
    },
    { 
      id: 'skillNotAcq', 
      title: userRole === 'eleve' ? "Mes compétences non acquises" : "Compétence non acquise", 
      value: lessonData.statsData.skillNotAcquired, 
      percentage: lessonData.statsData.skillNotAcquired, 
      progressColor: 'text-red-500' 
    },
  ];

  // Ajouter la stat de remédiation uniquement si l'utilisateur n'est pas un élève
  if (userRole !== 'eleve') {
    lessonStats.push({ id: 'remediate', title: "Nombre d'élève à remédier", value: lessonData.statsData.studentsToRemediate });
  }

  const handleViewResource = (resourceId: string) => {
    console.log("Voir ressource :", resourceId);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <CourseDetailHeader title={courseTheme} />
      
      <div className="p-4 md:p-6">

        <div className="bg-white p-6 rounded-lg shadow-sm flex items-stretch gap-8">
          
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-xl font-semibold text-slate-800">
                {lessonData.lessonTitle}
              </h1>
              {userRole === 'enseignant' && (
                <button className="text-gray-500 hover:text-orange-600 transition-colors p-1 cursor-pointer">
                  <Pencil className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {lessonData.statusTags.map(tag => (
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
              stats={lessonStats}
            />
          </div> 

          <div className="w-1/3 flex-shrink-0">
            <img 
              src={lessonData.illustrationImage} 
              alt="Illustration" 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        <div className="mt-6 mb-6">
          <LessonResourcesSection 
            resources={lessonData.resources} 
            onViewResource={handleViewResource}
          />
        </div>
        {lessonData.remediation && (
          <section className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Remédiation</h3>
            <div className="max-w-sm">
              <RemediationCard
                title={lessonData.remediation.title}
                subject={lessonData.remediation.subject}
                time={lessonData.remediation.time}
                teacher={lessonData.remediation.teacher}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default DetailLeconPage; 
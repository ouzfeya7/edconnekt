import React from 'react';
import { useParams } from 'react-router-dom';
import { mockCourses } from '../../lib/mock-data';
import CourseDetailHeader from '../../components/course/CourseDetailHeader';
import LessonInfoSection, { StatItem } from '../../components/course/LessonInfoSection';
import LessonResourcesSection from '../../components/course/LessonResourcesSection';
import { useAuth } from '../../pages/authentification/useAuth';
import { Pencil, GraduationCap, AlertTriangle, Calendar, TrendingUp, User } from 'lucide-react';

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
            courseId="course-1"
            lessonId="lesson-1"
            onViewResource={handleViewResource}
          />
        </div>
        {/* Section Remédiation adaptée selon le rôle et les statistiques de la leçon */}
          <section className="mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-100 rounded-lg">
                <GraduationCap className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800">Remédiation</h2>
                <p className="text-slate-500 text-sm mt-0.5">
                  {userRole === 'eleve' 
                    ? 'Aide personnalisée pour cette leçon' 
                    : 'Sessions de remédiation pour cette leçon'
                  }
                </p>
              </div>
            </div>

            {userRole === 'eleve' ? (
              /* Section pour les élèves basée sur leurs statistiques */
              <div>
                {/* Évaluation de l'élève pour cette leçon */}
                <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="font-semibold text-slate-800 mb-2">Mes résultats pour cette leçon</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-800">{lessonData.statsData.evaluationNote}%</p>
                      <p className="text-sm text-slate-600">Ma note</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{lessonData.statsData.skillAcquired}%</p>
                      <p className="text-sm text-slate-600">Compétences acquises</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{lessonData.statsData.skillNotAcquired}%</p>
                      <p className="text-sm text-slate-600">À améliorer</p>
                    </div>
                  </div>
                </div>

                {/* Recommandation de remédiation basée sur les performances */}
                {lessonData.statsData.skillNotAcquired > 30 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mes difficultés identifiées */}
                    <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-200 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-orange-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-orange-800">Points à renforcer</h3>
                          <p className="text-xs text-orange-600">Basé sur mes résultats</p>
                        </div>
                      </div>
                      <p className="text-sm text-orange-700 mb-3">
                        {lessonData.statsData.skillNotAcquired}% de compétences nécessitent une attention particulière
                      </p>
                      <div className="text-xs text-orange-600">
                        <p>• Compréhension des concepts de base</p>
                        <p>• Application pratique des méthodes</p>
                        <p>• Exercices d'approfondissement</p>
                      </div>
                    </div>

                    {/* Session recommandée */}
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-200 rounded-lg">
                          <Calendar className="w-5 h-5 text-blue-700" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-blue-800">Session recommandée</h3>
                          <p className="text-xs text-blue-600">Prochaine disponibilité</p>
                        </div>
                      </div>
                      <div className="text-sm text-blue-700 mb-4">
                        <p><strong>Mercredi 27 Novembre</strong></p>
                        <p>15h00 - 16h00</p>
                        <p>Salle B12 avec {lessonData.remediation?.teacher || 'Mme Dubois'}</p>
                      </div>
                      <button className="w-full text-xs bg-white text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors shadow">
                        Réserver cette session
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Si l'élève a de bons résultats */
                  <div className="bg-green-50 p-6 rounded-xl border border-green-200 text-center">
                    <div className="p-3 bg-green-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-green-700" />
                    </div>
                    <h3 className="font-semibold text-green-800 mb-2">Excellents résultats !</h3>
                    <p className="text-sm text-green-700 mb-4">
                      Vous maîtrisez bien cette leçon avec {lessonData.statsData.skillAcquired}% de compétences acquises.
                    </p>
                    <p className="text-xs text-green-600">
                      Continuez comme ça ! Vous pouvez passer aux exercices d'approfondissement.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Section pour les enseignants */
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Élèves en difficulté pour cette leçon */}
                  <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-red-200 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-red-800">Élèves en difficulté</h3>
                        <p className="text-xs text-red-600">Pour cette leçon</p>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-red-800 mb-2">
                      {lessonData.statsData.studentsToRemediate || Math.round((lessonData.statsData.skillNotAcquired / 100) * 25)}
                    </p>
                    <p className="text-sm text-red-600">élèves concernés</p>
                  </div>

                  {/* Sessions programmées */}
                  <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-amber-200 rounded-lg">
                        <Calendar className="w-5 h-5 text-amber-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-amber-800">Sessions prévues</h3>
                        <p className="text-xs text-amber-600">Cette semaine</p>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-amber-800 mb-2">2</p>
                    <p className="text-sm text-amber-600">sessions planifiées</p>
                  </div>

                  {/* Taux de réussite post-remédiation */}
                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-200 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-green-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-800">Taux d'amélioration</h3>
                        <p className="text-xs text-green-600">Après remédiation</p>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-green-800 mb-2">78%</p>
                    <p className="text-sm text-green-600">d'amélioration moyenne</p>
                  </div>
                </div>

                {/* Actions pour les enseignants */}
                <div className="pt-6 border-t border-slate-200">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium">
                      <Calendar className="w-4 h-4" />
                      Programmer une session
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                      <User className="w-4 h-4" />
                      Voir les élèves concernés
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                      <TrendingUp className="w-4 h-4" />
                      Rapport détaillé
                    </button>
                  </div>
                </div>
              </div>
            )}
            </div>
          </section>
      </div>
    </div>
  );
};

export default DetailLeconPage; 
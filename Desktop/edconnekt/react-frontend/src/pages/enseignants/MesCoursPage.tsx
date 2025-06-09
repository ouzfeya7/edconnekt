import { Plus, BookOpen, MessageSquare, Calendar } from 'lucide-react';
import React from 'react';
import { ActionCard } from '../../components/ui/ActionCard';
import DateCard from '../../components/Header/DateCard';
import ClassNameCard from '../../components/Header/ClassNameCard';
import TrimestreCard from '../../components/Header/TrimestreCard';
import StatsCard from '../../components/Header/StatsCard';
import LessonCard from '../../components/course/LessonCard';
import RemediationCard from '../../components/course/RemediationCard';
import { mockCourses, classStats } from '../../lib/mock-data'; // Importer les données et les stats

const MesCours = () => {
  // Utiliser les leçons du premier cours (Maths) comme exemple pour l'enseignant
  const teacherLessons = mockCourses.find(c => c.id === 'mathematique')?.lessons || [];

  const remediations = [
    { title: "Résoudre une équation du second degré", subject: "Mathématique", time: "15H30 - 16H00", teacher: "Mouhamed Sall" },
    { title: "Résoudre une équation du second degré", subject: "Mathématique", time: "15H30 - 16H00", teacher: "Mouhamed Sall" },
    { title: "Résoudre une équation du second degré", subject: "Mathématique", time: "15H30 - 16H00", teacher: "Mouhamed Sall" },
  ];

  const [currentDate, setCurrentDate] = React.useState(() => {
    const today = new Date();
    return today.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  });
  const [currentClasse, setCurrentClasse] = React.useState("4e B");
  const [currentTrimestre, setCurrentTrimestre] = React.useState("Trimestre 1");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mes cours</h1>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <ActionCard icon={<Plus className="text-orange-500" />} label="Ajouter une fiche" />
        <ActionCard icon={<BookOpen className="text-orange-500" />} label="Gestion des notes" />
        <ActionCard icon={<MessageSquare className="text-orange-500" />} label="Envoyer un message" />
        <ActionCard icon={<Calendar className="text-orange-500" />} label="Ajouter un événement" />
      </div>

      {/* Filters and Stats */}
      <div className="flex gap-4 mb-6 items-stretch">
        <DateCard value={currentDate} onChange={setCurrentDate} />
        <ClassNameCard value={currentClasse} onChange={setCurrentClasse} />
        <TrimestreCard value={currentTrimestre} onChange={setCurrentTrimestre} />
        <div className="flex-grow">
          <StatsCard stats={classStats} />
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {teacherLessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            id={lesson.id}
            title={lesson.lessonTitle}
            subject={lesson.remediation?.subject || "N/A"}
            time={lesson.remediation?.time || "N/A"}
            teacher={lesson.remediation?.teacher || "N/A"}
            presentCount={classStats.present}
            absentCount={classStats.absent}
          />
        ))}
      </div>

      {/* Remediation Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Remédiation</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {remediations.map((remediation, index) => (
            <RemediationCard key={index} {...remediation} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MesCours; 
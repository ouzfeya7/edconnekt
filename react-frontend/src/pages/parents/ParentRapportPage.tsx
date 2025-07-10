import React, { useState } from 'react';
import ReportSummary from '../../components/rapports/ReportSummary';
import SubjectReportCard from '../../components/rapports/SubjectReportCard';
import PerformanceRadar from '../../components/rapports/PerformanceRadar';
import ChildSelectorCard from '../../components/parents/ChildSelectorCard';
import TrimestreCard from '../../components/Header/TrimestreCard';
import { Download } from 'lucide-react';
import { mockParentData } from '../../lib/mock-parent-data';
import { getSubjectsForClass } from '../../lib/notes-data';
import type { TrimesterReport, SubjectReport } from '../../lib/mock-report-data';

// Fonction utilitaire pour transformer les données de l'enfant en rapport trimestriel
const generateChildReport = (child: typeof mockParentData.children[0], trimesterNumber: number): TrimesterReport | null => {
  if (!child || !child.progression?.byEvaluationType?.trimestrielle) {
    return null;
  }

  // Récupérer les données de progression trimestrielle
  const trimesterData = child.progression.byEvaluationType.trimestrielle.find(
    t => t.date === `Trim ${trimesterNumber}`
  );

  if (!trimesterData) {
    return null;
  }

  // Récupérer les matières pour la classe CP1 (pour l'exemple)
  const domains = getSubjectsForClass('cp1');
  const subjects: SubjectReport[] = [];

  domains.forEach(domain => {
    domain.subjects.forEach(subject => {
      const subjectNotes: number[] = [];
      const competencies: { name: string; status: 'acquis' | 'en_cours' | 'a_renforcer' }[] = [];

      subject.competences.forEach(competence => {
        const note = child.notes[competence.id];
        if (typeof note === 'number') {
          subjectNotes.push(note);
          
          // Déterminer le statut de la compétence
          let status: 'acquis' | 'en_cours' | 'a_renforcer' = 'a_renforcer';
          if (note >= 75) status = 'acquis';
          else if (note >= 50) status = 'en_cours';

          competencies.push({
            name: competence.label,
            status: status
          });
        }
      });

      if (subjectNotes.length > 0) {
        const average = Math.round(subjectNotes.reduce((sum, note) => sum + note, 0) / subjectNotes.length);
        
        // Générer un commentaire basé sur la moyenne
        let teacherComment = '';
        if (average >= 90) {
          teacherComment = `Travail exceptionnel en ${subject.name}. ${child.firstName} maîtrise parfaitement toutes les compétences de cette matière.`;
        } else if (average >= 70) {
          teacherComment = `Excellent travail en ${subject.name}. ${child.firstName} maîtrise très bien les compétences de cette matière.`;
        } else if (average >= 50) {
          teacherComment = `Bon niveau en ${subject.name}. ${child.firstName} progresse bien, quelques points à consolider.`;
        } else if (average >= 30) {
          teacherComment = `Niveau correct en ${subject.name}. ${child.firstName} doit continuer ses efforts pour améliorer ses résultats.`;
        } else {
          teacherComment = `Des difficultés en ${subject.name}. ${child.firstName} a besoin d'un soutien supplémentaire dans cette matière.`;
        }

        subjects.push({
          subject: subject.name,
          average: average,
          teacherComment: teacherComment,
          competencies: competencies
        });
      }
    });
  });

  // Calculer la moyenne générale
  const allNotes = Object.values(child.notes).filter(note => typeof note === 'number') as number[];
  const overallAverage = allNotes.length > 0 
    ? Math.round(allNotes.reduce((sum, note) => sum + note, 0) / allNotes.length)
    : 0;

  // Générer un commentaire général
  let generalComment = '';
  if (overallAverage >= 90) {
    generalComment = `${child.firstName} obtient des résultats exceptionnels ce trimestre. Son travail est remarquable et sa maîtrise parfaite. Bravo !`;
  } else if (overallAverage >= 70) {
    generalComment = `${child.firstName} obtient d'excellents résultats ce trimestre. Son travail est remarquable et sa progression constante. Félicitations !`;
  } else if (overallAverage >= 50) {
    generalComment = `${child.firstName} montre de bons résultats ce trimestre. Son investissement porte ses fruits. Continuez ainsi !`;
  } else if (overallAverage >= 30) {
    generalComment = `${child.firstName} fait des efforts ce trimestre. Les résultats sont corrects mais peuvent encore être améliorés avec plus de régularité.`;
  } else {
    generalComment = `${child.firstName} rencontre des difficultés ce trimestre. Un accompagnement personnalisé sera mis en place pour l'aider à progresser.`;
  }

  // Simuler des données de présence basées sur le statut d'assiduité
  const attendance = {
    present: child.attendanceStatus === 'present' ? 58 : child.attendanceStatus === 'late' ? 55 : 50,
    late: child.attendanceStatus === 'late' ? 3 : child.attendanceStatus === 'present' ? 1 : 2,
    absent: child.attendanceStatus === 'absent' ? 5 : child.attendanceStatus === 'late' ? 2 : 1,
  };

  return {
    trimester: trimesterNumber,
    overallAverage: overallAverage,
    generalComment: generalComment,
    attendance: attendance,
    subjects: subjects
  };
};

const ParentRapportPage: React.FC = () => {
  const [selectedChildId, setSelectedChildId] = useState(mockParentData.children[0]?.studentId || '');
  const [selectedTrimester, setSelectedTrimester] = useState("Trimestre 1");
  
  const trimesterNumber = parseInt(selectedTrimester.split(' ')[1]);
  const selectedChild = mockParentData.children.find(c => c.studentId === selectedChildId);
  
  // Générer le rapport dynamique pour l'enfant sélectionné
  const reportData = selectedChild ? generateChildReport(selectedChild, trimesterNumber) : null;

  if (!reportData || !selectedChild) {
    return (
        <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                    {!selectedChild 
                        ? "Veuillez sélectionner un enfant pour voir son rapport."
                        : `Aucun rapport disponible pour ${selectedChild.firstName} ${selectedChild.lastName} au ${selectedTrimester}.`
                    }
                </p>
            </div>
        </div>
    );
  }

  const studentName = `${selectedChild.firstName} ${selectedChild.lastName}`;

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      {/* En-tête avec design moderne */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 p-6 shadow-sm border border-emerald-200/50">
        {/* Motifs décoratifs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Bulletin Trimestriel
            </h1>
            <p className="text-lg text-gray-600">
              Voici le bilan des progrès de {studentName} pour le {selectedTrimester}.
            </p>
          </div>
          
          {/* Bouton de téléchargement dans l'en-tête */}
          <div className="mt-4 md:mt-0 md:ml-6">
            <button className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-emerald-700 border border-emerald-300 font-semibold py-3 px-6 rounded-lg shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 w-full md:w-auto">
              <Download className="w-5 h-5" />
              Télécharger le PDF
            </button>
          </div>
        </div>
        

      </div>
      
      {/* Barre de filtres avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <ChildSelectorCard 
          children={mockParentData.children}
          selectedChildId={selectedChildId}
          onSelectChild={setSelectedChildId}
        />
        <TrimestreCard 
          value={selectedTrimester}
          onChange={setSelectedTrimester}
        />
        
        {/* Carte Moyenne générale */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-1">Moyenne générale</div>
          <div className={`text-2xl font-bold ${
            reportData.overallAverage >= 90 ? 'text-green-700' :
            reportData.overallAverage >= 70 ? 'text-green-500' :
            reportData.overallAverage >= 50 ? 'text-yellow-500' :
            reportData.overallAverage >= 30 ? 'text-orange-500' : 'text-red-600'
          }`}>
            {reportData.overallAverage}%
          </div>
        </div>
        
        {/* Carte Matières évaluées */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-1">Matières évaluées</div>
          <div className="text-2xl font-bold text-gray-900">
            {reportData.subjects.length}
          </div>
        </div>
      </div>

      {/* Synthèse */}
      <ReportSummary report={reportData} />

      {/* Radar de performance */}
      <div className="mb-8">
        <PerformanceRadar report={reportData} />
      </div>

      {/* Rapports par matière */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {reportData.subjects.map(subjectReport => (
          <SubjectReportCard key={subjectReport.subject} report={subjectReport} />
        ))}
      </div>
    </div>
  );
};

export default ParentRapportPage; 
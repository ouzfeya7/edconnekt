import React, { useState } from 'react';
import { Download, Calendar, User, BookOpen, Target, MessageSquare, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable, { Table } from 'jspdf-autotable';
import ChildSelectorCard from '../../components/parents/ChildSelectorCard';
import TrimestreCard from '../../components/Header/TrimestreCard';
import PdiCard from '../../components/Header/PdiCard';
import { mockParentData } from '../../lib/mock-parent-data';
import { mockFacilitators } from '../../lib/mock-data';
import { getPdfTableStyles } from '../../components/GestionDesNotes/pdfStyles';
import schoolLogo from '../../assets/logo-yka-1.png';

interface jsPDFWithAutoTable extends jsPDF {
    lastAutoTable?: Table;
}

const schoolInfo = {
    name: "Yenne Kids' Academy",
    address: "Kel, Rte de Toubab Dialaw, Yenne BP 20000, Dakar, Senegal",
    phone1: "+221 77 701 52 52",
    phone2: "+221 33 871 27 82",
    email: "hello@yennekidsacademy.com",
    website: "www.yennekidsacademy.com",
    academicYear: "2023-2024"
};

const addPdfHeader = (doc: jsPDF, studentName: string, teacherName: string, studentClass: string) => {
    // Logo
    doc.addImage(schoolLogo, 'PNG', 25, 15, 30, 30);

    // School Info
    doc.setFontSize(14);
    doc.setFont("times", 'bold');
    doc.text(schoolInfo.name, 65, 22);
    
    doc.setFontSize(8);
    doc.setFont("times", 'normal');
    doc.text(schoolInfo.address, 65, 28);
    doc.text(`Tél: ${schoolInfo.phone1} / ${schoolInfo.phone2}`, 65, 32);
    doc.text(`Email: ${schoolInfo.email} | Site: ${schoolInfo.website}`, 65, 36);
    doc.text(`Année Scolaire: ${schoolInfo.academicYear}`, 65, 40);

    // Student Info (right-aligned)
    const rightMargin = doc.internal.pageSize.getWidth() - 25;
    doc.setFontSize(10);
    doc.setFont("times", 'bold');
    doc.text(studentName, rightMargin, 28, { align: 'right' });
    
    doc.setFontSize(9);
    doc.setFont("times", 'normal');
    doc.text(`Classe: ${studentClass}`, rightMargin, 36, { align: 'right' });
    doc.text(`Enseignant: ${teacherName}`, rightMargin, 44, { align: 'right' });

    // Main Title
    let currentY = 55;
    doc.setFontSize(16);
    doc.setFont("times", 'bold');
    doc.text("Rapport PDI - Séance", doc.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });
    currentY += 7;

    // Header Line
    doc.setDrawColor(0);
    doc.line(25, currentY, doc.internal.pageSize.getWidth() - 25, currentY);
    
    return currentY + 10;
};

const ParentRapportPage: React.FC = () => {
  const [selectedChildId, setSelectedChildId] = useState(mockParentData.children[0]?.studentId || '');
  const [selectedTrimester, setSelectedTrimester] = useState("Trimestre 1");
  const [selectedWeek, setSelectedWeek] = useState("semaine-4");
  
  const trimesterNumber = parseInt(selectedTrimester.split(' ')[1]);
  const weekNumber = parseInt(selectedWeek.split('-')[1]);
  const selectedChild = mockParentData.children.find(c => c.studentId === selectedChildId);
  
  // Fonction pour calculer la date de session basée sur la semaine PDI
  const getSessionDate = (weekNumber: number) => {
    const startDate = new Date(2024, 8, 2); // 2 Septembre 2024 (référence PdiCard)
    const sessionDate = new Date(startDate);
    sessionDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);
    return sessionDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Fonction pour générer le code PDI basé sur les jours de la semaine (01-04 = lundi à jeudi)
  const getPdiCode = (weekNumber: number) => {
    // Calculer le jour de la semaine (1 = lundi, 2 = mardi, etc.)
    const startDate = new Date(2024, 8, 2); // 2 Septembre 2024
    const weekStartDate = new Date(startDate);
    weekStartDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);
    
    // Obtenir le jour du mois pour le lundi de cette semaine
    const mondayDay = weekStartDate.getDate();
    
    // Générer le code PDI du lundi au jeudi (4 jours)
    const startDay = String(mondayDay).padStart(2, '0');
    const endDay = String(mondayDay + 3).padStart(2, '0'); // +3 pour aller jusqu'à jeudi
    
    return `PDI ${startDay}-${endDay}`;
  };
  
  // Récupérer les données PDI réelles de l'enfant
  const sessionKey = `trim${trimesterNumber}-week${weekNumber}`;
  const pdiSession = selectedChild?.pdiSessions?.[sessionKey];

  if (!pdiSession || !selectedChild) {
    return (
        <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                    {!selectedChild 
              ? "Veuillez sélectionner un enfant pour voir son rapport PDI."
              : `Aucun rapport PDI disponible pour ${selectedChild.firstName} ${selectedChild.lastName} au ${selectedTrimester} - Semaine ${weekNumber}.`
                    }
                </p>
            </div>
        </div>
    );
  }

  // Calculer les statistiques à partir des données réelles
  const acquiredCount = pdiSession.competences.filter(c => c.status === 'acquis').length;
  const nonAcquiredCount = pdiSession.competences.filter(c => c.status === 'a_renforcer').length;
  const averageScore = Math.round(pdiSession.competences.reduce((sum, comp) => sum + comp.currentScore, 0) / pdiSession.competences.length);
  const inProgressCount = pdiSession.competences.filter(c => c.status === 'en_cours').length;

  // Fonctions pour générer les interprétations dynamiques
  const getClassAverageInterpretation = (studentAverage: number, classAverage: number = 73) => {
    if (studentAverage > classAverage + 10) {
      return `${selectedChild.firstName} se situe bien au-dessus de la moyenne de classe`;
    } else if (studentAverage > classAverage) {
      return `${selectedChild.firstName} se situe au-dessus de la moyenne de classe`;
    } else if (studentAverage > classAverage - 10) {
      return `${selectedChild.firstName} se situe proche de la moyenne de classe`;
    } else {
      return `${selectedChild.firstName} se situe en dessous de la moyenne de classe`;
    }
  };

  const getAcquiredCompetencesInterpretation = (acquiredPercentage: number) => {
    if (acquiredPercentage >= 80) {
      return "Excellente acquisition des objectifs actuels";
    } else if (acquiredPercentage >= 60) {
      return "Bonne acquisition des objectifs actuels";
    } else if (acquiredPercentage >= 40) {
      return "Acquisition partielle des objectifs actuels";
    } else {
      return "Acquisition limitée des objectifs actuels";
    }
  };

  const getNonAcquiredCompetencesInterpretation = (nonAcquiredPercentage: number) => {
    if (nonAcquiredPercentage <= 20) {
      return "Quelques points à renforcer";
    } else if (nonAcquiredPercentage <= 40) {
      return "Plusieurs points à renforcer";
    } else if (nonAcquiredPercentage <= 60) {
      return "Nombreux points à renforcer";
    } else {
      return "Beaucoup de points à renforcer";
    }
  };

  const getRemediationInterpretation = (remediationCount: number) => {
    if (remediationCount === 0) {
      return "Aucune remédiation nécessaire";
    } else if (remediationCount === 1) {
      return "1 compétence nécessite une remédiation";
    } else if (remediationCount <= 3) {
      return `${remediationCount} compétences nécessitent une remédiation`;
    } else {
      return `${remediationCount} compétences nécessitent une remédiation urgente`;
    }
  };

  const getQuickSummary = () => {
    const acquiredPercentage = Math.round((acquiredCount / pdiSession.competences.length) * 100);
    
    if (acquiredPercentage >= 80 && nonAcquiredCount === 0) {
      return `${selectedChild.firstName} obtient d'excellents résultats. Toutes les compétences sont maîtrisées.`;
    } else if (acquiredPercentage >= 60 && nonAcquiredCount <= 1) {
      return `${selectedChild.firstName} progresse bien. ${nonAcquiredCount} compétence${nonAcquiredCount > 1 ? 's' : ''} nécessite${nonAcquiredCount > 1 ? 'nt' : ''} une attention particulière.`;
    } else if (acquiredPercentage >= 40) {
      return `${selectedChild.firstName} progresse régulièrement. ${nonAcquiredCount} compétence${nonAcquiredCount > 1 ? 's' : ''} nécessite${nonAcquiredCount > 1 ? 'nt' : ''} une attention particulière cette semaine.`;
    } else {
      return `${selectedChild.firstName} rencontre des difficultés. ${nonAcquiredCount} compétence${nonAcquiredCount > 1 ? 's' : ''} nécessite${nonAcquiredCount > 1 ? 'nt' : ''} une remédiation urgente.`;
    }
  };

  // Fonction pour déterminer la classe de l'enfant basée sur ses notes
  const getStudentClass = (child: typeof selectedChild) => {
    if (!child?.notes) return 'CP1';
    
    // Déterminer la classe basée sur les préfixes des compétences
    const competenceIds = Object.keys(child.notes);
    if (competenceIds.some(id => id.startsWith('cp1-'))) {
      return 'CP1';
    } else if (competenceIds.some(id => id.startsWith('cp2-'))) {
      return 'CP2';
    } else if (competenceIds.some(id => id.startsWith('ce1-'))) {
      return 'CE1';
    } else if (competenceIds.some(id => id.startsWith('ce2-'))) {
      return 'CE2';
    } else if (competenceIds.some(id => id.startsWith('cm2-'))) {
      return 'CM2';
    } else if (competenceIds.some(id => id.startsWith('presk1-'))) {
      return 'PRESK1';
    } else if (competenceIds.some(id => id.startsWith('presk2-'))) {
      return 'PRESK2';
    }
    
    return 'CP1'; // Par défaut
  };

  // Fonction pour déterminer l'enseignant en fonction de la classe
  const getTeacherForClass = (studentClass: string) => {
    // Trouver les facilitateurs qui gèrent cette classe
    const availableTeachers = mockFacilitators.filter(facilitator => 
      facilitator.classes.includes(studentClass)
    );
    
    // Pour CP1, privilégier les facilitateurs français
    if (studentClass === 'CP1') {
      const frenchTeacher = availableTeachers.find(teacher => 
        teacher.role.toLowerCase().includes('français') || 
        teacher.role.toLowerCase().includes('facilitateur français')
      );
      return frenchTeacher || availableTeachers[0] || mockFacilitators[0];
    }
    
    // Pour les autres classes, prendre le premier disponible
    return availableTeachers[0] || mockFacilitators[0];
  };

  const handleDownloadPdf = () => {
    if (!pdiSession || !selectedChild) return;

    try {
      const doc = new jsPDF() as jsPDFWithAutoTable;
      const studentName = `${selectedChild.firstName} ${selectedChild.lastName}`;
      const teacherName = getTeacherForClass(getStudentClass(selectedChild)).name;
      const studentClass = getStudentClass(selectedChild);
      
      let startY = addPdfHeader(doc, studentName, teacherName, studentClass);
      const baseStyles = getPdfTableStyles(doc);

      // Informations de la séance
      doc.setFontSize(12);
      doc.setFont("times", 'bold');
      doc.text("Informations de la séance", 25, startY);
      startY += 10;

      const sessionInfo = [
        ['Code PDI', pdiSession.sessionCode],
        ['Date', pdiSession.sessionDate],
        ['Élève', studentName],
        ['Classe', studentClass],
        ['Enseignant', teacherName]
      ];

      autoTable(doc, {
        ...baseStyles,
        head: [['Informations', 'Détails']],
        body: sessionInfo,
        startY: startY,
        margin: { left: 25, right: 25 },
        styles: { ...baseStyles.styles, fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 60, fontStyle: 'bold' },
          1: { cellWidth: 100 }
        }
      });

      startY = (doc.lastAutoTable?.finalY || startY) + 15;

      // Vue d'ensemble des résultats
      doc.setFontSize(12);
      doc.setFont("times", 'bold');
      doc.text("Vue d'ensemble des résultats", 25, startY);
      startY += 10;

      const overviewData = [
        ['Indicateur', 'Valeur', 'Interprétation'],
        ['Moyenne de classe', '73%', getClassAverageInterpretation(averageScore)],
        ['Compétences acquises', `${Math.round((acquiredCount / pdiSession.competences.length) * 100)}%`, getAcquiredCompetencesInterpretation(Math.round((acquiredCount / pdiSession.competences.length) * 100))],
        ['Compétences non acquises', `${Math.round((nonAcquiredCount / pdiSession.competences.length) * 100)}%`, getNonAcquiredCompetencesInterpretation(Math.round((nonAcquiredCount / pdiSession.competences.length) * 100))],
        ['Compétences à remédier', `${nonAcquiredCount}`, getRemediationInterpretation(nonAcquiredCount)]
      ];

      autoTable(doc, {
        ...baseStyles,
        head: [overviewData[0]],
        body: overviewData.slice(1),
        startY: startY,
        margin: { left: 25, right: 25 },
        styles: { ...baseStyles.styles, fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 50, fontStyle: 'bold' },
          1: { cellWidth: 30, halign: 'center' },
          2: { cellWidth: 80 }
        }
      });

      startY = (doc.lastAutoTable?.finalY || startY) + 15;

      // Détail des compétences
      doc.setFontSize(12);
      doc.setFont("times", 'bold');
      doc.text("Détail des compétences", 25, startY);
      startY += 10;

      const competencesData = pdiSession.competences.map(comp => [
        comp.name,
        `${comp.currentScore}%`,
        `${comp.weeklyEvolution > 0 ? '+' : ''}${comp.weeklyEvolution}%`,
        comp.teacherComment
      ]);

      autoTable(doc, {
        ...baseStyles,
        head: [['Compétence', 'Score actuel', 'Évolution hebdo', 'Commentaire pédagogique']],
        body: competencesData,
        startY: startY,
        margin: { left: 25, right: 25 },
        styles: { ...baseStyles.styles, fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 40, fontStyle: 'bold' },
          1: { cellWidth: 25, halign: 'center' },
          2: { cellWidth: 25, halign: 'center' },
          3: { cellWidth: 80 }
        }
      });

      startY = (doc.lastAutoTable?.finalY || startY) + 15;

      // Plan d'action
      doc.setFontSize(12);
      doc.setFont("times", 'bold');
      doc.text("Plan d'action proposé", 25, startY);
      startY += 10;

      const actionPlanData = [
        ['En classe'],
        ...pdiSession.actionPlan.inClass.map(action => [`• ${action.action} : ${action.description}`]),
        ['À la maison'],
        ...pdiSession.actionPlan.atHome.map(action => [`• ${action.action} : ${action.description}`]),
        ['Suivi', pdiSession.actionPlan.followUp]
      ];

      autoTable(doc, {
        ...baseStyles,
        body: actionPlanData,
        startY: startY,
        margin: { left: 25, right: 25 },
        styles: { ...baseStyles.styles, fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 160 }
        }
      });

      startY = (doc.lastAutoTable?.finalY || startY) + 15;

      // Présence et comportement
      doc.setFontSize(12);
      doc.setFont("times", 'bold');
      doc.text("Présence et comportement", 25, startY);
      startY += 10;

      const attendanceData = [
        ['Total élèves', pdiSession.attendance.total.toString()],
        ['Présents', pdiSession.attendance.present.toString()],
        ['Retards', pdiSession.attendance.late.toString()],
        ['Absents', pdiSession.attendance.absent.toString()],
        ['Observations', pdiSession.attendance.observations]
      ];

      autoTable(doc, {
        ...baseStyles,
        head: [['Statut', 'Nombre']],
        body: attendanceData.slice(0, 4),
        startY: startY,
        margin: { left: 25, right: 25 },
        styles: { ...baseStyles.styles, fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 80, fontStyle: 'bold' },
          1: { cellWidth: 40, halign: 'center' }
        }
      });

      startY = (doc.lastAutoTable?.finalY || startY) + 10;
      doc.setFontSize(9);
      doc.setFont("times", 'normal');
      doc.text(`Observations : ${pdiSession.attendance.observations}`, 25, startY);
      startY += 15;

      // Message aux parents
      doc.setFontSize(12);
      doc.setFont("times", 'bold');
      doc.text("Message et recommandations aux parents", 25, startY);
      startY += 10;

      doc.setFontSize(9);
      doc.setFont("times", 'normal');
      const messageLines = doc.splitTextToSize(pdiSession.parentMessage, 160);
      doc.text(messageLines, 25, startY);
      startY += (messageLines.length * 5) + 15;

      // Note de confidentialité avec meilleur positionnement
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      
      // Ligne de séparation
      doc.setDrawColor(200);
      doc.line(25, pageHeight - 40, pageWidth - 25, pageHeight - 40);
      
      // Note de confidentialité
      doc.setFontSize(8);
      doc.setFont("times", 'italic');
      doc.setTextColor(100, 100, 100);
      doc.text("Note de confidentialité : Ce rapport est strictement réservé aux parents ou responsables légaux de l'élève. Toute diffusion non autorisée est interdite.", pageWidth / 2, pageHeight - 30, { align: 'center' });
      
      // Reset de la couleur
      doc.setTextColor(0, 0, 0);

      doc.save(`Rapport_PDI_${studentName.replace(/\s+/g, '_')}_${pdiSession.sessionCode}.pdf`);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      {/* En-tête de la page */}
      <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm border border-blue-200/50 p-6">
        {/* Motifs décoratifs */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/15 rounded-full -translate-y-14 translate-x-14"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-indigo-500/15 rounded-full translate-y-10 -translate-x-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/5 rounded-full"></div>
        
        <div className="relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Rapport PDI - Séance</h1>
              <p className="text-slate-600">Consultez les progrès de votre enfant lors des séances PDI</p>
          </div>
            <button onClick={handleDownloadPdf} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              <Download className="w-4 h-4" />
              Télécharger PDF
            </button>
          </div>
        </div>
      </div>
      
      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <ChildSelectorCard 
          children={mockParentData.children}
          selectedChildId={selectedChildId}
          onSelectChild={setSelectedChildId}
        />
        <TrimestreCard 
          value={selectedTrimester}
          onChange={setSelectedTrimester}
        />
        <PdiCard 
          value={selectedWeek}
          onChange={setSelectedWeek}
        />
      </div>

      {/* Informations de la séance PDI */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Informations de la séance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm font-medium text-blue-800">Code PDI</div>
              <div className="text-lg font-bold text-blue-900">{getPdiCode(weekNumber)}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Calendar className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-sm font-medium text-green-800">Date</div>
              <div className="text-lg font-bold text-green-900">{getSessionDate(weekNumber)}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <User className="w-5 h-5 text-purple-600" />
            <div>
              <div className="text-sm font-medium text-purple-800">Élève</div>
              <div className="text-lg font-bold text-purple-900">{selectedChild.firstName} {selectedChild.lastName}</div>
              <div className="text-sm text-purple-700">{getStudentClass(selectedChild)}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
            <Target className="w-5 h-5 text-orange-600" />
            <div>
              <div className="text-sm font-medium text-orange-800">Enseignant</div>
              <div className="text-lg font-bold text-orange-900">{getTeacherForClass(getStudentClass(selectedChild)).name}</div>
              <div className="text-sm text-orange-700">{getTeacherForClass(getStudentClass(selectedChild)).role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Vue d'ensemble des résultats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Vue d'ensemble des résultats</h2>
        
        {/* Tableau des indicateurs selon le cahier des charges */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Indicateur</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Valeur</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Interprétation</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-800">Moyenne de classe</td>
                <td className="text-center py-3 px-4">
                  <span className="text-2xl font-bold text-blue-600">73%</span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {getClassAverageInterpretation(averageScore)}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-800">Compétences acquises</td>
                <td className="text-center py-3 px-4">
                  <span className="text-2xl font-bold text-green-600">
                    {Math.round((acquiredCount / pdiSession.competences.length) * 100)}%
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {getAcquiredCompetencesInterpretation(Math.round((acquiredCount / pdiSession.competences.length) * 100))}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-800">Compétences non acquises</td>
                <td className="text-center py-3 px-4">
                  <span className="text-2xl font-bold text-yellow-600">
                    {Math.round((nonAcquiredCount / pdiSession.competences.length) * 100)}%
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {getNonAcquiredCompetencesInterpretation(Math.round((nonAcquiredCount / pdiSession.competences.length) * 100))}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-800">Compétences à remédier</td>
                <td className="text-center py-3 px-4">
                  <span className="text-2xl font-bold text-red-600">{nonAcquiredCount}</span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {getRemediationInterpretation(nonAcquiredCount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Indicateurs visuels supplémentaires */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Points forts</span>
            </div>
            <div className="text-sm text-green-700">
              {acquiredCount} compétence{acquiredCount > 1 ? 's' : ''} maîtrisée{acquiredCount > 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">En progression</span>
            </div>
            <div className="text-sm text-yellow-700">
              {inProgressCount} compétence{inProgressCount > 1 ? 's' : ''} en cours
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-red-800">À renforcer</span>
            </div>
            <div className="text-sm text-red-700">
              {nonAcquiredCount} compétence{nonAcquiredCount > 1 ? 's' : ''} nécessitant remédiation
            </div>
          </div>
        </div>
      </div>

      {/* Synthèse PDI */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          Synthèse de la séance PDI
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Résumé de la séance */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-3">Résumé de la séance</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex justify-between">
                <span>Compétences évaluées :</span>
                <span className="font-medium">{pdiSession.competences.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Compétences acquises :</span>
                <span className="font-medium text-green-600">{acquiredCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Compétences en cours :</span>
                <span className="font-medium text-yellow-600">{inProgressCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Compétences à renforcer :</span>
                <span className="font-medium text-red-600">{nonAcquiredCount}</span>
              </div>
            </div>
          </div>

          {/* Points d'attention */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-3">Points d'attention</h3>
            <div className="space-y-2 text-sm text-yellow-700">
              {pdiSession.competences
                .filter(comp => comp.status === 'a_renforcer')
                .map((comp, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span>{comp.name} : {comp.currentScore}%</span>
                  </div>
                ))}
              {pdiSession.competences.filter(comp => comp.status === 'a_renforcer').length === 0 && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Aucun point critique identifié</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Commentaire pédagogique global */}
        <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">Commentaire pédagogique</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {getQuickSummary()}
          </p>
        </div>
      </div>

      {/* Détail des compétences */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Détail des compétences</h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {pdiSession.competences.map((competence, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{competence.name}</h3>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${
                    competence.currentScore >= 75 ? 'text-green-600' :
                    competence.currentScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {competence.currentScore}%
                  </span>
                  <span className={`text-sm font-medium ${
                    competence.weeklyEvolution > 0 ? 'text-green-600' :
                    competence.weeklyEvolution < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {competence.weeklyEvolution > 0 ? '+' : ''}{competence.weeklyEvolution}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                {competence.status === 'acquis' && <CheckCircle className="w-4 h-4 text-green-600" />}
                {competence.status === 'en_cours' && <Clock className="w-4 h-4 text-yellow-600" />}
                {competence.status === 'a_renforcer' && <AlertCircle className="w-4 h-4 text-red-600" />}
                <span className={`text-sm font-medium ${
                  competence.status === 'acquis' ? 'text-green-700' :
                  competence.status === 'en_cours' ? 'text-yellow-700' : 'text-red-700'
                }`}>
                  {competence.status === 'acquis' ? 'Acquis' :
                   competence.status === 'en_cours' ? 'En cours' : 'À renforcer'}
                </span>
              </div>
              <p className="text-sm text-gray-600">{competence.teacherComment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Plan d'action */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Plan d'action proposé</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              En classe
            </h3>
            <div className="space-y-3">
              {pdiSession.actionPlan.inClass.map((action, index) => (
                <div key={index} className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="font-medium text-blue-800">{action.action}</div>
                  <div className="text-sm text-blue-600">{action.description}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-green-600" />
              À la maison
            </h3>
            <div className="space-y-3">
              {pdiSession.actionPlan.atHome.map((action, index) => (
                <div key={index} className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="font-medium text-green-800">{action.action}</div>
                  <div className="text-sm text-green-600">{action.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="font-medium text-yellow-800 mb-1">Suivi</div>
          <div className="text-sm text-yellow-700">{pdiSession.actionPlan.followUp}</div>
        </div>
      </div>

      {/* Présence et comportement */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Présence et comportement</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{pdiSession.attendance.total}</div>
            <div className="text-sm text-gray-600">Total élèves</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{pdiSession.attendance.present}</div>
            <div className="text-sm text-gray-600">Présents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{pdiSession.attendance.late}</div>
            <div className="text-sm text-gray-600">Retards</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{pdiSession.attendance.absent}</div>
            <div className="text-sm text-gray-600">Absents</div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="font-medium text-gray-800 mb-1">Observations</div>
          <div className="text-sm text-gray-600">{pdiSession.attendance.observations}</div>
        </div>
      </div>

      {/* Message aux parents */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          Message et recommandations
        </h2>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="whitespace-pre-line text-gray-700">{pdiSession.parentMessage}</div>
        </div>
      </div>

      {/* Note de confidentialité */}
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600">
          <strong>Note de confidentialité :</strong> Ce rapport est strictement réservé aux parents ou responsables légaux de l'élève. 
          Toute diffusion non autorisée est interdite.
        </p>
      </div>
    </div>
  );
};

export default ParentRapportPage; 
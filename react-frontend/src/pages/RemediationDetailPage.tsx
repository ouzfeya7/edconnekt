import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockRemediations, RemediationStudent } from '../lib/mock-data';
import { 
  ArrowLeft, User, Calendar, BookOpen, CheckCircle, Clock, Loader, 
  Target, MapPin, Users, FileText, Download, Send, BarChart3, 
  TrendingUp, AlertCircle, History, Settings, Bell, PlusCircle, 
  MessageSquare, ChevronDown, ChevronRight, MessageCircle,
  BookOpenCheck, Languages, Sigma, Palette, Music, Bike, Theater, 
  Move, Globe, ScrollText, BookMarked, Home, HeartPulse, Eye, HardDrive, FileIcon
} from 'lucide-react';
import RemediationResourceAssociationModal from '../components/course/RemediationResourceAssociationModal';
import RemediationResourceCard from '../components/course/RemediationResourceCard';
import jsPDF from 'jspdf';
import autoTable, { Table, UserOptions } from 'jspdf-autotable';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { ActionCard } from '../components/ui/ActionCard';
import { useFilters } from '../contexts/FilterContext';
import { useAuthContext } from '../pages/authentification/AuthContext';
import { useAvailableResources } from '../hooks/useAvailableResources';

import schoolLogo from '../assets/logo-yka-1.png';

// Couleurs pour les badges de matière (copiées de RessourcesPage)
const subjectBadgeColors: { [key: string]: string } = {
  // CRÉATIVITÉ & SPORT - Teintes bleu-violet
  "Arts plastiques": "bg-indigo-400 text-white",
  EPS: "bg-sky-400 text-white",
  Motricité: "bg-cyan-400 text-white",
  Musique: "bg-violet-400 text-white",
  "Théâtre/Drama": "bg-purple-400 text-white",

  // LANGUES ET COMMUNICATION - Teintes vert
  Anglais: "bg-emerald-400 text-white",
  Français: "bg-green-400 text-white",

  // STEM - Teintes orange-rouge
  Mathématiques: "bg-amber-400 text-white",

  // SCIENCES HUMAINES - Teintes rose-brun
  "Études islamiques": "bg-teal-400 text-white",
  Géographie: "bg-blue-400 text-white",
  Histoire: "bg-slate-400 text-white",
  "Lecture arabe": "bg-lime-400 text-white",
  Qran: "bg-rose-400 text-white",
  "Vivre dans son milieu": "bg-stone-400 text-white",
  "Vivre ensemble": "bg-orange-400 text-white",
  Wellness: "bg-pink-400 text-white",
};

// Fonction pour obtenir l'icône par matière (simplifiée)
const getIconForSubject = (subject: string) => {
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    Français: BookOpenCheck,
    Anglais: Languages,
    Mathématiques: Sigma,
    "Arts plastiques": Palette,
    Musique: Music,
    EPS: Bike,
    "Théâtre/Drama": Theater,
    Motricité: Move,
    Géographie: Globe,
    Histoire: ScrollText,
    "Études islamiques": BookMarked,
    Qran: BookMarked,
    "Lecture arabe": BookMarked,
    "Vivre ensemble": Home,
    "Vivre dans son milieu": Home,
    Wellness: HeartPulse,
  };
  return iconMap[subject] || FileText;
};

interface RemediationResource {
  id: string;
  remediationId: string;
  resourceId: number;
  title: string;
  description: string;
  subject: string;
  imageUrl: string;
  fileType: string;
  fileSize: number;
  visibility: string;
  addedBy: string;
  addedAt: string;
  isActive: boolean;
  isPaid?: boolean;
}

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

const addPdfHeader = (doc: jsPDF, classe: string, title: string) => {
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

  // Title
  doc.setFontSize(16);
  doc.setFont("times", 'bold');
  doc.text(title, doc.internal.pageSize.getWidth() / 2, 55, { align: 'center' });
  
  // Class Subtitle
  doc.setFontSize(12);
  doc.setFont("times", 'normal');
  doc.text(`Classe: ${classe.toUpperCase()}`, doc.internal.pageSize.getWidth() / 2, 62, { align: 'center' });

  // Header Line
  doc.setDrawColor(0);
  doc.line(25, 70, doc.internal.pageSize.getWidth() - 25, 70);
  
  return 80; // Return the start Y position for the content
};

const getPdfTableStyles = (): Partial<UserOptions> => ({
  theme: 'grid' as const,
  headStyles: {
    fillColor: [230, 230, 230] as [number, number, number],
    textColor: [0, 0, 0] as [number, number, number],
    fontStyle: 'bold' as const,
    lineColor: [0, 0, 0] as [number, number, number],
    lineWidth: 0.1,
  },
  styles: {
    lineColor: [0, 0, 0] as [number, number, number],
    lineWidth: 0.1,
  },
});





const RemediationDetailPage = () => {
  const { t } = useTranslation();
  const { currentClasse } = useFilters();
  const { roles } = useAuthContext();
  const { remediationId } = useParams<{ remediationId: string }>();
  const navigate = useNavigate();
  const remediation = mockRemediations.find(r => r.id === remediationId);
  const { getResourcesBySubject } = useAvailableResources();
  
  // Détecter si c'est une vue parent
  const isParentView = roles.includes('parent');

  const [students, setStudents] = useState<RemediationStudent[]>(remediation?.students || []);
  const [activeTab, setActiveTab] = useState<'overview' | 'method' | 'resources' | 'history' | 'pdi'>('overview');
  const [showParentReport, setShowParentReport] = useState(false);
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [remediationResources, setRemediationResources] = useState<RemediationResource[]>([]);
  const [isParentMethodModalOpen, setIsParentMethodModalOpen] = useState(false);
  const [parentMethods, setParentMethods] = useState<Array<{
    id: string;
    name: string;
    type: 'individuel' | 'groupe' | 'mixte';
    duration: number;
    description: string;
    addedBy: string;
    addedAt: string;
  }>>([]);

  // Charger les ressources de la remédiation au démarrage
  React.useEffect(() => {
    const loadRemediationResources = () => {
      if (remediation && remediation.subject) {
        // Récupérer les vraies ressources de la page des ressources pour cette matière
        const availableResources = getResourcesBySubject(remediation.subject);
        
        // Convertir les ressources disponibles au format RemediationResource
        const convertedResources: RemediationResource[] = availableResources.slice(0, 3).map((resource, index) => ({
          id: `remediation-${remediationId}-${index}`,
          remediationId: remediationId || '',
          resourceId: parseInt(resource.id),
          title: resource.title,
          description: resource.description,
          subject: resource.subject,
          imageUrl: resource.imageUrl,
          fileType: resource.fileType || 'PDF',
          fileSize: resource.fileSize || 1024 * 1024,
          visibility: resource.visibility || 'CLASS',
          addedBy: 'Enseignant',
          addedAt: remediation.date,
          isActive: true,
          isPaid: resource.isPaid
        }));
        
        setRemediationResources(convertedResources);
      }
    };

    loadRemediationResources();
  }, [remediation, remediationId]);

  if (!remediation) {
    return (
      <div className="bg-white min-h-screen p-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Session de remédiation introuvable</h2>
          <Link to="/mes-cours" className="text-orange-600 hover:text-orange-700 font-medium">
            Retour à la liste des cours
          </Link>
        </div>
      </div>
    );
  }

  const handleStatusChange = (studentId: string, newStatus: 'present' | 'absent' | 'late') => {
    setStudents(currentStudents =>
      currentStudents.map(student =>
        student.id === studentId ? { ...student, status: newStatus } : student
      )
    );
  };

  const handleGradeChange = (studentId: string, rawValue: string) => {
    const trimmedValue = rawValue.trim();
    setEditingCell(null); // Toujours quitter le mode d'édition

    if (trimmedValue === '') {
      // Si le champ est vide, la note est considérée comme non renseignée
      setStudents(currentStudents =>
        currentStudents.map(student =>
          student.id === studentId
            ? { ...student, remediationGrade: null, competenceAcquired: false }
            : student
        )
      );
      return;
    }

    const newGrade = parseInt(trimmedValue, 10);

    if (isNaN(newGrade)) {
      // Si la valeur n'est pas un nombre, ne rien changer
      return;
    }

    // C'est un nombre valide, on le limite entre 0 et 100
    const finalGrade = Math.max(0, Math.min(100, newGrade));

    setStudents(currentStudents =>
      currentStudents.map(student => {
        if (student.id === studentId) {
          return {
            ...student,
            remediationGrade: finalGrade,
            competenceAcquired: finalGrade >= 70,
          };
        }
        return student;
      })
    );
  };





  // Gérer l'association d'une ressource
  const handleResourceAssociated = (resource: RemediationResource) => {
    // Déterminer qui ajoute la ressource basé sur le rôle de l'utilisateur
    const isParent = roles.includes('parent');
    const updatedResource = {
      ...resource,
      addedBy: isParent ? 'Parent' : 'Enseignant'
    };
    
    setRemediationResources(prev => [...prev, updatedResource]);
  };

  const handleParentMethodShared = (method: {
    name: string;
    type: 'individuel' | 'groupe' | 'mixte';
    duration: number;
    description: string;
  }) => {
    const newMethod = {
      id: Date.now().toString(),
      ...method,
      addedBy: 'Parent',
      addedAt: new Date().toISOString()
    };
    
    setParentMethods(prev => [...prev, newMethod]);
    setIsParentMethodModalOpen(false);
  };

  // Gérer le clic sur une ressource
  const handleResourceClick = (resource: RemediationResource) => {
    if (resource.isPaid) {
      navigate(`/paiement/${resource.resourceId}`);
      return;
    }
    navigate(`/ressources/${resource.resourceId}`);
  };

  const handleExportReport = () => {
    if (!remediation) return;

    try {
      const doc = new jsPDF() as jsPDFWithAutoTable;
      const title = `Rapport de Remédiation - ${remediation.subject}`;
      let startY = addPdfHeader(doc, currentClasse, title);
      const baseStyles = getPdfTableStyles();

      // Section 1: Informations générales
      doc.setFontSize(14);
      doc.setFont("times", 'bold');
      doc.text('INFORMATIONS GÉNÉRALES', 25, startY);
      startY += 10;

      const generalInfo = [
        ['Session', remediation.title],
        ['Date', dayjs(remediation.date).format('DD/MM/YYYY')],
        ['Matière', remediation.subject],
        ['Enseignant', remediation.teacher],
        ['Durée', `${remediation.duration} minutes`],
        ['Lieu', remediation.location],
        ['Objectif', remediation.objective],
        ['Compétence visée', remediation.skillToAcquire]
      ];

      autoTable(doc, {
        ...baseStyles,
        body: generalInfo,
        startY: startY,
        margin: { left: 25, right: 25 },
        columnStyles: {
          0: { cellWidth: 50, fontStyle: 'bold' },
          1: { cellWidth: 120 }
        }
      });

      startY = (doc.lastAutoTable?.finalY || startY) + 15;

      // Section 2: Résultats des élèves
      doc.setFontSize(14);
      doc.setFont("times", 'bold');
      doc.text('RÉSULTATS DES ÉLÈVES', 25, startY);
      startY += 7;

      const studentHeaders = ['Nom', 'Présence', 'Note initiale', 'Note remédiation', 'Progression', 'Compétence'];
      const studentRows = students.map(student => [
        student.name,
        student.status === 'present' ? 'Présent' : student.status === 'absent' ? 'Absent' : 'Retard',
        student.initialGrade?.toString() || '-',
        student.remediationGrade?.toString() || '-',
        student.initialGrade && student.remediationGrade ? 
          ((student.remediationGrade > student.initialGrade ? '+' : '') + (student.remediationGrade - student.initialGrade).toString()) : '-',
        student.competenceAcquired ? 'Acquise' : 'Non acquise'
      ]);

             autoTable(doc, {
         ...baseStyles,
         head: [studentHeaders],
         body: studentRows,
         startY: startY,
         margin: { left: 25, right: 25 },
         styles: { 
           lineColor: [0, 0, 0] as [number, number, number],
           lineWidth: 0.1,
           fontSize: 9, 
           cellPadding: 3 
         },
         columnStyles: {
           0: { cellWidth: 35 }, // Nom
           1: { cellWidth: 25 }, // Présence
           2: { cellWidth: 25 }, // Note initiale
           3: { cellWidth: 30 }, // Note remédiation
           4: { cellWidth: 25 }, // Progression
           5: { cellWidth: 30 }  // Compétence
         }
       });

      startY = (doc.lastAutoTable?.finalY || startY) + 15;

      // Section 3: Statistiques globales
      doc.setFontSize(14);
      doc.setFont("times", 'bold');
      doc.text('STATISTIQUES GLOBALES', 25, startY);
      startY += 7;

      const stats = [
        ['Élèves présents', `${studentsPresent}/${remediation.studentCount} (${Math.round((studentsPresent / remediation.studentCount) * 100)}%)`],
        ['Compétences acquises', `${competencesAcquired} élèves (${Math.round((competencesAcquired / studentsPresent) * 100)}%)`],
        ['Amélioration moyenne', `+${Math.round(averageImprovement)} points`],
        ['Score Moyen Session', `${remediation.pdiIntegration.competenceTracking.current}%`]
      ];

      autoTable(doc, {
        ...baseStyles,
        body: stats,
        startY: startY,
        margin: { left: 25, right: 25 },
        columnStyles: {
          0: { cellWidth: 60, fontStyle: 'bold' },
          1: { cellWidth: 110 }
        }
      });

      startY = (doc.lastAutoTable?.finalY || startY) + 15;

      // Section 4: Suivi PDI
      doc.setFontSize(14);
      doc.setFont("times", 'bold');
      doc.text('SUIVI PDI', 25, startY);
      startY += 7;

      const pdiData = [
        ['Niveau initial', `${remediation.pdiIntegration.competenceTracking.initial}%`, 'Point de départ'],
        ['Niveau actuel', `${remediation.pdiIntegration.competenceTracking.current}%`, 'Après remédiation'],
        ['Objectif visé', `${remediation.pdiIntegration.competenceTracking.target}%`, 'Cible à atteindre']
      ];

      autoTable(doc, {
        ...baseStyles,
        head: [['Indicateur', 'Valeur', 'Description']],
        body: pdiData,
        startY: startY,
        margin: { left: 25, right: 25 }
      });

      startY = (doc.lastAutoTable?.finalY || startY) + 15;

      // Section 5: Alertes (si existantes)
      if (remediation.pdiIntegration.alertsGenerated.length > 0) {
        doc.setFontSize(14);
        doc.setFont("times", 'bold');
        doc.text('ALERTES GÉNÉRÉES', 25, startY);
        startY += 7;

        const alertData = remediation.pdiIntegration.alertsGenerated.map(alert => [alert]);

        autoTable(doc, {
          ...baseStyles,
          body: alertData,
          startY: startY,
          margin: { left: 25, right: 25 }
        });

        startY = (doc.lastAutoTable?.finalY || startY) + 10;
      }

      // Pied de page
      doc.setFontSize(10);
      doc.setFont("times", 'normal');
      doc.text(`Rapport généré le ${dayjs().format('DD/MM/YYYY à HH:mm')}`, 25, doc.internal.pageSize.height - 20);
      doc.text('EdConnekt - Système de remédiation', doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 20, { align: 'right' });

      doc.save(`Rapport_Remediation_${remediation.title.replace(/\s+/g, '_')}_${dayjs(remediation.date).format('YYYY-MM-DD')}.pdf`);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF :", error);
      alert("Une erreur est survenue lors de la création du PDF. Veuillez consulter la console pour plus de détails.");
    }
  };



  // Calculs des statistiques
  const studentsPresent = students.filter(s => s.status !== 'absent').length;
  const competencesAcquired = students.filter(s => s.competenceAcquired).length;
  const averageImprovement = students
    .filter(s => s.remediationGrade && s.initialGrade)
    .reduce((acc, s) => acc + (s.remediationGrade! - s.initialGrade!), 0) / 
    students.filter(s => s.remediationGrade && s.initialGrade).length || 0;
    
  // Calcul du Score Moyen des élèves présents
  const averagePdiProgression = students
    .filter(s => s.status === 'present' && s.remediationGrade)
    .reduce((acc, s) => acc + s.remediationGrade!, 0) /
    (students.filter(s => s.status === 'present' && s.remediationGrade).length || 1);

  // Fonction pour rendre l'onglet Méthode (vue parentale)
  const renderMethodTab = () => {
    // Trouver l'enfant du parent dans cette remédiation (simulation)
    const selectedStudent = students[0]; // Pour l'exemple, on prend le premier élève
    
    // Déterminer le type d'intervention
    const requiresIntervention = selectedStudent?.parentNotified || 
      remediation.pdiIntegration.alertsGenerated.some(alert => 
        alert.toLowerCase().includes('intervention') || 
        alert.toLowerCase().includes('parent')
      );
    
    return (
      <div className="space-y-8">
        {/* Section Méthode de l'enseignant */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl font-bold text-slate-800">Méthode utilisée par l'enseignant</h3>
            </div>
          </div>
          
          {remediation.method ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm font-medium text-blue-700 mb-1">Nom de la méthode</p>
                  <p className="text-slate-800 font-semibold">{remediation.method.name}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm font-medium text-green-700 mb-1">Type d'approche</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    remediation.method.type === 'individuel' ? 'bg-blue-100 text-blue-800' :
                    remediation.method.type === 'groupe' ? 'bg-green-100 text-green-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {remediation.method.type}
                  </span>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <p className="text-sm font-medium text-orange-700 mb-1">Durée recommandée</p>
                  <p className="text-slate-800 font-semibold">{remediation.method.duration} minutes</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
                <p className="text-sm font-medium text-slate-700 mb-2">Description de la méthode</p>
                <p className="text-slate-700 leading-relaxed">{remediation.method.description}</p>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-yellow-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-yellow-800 mb-1">Information pour les parents</p>
                    <p className="text-sm text-yellow-700">
                      Cette méthode a été choisie par l'enseignant pour répondre aux besoins spécifiques de votre enfant. 
                      Vous pouvez utiliser ces informations pour mieux comprendre l'approche pédagogique utilisée.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-slate-600">Aucune méthode spécifique documentée par l'enseignant</p>
            </div>
          )}
        </div>

        {/* Section Méthodes du parent */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-slate-800">Mes méthodes utilisées</h3>
            </div>
            {requiresIntervention && (
              <button 
                onClick={() => setIsParentMethodModalOpen(true)}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                <Settings className="w-4 h-4" />
                <span>Partager ma méthode</span>
              </button>
            )}
          </div>
          
          {parentMethods.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 mb-4">
                Voici les méthodes que vous avez utilisées pour aider votre enfant.
              </p>
              {parentMethods.map((method) => (
                <div key={method.id} className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <p className="text-sm font-medium text-purple-700 mb-1">Nom de la méthode</p>
                      <p className="text-slate-800 font-semibold">{method.name}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <p className="text-sm font-medium text-purple-700 mb-1">Type d'approche</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        method.type === 'individuel' ? 'bg-blue-100 text-blue-800' :
                        method.type === 'groupe' ? 'bg-green-100 text-green-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {method.type}
                      </span>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <p className="text-sm font-medium text-purple-700 mb-1">Durée utilisée</p>
                      <p className="text-slate-800 font-semibold">{method.duration} minutes</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                    <p className="text-sm font-medium text-purple-700 mb-2">Description de votre méthode</p>
                    <p className="text-slate-700 leading-relaxed">{method.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-slate-600 mb-3">Aucune méthode documentée par vous</p>
              <p className="text-sm text-slate-500">
                {requiresIntervention 
                  ? "Vous pouvez partager les méthodes que vous avez utilisées pour aider votre enfant."
                  : "Vous n'avez pas encore documenté de méthodes pour cette remédiation."
                }
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Composant pour afficher une ressource dans le même format que RessourcesPage
  const ResourceCard = ({ resource, addedBy }: { resource: RemediationResource; addedBy: 'Enseignant' | 'Parent' }) => {
    const Icon = getIconForSubject(resource.subject);
    const badgeColor = subjectBadgeColors[resource.subject] || "bg-gray-600 text-white";
    
    // Fonction pour formater la taille des fichiers
    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const handleCardClick = () => {
      handleResourceClick(resource);
    };

    return (
      <div
        className={`group bg-white rounded-xl shadow-sm border transition-all duration-200 overflow-hidden cursor-pointer ${
          resource.isPaid
            ? "border-yellow-300 hover:border-yellow-400 hover:shadow-lg"
            : "border-gray-200 hover:border-gray-300 hover:shadow-lg"
        }`}
        onClick={handleCardClick}
        tabIndex={0}
        role="button"
        aria-label={`Voir la ressource ${resource.title}`}
      >
        <div className="flex h-32">
          {/* Image/Thumbnail à gauche */}
          <div className="w-32 h-32 flex-shrink-0 bg-white border-r border-gray-200 relative">
            {resource.imageUrl ? (
              <img
                src={resource.imageUrl}
                alt={resource.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-100">
                <Icon className="w-12 h-12 text-gray-400" />
              </div>
            )}
            {/* Indicateur de ressource payante */}
            {resource.isPaid && (
              <div className="absolute bottom-2 right-2">
                <div className="w-4 h-4 bg-yellow-400 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                  <span className="text-xs font-bold text-white">F CFA</span>
                </div>
              </div>
            )}
          </div>

          {/* Contenu principal à droite */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            {/* En-tête avec titre et badges */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
                    {resource.title}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold shadow-sm ${badgeColor}`}>
                    {resource.subject}
                  </span>
                </div>
                {resource.isPaid && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-400 text-white text-xs font-bold">
                    Payant
                  </span>
                )}
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                  addedBy === 'Enseignant' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {addedBy}
                </span>
              </div>
            </div>

            {/* Description */}
            {resource.description && (
              <div className="text-sm text-gray-600 line-clamp-2 mb-3">
                {resource.description}
              </div>
            )}

            {/* Métadonnées et actions */}
            <div className="flex items-center justify-between">
              {/* Métadonnées de base */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(resource.addedAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Métadonnées techniques */}
                <div className="flex items-center gap-1">
                                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">
                  <FileIcon className="w-3 h-3" />
                  {resource.fileType || "PDF"}
                </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">
                    <HardDrive className="w-3 h-3" />
                    {formatFileSize(resource.fileSize)}
                  </span>
                </div>

                {/* Bouton d'action */}
                <div className="flex items-center gap-1">
                  <button
                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 ${
                      addedBy === 'Enseignant' 
                        ? 'text-orange-700 bg-orange-50 hover:bg-orange-100' 
                        : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResourceClick(resource);
                    }}
                    title="Consulter la ressource"
                  >
                    <Eye className="w-3 h-3" />
                    Consulter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Fonction pour rendre l'onglet Ressources (vue parentale)
  const renderResourcesTab = () => {
    // Trouver l'enfant du parent dans cette remédiation (simulation)
    const selectedStudent = students[0]; // Pour l'exemple, on prend le premier élève
    
    // Déterminer le type d'intervention
    const requiresIntervention = selectedStudent?.parentNotified || 
      remediation.pdiIntegration.alertsGenerated.some(alert => 
        alert.toLowerCase().includes('intervention') || 
        alert.toLowerCase().includes('parent')
      );
    
    // Séparer les ressources par type d'utilisateur
    const teacherResources = remediationResources.filter(resource => 
      resource.addedBy.toLowerCase().includes('enseignant') || 
      resource.addedBy.toLowerCase().includes('teacher')
    );
    
    const parentResources = remediationResources.filter(resource => 
      resource.addedBy.toLowerCase().includes('parent') || 
      resource.addedBy.toLowerCase().includes('famille')
    );
    
    return (
      <div className="space-y-8">
        {/* Section Ressources de l'enseignant */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl font-bold text-slate-800">Ressources utilisées par l'enseignant</h3>
            </div>
          </div>
          
          {teacherResources.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 mb-4">
                Voici les ressources pédagogiques que l'enseignant a utilisées pour cette remédiation.
              </p>
              {teacherResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} addedBy="Enseignant" />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-slate-600 mb-3">Aucune ressource documentée par l'enseignant</p>
              <p className="text-sm text-slate-500">
                L'enseignant n'a pas encore associé de ressources à cette remédiation.
              </p>
            </div>
          )}
        </div>

        {/* Section Ressources du parent */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-slate-800">Mes ressources utilisées</h3>
            </div>
            {requiresIntervention && (
              <button 
                onClick={() => setIsResourceModalOpen(true)}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                <FileText className="w-4 h-4" />
                <span>Associer ressource</span>
              </button>
            )}
          </div>
          
          {parentResources.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 mb-4">
                Voici les ressources que vous avez utilisées pour aider votre enfant.
              </p>
              {parentResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} addedBy="Parent" />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-slate-600 mb-3">Aucune ressource documentée par vous</p>
              <p className="text-sm text-slate-500">
                {requiresIntervention 
                  ? "Vous pouvez associer des ressources que vous avez utilisées pour aider votre enfant."
                  : "Vous n'avez pas encore documenté de ressources pour cette remédiation."
                }
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Fonction pour rendre l'onglet Historique (vue parentale)
  const renderHistoryTab = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <History className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-bold text-slate-800">Historique des remédiations</h3>
          </div>
          
          {remediation.history && remediation.history.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 mb-4">
                Voici l'historique des sessions de remédiation précédentes sur le même thème.
              </p>
              {remediation.history.map((historyItem) => (
                <div key={historyItem.sessionId} className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-800">
                        Session du {dayjs(historyItem.date).format('DD/MM/YYYY')}
                      </h4>
                      <p className="text-sm text-slate-600">{historyItem.method.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{historyItem.results.studentsImproved}</div>
                      <div className="text-xs text-slate-500">Élèves améliorés</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">+{historyItem.results.averageImprovement}</div>
                      <div className="text-xs text-slate-500">Amélioration moyenne</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-700">{historyItem.results.competencesAcquired}</div>
                      <div className="text-xs text-slate-500">Compétences acquises</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{historyItem.resources.length}</div>
                      <div className="text-xs text-slate-500">Ressources utilisées</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <History className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-slate-600">Aucun historique de remédiation disponible</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Fonction pour rendre la vue parentale
  const renderParentView = () => {
    // Trouver l'enfant du parent dans cette remédiation (simulation)
    const selectedStudent = students[0]; // Pour l'exemple, on prend le premier élève
    
    // Déterminer le type d'intervention
    const requiresIntervention = selectedStudent?.parentNotified || 
      remediation.pdiIntegration.alertsGenerated.some(alert => 
        alert.toLowerCase().includes('intervention') || 
        alert.toLowerCase().includes('parent')
      );
    
    let interventionType: 'urgent' | 'requested' | 'optional' = 'optional';
    if (selectedStudent?.competenceAcquired === false && remediation.status === 'completed') {
      interventionType = 'urgent';
    } else if (requiresIntervention) {
      interventionType = 'requested';
    }

    return (
      <div className="space-y-6">
        {/* En-tête avec toutes les informations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{remediation.title}</h2>
              <p className="text-slate-600">{remediation.subject} - {remediation.theme}</p>
              <div className="mt-3">
                <p className="text-sm text-slate-600 mb-1">
                  <Target className="w-4 h-4 inline mr-2 text-orange-600" />
                  Compétence visée :
                </p>
                <p className="text-slate-700 font-medium">{remediation.skillToAcquire}</p>
                <p className="text-sm text-slate-600 mt-1">{remediation.objective}</p>
              </div>
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              remediation.status === 'completed' ? 'bg-green-100 text-green-800' :
              remediation.status === 'in_progress' ? 'bg-orange-100 text-orange-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {remediation.status === 'completed' ? <CheckCircle className="w-5 h-5" /> :
               remediation.status === 'in_progress' ? <Loader className="w-5 h-5 animate-spin" /> :
               <Clock className="w-5 h-5" />}
              <span className="font-semibold">
                {remediation.status === 'completed' ? 'Terminée' :
                 remediation.status === 'in_progress' ? 'En cours' : 'À venir'}
              </span>
            </div>
          </div>
          
          {/* Actions rapides - seulement pour les enseignants */}
          {!isParentView && (
            <div className="flex flex-wrap gap-3 mb-6">
              <ActionCard
                icon={<Send className="w-4 h-4" />}
                label="Informer les parents"
                onClick={() => setShowParentReport(true)}
              />
              <ActionCard
                icon={<Download className="w-4 h-4" />}
                label="Exporter le rapport"
                onClick={handleExportReport}
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-slate-500" />
              <div>
                <p className="text-sm text-slate-600">Date</p>
                <p className="font-medium">{dayjs(remediation.date).format('dddd D MMMM YYYY')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-slate-500" />
              <div>
                <p className="text-sm text-slate-600">Durée</p>
                <p className="font-medium">{remediation.duration} minutes</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-slate-500" />
              <div>
                <p className="text-sm text-slate-600">Enseignant</p>
                <p className="font-medium">{remediation.teacher}</p>
              </div>
            </div>
          </div>


        </div>

        {/* Progrès de l'enfant */}
        {selectedStudent && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Progrès de votre enfant</h3>
                <p className="text-sm text-slate-600">Suivi des performances</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {(() => {
                const initialGrade = selectedStudent.initialGrade;
                const finalGrade = selectedStudent.remediationGrade;
                
                // Fonction pour déterminer les couleurs basées sur la note
                const getGradeColors = (grade: number | null | undefined) => {
                  if (!grade) return { bg: 'from-gray-50 to-gray-100', border: 'border-gray-200', text: 'text-gray-700', badge: 'bg-gray-200', badgeText: 'text-gray-800' };
                  if (grade < 50) return { bg: 'from-red-50 to-red-100', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-200', badgeText: 'text-red-800' };
                  if (grade < 70) return { bg: 'from-orange-50 to-orange-100', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-200', badgeText: 'text-orange-800' };
                  return { bg: 'from-green-50 to-green-100', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-200', badgeText: 'text-green-800' };
                };
                
                const initialColors = getGradeColors(initialGrade);
                const finalColors = getGradeColors(finalGrade);
                
                return (
                  <>
                    <div className={`bg-gradient-to-br ${initialColors.bg} rounded-lg p-4 border ${initialColors.border}`}>
                      <div className="flex items-center justify-between mb-2">
                        <p className={`text-sm font-medium ${initialColors.text}`}>Note initiale</p>
                        <div className={`w-8 h-8 ${initialColors.badge} rounded-full flex items-center justify-center`}>
                          <span className={`text-xs font-bold ${initialColors.badgeText}`}>I</span>
                        </div>
                      </div>
                      <p className={`text-3xl font-bold ${initialColors.text}`}>
                        {initialGrade || 'N/A'}
                      </p>
                      <p className={`text-xs ${initialColors.text} mt-1 opacity-80`}>
                        {initialGrade ? 'Évaluation de départ' : 'Non évalué'}
                      </p>
                    </div>
                    
                    <div className={`bg-gradient-to-br ${finalColors.bg} rounded-lg p-4 border ${finalColors.border}`}>
                      <div className="flex items-center justify-between mb-2">
                        <p className={`text-sm font-medium ${finalColors.text}`}>Note après remédiation</p>
                        <div className={`w-8 h-8 ${finalColors.badge} rounded-full flex items-center justify-center`}>
                          <span className={`text-xs font-bold ${finalColors.badgeText}`}>F</span>
                        </div>
                      </div>
                      <p className={`text-3xl font-bold ${finalColors.text}`}>
                        {finalGrade || 'N/A'}
                      </p>
                      <p className={`text-xs ${finalColors.text} mt-1 opacity-80`}>
                        {finalGrade ? 'Évaluation finale' : 'Non évalué'}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
            
            {selectedStudent.initialGrade && selectedStudent.remediationGrade && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-slate-700">Progression</p>
                  <div className="flex items-center space-x-2">
                    {selectedStudent.remediationGrade > selectedStudent.initialGrade ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : selectedStudent.remediationGrade < selectedStudent.initialGrade ? (
                      <TrendingUp className="w-4 h-4 text-red-600 transform rotate-180" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className={`text-xl font-bold ${
                      selectedStudent.remediationGrade > selectedStudent.initialGrade ? 'text-green-600' : 
                      selectedStudent.remediationGrade < selectedStudent.initialGrade ? 'text-red-600' : 'text-slate-600'
                    }`}>
                      {selectedStudent.remediationGrade > selectedStudent.initialGrade ? '+' : ''}
                      {selectedStudent.remediationGrade - selectedStudent.initialGrade} points
                    </span>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedStudent.remediationGrade > selectedStudent.initialGrade ? 'bg-green-100 text-green-800' :
                      selectedStudent.remediationGrade < selectedStudent.initialGrade ? 'bg-red-100 text-red-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {selectedStudent.remediationGrade > selectedStudent.initialGrade ? 'Amélioration' :
                       selectedStudent.remediationGrade < selectedStudent.initialGrade ? 'Régression' : 'Stable'}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedStudent.competenceAcquired ? 'bg-green-100' : 'bg-red-100'
                  }">
                    {selectedStudent.competenceAcquired ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Compétence acquise</p>
                    <p className={`font-semibold ${
                      selectedStudent.competenceAcquired ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedStudent.competenceAcquired ? 'Acquise' : 'Non acquise'}
                    </p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedStudent.competenceAcquired ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedStudent.competenceAcquired ? 'Objectif atteint' : 'Objectif à atteindre'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Message de l'enseignant */}
        {remediation.parentReport?.content && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <MessageCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 mb-2">Message de l'enseignant</h3>
                <p className="text-blue-700">{remediation.parentReport.content}</p>
              </div>
            </div>
          </div>
        )}

        {/* Intervention parentale */}
        {requiresIntervention && (
          <div className={`border rounded-lg p-6 ${
            interventionType === 'urgent' ? 'bg-red-50 border-red-200' :
            interventionType === 'requested' ? 'bg-orange-50 border-orange-200' :
            'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-start space-x-3">
              <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                interventionType === 'urgent' ? 'text-red-600' :
                interventionType === 'requested' ? 'text-orange-600' :
                'text-blue-600'
              }`} />
              <div className="flex-1">
                <h3 className={`font-semibold mb-2 ${
                  interventionType === 'urgent' ? 'text-red-800' :
                  interventionType === 'requested' ? 'text-orange-800' :
                  'text-blue-800'
                }`}>
                  {interventionType === 'urgent' && 'Intervention urgente requise'}
                  {interventionType === 'requested' && 'Intervention demandée'}
                  {interventionType === 'optional' && 'Intervention suggérée'}
                </h3>
                <p className={`${
                  interventionType === 'urgent' ? 'text-red-700' :
                  interventionType === 'requested' ? 'text-orange-700' :
                  'text-blue-700'
                }`}>
                  {interventionType === 'urgent' && 'Votre enfant a besoin d\'un soutien immédiat'}
                  {interventionType === 'requested' && 'L\'enseignant demande votre intervention'}
                  {interventionType === 'optional' && 'Un suivi à domicile pourrait être bénéfique'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions recommandées */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Actions recommandées</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <p className="text-slate-700">Faire 10-15 minutes d'exercices par jour sur la compétence visée</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <p className="text-slate-700">Utiliser les ressources pédagogiques fournies</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <p className="text-slate-700">Encourager la pratique régulière à la maison</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <p className="text-slate-700">Contacter l'enseignant si vous avez des questions</p>
            </div>
          </div>
        </div>

        {/* Actions possibles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center space-x-2 bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition">
            <MessageCircle className="w-5 h-5" />
            <span>Contacter l'enseignant</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition">
            <Download className="w-5 h-5" />
            <span>Télécharger le rapport</span>
          </button>
        </div>


      </div>
    );
  };

  const renderTabContent = () => {
    // Vue parentale - onglets adaptés
    if (isParentView) {
      switch(activeTab) {
        case 'overview':
          return renderParentView();
        case 'method':
          return renderMethodTab();
        case 'resources':
          return renderResourcesTab();
        case 'history':
          return renderHistoryTab();
        default:
          return renderParentView();
      }
    }

    // Vue enseignant (existant)
    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* En-tête avec design orange cohérent */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm border border-orange-200/50 p-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/8 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/6 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-800">Objectif de la session</h3>
                </div>
                <p className="text-slate-700 mb-3">{remediation.objective}</p>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-slate-600">Compétence visée :</span>
                  <span className="text-slate-800">{remediation.skillToAcquire}</span>
                </div>
              </div>
            </div>

            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { icon: <Calendar className="w-5 h-5 text-slate-500" />, label: "Date", value: dayjs(remediation.date).format('dddd D MMMM YYYY') },
                { icon: <BookOpen className="w-5 h-5 text-slate-500" />, label: "Matière", value: remediation.subject },
                { icon: <Clock className="w-5 h-5 text-slate-500" />, label: "Durée", value: `${remediation.duration} minutes` },
                { icon: <MapPin className="w-5 h-5 text-slate-500" />, label: "Lieu", value: remediation.location }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <div>
                      <p className="text-sm font-medium text-slate-600">{item.label}</p>
                      <p className="text-slate-800">{item.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Statistiques de la session */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Élèves présents</p>
                    <p className="text-2xl font-bold text-green-700">
                      {remediation.status === 'upcoming' ? '-' : `${studentsPresent}/${remediation.studentCount}`}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Compétences acquises</p>
                    <p className="text-2xl font-bold text-orange-700">
                      {remediation.status === 'upcoming' ? '-' : competencesAcquired}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-orange-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Amélioration moyenne</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {remediation.status === 'upcoming' ? '-' : `+${Math.round(averageImprovement)}`}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-slate-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Score Moyen Session</p>
                    <p className="text-2xl font-bold text-orange-700">
                      {remediation.status === 'upcoming' ? '-' : `${Math.round(averagePdiProgression)}%`}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Liste des élèves avec notes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-slate-800 flex items-center">
                  <User className="w-6 h-6 mr-3 text-slate-500" />
                  Suivi des élèves ({remediation.studentCount})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-slate-700">Élève</th>
                      <th className="text-center p-4 font-semibold text-slate-700">Présence</th>
                      <th className="text-center p-4 font-semibold text-slate-700">Note initiale</th>
                      <th className="text-center p-4 font-semibold text-slate-700">Note remédiation</th>
                      <th className="text-center p-4 font-semibold text-slate-700">Progression</th>
                      <th className="text-center p-4 font-semibold text-slate-700">Compétence</th>
                      <th className="text-center p-4 font-semibold text-slate-700">Parents informés</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full"/>
                            <span className="font-medium text-slate-800">{student.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <select
                            value={student.status}
                            onChange={(e) => handleStatusChange(student.id, e.target.value as 'present' | 'absent' | 'late')}
                            disabled={remediation.status !== 'in_progress'}
                            className={`border-none text-center px-3 py-1 text-xs font-semibold rounded-full ${
                              student.status === 'present' ? 'bg-green-100 text-green-800' :
                              student.status === 'absent' ? 'bg-red-100 text-red-800' :
                              'bg-amber-100 text-amber-800'
                            } ${
                              remediation.status !== 'in_progress'
                                ? 'cursor-not-allowed opacity-70'
                                : 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                            }`}
                          >
                            <option value="present">{t('present')}</option>
                            <option value="absent">{t('absent')}</option>
                            <option value="late">{t('late')}</option>
                          </select>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-slate-700">{remediation.status === 'upcoming' ? '-' : (student.initialGrade ?? '-')}</span>
                        </td>
                        <td 
                          className={`p-4 text-center ${remediation.status === 'in_progress' ? 'cursor-pointer' : ''}`}
                          onDoubleClick={() => remediation.status === 'in_progress' && setEditingCell(student.id)}
                        >
                          {remediation.status === 'upcoming' ? '-' : (
                            editingCell === student.id ? (
                              <input
                                type="number"
                                defaultValue={student.remediationGrade ?? ''}
                                className="w-16 text-center border rounded-md py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                autoFocus
                                onBlur={(e) => handleGradeChange(student.id, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleGradeChange(student.id, e.currentTarget.value);
                                  } else if (e.key === 'Escape') {
                                    setEditingCell(null);
                                  }
                                }}
                              />
                            ) : (
                              <span className="text-slate-700">{student.remediationGrade ?? '-'}</span>
                            )
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {remediation.status === 'upcoming' ? '-' : (
                            typeof student.initialGrade === 'number' && typeof student.remediationGrade === 'number' ? (
                              <span className={`font-bold ${
                                student.remediationGrade > student.initialGrade ? 'text-green-600' : 
                                student.remediationGrade < student.initialGrade ? 'text-red-600' : 'text-slate-600'
                              }`}>
                                {student.remediationGrade > student.initialGrade ? '+' : ''}{student.remediationGrade - student.initialGrade}
                              </span>
                            ) : '-'
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {remediation.status === 'upcoming' ? '-' : (
                            student.competenceAcquired ? (
                              <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-600 mx-auto" />
                            )
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {student.parentNotified ? (
                            <Send className="w-5 h-5 text-orange-600 mx-auto" />
                          ) : (
                            <MessageSquare className="w-5 h-5 text-gray-400 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'method':
        return (
          <div className="space-y-6">
            {remediation.method ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Settings className="w-6 h-6 text-orange-600" />
                  <h3 className="text-xl font-bold text-slate-800">Méthode de remédiation utilisée</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">Nom de la méthode</p>
                    <p className="text-slate-800">{remediation.method.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">Type</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      remediation.method.type === 'individuel' ? 'bg-orange-100 text-orange-800' :
                      remediation.method.type === 'groupe' ? 'bg-green-100 text-green-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {remediation.method.type}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-1">Durée recommandée</p>
                    <p className="text-slate-800">{remediation.method.duration} minutes</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-slate-600 mb-2">Description</p>
                  <p className="text-slate-700 leading-relaxed">{remediation.method.description}</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-slate-600">Aucune méthode spécifique documentée pour cette session</p>
              </div>
            )}
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Ressources pédagogiques</h3>
              <ActionCard
                icon={<PlusCircle className="w-4 h-4" />}
                label="Ajouter une ressource"
                onClick={() => setIsResourceModalOpen(true)}
                className="hover:bg-orange-50"
              />
            </div>
            
            {/* Ressources associées à la remédiation */}
            {remediationResources.length > 0 ? (
              <div className="space-y-4">
                {remediationResources.map((resource) => (
                  <RemediationResourceCard
                    key={resource.id}
                    resource={resource}
                    onClick={handleResourceClick}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-slate-600 mb-3">Aucune ressource documentée pour cette session</p>
                <button 
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                  onClick={() => setIsResourceModalOpen(true)}
                >
                  Ajouter des ressources
                </button>
              </div>
            )}


          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Historique des remédiations</h3>
            
            {remediation.history && remediation.history.length > 0 ? (
              <div className="space-y-4">
                {remediation.history.map((historyItem) => (
                  <div key={historyItem.sessionId} className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => setExpandedHistory(
                        expandedHistory === historyItem.sessionId ? null : historyItem.sessionId
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <History className="w-5 h-5 text-slate-500" />
                          <div>
                            <p className="font-semibold text-slate-800">
                              Session du {dayjs(historyItem.date).format('DD/MM/YYYY')}
                            </p>
                            <p className="text-sm text-slate-600">{historyItem.method.name}</p>
                          </div>
                        </div>
                        {expandedHistory === historyItem.sessionId ? 
                          <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        }
                      </div>
                    </div>
                    
                    {expandedHistory === historyItem.sessionId && (
                      <div className="px-4 pb-4 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{historyItem.results.studentsImproved}</p>
                            <p className="text-sm text-slate-600">Élèves améliorés</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-orange-600">+{historyItem.results.averageImprovement}</p>
                            <p className="text-sm text-slate-600">Amélioration moyenne</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-slate-700">{historyItem.results.competencesAcquired}</p>
                            <p className="text-sm text-slate-600">Compétences acquises</p>
                          </div>
                        </div>
                        
                        {historyItem.resources.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-semibold text-slate-600 mb-2">Ressources utilisées :</p>
                            <div className="flex flex-wrap gap-2">
                              {historyItem.resources.map(resource => (
                                <span key={resource.id} className="px-2 py-1 bg-gray-100 text-slate-700 text-xs rounded">
                                  {resource.title}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-slate-600">Aucun historique de remédiation disponible</p>
              </div>
            )}
          </div>
        );

      case 'pdi':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Intégration PDI et Suivi</h3>
            
            {/* Suivi des compétences */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-orange-600" />
                Progression des compétences
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-2">Niveau initial</p>
                  <div className="text-3xl font-bold text-red-600">{remediation.pdiIntegration.competenceTracking.initial}%</div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-2">Niveau actuel</p>
                  <div className="text-3xl font-bold text-orange-600">{remediation.pdiIntegration.competenceTracking.current}%</div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-2">Objectif</p>
                  <div className="text-3xl font-bold text-green-600">{remediation.pdiIntegration.competenceTracking.target}%</div>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-red-500 via-orange-500 to-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(remediation.pdiIntegration.competenceTracking.current / remediation.pdiIntegration.competenceTracking.target) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Début</span>
                  <span>Progression actuelle</span>
                  <span>Objectif</span>
                </div>
              </div>
            </div>

            {/* Alertes et notifications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-orange-600" />
                Alertes et notifications
              </h4>
              {remediation.pdiIntegration.alertsGenerated.length > 0 ? (
                <div className="space-y-2">
                  {remediation.pdiIntegration.alertsGenerated.map((alert, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <span className="text-orange-800">{alert}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600">Aucune alerte générée</p>
              )}
            </div>

            {/* Rapport hebdomadaire */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold text-slate-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-orange-600" />
                Rapport hebdomadaire PDI
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-700">
                    Statut : {remediation.pdiIntegration.weeklyReportGenerated ? (
                      <span className="text-green-600 font-semibold">Généré</span>
                    ) : (
                      <span className="text-orange-600 font-semibold">En attente</span>
                    )}
                  </p>
                  {remediation.pdiIntegration.weeklyReportGenerated && (
                    <p className="text-sm text-slate-600 mt-1">
                      Dernière mise à jour : {dayjs().subtract(1, 'day').format('DD/MM/YYYY')}
                    </p>
                  )}
                </div>
                <ActionCard
                  icon={<Download className="w-4 h-4" />}
                  label="Télécharger"
                  onClick={() => {}}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <Link to={isParentView ? "/remediation" : "/mes-cours"} className="flex items-center text-sm text-orange-600 hover:text-orange-700 mb-6 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {isParentView ? "Retour aux remédiations" : "Retour à mes cours"}
        </Link>



        {/* Navigation par onglets - pour tous les utilisateurs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Vue d\'ensemble', icon: <BarChart3 className="w-4 h-4" /> },
                { key: 'method', label: 'Méthode', icon: <Settings className="w-4 h-4" /> },
                { key: 'resources', label: 'Ressources', icon: <FileText className="w-4 h-4" /> },
                { key: 'history', label: 'Historique', icon: <History className="w-4 h-4" /> },
                ...(isParentView ? [] : [{ key: 'pdi', label: 'Suivi PDI', icon: <TrendingUp className="w-4 h-4" /> }])
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as 'overview' | 'method' | 'resources' | 'history' | 'pdi')}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>

        {/* Modal de communication aux parents */}
        {showParentReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-4">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Communication aux parents</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Objet</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    defaultValue={`Remédiation en ${remediation.subject} - ${remediation.title}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    defaultValue={remediation.parentReport?.content || `Votre enfant a participé à une session de remédiation en ${remediation.subject}. Cette session avait pour objectif de travailler sur : ${remediation.skillToAcquire}`}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <ActionCard
                    label="Annuler"
                    onClick={() => setShowParentReport(false)}
                    icon={<></>}
                  />
                  <ActionCard
                    label="Envoyer"
                    onClick={() => setShowParentReport(false)}
                    icon={<Send className="w-4 h-4" />}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal pour la méthode parentale */}
        {isParentMethodModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800">Partager ma méthode d'intervention</h3>
                <button 
                  onClick={() => setIsParentMethodModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const method = {
                  name: formData.get('name') as string,
                  type: formData.get('type') as 'individuel' | 'groupe' | 'mixte',
                  duration: parseInt(formData.get('duration') as string),
                  description: formData.get('description') as string
                };
                handleParentMethodShared(method);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom de votre méthode</label>
                    <input 
                      name="name"
                      type="text" 
                      placeholder="Ex: Exercices quotidiens, Jeux éducatifs..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type d'approche</label>
                    <select 
                      name="type"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    >
                      <option value="">Sélectionner...</option>
                      <option value="individuel">Individuel</option>
                      <option value="groupe">Groupe</option>
                      <option value="mixte">Mixte</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Durée par session</label>
                    <input 
                      name="duration"
                      type="number" 
                      placeholder="15"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                    <p className="text-xs text-slate-500 mt-1">en minutes</p>
                  </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description de votre méthode</label>
                  <textarea 
                    name="description"
                    placeholder="Décrivez comment vous avez aidé votre enfant..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsParentMethodModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800 transition"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Partager ma méthode</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        )}

        {/* Modal d'association de ressources - pour tous les utilisateurs */}
        <RemediationResourceAssociationModal
          isOpen={isResourceModalOpen}
          onClose={() => setIsResourceModalOpen(false)}
          remediationId={remediationId || ''}
          onResourceAssociated={handleResourceAssociated}
          remediationSubject={remediation.subject}
        />

      </div>
    </div>
  );
};

export default RemediationDetailPage; 
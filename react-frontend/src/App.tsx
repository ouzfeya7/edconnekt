import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./pages/authentification/useAuth"; // Utiliser notre nouveau hook
import { useAppRolesFromIdentity } from './hooks/useAppRolesFromIdentity';

import DashboardLayout from "./layouts/DashboardLayout";
import Accueil from "./pages/Accueil";
import Eleves from "./pages/Eleves";
import Evaluations from "./pages/Evaluations";
import NotFound from "./pages/NotFound";
import EnseignantDashboard from "./pages/enseignants/EnseignantDashboard";
// import ClassePage from "./pages/ClassePage";
import Dash from "./pages/eleves/Dashboard";
import MesNotesPage from "./pages/eleves/MesNotesPage";
import Classe from "./pages/ClassePage";
import GNote from "./pages/gestionNotes/TableauPdi";
import MessagePage from "./pages/messages/MessagePage";
import { LoginPage } from "./pages/signup/LoginPage";
import Agenda from "./pages/Agenda";
import Ressource from "./pages/RessourcesPage";
import ProfilePage from "./pages/profile/ProfilePage";
import MesCoursPage from "./pages/eleves/MesCoursPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import DetailLeconPage from "./pages/eleves/DetailLeconPage";
import MesCours from "./pages/enseignants/MesCoursPage";
import PdiSeancePage from "./pages/PdiSeancePage";
import PdiDetailPage from "./pages/PdiDetailPage";
import DirectorPdiPage from "./pages/DirectorPdiPage";

import RessourceDetailPage from "./pages/RessourceDetailPage";
import CreateResourcePage from "./pages/CreateResourcePage"; // Import the new page
import TeacherSuppliesPage from './pages/supplies/TeacherSuppliesPage';
import ParentSuppliesChecklistPage from './pages/supplies/ParentSuppliesChecklistPage';

import ArchivesPage from "./pages/ArchivesPage";
import { JSX } from "react/jsx-runtime";
import { ResourceProvider } from "./contexts/ResourceContext";
import { EventProvider } from './contexts/EventContext'; // Importer le provider
import { NotificationProvider } from './contexts/NotificationContext'; // Importer le nouveau provider
import { DirectorProvider } from './contexts/DirectorContext'; // Importer le provider directeur
import { OnboardingProvider } from './contexts/OnboardingContext'; // Importer le provider onboarding
import { AlertProvider } from './contexts/AlertContext'; // Importer le provider alertes
import { ScheduleProvider } from './contexts/ScheduleContext'; // Importer le provider emploi du temps
import { SettingsProvider } from './contexts/SettingsContext'; // Importer le provider paramètres
import { DirectorTimetableProvider } from './contexts/DirectorTimetableContext'; // Importer le provider emploi du temps directeur
import GestionNotesPage from './pages/gestionNotes/GestionNotesPage';
import GestionDevoirsPage from './pages/gestionNotes/GestionDevoirsPage';
import EnseignantDevoirDetailPage from './pages/gestionNotes/DevoirDetailPage';
import CreateDevoirPage from './pages/gestionNotes/CreateDevoirPage';
import AppLoader from './components/ui/AppLoader';
import RemediationDetailPage from './pages/RemediationDetailPage';
import RemediationPage from './pages/RemediationPage';
import DevoirsPage from './pages/eleves/DevoirsPage';
import EleveDevoirDetailPage from './pages/eleves/DevoirDetailPage';
import EmploiDuTemps from './pages/EmploiDuTemps';
import ParentDashboard from "./pages/parents/ParentDashboard";
import ParentRapportPage from "./pages/parents/ParentRapportPage"; // Importer la nouvelle page
import ParentRemediationPage from "./pages/parents/ParentRemediationPage"; // Importer la page de remédiation
import PaiementPage from './pages/PaiementPage';
import AdmissionPublicPage from './pages/AdmissionPublicPage';
import AdmissionsPage from './pages/admin/admissions/AdmissionsPage';
import AdmissionDetailPage from './pages/admin/admissions/AdmissionDetailPage';
import AdmissionFormPage from './pages/parents/AdmissionFormPage';

// Import des pages du directeur
import DirecteurDashboard from './pages/directeur/DirecteurDashboard';
import UsersPage from './pages/directeur/UsersPage'; // Renommé et mis à jour
import ReferentielsPage from './pages/directeur/ReferentielsPage';
import CentreAlertesPage from './pages/directeur/CentreAlertesPage';
import EmploiDuTempsPage from './pages/directeur/EmploiDuTempsPage';
import ParametresPage from './pages/directeur/ParametresPage';
import RessourcesAuditPage from './pages/directeur/RessourcesAuditPage';
import DirectorSuppliesPage from './pages/directeur/DirectorSuppliesPage';
import PublicSuppliesListPage from './pages/famille/PublicSuppliesListPage';
import DirecteurEventsPage from './pages/directeur/DirecteurEventsPage';
import EventDetailPage from './pages/events/EventDetailPage';
import IdentityContextProvider, { useIdentityContext } from './contexts/IdentityContextProvider';
import SelectContextPage from './pages/context/SelectContextPage';

// Pages de détail Référentiels / Compétences
import CompetencyDetailPage from './pages/referentiels/CompetencyDetailPage';
import SubjectDetailPage from './pages/referentiels/SubjectDetailPage';
import AssignmentDetailPage from './pages/referentiels/AssignmentDetailPage';

// Import des pages de l'administrateur
import AdminDashboard from './pages/admin/dashboard/AdminDashboard';
import EtablissementsPage from './pages/admin/etablissements/EtablissementsPage';
import AbonnementsPage from './pages/admin/abonnements/AbonnementsPage';
import PlansPage from './pages/admin/plans/PlansPage';
import ReferentielsAdminPage from './pages/admin/referentiels/ReferentielsAdminPage';
import ImportsPage from './pages/admin/imports/ImportsPage';
import ClasseDetailPage from './pages/admin/classes/ClasseDetailPage';
import EtablissementDetailPage from './pages/admin/etablissements/EtablissementDetailPage';


// Définition des types de rôles pour la clarté
type Role =
  | "enseignant"
  | "directeur"
  | "eleve"
  | "parent"
  | "administrateur"
  | "espaceFamille";

// Configuration des routes par rôle
const routesByRole: Record<Role, { path: string; element: JSX.Element }[]> = {
  enseignant: [
    { path: "/", element: <EnseignantDashboard /> },
    { path: "/eleves", element: <Eleves /> },
    { path: "/evaluations/notes", element: <GNote /> },
    { path: "/classes", element: <Classe /> },
    { path: "/calendar", element: <Agenda /> },
    { path: "/agenda", element: <Agenda /> },
    { path: "/messages", element: <MessagePage /> },
    { path: "/ressources", element: <Ressource /> },
    { path: "/ressources/archives", element: <ArchivesPage /> },
    { path: "/ressources/creer", element: <CreateResourcePage /> }, // New route for resource creation
    { path: "/emploi-du-temps", element: <EmploiDuTemps /> },
    { path: "/ressources/:resourceId", element: <RessourceDetailPage /> },
    { path: "/pdi", element: <PdiSeancePage /> },
    { path: "/pdi/:facilitatorId", element: <PdiDetailPage /> },
    { path: "/profile", element: <ProfilePage /> },
    { path: "/mes-cours", element: <MesCours /> },
    { path: "/mes-cours/:courseId", element: <CourseDetailPage /> },
    { path: "/lecons/:lessonId", element: <DetailLeconPage /> },
    { path: "/classes/:classId", element: <Classe /> },
    { path: "/gestion-notes", element: <GestionNotesPage /> },
    { path: "/devoirs", element: <GestionDevoirsPage /> },
    { path: "/devoirs/creer", element: <CreateDevoirPage /> },
    { path: "/devoirs/:devoirId", element: <EnseignantDevoirDetailPage /> },
    { path: "/evaluations", element: <Evaluations /> },
    { path: "/remediation", element: <RemediationPage /> },
    { path: "/remediations/:remediationId", element: <RemediationDetailPage /> },
    { path: "/fournitures", element: <TeacherSuppliesPage /> },
    { path: "*", element: <NotFound /> }, // Utilisation de '*' pour le catch-all
  ],
  directeur: [
    { path: "/", element: <DirecteurDashboard /> },
    { path: "/admissions", element: <AdmissionsPage /> },
    { path: "/admissions/:admissionId", element: <AdmissionDetailPage /> },
    { path: "/utilisateurs", element: <UsersPage /> }, // Mis à jour
    { path: "/referentiels", element: <ReferentielsPage /> },
    { path: "/referentiels/competencies/:competencyId", element: <CompetencyDetailPage /> },
    { path: "/referentiels/subjects/:subjectId", element: <SubjectDetailPage /> },
    { path: "/referentiels/assignments/:assignmentId", element: <AssignmentDetailPage /> },
    { path: "/alertes", element: <CentreAlertesPage /> },
    { path: "/emploi-du-temps", element: <EmploiDuTempsPage /> },
    { path: "/audit-ressources", element: <RessourcesAuditPage /> },
    { path: "/parametres", element: <ParametresPage /> },
    { path: "/fournitures/*", element: <DirectorSuppliesPage /> },
    { path: "/direction/pdi", element: <DirectorPdiPage /> },
    { path: "/direction/evenements", element: <DirecteurEventsPage /> },
    { path: "/evenements/:eventId", element: <EventDetailPage /> },
    { path: "/messages", element: <MessagePage /> },
    { path: "/profile", element: <ProfilePage /> },
    { path: "*", element: <NotFound /> },
  ],
  eleve: [
    { path: "/", element: <Dash /> },
    { path: "/mes-notes", element: <MesNotesPage /> },
    { path: "/devoirs", element: <DevoirsPage /> },
    { path: "/devoirs/:devoirId", element: <EleveDevoirDetailPage /> },
    { path: "/ressources", element: <Ressource /> },
    { path: "/ressources/archives", element: <ArchivesPage /> },
    { path: "/ressources/:resourceId", element: <RessourceDetailPage /> },
    { path: "/calendar", element: <Agenda /> },
    { path: "/agenda", element: <Agenda /> },
    { path: "/emploi-du-temps", element: <EmploiDuTemps /> },
    { path: "/messages", element: <MessagePage /> },
    { path: "/evaluations/notes", element: <GNote /> },
    { path: "/profile", element: <ProfilePage /> },
    { path: "/mes-cours", element: <MesCoursPage /> },
    { path: "/mes-cours/:courseId", element: <CourseDetailPage /> },
    { path: "/lecons/:lessonId", element: <DetailLeconPage /> },
    { path: "*", element: <NotFound /> },
  ],
  parent: [
    { path: "/", element: <ParentDashboard /> },
    { path: "/admission", element: <AdmissionFormPage /> },
    { path: "/rapport", element: <ParentRapportPage /> },
    { path: "/remediation", element: <ParentRemediationPage /> }, // Route pour la page de remédiation
    { path: "/remediation/:remediationId", element: <RemediationDetailPage /> }, // Route pour la page de détail de remédiation
    { path: "/calendar", element: <Agenda /> },
    { path: "/agenda", element: <Agenda /> },
    { path: "/emploi-du-temps", element: <EmploiDuTemps /> },
    { path: "/messages", element: <MessagePage /> },
    { path: "/profile", element: <ProfilePage /> },
    { path: "/mes-notes", element: <MesNotesPage /> },
    { path: "/notifications", element: <MessagePage /> },
    { path: "/ressources", element: <Ressource /> }, // Ajouter la route des ressources
    { path: "/ressources/:resourceId", element: <RessourceDetailPage /> },
    { path: "/fournitures", element: <ParentSuppliesChecklistPage /> },
    { path: "*", element: <NotFound /> },
  ],
  administrateur: [
    { path: "/", element: <AdminDashboard /> },
    { path: "/admissions", element: <AdmissionsPage /> },
    { path: "/admissions/:admissionId", element: <AdmissionDetailPage /> },
    { path: "/etablissements", element: <EtablissementsPage /> },
    { path: "/etablissements/:etabId", element: <EtablissementDetailPage /> },
    { path: "/evenements/:eventId", element: <EventDetailPage /> },
    { path: "/admin/classes/:classeId", element: <ClasseDetailPage /> },
    { path: "/utilisateurs", element: <UsersPage /> },
    { path: "/abonnements", element: <AbonnementsPage /> },
    { path: "/plans", element: <PlansPage /> },
    { path: "/referentiels", element: <ReferentielsAdminPage /> },
    { path: "/referentiels/competencies/:competencyId", element: <CompetencyDetailPage /> },
    { path: "/referentiels/subjects/:subjectId", element: <SubjectDetailPage /> },
    { path: "/referentiels/assignments/:assignmentId", element: <AssignmentDetailPage /> },
    { path: "/imports", element: <ImportsPage /> },
    { path: "/profile", element: <ProfilePage /> },
    { path: "*", element: <NotFound /> },
  ],
  espaceFamille: [
    { path: "/", element: <Accueil /> },
    { path: "/ressources/:resourceId", element: <RessourceDetailPage /> },
    { path: "/fournitures/liste-publique", element: <PublicSuppliesListPage /> },
    { path: "*", element: <NotFound /> },
    { path: "/profile", element: <ProfilePage /> },
  ],
};

// Ordre de priorité pour déterminer le rôle principal de l'utilisateur
const rolesPriority: Role[] = [
  "administrateur",
  "directeur",
  "enseignant",
  "eleve",
  "parent",
  "espaceFamille",
];

// Composant qui gère la logique de routage
const AppContent = () => {
  const { isAuthenticated, roles, loading } = useAuth();
  const { capabilities } = useAppRolesFromIdentity();
  const { activeEtabId, activeRole } = useIdentityContext();
  const isAdmin = roles.includes('administrateur');

  // Affiche un message de chargement pendant l'initialisation de Keycloak
  if (loading) {
    return <AppLoader />;
  }

  // Si l'utilisateur n'est pas authentifié, il n'a accès qu'à la page de connexion.
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admission" element={<AdmissionPublicPage />} />
        {/* Redirige toutes les autres tentatives d'accès vers la page de connexion */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }
  
  // Utilisateur authentifié mais contexte non sélectionné -> écran intermédiaire de sélection (sauf administrateur)
  if (!isAdmin && (!activeEtabId || !activeRole)) {
    return (
      <Routes>
        <Route path="/select-contexte" element={<SelectContextPage />} />
        <Route path="*" element={<Navigate to="/select-contexte" replace />} />
      </Routes>
    );
  }

  // L'utilisateur est authentifié, on détermine son rôle et ses routes.
  // Basculer prioritairement sur le rôle actif identity si présent
  const identityPrimaryRole = capabilities.isAdminStaff
    ? 'directeur'
    : capabilities.isTeacher
      ? 'enseignant'
      : capabilities.isStudent
        ? 'eleve'
        : capabilities.isParent
          ? 'parent'
          : undefined;
  const userRole = (identityPrimaryRole as Role | undefined) || rolesPriority.find((r) => roles.includes(r));

  // Si l'utilisateur a un rôle non reconnu, on affiche une page d'erreur.
  if (!userRole) {
    return (
      <Routes>
        <Route
          path="*"
          element={<div>Accès non autorisé. Rôle inconnu.</div>}
        />
      </Routes>
    );
  }

  const allowedRoutes = routesByRole[userRole];

  return (
    <Routes>
      {/* Redirige vers la page d'accueil si un utilisateur connecté essaie d'aller sur /login */}
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/paiement/:id" element={<PaiementPage />} />

      {/* Affiche le layout principal avec les routes autorisées pour le rôle de l'utilisateur */}
      <Route element={<DashboardLayout role={userRole} />}>
        {allowedRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <ResourceProvider>
        <EventProvider>
          <NotificationProvider>
                    <DirectorProvider>
          <OnboardingProvider>
            <AlertProvider>
              <ScheduleProvider>
                <SettingsProvider>
                  <DirectorTimetableProvider>
                    <IdentityContextProvider>
                      <AppContent />
                    </IdentityContextProvider>
                  </DirectorTimetableProvider>
                </SettingsProvider>
              </ScheduleProvider>
            </AlertProvider>
          </OnboardingProvider>
        </DirectorProvider>
          </NotificationProvider>
        </EventProvider>
      </ResourceProvider>
    </Router>
  );
};

export default App;

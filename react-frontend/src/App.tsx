import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./pages/authentification/useAuth"; // Utiliser notre nouveau hook

import DashboardLayout from "./layouts/DashboardLayout";
import Accueil from "./pages/Accueil";
import Eleves from "./pages/Eleves";
import Evaluations from "./pages/Evaluations";
import Rapport from "./pages/Rapport";
import NotFound from "./pages/NotFound";
import EnseignantDashboard from "./pages/enseignants/EnseignantDashboard";
// import ClassePage from "./pages/ClassePage";
import Dash from "./pages/eleves/Dashboard";
import MesNotesPage from "./pages/eleves/MesNotesPage";
import Classe from "./pages/ClassePage";
import GNote from "./pages/gestionNotes/TableauPdi";
import MessageEnseignant from "./pages/enseignants/message/message";
import MessageEleve from "./pages/eleves/message/message";
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
import RessourceDetailPage from "./pages/RessourceDetailPage";

import ArchivesPage from "./pages/ArchivesPage";
import { JSX } from "react/jsx-runtime";
import { ResourceProvider } from "./contexts/ResourceContext";
import GestionNotesPage from './pages/gestionNotes/GestionNotesPage';
import GestionDevoirsPage from './pages/gestionNotes/GestionDevoirsPage';
import EnseignantDevoirDetailPage from './pages/gestionNotes/DevoirDetailPage';
import CreateDevoirPage from './pages/gestionNotes/CreateDevoirPage';
import AppLoader from './components/ui/AppLoader';
import RemediationDetailPage from './pages/RemediationDetailPage';
import DevoirsPage from './pages/eleves/DevoirsPage';
import EleveDevoirDetailPage from './pages/eleves/DevoirDetailPage';
import CreateEventPage from './pages/CreateEventPage';
import EmploiDuTemps from './pages/EmploiDuTemps';

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
    { path: "/agenda/create", element: <CreateEventPage /> },
    { path: "/agenda/edit/:eventId", element: <CreateEventPage /> },
    { path: "/messages", element: <MessageEnseignant /> },
    { path: "/ressources", element: <Ressource /> },
    { path: "/ressources/archives", element: <ArchivesPage /> },
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
    { path: "/remediations/:remediationId", element: <RemediationDetailPage /> },
    { path: "*", element: <NotFound /> }, // Utilisation de '*' pour le catch-all
  ],
  directeur: [
    { path: "/", element: <Accueil /> },
    { path: "/rapport", element: <Rapport /> },
    { path: "/profile", element: <ProfilePage /> },
    { path: "*", element: <NotFound /> },
  ],
  eleve: [
    { path: "/", element: <Dash /> },
    { path: "/mes-notes", element: <MesNotesPage /> },
    { path: "/devoirs", element: <DevoirsPage /> },
    { path: "/devoirs/:devoirId", element: <EleveDevoirDetailPage /> },
    { path: "/calendar", element: <Agenda /> },
    { path: "/agenda", element: <Agenda /> },
    { path: "/emploi-du-temps", element: <EmploiDuTemps /> },
    { path: "/agenda/create", element: <CreateEventPage /> },
    { path: "/agenda/edit/:eventId", element: <CreateEventPage /> },
    { path: "/messages", element: <MessageEleve /> },
    { path: "/evaluations/notes", element: <GNote /> },
    { path: "/profile", element: <ProfilePage /> },
    { path: "/mes-cours", element: <MesCoursPage /> },
    { path: "/mes-cours/:courseId", element: <CourseDetailPage /> },
    { path: "/lecons/:lessonId", element: <DetailLeconPage /> },
    { path: "*", element: <NotFound /> },
  ],
  parent: [
    { path: "/", element: <Accueil /> },
    { path: "*", element: <NotFound /> },
    { path: "/profile", element: <ProfilePage /> },
  ],
  administrateur: [
    { path: "/", element: <Accueil /> },
    { path: "*", element: <NotFound /> },
    { path: "/profile", element: <ProfilePage /> },
  ],
  espaceFamille: [
    { path: "/", element: <Accueil /> },
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

  // Affiche un message de chargement pendant l'initialisation de Keycloak
  if (loading) {
    return <AppLoader />;
  }

  // Si l'utilisateur n'est pas authentifié, il n'a accès qu'à la page de connexion.
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* Redirige toutes les autres tentatives d'accès vers la page de connexion */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // L'utilisateur est authentifié, on détermine son rôle et ses routes.
  const userRole = rolesPriority.find((r) => roles.includes(r));

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
        <AppContent />
      </ResourceProvider>
    </Router>
  );
};

export default App;

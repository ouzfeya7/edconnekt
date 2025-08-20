import {
  FaHome, FaUsers, FaFileAlt, FaChalkboardTeacher,
  FaCalendarAlt, FaEnvelope, FaUser, FaChartLine, FaBook, FaClipboardList, FaBox,
  FaUpload, FaExclamationTriangle, FaGraduationCap, FaCog, FaBuilding, FaFileInvoiceDollar, FaTags
} from "react-icons/fa";
// import { MdSettings } from "react-icons/md";
import { JSX } from "react/jsx-runtime";

// Ce fichier centralise la configuration de la navigation pour toute l'application.

export interface MenuItemType {
titleKey: string;
to: string;
icon: JSX.Element;
hideInNavbar?: boolean; // Nouvelle propriété optionnelle
activePaths?: string[]; // Chemins pour lesquels l'onglet doit rester actif
}

export type Role = "enseignant" | "directeur" | "eleve" | "parent" | "administrateur" | "espaceFamille";

// Note: La fonction t() ne fonctionnera que si i18next est initialisé avant le chargement de ce module.
// C'est généralement le cas.
export const menuByRole: { [key in Role]: MenuItemType[] } = {
  enseignant: [
    { titleKey: "home", to: "/", icon: <FaHome /> },
    { titleKey: "Classes", to: "/classes", icon: <FaUsers /> },
    { titleKey: "my_courses", to: "/mes-cours", icon: <FaChalkboardTeacher /> },
    { titleKey: "evaluations_nav", to: "/evaluations", icon: <FaClipboardList /> },
    { titleKey: "remediation", to: "/remediation", icon: <FaChalkboardTeacher /> },
    { titleKey: "seances_pdi", to: "/pdi", icon: <FaChartLine /> },
    { titleKey: "Ressources", to: "/ressources", icon: <FaBook /> },
    { titleKey: "Agenda", to: "/calendar", icon: <FaCalendarAlt />, hideInNavbar: true },
    { titleKey: "Message", to: "/messages", icon: <FaEnvelope />, hideInNavbar: true },
    { titleKey: "Profile", to: "/profile", icon: <FaUser />, hideInNavbar: true },
  ],
  directeur: [
    { titleKey: "home", to: "/", icon: <FaHome /> },
    { titleKey: "onboarding", to: "/onboarding", icon: <FaUpload /> },
    { titleKey: "referentiels", to: "/referentiels", icon: <FaGraduationCap /> },
    { titleKey: "alertes", to: "/alertes", icon: <FaExclamationTriangle /> },
    { titleKey: "emploi_du_temps", to: "/emploi-du-temps", icon: <FaCalendarAlt /> },
    { titleKey: "parametres", to: "/parametres", icon: <FaCog /> },
    { titleKey: "Profile", to: "/profile", icon: <FaUser />, hideInNavbar: true },
  ],
  eleve: [
    { titleKey: "home", to: "/", icon: <FaHome /> },
    { titleKey: "my_courses", to: "/mes-cours", icon: <FaChalkboardTeacher /> },
    { titleKey: "Mes Notes", to: "/mes-notes", icon: <FaFileAlt /> },
    { titleKey: "Devoirs", to: "/devoirs", icon: <FaChalkboardTeacher /> },
    { titleKey: "supplies", to: "/fournitures", icon: <FaBox /> },
    { titleKey: "Ressources", to: "/ressources", icon: <FaBook /> },
    { titleKey: "Agenda", to: "/calendar", icon: <FaCalendarAlt />, hideInNavbar: true },
    { titleKey: "Message", to: "/messages", icon: <FaEnvelope />, hideInNavbar: true },
    { titleKey: "Profile", to: "/profile", icon: <FaUser />, hideInNavbar: true },
  ],
  parent: [
    { titleKey: "home", to: "/", icon: <FaHome /> },
    { titleKey: "Notes", to: "/mes-notes", icon: <FaFileAlt /> },
    { titleKey: "Rapport", to: "/rapport", icon: <FaChartLine /> }, // Icône différencié
    { titleKey: "Remediation", to: "/remediation", icon: <FaChalkboardTeacher />, activePaths: ["/remediation", "/remediation/:remediationId"] },
    { titleKey: "supplies", to: "/fournitures", icon: <FaBox /> },
    { titleKey: "Ressources", to: "/ressources", icon: <FaBook /> },
    { titleKey: "Agenda", to: "/calendar", icon: <FaCalendarAlt />, hideInNavbar: true },
    { titleKey: "Message", to: "/messages", icon: <FaEnvelope />, hideInNavbar: true },
    { titleKey: "Profile", to: "/profile", icon: <FaUser />, hideInNavbar: true },
  ],
  administrateur: [
    { titleKey: "home", to: "/", icon: <FaHome /> },
    { titleKey: "etablissements", to: "/etablissements", icon: <FaBuilding /> },
    { titleKey: "classes", to: "/admin/classes", icon: <FaUsers /> },
    { titleKey: "utilisateurs", to: "/utilisateurs", icon: <FaUsers /> },
    { titleKey: "abonnements", to: "/abonnements", icon: <FaFileInvoiceDollar /> },
    { titleKey: "plans", to: "/plans", icon: <FaTags /> },
    { titleKey: "referentiels", to: "/referentiels", icon: <FaGraduationCap /> },
    { titleKey: "imports", to: "/imports", icon: <FaUpload /> },
    { titleKey: "Profile", to: "/profile", icon: <FaUser />, hideInNavbar: true },
  ],
  espaceFamille: [
    { titleKey: "home", to: "/", icon: <FaHome /> },
    { titleKey: "Progression", to: "/progression", icon: <FaChartLine /> },
    { titleKey: "Ressources", to: "/ressources", icon: <FaBook /> },
    { titleKey: "Agenda", to: "/calendar", icon: <FaCalendarAlt />, hideInNavbar: true },
    { titleKey: "Message", to: "/messages", icon: <FaEnvelope />, hideInNavbar: true },
    { titleKey: "Profile", to: "/profile", icon: <FaUser />, hideInNavbar: true },
  ],
}; 
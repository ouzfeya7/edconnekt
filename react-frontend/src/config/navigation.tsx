import {
    FaHome, FaUsers, FaFileAlt, FaChalkboardTeacher,
    FaCalendarAlt, FaEnvelope, FaUser, FaChartLine, FaBook, FaClipboardList
} from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import { JSX } from "react/jsx-runtime";

// Ce fichier centralise la configuration de la navigation pour toute l'application.

export interface MenuItemType {
  titleKey: string;
  to: string;
  icon: JSX.Element;
  hideInNavbar?: boolean; // Nouvelle propriété optionnelle
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
      { titleKey: "Ressources", to: "/ressources", icon: <FaBook /> },
      { titleKey: "Agenda", to: "/calendar", icon: <FaCalendarAlt /> },
      { titleKey: "Message", to: "/messages", icon: <FaEnvelope />, hideInNavbar: true },
      { titleKey: "Profile", to: "/profile", icon: <FaUser />, hideInNavbar: true },
    ],
    directeur: [
      { titleKey: "home", to: "/", icon: <FaHome /> },
      { titleKey: "Suivi", to: "/suivi", icon: <FaChartLine /> },
      { titleKey: "Rapport", to: "/rapport", icon: <FaFileAlt /> },
      { titleKey: "Personnel", to: "/personnel", icon: <FaUsers /> },
      { titleKey: "Événements", to: "/evenements", icon: <FaCalendarAlt /> },
      { titleKey: "Parametre", to: "/parametre", icon: <MdSettings /> },
      { titleKey: "Profile", to: "/profile", icon: <FaUser />, hideInNavbar: true },
    ],
    eleve: [
      { titleKey: "home", to: "/", icon: <FaHome /> },
      { titleKey: "my_courses", to: "/mes-cours", icon: <FaChalkboardTeacher /> },
      { titleKey: "Mes Notes", to: "/mes-notes", icon: <FaFileAlt /> },
      { titleKey: "Devoirs", to: "/devoirs", icon: <FaChalkboardTeacher /> },
      { titleKey: "Agenda", to: "/calendar", icon: <FaCalendarAlt /> },
      { titleKey: "Message", to: "/messages", icon: <FaEnvelope />, hideInNavbar: true },
      { titleKey: "Profile", to: "/profile", icon: <FaUser />, hideInNavbar: true },
    ],
    parent: [
      { titleKey: "home", to: "/", icon: <FaHome /> },
      { titleKey: "Note", to: "/note", icon: <FaFileAlt /> },
      { titleKey: "Rapport", to: "/rapport", icon: <FaFileAlt /> },
      { titleKey: "Ressources", to: "/ressources", icon: <FaBook /> },
      { titleKey: "Agenda", to: "/calendar", icon: <FaCalendarAlt /> },
      { titleKey: "Message", to: "/messages", icon: <FaEnvelope />, hideInNavbar: true },
      { titleKey: "Profile", to: "/profile", icon: <FaUser />, hideInNavbar: true },
    ],
    administrateur: [
      { titleKey: "home", to: "/", icon: <FaHome /> },
      { titleKey: "Utilisateurs", to: "/utilisateurs", icon: <FaUsers /> },
      { titleKey: "evaluations_nav", to: "/evaluations", icon: <FaFileAlt /> },
      { titleKey: "Ressources", to: "/ressources", icon: <FaBook /> },
      { titleKey: "Classes", to: "/classes", icon: <FaUsers /> },
      { titleKey: "Statistiques", to: "/statistiques", icon: <FaChartLine /> },
      { titleKey: "Parametre", to: "/parametre", icon: <MdSettings /> },
    ],
    espaceFamille: [
      { titleKey: "home", to: "/", icon: <FaHome /> },
      { titleKey: "Progression", to: "/progression", icon: <FaChartLine /> },
      { titleKey: "Ressources", to: "/ressources", icon: <FaBook /> },
      { titleKey: "Agenda", to: "/calendar", icon: <FaCalendarAlt /> },
      { titleKey: "Message", to: "/messages", icon: <FaEnvelope />, hideInNavbar: true },
      { titleKey: "Profile", to: "/profile", icon: <FaUser />, hideInNavbar: true },
    ],
}; 
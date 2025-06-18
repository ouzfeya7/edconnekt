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
      { titleKey: "Accueil", to: "/", icon: <FaHome /> },
      { titleKey: "Classes", to: "/classes", icon: <FaUsers /> },
      { titleKey: "Mes cours", to: "/mes-cours", icon: <FaChalkboardTeacher /> },
      { titleKey: "Évaluations", to: "/evaluations", icon: <FaClipboardList /> },
      { titleKey: "Ressources", to: "/ressources", icon: <FaBook /> },
      { titleKey: "Agenda", to: "/calendar", icon: <FaCalendarAlt /> },
      { titleKey: "Message", to: "/messages", icon: <FaEnvelope />, hideInNavbar: true },
      { titleKey: "Profil", to: "/profile", icon: <FaUser />, hideInNavbar: true },
    ],
    directeur: [
      { titleKey: "Accueil", to: "/", icon: <FaHome /> },
      { titleKey: "Suivi", to: "/suivi", icon: <FaChartLine /> },
      { titleKey: "Rapport", to: "/rapport", icon: <FaFileAlt /> },
      { titleKey: "Personnel", to: "/personnel", icon: <FaUsers /> },
      { titleKey: "Événements", to: "/evenements", icon: <FaCalendarAlt /> },
      { titleKey: "Paramètre", to: "/parametre", icon: <MdSettings /> },
      { titleKey: "Profil", to: "/profile", icon: <FaUser />, hideInNavbar: true },
    ],
    eleve: [
      { titleKey: "Accueil", to: "/", icon: <FaHome /> },
      { titleKey: "Mes cours", to: "/mes-cours", icon: <FaChalkboardTeacher /> },
      { titleKey: "Mes Notes", to: "/mes-notes", icon: <FaFileAlt /> },
      { titleKey: "Devoirs", to: "/devoirs", icon: <FaChalkboardTeacher /> },
      { titleKey: "Agenda", to: "/calendar", icon: <FaCalendarAlt /> },
      { titleKey: "Message", to: "/messages", icon: <FaEnvelope />, hideInNavbar: true },
      { titleKey: "Profil", to: "/profile", icon: <FaUser />, hideInNavbar: true },
    ],
    parent: [
      { titleKey: "Accueil", to: "/", icon: <FaHome /> },
      { titleKey: "Note", to: "/note", icon: <FaFileAlt /> },
      { titleKey: "Rapport", to: "/rapport", icon: <FaFileAlt /> },
      { titleKey: "Ressources", to: "/ressources", icon: <FaBook /> },
      { titleKey: "Agenda", to: "/calendar", icon: <FaCalendarAlt /> },
      { titleKey: "Message", to: "/messages", icon: <FaEnvelope />, hideInNavbar: true },
      { titleKey: "Profil", to: "/profile", icon: <FaUser />, hideInNavbar: true },
    ],
    administrateur: [
      { titleKey: "Accueil", to: "/", icon: <FaHome /> },
      { titleKey: "Utilisateurs", to: "/utilisateurs", icon: <FaUsers /> },
      { titleKey: "Évaluations", to: "/evaluations", icon: <FaFileAlt /> },
      { titleKey: "Ressources", to: "/ressources", icon: <FaBook /> },
      { titleKey: "Classes", to: "/classes", icon: <FaUsers /> },
      { titleKey: "Statistiques", to: "/statistiques", icon: <FaChartLine /> },
      { titleKey: "Paramètre", to: "/parametre", icon: <MdSettings /> },
    ],
    espaceFamille: [
      { titleKey: "Accueil", to: "/", icon: <FaHome /> },
      { titleKey: "Progression", to: "/progression", icon: <FaChartLine /> },
      { titleKey: "Ressources", to: "/ressources", icon: <FaBook /> },
      { titleKey: "Agenda", to: "/calendar", icon: <FaCalendarAlt /> },
      { titleKey: "Message", to: "/messages", icon: <FaEnvelope />, hideInNavbar: true },
      { titleKey: "Profil", to: "/profile", icon: <FaUser />, hideInNavbar: true },
    ],
}; 
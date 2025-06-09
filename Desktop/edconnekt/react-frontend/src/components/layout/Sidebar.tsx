import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaHome, FaUsers, FaFileAlt, FaChalkboardTeacher,
  FaCalendarAlt, FaEnvelope, FaUser, FaChartLine, FaBook, FaClipboardList
} from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import { JSX } from "react/jsx-runtime";
import { useTranslation } from "react-i18next"; // Importer le hook pour la traduction

interface MenuItemType {
  title: string;
  to: string;
  icon: JSX.Element;
}

interface SidebarProps {
  role: "enseignant" | "directeur" | "eleve" | "parent" | "administrateur" | "espaceFamille";
  isOpen: boolean; // Nouvelle prop pour contrôler l'affichage
}

const Sidebar = ({ role, isOpen }: SidebarProps) => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    console.log("Sidebar mounted, Role:", role, " isOpen:", isOpen, "Path:", location.pathname);
  }, [role, location, isOpen]);

  const menuByRole: { [key: string]: MenuItemType[] } = {
    enseignant: [
      { title: t("Dashboard"), to: "/", icon: <FaHome /> },
      { title: t("Classes"), to: "/classes", icon: <FaUsers /> },
      { title: t("Mes cours"), to: "/mes-cours", icon: <FaChalkboardTeacher /> },
      { title: t("Évaluations"), to: "/evaluations", icon: <FaClipboardList /> },
      { title: t("Ressources"), to: "/ressources", icon: <FaBook /> },
      { title: t("Agenda"), to: "/calendar", icon: <FaCalendarAlt /> },
      { title: t("Message"), to: "/messages", icon: <FaEnvelope /> },
      { title: t("Profil"), to: "/profile", icon: <FaUser /> },
    ],
    directeur: [
      { title: t("Dashboard"), to: "/", icon: <FaHome /> },
      { title: t("Suivi"), to: "/suivi", icon: <FaChartLine /> },
      { title: t("Rapport"), to: "/rapport", icon: <FaFileAlt /> },
      { title: t("Personnel"), to: "/personnel", icon: <FaUsers /> },
      { title: t("Événements"), to: "/evenements", icon: <FaCalendarAlt /> },
      { title: t("Paramètre"), to: "/parametre", icon: <MdSettings /> },
      { title: t("Profil"), to: "/profile", icon: <FaUser /> },
    ],
    eleve: [
      { title: t("Dashboard"), to: "/", icon: <FaHome /> },
      { title: t("Mes cours"), to: "/mes-cours", icon: <FaChalkboardTeacher /> },
      { title: t("Mes Notes"), to: "/mes-notes", icon: <FaFileAlt /> },
      { title: t("Devoirs"), to: "/devoirs", icon: <FaChalkboardTeacher /> },
      { title: t("Agenda"), to: "/calendar", icon: <FaCalendarAlt /> },
      { title: t("Message"), to: "/messages", icon: <FaEnvelope /> },
      { title: t("Profil"), to: "/profile", icon: <FaUser /> },
    ],
    parent: [
      { title: t("Dashboard"), to: "/", icon: <FaHome /> },
      { title: t("Note"), to: "/note", icon: <FaFileAlt /> },
      { title: t("Rapport"), to: "/rapport", icon: <FaFileAlt /> },
      { title: t("Ressources"), to: "/ressources", icon: <FaBook /> },
      { title: t("Agenda"), to: "/calendar", icon: <FaCalendarAlt /> },
      { title: t("Message"), to: "/messages", icon: <FaEnvelope /> },
      { title: t("Profil"), to: "/profile", icon: <FaUser /> },
    ],
    administrateur: [
      { title: t("Dashboard"), to: "/", icon: <FaHome /> },
      { title: t("Utilisateurs"), to: "/utilisateurs", icon: <FaUsers /> },
      { title: t("Évaluations"), to: "/evaluations", icon: <FaFileAlt /> },
      { title: t("Ressources"), to: "/ressources", icon: <FaBook /> },
      { title: t("Classes"), to: "/classes", icon: <FaUsers /> },
      { title: t("Statistiques"), to: "/statistiques", icon: <FaChartLine /> },
      { title: t("Paramètre"), to: "/parametre", icon: <MdSettings /> },
    ],
    espaceFamille: [
      { title: t("Dashboard"), to: "/", icon: <FaHome /> },
      { title: t("Progression"), to: "/progression", icon: <FaChartLine /> },
      { title: t("Ressources"), to: "/ressources", icon: <FaBook /> },
      { title: t("Agenda"), to: "/calendar", icon: <FaCalendarAlt /> },
      { title: t("Message"), to: "/messages", icon: <FaEnvelope /> },
      { title: t("Profil"), to: "/profile", icon: <FaUser /> },
    ],
  };

  const currentMenu = menuByRole[role];

  return (
    <aside className={`
      bg-white dark:bg-g500 border-r
      text-gray-800 dark:text-gray-100 
      h-full sticky top-0
      transition-all duration-300 ease-in-out
      ${isOpen ? "w-64 p-4" : "w-0 p-0 overflow-hidden"}
    `}>
      {isOpen && currentMenu && (
        <>
          {/* Le titre du rôle a été supprimé d'ici */}
          {/* Optionnel: ajouter un petit padding en haut si le titre est retiré */}
          {/* <div className="mb-6"></div> */}
          
          <nav className="space-y-2 pt-2"> {/* Ajout d'un pt-2 si le titre est retiré */}
            {currentMenu.map((item) => {
              return (
                <NavLink
                  key={item.title}
                  to={item.to}
                  className={({ isActive }) => {
                    return `
                      flex items-center gap-3 px-3 py-2 rounded-md 
                      transition-all 
                      ${isActive 
                        ? "bg-[#184867] text-white" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-g400"}
                    `;
                  }}
                >
                  {item.icon}
                  <span className="hidden md:block flex-col">{item.title}</span>
                </NavLink>
              );
            })}
          </nav>
        </>
      )}
    </aside>
  );
};

export default Sidebar; 
import { Bell, Menu, School, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useEvents } from "../events/EventContext";
import { Link } from "react-router-dom";
import { User } from "../../layouts/DashboardLayout";

interface TopbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  user: User;
}

const Topbar = ({ toggleSidebar, isSidebarOpen, user }: TopbarProps) => {
  const { t } = useTranslation();
  const { events } = useEvents();

  // Les données sont maintenant reçues via les props
  const userName = user.name;
  const role = user.role;
  const establishmentName = "YKA";

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('');
  };
  
  const initials = getInitials(userName);
  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(initials)}&backgroundColor=ff8c00`;

  useEffect(() => {
    console.log("Topbar mounted");
    console.log("Sidebar open in Topbar:", isSidebarOpen);
  }, [isSidebarOpen]);

  return (
    <header className="bg-white p-3 flex justify-between items-center">
      {/* Section Gauche: Hamburger, Logo Etablissement, Nom Etablissement */}
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors" 
          aria-label={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isSidebarOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
        </button>
        <div className="flex items-center gap-2">
          {/* Placeholder pour le logo de l'établissement */}
          <div className="bg-blue-500 p-1.5 rounded-full">
            <School className="h-6 w-6 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-800">{establishmentName}</span>
        </div>
      </div>

      {/* Section Centre: Barre de recherche */}
      <div className="flex-1 px-4 lg:px-8 flex justify-center">
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder={t("search")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Section Droite: Notifications, Profil Utilisateur */}
      <div className="flex items-center gap-4">
        <Link to="/notifications" className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="h-6 w-6 text-gray-700" />
          {events.length > 0 && (
             <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
          )}
        </Link>
        
        <Link to="/profile" className="flex items-center gap-3 cursor-pointer">
          <img
            src={avatarUrl}
            alt={userName}
            className="h-9 w-9 rounded-full border-2 border-gray-200"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">{userName}</span>
            <span className="text-xs text-gray-500 capitalize">{role}</span>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Topbar; 
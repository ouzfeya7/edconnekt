import { Bell, Menu, X, User as UserIcon, LogOut } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useEvents } from "../events/EventContext";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../../layouts/DashboardLayout";
import Navbar from "./Navbar";
import { Role } from "../../config/navigation";
import SchoolLogo from "../../assets/logo-yka-1.png";
import { useAuth } from "../../pages/authentification/useAuth";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

interface TopbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  user: User;
}

const Topbar = ({ toggleSidebar, isSidebarOpen, user }: TopbarProps) => {
  const { t } = useTranslation();
  const { events } = useEvents();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Les données sont maintenant reçues via les props
  const userName = user.name;
  const role = user.role as Role;
  const establishmentName = "YKA";

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('');
  };
  
  const initials = getInitials(userName);
  const fallbackAvatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(initials)}&backgroundColor=ff8c00`;
  const avatarUrl = user.imageUrl || fallbackAvatarUrl;

  const handleLogout = () => {
    logout();
    // navigate('/'); // Redirection supprimée. Keycloak s'en charge.
  };

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    console.log("Topbar mounted");
    console.log("Sidebar open in Topbar:", isSidebarOpen);
  }, [isSidebarOpen]);

  return (
    <header className="bg-white p-3 flex justify-between items-center border-b relative">
      {/* Section Gauche: Hamburger (mobile/tablette) ou Logo (PC) */}
      <div className="flex items-center gap-3">
        {/* Bouton Hamburger pour mobile et tablette, disparaît sur PC */}
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors lg:hidden" 
          aria-label={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isSidebarOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
        </button>
        
        {/* Logo et Nom, toujours visible */}
        <a 
          href="https://yennekidsacademy.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 group"
        >
          <div className="bg-white p-1 rounded-full flex items-center justify-center h-11 w-11 transition-transform duration-300 group-hover:scale-110">
            <img src={SchoolLogo} alt="Logo YKA" className="h-full w-full object-contain" />
          </div>
          <span className="text-lg font-semibold text-gray-800 hidden sm:block">{establishmentName}</span>
        </a>
      </div>

      {/* Section Centre: Navbar pour PC */}
      <div className="flex-1 flex justify-center">
        <Navbar role={role} />
      </div>

      {/* Section Droite: Notifications, Profil Utilisateur */}
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <Link to="/messages" className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="h-6 w-6 text-gray-700" />
          {events.length > 0 && (
             <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
          )}
        </Link>
        
        <div className="relative" ref={profileMenuRef}>
          <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-3 cursor-pointer">
            <img
              src={avatarUrl}
              alt={userName}
              className="h-9 w-9 rounded-full border-2 border-gray-200 object-cover"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-semibold text-gray-800">{userName}</span>
              <span className="text-xs text-gray-500">{t('teacher_role')}</span>
            </div>
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <UserIcon className="mr-2 h-4 w-4" />
                {t('my_profile')}
              </Link>
              <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <LogOut className="mr-2 h-4 w-4" />
                {t('logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar; 
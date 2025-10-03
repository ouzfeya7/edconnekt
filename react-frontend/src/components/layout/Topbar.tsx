import { Bell, Menu, X, User as UserIcon, LogOut, Calendar } from "lucide-react";
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useEvents } from "../events/EventContext";
import { Link, useLocation } from "react-router-dom";
import { User } from "../../layouts/DashboardLayout";
import Navbar from "./Navbar";
import { Role } from "../../config/navigation";
import { useAuth } from "../../pages/authentification/useAuth";
import { useIdentityContext } from "../../contexts/IdentityContextProvider";
import { useMyRolesDetailed } from "../../hooks/useMyRolesDetailed";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

interface TopbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  user: User;
}

const getRoleTranslationKey = (role: Role): string => {
  switch (role) {
    case 'enseignant':
      return 'teacher_role';
    case 'eleve':
      return 'student_role';
    case 'directeur':
      return 'director_role';
    case 'parent':
      return 'parent_role';
    case 'administrateur':
      return 'admin_role';
    case 'espaceFamille':
      return 'family_space_role';
    default:
      return 'unknown_role';
  }
};

const Topbar = ({ toggleSidebar, isSidebarOpen, user }: TopbarProps) => {
  const { t } = useTranslation();
  const { events } = useEvents();
  const { logout } = useAuth();
  const { openContextSelector, activeEtabId, activeRole } = useIdentityContext();
  const { data: myRolesDetailed } = useMyRolesDetailed(activeEtabId ?? undefined, { enabled: !!activeEtabId });

  const location = useLocation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Les données sont maintenant reçues via les props
  const userName = user.name;
  const role = user.role as Role;
  const isAdmin = role === 'administrateur';

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('');
  };
  
  const initials = getInitials(userName);
  const fallbackAvatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(initials)}&backgroundColor=ff8c00`;
  const avatarUrl = user.imageUrl || fallbackAvatarUrl;

  // Préférence: éviter les clés techniques (role.effectif.secretaire) et afficher un libellé lisible.
  const formatLabel = useCallback((key?: string): string => {
    if (!key) return '';
    const localized = t(key, { defaultValue: '' }) as string;
    if (localized && localized !== key) return localized;
    const last = (key.split('.')?.pop() || key).replace(/_/g, ' ');
    return last.charAt(0).toUpperCase() + last.slice(1);
  }, [t]);

  // Sélection du rôle détaillé correspondant au contexte actif
  const activeRoleLabel = useMemo(() => {
    if (!Array.isArray(myRolesDetailed) || myRolesDetailed.length === 0) return '';
    if (!activeRole) return '';
    const match = myRolesDetailed.find((r) => r.role_principal?.code === activeRole);
    const labelKey = match?.role_effectif?.label_key || match?.role_principal?.label_key;
    return formatLabel(labelKey);
  }, [myRolesDetailed, activeRole, formatLabel]);

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
    <header className="bg-white p-3 flex justify-between items-center border-b relative shadow-sm">
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
        
        {/* Logo EdConnekt, toujours visible */}
        <Link 
          to="/"
          className="flex items-center gap-3 group"
        >
          <div className="flex items-center justify-center h-11 w-11 transition-transform duration-300 group-hover:scale-110">
            <svg width="44" height="41" viewBox="0 0 44 41" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30.2708 13.2305L13.6768 12.2858L12.1218 12.4924L10.4133 14.6866L9.93016 17.1684L9.88947 18.8456L26.5313 19.7074L30.2708 13.2305Z" fill="#068789"/>
              <path d="M13.5736 27.3277L30.1603 28.393L31.7167 28.1977L33.4411 26.0161L33.9424 23.5378L33.9952 21.8609L17.3601 20.8781L13.5736 27.3277Z" fill="#FFC903"/>
              <path d="M8.64386 20.834C10.9984 25.0678 17.7949 34.7626 17.7949 34.7626L21.5384 28.2786L12.3874 14.35C11.6235 12.6593 12.3869 12.5247 13.7382 12.2865L13.7799 12.2791L11.8835 12.1782C6.86962 12.2834 6.28929 16.6001 8.64386 20.834Z" fill="#068789"/>
              <path d="M35.255 19.8813C32.9313 15.6304 26.2055 5.88647 26.2055 5.88647L22.4149 12.343L31.4644 26.3378C32.2159 28.0341 31.4515 28.1631 30.0986 28.3915L30.0569 28.3985L31.9524 28.5133C36.9669 28.4445 37.5787 24.1322 35.255 19.8813Z" fill="#FFC903"/>
            </svg>
          </div>
        </Link>
      </div>

      {/* Section Centre: Navbar pour PC */}
      <div className="flex-1 flex justify-center">
        <Navbar role={role} />
      </div>

      {/* Section Droite: Notifications, Emploi du temps, Profil Utilisateur */}
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        {!isAdmin && (
          <button
            onClick={openContextSelector}
            className="px-2 py-1 text-xs rounded border hover:bg-gray-50"
            title={activeEtabId && activeRole ? `Etab: ${activeEtabId} | Rôle: ${activeRole}` : 'Sélectionner le contexte'}
          >
            Contexte
          </button>
        )}
        <Link 
          to="/calendar" 
          className={`relative p-2 rounded-full transition-colors ${
            location.pathname === '/calendar' 
              ? 'bg-blue-100 text-blue-600' 
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          title={t('schedule')}
        >
          <Calendar className="h-6 w-6" />
        </Link>
        <Link 
          to="/messages" 
          className={`relative p-2 rounded-full transition-colors ${
            location.pathname === '/messages' 
              ? 'bg-blue-100 text-blue-600' 
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <Bell className="h-6 w-6" />
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
              <span className="text-xs text-gray-500">
                {activeRoleLabel || t(getRoleTranslationKey(role))}
              </span>
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
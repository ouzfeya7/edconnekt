import { Outlet, useOutletContext } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useEffect, useState, useRef } from "react";
import { Role } from "../config/navigation"; // Importer Role
import { useAuth } from "../pages/authentification/useAuth";
import ScrollToTop from "../components/layout/ScrollToTop";
import { FilterProvider } from "../contexts/FilterContext";

// Définir une structure pour les données de l'utilisateur
export interface User {
  id: string; // ID unique de l'utilisateur (de Keycloak)
  name: string;
  role: Role;
  email: string;
  phone: string;
  address: string;
  classId?: string; // Classe de l'élève (ex: CP1, CE1, etc.)
  classLabel?: string; // Nom complet de la classe (ex: "Cours Préparatoire 1")
  specialty?: string;
  entryDate?: string;
  status?: string;
  birthDate?: string;
  gender?: 'Male' | 'Female' | 'Other';
  imageUrl?: string;
}

interface DashboardLayoutProps {
  role: Role;
}

const DashboardLayout = ({ role }: DashboardLayoutProps) => {
  const { user: authUser, loading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const mainContentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (authUser) {
      // Interface étendue pour les attributs Keycloak
      interface ExtendedKeycloakProfile {
        sub?: string;
        attributes?: {
          picture?: string[];
          avatar?: string[];
          phone?: string[];
          address?: string[];
          specialty?: string[];
          classId?: string[];
          classLabel?: string[];
        };
        picture?: string;
      }

      const extendedAuthUser = authUser as ExtendedKeycloakProfile;
      
      // Utiliser les vraies données de Keycloak
      const fullName = `${authUser.firstName || ''} ${authUser.lastName || ''}`.trim();
      const userEmail = authUser.email || '';
      
      // Récupérer la photo de profil depuis Keycloak
      const profilePicture = extendedAuthUser?.attributes?.picture?.[0] || 
                           extendedAuthUser?.attributes?.avatar?.[0] || 
                           extendedAuthUser?.picture || 
                           undefined;
      
      // Générer un avatar par défaut basé sur les initiales
      const initials = `${authUser.firstName?.[0] || ''}${authUser.lastName?.[0] || ''}`.toUpperCase();
      const fallbackAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(initials)}&backgroundColor=184867`;

      setUser({
        id: extendedAuthUser.sub || authUser.username || 'unknown', // Utiliser sub depuis l'interface étendue
        name: fullName || authUser.username || 'Utilisateur',
        role: role,
        email: userEmail,
        phone: extendedAuthUser?.attributes?.phone?.[0] || '', 
        address: extendedAuthUser?.attributes?.address?.[0] || '', 
        classId: extendedAuthUser?.attributes?.classId?.[0] || undefined,
        classLabel: extendedAuthUser?.attributes?.classLabel?.[0] || undefined,
        specialty: extendedAuthUser?.attributes?.specialty?.[0] || undefined,
        entryDate: undefined, // À configurer dans Keycloak si nécessaire
        status: "Actif", // Status par défaut
        birthDate: undefined, // À configurer dans Keycloak si nécessaire
        gender: undefined, // À configurer dans Keycloak si nécessaire
        imageUrl: profilePicture || fallbackAvatar,
      });
    }
  }, [authUser, role]);
  

  const handleUpdateUser = (updatedData: Partial<User & { firstName?: string; lastName?: string }>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      
      const newName = (updatedData.firstName && updatedData.lastName)
        ? `${updatedData.firstName} ${updatedData.lastName}`
        : prevUser.name;
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { firstName, lastName, ...restOfData } = updatedData;

      return { 
        ...prevUser, 
        ...restOfData,
        name: newName 
      };
    });
  };

  useEffect(() => {
    // Fermer le sidebar en naviguant sur grand écran pour éviter qu'il reste ouvert
    // en redimensionnant la fenêtre.
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Chargement du profil utilisateur...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Utilisateur non authentifié ou profil introuvable.</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gdark700">
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar role={user.role} isOpen={true} />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <header className="w-full z-30">
          <Topbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} user={user} />
        </header>

      {/* Sidebar pour mobile/tablette. Devient un overlay sur le contenu */}
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}>
        <Sidebar role={user.role} isOpen={isSidebarOpen} />
      </div>
      
      {/* Overlay sombre quand le sidebar est ouvert sur mobile */}
      {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />}

        <main className="flex-1 overflow-y-auto" ref={mainContentRef}>
          <ScrollToTop containerRef={mainContentRef} />
          <FilterProvider>
            <Outlet context={{ user: user, updateUser: handleUpdateUser }} />
          </FilterProvider>
        </main>
      </div>
    </div>
  );
};

export const useUser = () => {
  return useOutletContext<{ user: User; updateUser: (updatedData: Partial<User & { firstName?: string; lastName?: string }>) => void; }>();
}

export default DashboardLayout;

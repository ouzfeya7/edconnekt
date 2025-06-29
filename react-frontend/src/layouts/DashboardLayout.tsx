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
      setUser({
        name: `Ouz Feya`, // Utiliser le même nom que dans les données fictives
        role: role,
        email: authUser.email || 'ouz.feya@example.com',
        phone: '77 123 45 67', 
        address: 'Dakar, Sénégal', 
        classId: "cp1", // Classe par défaut
        classLabel: "Cours Préparatoire 1",
        specialty: "Mathématiques",
        entryDate: "Septembre 2023",
        status: "Inscrit",
        birthDate: "2015-05-15", // Date de naissance plus récente pour un élève
        gender: 'Male',
        imageUrl: 'https://i.pravatar.cc/150?img=33', // Même avatar que dans les données fictives
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

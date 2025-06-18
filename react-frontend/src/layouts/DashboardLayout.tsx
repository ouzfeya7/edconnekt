import { Outlet, useOutletContext } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useEffect, useState } from "react";
import { Role } from "../config/navigation"; // Importer Role
import { useAuth } from "../pages/authentification/useAuth";

// Définir une structure pour les données de l'utilisateur
export interface User {
  name: string;
  role: Role;
  email: string;
  phone: string;
  address: string;
  department?: string;
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

  useEffect(() => {
    if (authUser) {
      setUser({
        name: `${authUser.firstName} ${authUser.lastName}`,
        role: role,
        email: authUser.email || '',
        phone: '', 
        address: '', 
        department: "Sciences",
        specialty: "Mathématiques",
        entryDate: "Septembre 2023",
        status: "Titulaire",
        birthDate: "1985-05-15",
        gender: 'Male',
        imageUrl: '', 
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
    <div className="h-screen flex bg-gray-100 dark:bg-gdark700">
      {/* Sidebar pour mobile/tablette. Devient un overlay sur le contenu */}
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}>
        <Sidebar role={user.role} isOpen={isSidebarOpen} />
      </div>
      
      {/* Overlay sombre quand le sidebar est ouvert sur mobile */}
      {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />}

      {/* Conteneur principal qui contient Topbar + Contenu */}
      <div className="flex-1 flex flex-col w-full">
        <header className="w-full z-30"> 
          <Topbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} user={user} />
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet context={{ user: user, updateUser: handleUpdateUser }} />
        </main>
      </div>
    </div>
  );
};

export const useUser = () => {
  return useOutletContext<{ user: User; updateUser: (updatedData: Partial<User & { firstName?: string; lastName?: string }>) => void; }>();
}

export default DashboardLayout;

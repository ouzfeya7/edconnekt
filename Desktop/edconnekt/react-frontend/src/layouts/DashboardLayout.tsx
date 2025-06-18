import { Outlet, useOutletContext } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useEffect, useState } from "react";

// Définir une structure pour les données de l'utilisateur
export interface User {
  name: string;
  role: "enseignant" | "directeur" | "eleve" | "parent" | "administrateur" | "espaceFamille";
  email: string;
  phone: string;
  address: string;
  department?: string;
  specialty?: string;
  entryDate?: string;
  status?: string;
  birthDate?: string;
  gender?: 'Male' | 'Female' | 'Other';
}

interface DashboardLayoutProps {
  role: "enseignant" | "directeur" | "eleve" | "parent" | "administrateur" | "espaceFamille";
}

const DashboardLayout = ({ role }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Données utilisateur centralisées. Plus tard, elles viendront d'une API.
  const currentUser: User = {
    name: "Mouhamed Sall",
    role: role,
    email: "mouhamed.sall@edconnekt.edu",
    phone: "+221 77 123 45 67",
    address: "Dakar, Sénégal",
    department: "Sciences",
    specialty: "Mathématiques",
    entryDate: "Septembre 2023",
    status: "Titulaire",
    birthDate: "1985-05-15",
    gender: 'Male',
  };

  useEffect(() => {
    console.log("DashboardLayout mounted, Role:", role, "Sidebar open:", isSidebarOpen);
  }, [role, isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // La constante topbarHeight a été retirée car non utilisée directement dans les classes.
  // La valeur de padding `pt-[60px]` ci-dessous doit correspondre à la hauteur de votre Topbar.
  // Le Topbar a un padding p-3 (12px haut/bas) + bordure (1px) + hauteur du contenu. Approx 50-60px.

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gdark700">
      {/* Topbar fixe sur toute la largeur */}
      <div className="w-full z-40"> 
        <Topbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} user={currentUser} />
      </div>

      {/* Conteneur pour Sidebar et Contenu Principal */}
      <div className="flex flex-1 overflow-y-hidden">
        {/* Sidebar collante */}
        <Sidebar role={currentUser.role} isOpen={isSidebarOpen} />
        
        {/* Contenu Principal scrollable */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet context={{ user: currentUser }} />
        </main>
      </div>
    </div>
  );
};

export const useUser = () => {
  return useOutletContext<{ user: User }>();
}

export default DashboardLayout;

import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { menuByRole, Role } from "../../config/navigation"; // Importer depuis la config centralisée
import { useTranslation } from "react-i18next";

interface SidebarProps {
  role: Role;
  isOpen: boolean;
}

const Sidebar = ({ role, isOpen }: SidebarProps) => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    console.log("Sidebar mounted, Role:", role, " isOpen:", isOpen, "Path:", location.pathname);
  }, [role, location, isOpen]);

  const currentMenu = menuByRole[role];

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white shadow-xl z-40 w-64 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:hidden`}
    >
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Menu</h2>
      </div>

      {currentMenu && (
        <nav className="space-y-2 pt-2">
            {currentMenu.map((item) => {
              // Vérifier si l'onglet doit être actif en utilisant activePaths
              const isActive = item.activePaths 
                ? item.activePaths.some(path => {
                    // Gérer les paramètres dynamiques (comme :remediationId)
                    const pathPattern = path.replace(/:[^/]+/g, '[^/]+');
                    const regex = new RegExp(`^${pathPattern}$`);
                    return regex.test(location.pathname);
                  })
                : location.pathname === item.to;

              return (
                <NavLink
                  key={item.titleKey}
                  to={item.to}
                  className={`flex items-center p-3 rounded-lg text-base transition-colors duration-200 ${
                    isActive
                      ? "bg-[#184867] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{t(item.titleKey)}</span>
                </NavLink>
              );
            })}
          </nav>
      )}
    </aside>
  );
};

export default Sidebar; 
import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { menuByRole, Role } from "../../config/navigation"; // Importer depuis la config centralisée
import { useTranslation } from "react-i18next";
import edcLogo from "../../assets/logo.svg";

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
      className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-lg z-40 w-64 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:hidden`}
    >
      {/* Header avec logo EdConnekt */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center p-1">
            <img src={edcLogo} alt="EdConnekt" className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-gray-900 text-xl font-bold">EdConnekt</h2>
            <p className="text-gray-500 text-sm">Menu principal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {currentMenu && (
        <nav className="px-4 py-6 space-y-1">
            {currentMenu.map((item, index) => {
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
                  className={`group flex items-center p-3 rounded-lg text-base transition-all duration-200 ${
                    isActive
                      ? "bg-[#184867] text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <div className={`p-2 rounded-md transition-all duration-200 ${
                    isActive 
                      ? "bg-white/20 text-white" 
                      : "text-gray-500 group-hover:bg-white group-hover:text-gray-700"
                  }`}>
                    {item.icon}
                  </div>
                  <span className="ml-3 font-medium">{t(item.titleKey)}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </NavLink>
              );
            })}
          </nav>
      )}
    </aside>
  );
};

export default Sidebar; 
import { NavLink, useLocation } from "react-router-dom";
import { menuByRole, Role } from "../../config/navigation";
import { useTranslation } from "react-i18next";

interface NavbarProps {
  role: Role;
}

const Navbar = ({ role }: NavbarProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const currentMenu = menuByRole[role];

  if (!currentMenu) {
    return null;
  }

  return (
    <nav className="hidden lg:flex items-center h-full gap-4">
      {currentMenu
        .filter(item => !item.hideInNavbar)
        .map((item) => {
          let isActive = false;
          
          if (item.to === '/evaluations') {
            // Logique pour les évaluations
            isActive = location.pathname.startsWith('/evaluations') || 
                      location.pathname.startsWith('/gestion-notes') ||
                      location.pathname.startsWith('/devoirs');
          } else if (item.to === '/mes-cours') {
            // Logique pour "Mes cours" - actif pour toutes les pages de cours et leçons
            isActive = location.pathname.startsWith('/mes-cours') || 
                      location.pathname.startsWith('/lecons');
          } else if (item.to === '/devoirs') {
            // Logique pour "Devoirs" - actif pour toutes les pages de devoirs
            isActive = location.pathname.startsWith('/devoirs');
          } else if (item.to === '/ressources') {
            // Logique pour "Ressources" - actif pour la page principale et les pages de détails
            isActive = location.pathname.startsWith('/ressources');
          } else {
            // Logique standard pour les autres routes
            isActive = location.pathname === item.to;
          }
          
          return (
            <NavLink
              key={item.titleKey}
              to={item.to}
              className={`
                flex items-center gap-1.5 px-1.5 py-3 h-full
                text-sm
                border-b-2
                whitespace-nowrap
                transition-all duration-300
                ${isActive
                  ? "text-[#184867] border-[#184867] font-semibold"
                  : "text-gray-500 border-transparent hover:text-[#184867] hover:border-gray-300"
                }
              `}
            >
              {item.icon}
              <span>{t(item.titleKey)}</span>
            </NavLink>
          );
        })}
    </nav>
  );
};

export default Navbar; 
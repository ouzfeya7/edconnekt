import { NavLink, useLocation } from "react-router-dom";
import { menuByRole, Role } from "../../config/navigation";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

interface NavbarProps {
  role: Role;
}

const Navbar = ({ role }: NavbarProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const currentMenu = menuByRole[role];
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fonction pour gérer l'ouverture au hover
  const handleMouseEnter = (itemKey: string) => {
    // Annuler tout timeout de fermeture en cours
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setOpenDropdown(itemKey);
  };

  // Fonction pour gérer la fermeture au mouse leave
  const handleMouseLeave = () => {
    // Délai de 200ms avant fermeture pour éviter les fermetures accidentelles
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  // Annuler les timeouts lors du démontage
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  if (!currentMenu) {
    return null;
  }

  const checkIsActive = (item: { activePaths?: string[]; to: string }) => {
    let isActive = false;
    
    if (item.activePaths) {
      // Utiliser activePaths si défini
      isActive = item.activePaths.some((path: string) => {
        // Gérer les paramètres dynamiques (comme :remediationId)
        const pathPattern = path.replace(/:[^/]+/g, '[^/]+');
        const regex = new RegExp(`^${pathPattern}$`);
        return regex.test(location.pathname);
      });
    } else if (item.to === '/evaluations') {
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
    } else if (item.to !== '#') {
      // Logique standard pour les autres routes (exclure les dropdowns)
      isActive = location.pathname === item.to;
    }
    
    return isActive;
  };

  return (
    <nav className="hidden lg:flex items-center h-full gap-4">
      {currentMenu
        .filter(item => !item.hideInNavbar)
        .map((item) => {
          const isActive = checkIsActive(item);
          
          // Vérifier si un des items du dropdown est actif
          const isDropdownActive = item.isDropdown && item.dropdownItems?.some(dropdownItem => checkIsActive(dropdownItem));

          if (item.isDropdown) {
            return (
              <div 
                key={item.titleKey} 
                className="relative" 
                ref={dropdownRef}
                onMouseEnter={() => handleMouseEnter(item.titleKey)}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className={`
                    flex items-center gap-1.5 px-1.5 py-3 h-full
                    text-sm
                    border-b-2
                    whitespace-nowrap
                    transition-all duration-300
                    cursor-pointer
                    ${isDropdownActive
                      ? "text-[#184867] border-[#184867] font-semibold"
                      : "text-gray-500 border-transparent hover:text-[#184867] hover:border-gray-300"
                    }
                  `}
                >
                  {item.icon}
                  <span>{t(item.titleKey)}</span>
                  <FaChevronDown className={`ml-1 transition-transform duration-300 ${openDropdown === item.titleKey ? 'rotate-180' : ''}`} />
                </div>
                
                {openDropdown === item.titleKey && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px] z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                    {item.dropdownItems?.map((dropdownItem) => (
                      <NavLink
                        key={dropdownItem.titleKey}
                        to={dropdownItem.to}
                        onClick={() => setOpenDropdown(null)}
                        className={`
                          flex items-center gap-3 px-4 py-2 text-sm
                          transition-colors duration-200
                          ${checkIsActive(dropdownItem)
                            ? "text-[#184867] bg-blue-50 font-medium"
                            : "text-gray-700 hover:bg-gray-50 hover:text-[#184867]"
                          }
                        `}
                      >
                        <div className="w-4 h-4 flex items-center justify-center">
                          {dropdownItem.icon}
                        </div>
                        <span>{t(dropdownItem.titleKey)}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
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
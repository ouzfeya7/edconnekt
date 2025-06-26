import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Changer de langue"
      >
        <Languages className="h-6 w-6 text-gray-700" />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50">
          <button
            onClick={() => changeLanguage('fr')}
            className={`w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${i18n.language.startsWith('fr') ? 'font-bold' : ''}`}
          >
            <span className="mr-2">🇫🇷</span> Français
          </button>
          <button
            onClick={() => changeLanguage('en')}
            className={`w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${i18n.language.startsWith('en') ? 'font-bold' : ''}`}
          >
            <span className="mr-2">🇬🇧</span> English
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 
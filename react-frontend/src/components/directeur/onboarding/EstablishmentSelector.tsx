import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, ChevronDown } from 'lucide-react';
import { useAllEstablishments } from '../../../hooks/useAllEstablishments';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const EstablishmentSelector: React.FC = () => {
  const { t } = useTranslation();
  const { 
    isAdmin, 
    selectedEstablishmentId, 
    setSelectedEstablishmentId 
  } = useOnboarding();
  
  const { data: establishments, isLoading } = useAllEstablishments({
    enabled: isAdmin,
    limit: 100
  });

  // Si l'utilisateur n'est pas admin, ne pas afficher le sélecteur
  if (!isAdmin) {
    return null;
  }

  // const selectedEstablishment = establishments?.find(
  //   est => est.id === selectedEstablishmentId
  // );

  return (
    <div className="w-full max-w-sm">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Building2 className="w-4 h-4 inline mr-1" />
        {t('establishment', 'Établissement')}
      </label>
      
      <div className="relative">
        <select
          value={selectedEstablishmentId || ''}
          onChange={(e) => setSelectedEstablishmentId(e.target.value || null)}
          disabled={isLoading}
          className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
        >
          <option value="">
            {isLoading 
              ? t('loading', 'Chargement...') 
              : t('select_establishment', 'Sélectionner un établissement')
            }
          </option>
          {establishments?.map((establishment) => (
            <option key={establishment.id} value={establishment.id}>
              {establishment.label}
            </option>
          ))}
        </select>
        
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
      
      
      
      {!selectedEstablishmentId && isAdmin && (
        <p className="mt-1 text-xs text-amber-600">
          {t('establishment_required', 'Veuillez sélectionner un établissement pour continuer')}
        </p>
      )}
    </div>
  );
};

export default EstablishmentSelector;

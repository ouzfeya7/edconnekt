import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Users, User, UserCheck, UserCog, Shield, PlusCircle, IdCard } from 'lucide-react';
import IdentitiesManagement from '../../components/directeur/users/IdentitiesManagement';
import CSVUploader from '../../components/directeur/onboarding/CSVUploader';
import OnboardingTracking from '../../components/directeur/onboarding/OnboardingTracking';
import StudentsManagement from '../../components/directeur/users/StudentsManagement';
import TeachersManagement from '../../components/directeur/users/TeachersManagement';
import ParentsManagement from '../../components/directeur/users/ParentsManagement';
import StaffManagement from '../../components/directeur/users/StaffManagement';
import AddUserModal from '../../components/directeur/users/AddUserModal';
import { useOnboarding } from '../../contexts/OnboardingContext';
// Onglets lot Identity/Provisioning retirés (fusion dans Suivi Onboarding)

const UsersPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('import');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { shouldFocusTracking, setShouldFocusTracking } = useOnboarding();

  useEffect(() => {
    if (shouldFocusTracking) {
      setActiveTab('suivi');
      setShouldFocusTracking(false);
    }
  }, [shouldFocusTracking, setShouldFocusTracking]);

  const tabs = [
    { id: 'import', label: t('onboarding', 'Onboarding'), icon: Upload },
    { id: 'suivi', label: t('onboarding_tracking', 'Suivi Onboarding'), icon: UserCheck },
    { id: 'identities', label: t('identities', 'Identités'), icon: IdCard },
    { id: 'students', label: t('students', 'Élèves'), icon: User },
    { id: 'teachers', label: t('teachers', 'Enseignants'), icon: UserCog },
    { id: 'parents', label: t('parents', 'Parents'), icon: Users },
    { id: 'staff', label: t('administrative_staff', 'Personnel administratif'), icon: Shield },
  ];

  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('onboarding', 'Onboarding')}
          </h1>
          <p className="text-gray-600">
            {t('onboarding_description', "Importez des lots d'identités, lancez le provisioning et suivez les statuts.")}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          {t('add_user', 'Ajouter un utilisateur')}
        </button>
      </div>

      {/* Onglets */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu selon l'onglet actif */}
      <div>
        {activeTab === 'import' && <CSVUploader />}
        {activeTab === 'suivi' && <OnboardingTracking />}
        {activeTab === 'students' && <StudentsManagement />}
        {activeTab === 'identities' && <IdentitiesManagement />}
        {activeTab === 'teachers' && <TeachersManagement />}
        {activeTab === 'parents' && <ParentsManagement />}
        {activeTab === 'staff' && <StaffManagement />}
      </div>
      <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default UsersPage;

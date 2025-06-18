import React, { useState } from 'react';
import ProfileEdit from './ProfileEdit';
import { Mail, Phone, Calendar, User as UserIcon } from 'lucide-react';
import { useUser } from '../../layouts/DashboardLayout';
import { User } from '../../layouts/DashboardLayout';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (updatedUser: Partial<User>) => {
    updateUser(updatedUser);
    setIsEditing(false);
  };

  if (isEditing) {
    return <ProfileEdit currentUser={user} onCancel={() => setIsEditing(false)} onSave={handleSave} />;
  }

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  
  const [firstName, lastName] = user.name.split(' ');

  const profileFields = [
    { label: "Prénom", value: firstName, icon: <UserIcon size={18} /> },
    { label: "Nom", value: lastName, icon: <UserIcon size={18} /> },
    { label: "Email", value: user.email, icon: <Mail size={18} /> },
    { label: "Téléphone", value: user.phone, icon: <Phone size={18} /> },
    { label: "Date de naissance", value: formatDate(user.birthDate), icon: <Calendar size={18} /> },
    { label: "Genre", value: user.gender || "N/A", icon: <UserIcon size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* En-tête avec bouton Modifier */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Profil</h1>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-[#184867] text-white rounded-lg text-sm font-medium hover:bg-[#184867]/90"
          >
            Modifier le profil
          </button>
        </div>

        {/* Carte de profil */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
            {/* Avatar */}
            <div className="flex-shrink-0 mb-6 md:mb-0">
              <div className="w-32 h-32 rounded-full bg-[#184867] flex items-center justify-center text-white overflow-hidden">
                {user.imageUrl ? (
                  <img src={user.imageUrl} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold">
                    {getInitials(user.name)}
                  </span>
                )}
              </div>
            </div>

            {/* Informations */}
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {profileFields.map((field, index) => (
                  <div key={index} className="flex items-center">
                    <div className="text-[#184867] mr-3">{field.icon}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">{field.label}</p>
                      <p className="text-base text-gray-900 font-semibold">{field.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

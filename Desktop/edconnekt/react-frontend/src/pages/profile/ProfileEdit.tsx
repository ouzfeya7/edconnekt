import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { User } from '../../layouts/DashboardLayout'; // Importer le type User

interface ProfileEditProps {
  currentUser: User;
  onCancel: () => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ currentUser, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: currentUser.name.split(' ')[0] || '',
    lastName: currentUser.name.split(' ')[1] || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    birthDate: currentUser.birthDate || '',
    gender: currentUser.gender || 'Male',
    photo: '', // La photo n'est généralement pas passée comme ça
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Données sauvegardées :", formData);
    alert("Profil mis à jour !");
    onCancel(); 
  };

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Modifier le Profil</h1>
      <div className="bg-white p-8 rounded-xl shadow-sm max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Section photo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              {formData.photo ? (
                <img src={formData.photo} alt="Profil" className="w-full h-full rounded-full object-cover" />
              ) : (
                <Camera className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <label htmlFor="photo-upload" className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer font-semibold">
              Changer la photo
              <input id="photo-upload" name="photo" type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
            </label>
          </div>

          {/* Champs du formulaire */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-600 mb-1">Prénom</label>
              <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#184867]/50" placeholder="Entrez votre prénom" />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-600 mb-1">Nom</label>
              <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#184867]/50" placeholder="Entrez votre nom" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Votre email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#184867]/50" placeholder="Entrez votre email" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">Numéro de téléphone</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#184867]/50" placeholder="Entrez votre numéro de téléphone" />
            </div>
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-600 mb-1">Date de naissance</label>
              <input type="date" id="birthDate" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#184867]/50" />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-600 mb-1">Genre</label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#184867]/50">
                <option value="Male">Homme</option>
                <option value="Female">Femme</option>
                <option value="Other">Autre</option>
              </select>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="mt-10 flex justify-center items-center gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-10 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
              Annuler
            </button>
            <button type="submit" className="px-10 py-3 bg-[#184867] text-white font-semibold rounded-lg hover:bg-[#184867]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#184867]">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit; 
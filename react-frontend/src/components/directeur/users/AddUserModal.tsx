import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [role, setRole] = useState('student');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to handle form submission will be added here
    console.log("Form submitted");
    onClose(); // Close modal after submission
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold mb-4">{t('add_new_user', 'Ajouter un nouvel utilisateur')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">{t('first_name', 'Prénom')}</label>
            <input type="text" id="firstName" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">{t('last_name', 'Nom')}</label>
            <input type="text" id="lastName" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('email', 'Email')}</label>
            <input type="email" id="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div className="mb-6">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">{t('role', 'Rôle')}</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="student">{t('student', 'Élève')}</option>
              <option value="teacher">{t('teacher', 'Enseignant')}</option>
              <option value="parent">{t('parent', 'Parent')}</option>
              <option value="staff">{t('administrative_staff', 'Personnel administratif')}</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              {t('cancel', 'Annuler')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {t('add', 'Ajouter')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;

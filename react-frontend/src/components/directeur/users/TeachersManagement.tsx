import React from 'react';
import { useTranslation } from 'react-i18next';
import { mockTeachers } from './mock-data';
import { Edit, Trash } from 'lucide-react';

const TeachersManagement = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">{t('teachers_list', 'Liste des Enseignants')}</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('name', 'Nom')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('subject', 'Matière')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('email', 'Email')}</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions', 'Actions')}</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {mockTeachers.map((teacher) => (
            <tr key={teacher.id}>
              <td className="px-6 py-4 whitespace-nowrap">{teacher.firstName} {teacher.lastName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{teacher.subject}</td>
              <td className="px-6 py-4 whitespace-nowrap">{teacher.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="w-4 h-4" /></button>
                <button className="text-red-600 hover:text-red-900"><Trash className="w-4 h-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeachersManagement;

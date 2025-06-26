import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Eye, Edit } from 'lucide-react';

interface StudentReport {
  id: string;
  name: string;
  avatar: string;
  dob: string;
  rapports: {
    trimestre0?: string;
    trimestre1?: string;
    trimestre2?: string;
    trimestre3?: string;
  };
}

const mockStudentReports: StudentReport[] = [
  { id: '1', name: 'Khadija Ndiaye', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', dob: '2 Mars 2025', rapports: { trimestre0: 'rapport.pdf', trimestre1: 'rapport.pdf', trimestre2: 'rapport.pdf', trimestre3: 'rapport.pdf' } },
  { id: '2', name: 'Maty Diop', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', dob: '2 Mars 2025', rapports: { trimestre0: 'rapport.pdf', trimestre1: 'rapport.pdf', trimestre2: 'rapport.pdf', trimestre3: 'rapport.pdf' } },
  { id: '3', name: 'Mouhamed Fall', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', dob: '2 Mars 2025', rapports: { trimestre0: 'rapport.pdf', trimestre1: 'rapport.pdf', trimestre2: 'rapport.pdf', trimestre3: 'rapport.pdf' } },
];

const RapportsEleves = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Annuelle');

  const tabs = ['Annuelle', 'Trimestre T1', 'Octobre', 'PDI - (Nom du PDI)'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium focus:outline-none ${
              activeTab === tab
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder={t('search', 'Rechercher')} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:ring-orange-500 focus:border-orange-500" />
        </div>
        <div>
          {/* Pagination can go here */}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('student_name', 'Prénom et Nom')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dob', 'Date de naissance')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('trimester')} 0</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('trimester')} 1</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('trimester')} 2</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('trimester')} 3</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('action', 'Action')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockStudentReports.map(student => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img className="h-8 w-8 rounded-full mr-3" src={student.avatar} alt={student.name} />
                    <span className="font-medium text-gray-900">{student.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.dob}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 underline cursor-pointer">{student.rapports.trimestre0}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 underline cursor-pointer">{student.rapports.trimestre1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 underline cursor-pointer">{student.rapports.trimestre2}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 underline cursor-pointer">{student.rapports.trimestre3}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-orange-500"><Eye size={18} /></button>
                    <button className="text-gray-400 hover:text-orange-500"><Edit size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RapportsEleves; 
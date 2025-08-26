import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mockStudents as initialStudents } from './mock-data';
import { Edit, Trash } from 'lucide-react';

const StudentsManagement = () => {
  const { t } = useTranslation();
  const [students, setStudents] = useState(initialStudents);

  const handlePaymentStatusChange = (studentId: string) => {
    setStudents(students.map(student =>
      student.id === studentId
        ? { ...student, paymentStatus: student.paymentStatus === 'UP_TO_DATE' ? 'PENDING' : 'UP_TO_DATE' }
        : student
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'UP_TO_DATE':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{t('up_to_date', 'À jour')}</span>;
      case 'PENDING':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">{t('pending', 'En attente')}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">{t('students_list', 'Liste des Élèves')}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('name', 'Nom')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('class', 'Classe')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('email', 'Email')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('payment_status', 'Statut Paiement')}</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('is_up_to_date', 'À jour ?')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions', 'Actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap">{student.firstName} {student.lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.class}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(student.paymentStatus)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <input
                    type="checkbox"
                    checked={student.paymentStatus === 'UP_TO_DATE'}
                    onChange={() => handlePaymentStatusChange(student.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4"><Edit className="w-4 h-4" /></button>
                  <button className="text-red-600 hover:text-red-900"><Trash className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsManagement;

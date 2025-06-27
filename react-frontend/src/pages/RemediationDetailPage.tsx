import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockRemediations, RemediationStudent } from '../lib/mock-data';
import { ArrowLeft, User, Calendar, BookOpen, CheckCircle, Clock, Loader } from 'lucide-react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const statusInfo = {
  upcoming: { 
    icon: <Clock className="w-5 h-5 text-blue-500" />, 
    color: "text-blue-500",
    label: "À venir" 
  },
  in_progress: { 
    icon: <Loader className="w-5 h-5 text-orange-500 animate-spin" />, 
    color: "text-orange-500",
    label: "En cours"
  },
  completed: { 
    icon: <CheckCircle className="w-5 h-5 text-green-500" />, 
    color: "text-green-500",
    label: "Terminé"
  },
};

const RemediationDetailPage = () => {
  const { t } = useTranslation();
  const { remediationId } = useParams<{ remediationId: string }>();
  const remediation = mockRemediations.find(r => r.id === remediationId);

  const [students, setStudents] = useState<RemediationStudent[]>(remediation?.students || []);

  if (!remediation) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600">Session de remédiation introuvable</h2>
        <Link to="/mes-cours" className="text-blue-600 hover:underline mt-4 inline-block">
          Retour à la liste des cours
        </Link>
      </div>
    );
  }

  const handleStatusChange = (studentId: string, newStatus: 'present' | 'absent' | 'late') => {
    setStudents(currentStudents =>
      currentStudents.map(student =>
        student.id === studentId ? { ...student, status: newStatus } : student
      )
    );
  };

  const currentStatusInfo = statusInfo[remediation.status];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div>
        <Link to="/mes-cours" className="flex items-center text-sm text-blue-600 hover:underline mb-6 font-semibold">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à mes cours
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm font-semibold text-orange-600 uppercase tracking-wider">{remediation.theme}</p>
              <h1 className="text-4xl font-bold text-gray-800 mt-1">{remediation.title}</h1>
            </div>
            <div className={`flex items-center font-semibold text-lg ${currentStatusInfo.color}`}>
              {currentStatusInfo.icon}
              <span className="ml-2">{t(currentStatusInfo.label)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-700 mb-8 border-t border-b border-gray-100 py-6">
            <div className="flex items-center">
              <Calendar className="w-6 h-6 mr-4 text-gray-400" />
              <div>
                <p className="font-semibold text-gray-600">Date</p>
                <p className="text-gray-800">{dayjs(remediation.date).format('dddd D MMMM YYYY')}</p>
              </div>
            </div>
            <div className="flex items-center">
              <BookOpen className="w-6 h-6 mr-4 text-gray-400" />
              <div>
                <p className="font-semibold text-gray-600">Matière</p>
                <p className="text-gray-800">{remediation.subject}</p>
              </div>
            </div>
             <div className="flex items-center">
              <User className="w-6 h-6 mr-4 text-gray-400" />
              <div>
                <p className="font-semibold text-gray-600">Enseignant</p>
                <p className="text-gray-800">{remediation.teacher}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <User className="w-6 h-6 mr-3 text-gray-500" />
              Liste des élèves ({remediation.studentCount})
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {students.map(student => (
                <li key={student.id} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                  <div className="flex items-center">
                    <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full mr-4"/>
                    <span className="font-medium text-gray-800">{student.name}</span>
                  </div>
                  <select
                    value={student.status}
                    onChange={(e) => handleStatusChange(student.id, e.target.value as 'present' | 'absent' | 'late')}
                    className={`border-none appearance-none text-center cursor-pointer px-3 py-1 text-xs font-semibold rounded-full ${
                      student.status === 'present' ? 'bg-green-100 text-green-800' :
                      student.status === 'absent' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
                  >
                    <option value="present">{t('present')}</option>
                    <option value="absent">{t('absent')}</option>
                    <option value="late">{t('late')}</option>
                  </select>
                </li>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemediationDetailPage; 
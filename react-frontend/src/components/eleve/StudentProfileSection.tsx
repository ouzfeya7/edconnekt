import React from 'react';
import { useAuth } from '../../pages/authentification/useAuth';
import { Student, StudentStatus } from '../contexts/StudentContext';

// Idéalement, ceci serait dans un fichier partagé
type Role = "enseignant" | "directeur" | "eleve" | "parent" | "administrateur" | "espaceFamille";
const rolesPriority: Role[] = ["administrateur", "directeur", "enseignant", "eleve", "parent", "espaceFamille"];

interface StudentProfileProps {
  student: Student; // Utiliser l'interface centralisée
  onBack: () => void;
}

const StudentProfileSection: React.FC<StudentProfileProps> = ({ student, onBack }) => {
  const { roles } = useAuth();
  const userRole = rolesPriority.find(r => roles.includes(r));

  const getStatusStyle = (status: StudentStatus): string => {
    switch (status) {
      case 'Présent':
        return 'text-emerald-600';
      case 'Retard':
        return 'text-amber-500';
      case 'Absent':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* En-tête avec bouton retour, conditionnel au rôle */}
      {userRole !== 'eleve' && (
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-orange-400 cursor-pointer"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Retour</span>
          </button>
        </div>
      )}

      {/* Photo de profil et nom */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg" style={{ borderColor: '#184867' }}>
          {student.imageUrl ? (
            <img
              src={student.imageUrl}
              alt={student.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#184867] flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {student.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">{student.name}</h2>
      </div>

      {/* Informations de l'élève */}
      <div className="space-y-6 text-justify">
        <div>
          <p className="text-xs text-gray-500 tracking-wider">REF ID</p>
          <p className="text-base font-medium text-gray-800">{student.ref}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 tracking-wider">SEXE</p>
          <p className="text-base font-medium text-gray-800">{student.gender}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 tracking-wider">DATE DE NAISSANCE</p>
          <p className="text-base font-medium text-gray-800">{student.birthDate}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 tracking-wider">EMAIL</p>
          <p className="text-base font-medium text-orange-500">{student.email}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 tracking-wider">ADRESSE</p>
          <p className="text-base font-medium text-orange-500">{student.address}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 tracking-wider">DÉPARTEMENT</p>
          <p className="text-base font-medium text-gray-800">{student.department}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 tracking-wider">CLASSE</p>
          <p className="text-base font-medium text-gray-800">{student.class}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 tracking-wider">DATE D'ADMISSION</p>
          <p className="text-base font-medium text-gray-800">{student.admissionDate}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 tracking-wider">STUDENT STATUS</p>
          <p className={`text-base font-bold ${getStatusStyle(student.status as StudentStatus)}`}>{student.status}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileSection;
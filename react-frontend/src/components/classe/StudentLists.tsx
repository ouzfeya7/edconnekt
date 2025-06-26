import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Student, StudentStatus } from "../../contexts/StudentContext";

interface StudentListProps {
  students: Student[];
  onStudentClick?: (student: Student) => void;
  onStatusChange: (studentId: number, status: StudentStatus) => void;
}

const statusOptions: readonly StudentStatus[] = ["Présent", "Retard", "Absent"];

const statusKeyMap: Record<StudentStatus, string> = {
  Présent: "present",
  Retard: "late",
  Absent: "absent",
};

const statusStyle: Record<StudentStatus, string> = {
  Présent: "bg-green-100 text-green-700",
  Retard: "bg-yellow-100 text-yellow-700",
  Absent: "bg-red-100 text-red-700",
};

const StudentList: React.FC<StudentListProps> = ({ students, onStudentClick, onStatusChange }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StudentStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const filteredStudents = students.filter(student => {
    const nameMatch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'all' || student.status === statusFilter;
    return nameMatch && statusMatch;
  });

  // Reset to first page whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{t('student_list')}</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder={t('search_student_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StudentStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="all">{t('all_statuses')}</option>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {t(statusKeyMap[option])}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs uppercase tracking-wide border-b">
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">{t('name')}</th>
              <th className="py-3 px-4 text-left">{t('skill_header')}</th>
              <th className="py-3 px-4 text-left">{t('status_header')}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.map((student, idx) => (
              <tr
                key={student.id}
                className={`border-b hover:bg-gray-50 transition ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="py-3 px-4 text-gray-700">
                  {(currentPage - 1) * studentsPerPage + idx + 1}
                </td>
                <td 
                  className="py-3 px-4 flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => onStudentClick?.(student)}
                >
                  <img
                    src={student.avatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-medium text-gray-800">{student.name}</span>
                </td>
                <td className="py-3 px-4 text-gray-700">{student.competence}</td>
                <td className="py-3 px-4">
                  <select
                    value={student.status}
                    onChange={(e) => onStatusChange(student.id, e.target.value as StudentStatus)}
                    className={`px-2 py-1 rounded-full text-xs font-semibold border-none focus:ring-2 focus:ring-offset-2 ${
                      statusStyle[student.status]
                    }`}
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {t(statusKeyMap[option])}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <span className="text-sm text-gray-700">
            {t('page_of', { currentPage, totalPages })}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {t('previous', 'Précédent')}
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 border rounded-lg text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {t('next', 'Suivant')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList; 
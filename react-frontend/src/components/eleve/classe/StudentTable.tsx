"use client";

import { useState, useMemo } from "react";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { Student } from "./Types";

interface StudentTableProps {
  students: Student[];
}

const statusOptions = ["Present", "Retard", "Absent"];
const itemsPerPage = 5;

export function StudentTable({ students: initialStudents }: StudentTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);

  const [students, setStudents] = useState(
    initialStudents.map((s) => ({ ...s, visible: true }))
  );

  const handleStatusChange = (id: number, newStatus: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: newStatus as "Present" | "Retard" | "Absent" } : s
      )
    );
  };

  const toggleVisibility = (id: number) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    );
  };

  const handleEdit = (student: Student) => {
    alert(`Modifier ${student.name}`);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Absent":
        return "bg-red-100 text-red-600";
      case "Retard":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-green-100 text-green-600";
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.competence.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, students]);

  const pageCount = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  return (
    <section className="p-4 mt-6 bg-white rounded-xl shadow-lg w-full max-w-full">
      <header className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Liste des élèves</h2>
        <input
          type="text"
          placeholder="Rechercher un élève..."
          className="px-3 py-1 border rounded-lg text-sm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0); // reset to first page when searching
          }}
        />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-gray-700 border-b pb-2">
        <span>Prénom et Nom</span>
        <span>Compétence</span>
        <span>Date</span>
        <span>Statut</span>
        <span className="col-span-2">Actions</span>
      </div>

      {paginatedStudents.map((student) =>
        student.visible ? (
          <StudentRow
            key={student.id}
            student={student}
            onEdit={handleEdit}
            onToggleVisibility={toggleVisibility}
            onStatusChange={handleStatusChange}
            getStatusStyle={getStatusStyle}
          />
        ) : (
          <HiddenStudentRow
            key={student.id}
            student={student}
            onToggleVisibility={toggleVisibility}
          />
        )
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          className="text-sm text-blue-600 hover:underline disabled:opacity-40"
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
        >
          ← Précédent
        </button>
        <span className="text-sm text-gray-600">
          Page {page + 1} / {pageCount}
        </span>
        <button
          className="text-sm text-blue-600 hover:underline disabled:opacity-40"
          disabled={page >= pageCount - 1}
          onClick={() => setPage((p) => p + 1)}
        >
          Suivant →
        </button>
      </div>
    </section>
  );
}

function StudentRow({
  student,
  onEdit,
  onToggleVisibility,
  onStatusChange,
  getStatusStyle,
}: {
  student: Student;
  onEdit: (s: Student) => void;
  onToggleVisibility: (id: number) => void;
  onStatusChange: (id: number, status: string) => void;
  getStatusStyle: (status: string) => string;
}) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-6 gap-4 sm:gap-6 items-center px-4 py-3 text-xs sm:text-sm border-b hover:bg-gray-50 transition"
    >
      <div className="flex items-center gap-3 sm:col-span-1">
        <img
          src={student.image}
          alt={student.name}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
        />
        <span className="font-medium text-gray-800 text-sm">{student.name}</span>
      </div>
      <span className="font-medium text-gray-600 sm:col-span-1">{student.competence}</span>
      <span className="text-gray-500 sm:col-span-1">{student.date}</span>
      <select
        value={student.status}
        onChange={(e) => onStatusChange(student.id, e.target.value)}
        className={`rounded-lg px-2 py-1 text-xs sm:text-sm font-medium ${getStatusStyle(
          student.status
        )} cursor-pointer sm:col-span-1`}
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <div className="flex gap-4 sm:gap-6 items-center col-span-2 sm:col-span-1">
        <button
          onClick={() => onEdit(student)}
          className="text-orange-500 hover:text-orange-700 transition"
          title="Modifier"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onToggleVisibility(student.id)}
          className="text-gray-600 hover:text-gray-800 transition"
          title="Masquer la ligne"
        >
          <EyeOff size={18} />
        </button>
      </div>
    </div>
  );
}

function HiddenStudentRow({
  student,
  onToggleVisibility,
}: {
  student: Student;
  onToggleVisibility: (id: number) => void;
}) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-6 gap-4 sm:gap-6 items-center px-4 py-3 text-xs sm:text-sm border-b bg-gray-100 italic text-gray-400"
    >
      <span className="col-span-4 text-center">Ligne masquée</span>
      <div className="col-span-2 flex justify-end pr-6">
        <button
          onClick={() => onToggleVisibility(student.id)}
          className="text-gray-600 hover:text-gray-800 transition"
          title="Afficher la ligne"
        >
          <Eye size={18} />
        </button>
      </div>
    </div>
  );
}

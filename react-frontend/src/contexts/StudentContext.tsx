import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useFilters } from './FilterContext'; // Importer pour accéder à la classe actuelle
import { studentNotesByClass } from '../lib/notes-data'; // Importer les données

export type StudentStatus = 'Présent' | 'Retard' | 'Absent';

// L'interface Student est maintenant plus simple, car les notes sont gérées ailleurs.
export interface Student {
  id: string; // Utiliser le studentId comme id
  name: string;
  avatar: string;
  classId: string;
  status: StudentStatus;
  comment: string; // Ajout du champ commentaire
}

// Transformation des données importées pour les adapter au contexte
const allStudents: Omit<Student, 'comment'>[] = Object.entries(studentNotesByClass).flatMap(([classId, students]) =>
  students.map((student, index) => ({
    id: student.studentId,
    name: student.studentName,
    avatar: student.studentAvatar,
    classId: classId,
    // Statut par défaut
    status: index % 10 === 5 ? "Retard" : index % 10 === 7 ? "Absent" : "Présent",
  }))
);


interface StudentCount {
  total: number;
  present: number;
  retard: number;
  absent: number;
}

interface StudentContextType {
  students: Student[];
  updateStudentStatus: (studentId: string, status: StudentStatus) => void;
  updateStudentComment: (studentId: string, comment: string) => void;
  studentCount: StudentCount;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentClasse } = useFilters();
  const [students, setStudents] = useState<Student[]>([]);
  
  // Filtrer et initialiser les étudiants à chaque changement de classe
  useEffect(() => {
    const classStudents = allStudents.filter(s => s.classId === currentClasse);
    // Initialise le commentaire pour chaque élève
    setStudents(classStudents.map(s => ({ ...s, comment: '-' })));
  }, [currentClasse]);

  const [studentCount, setStudentCount] = useState<StudentCount>({
    total: 0,
    present: 0,
    retard: 0,
    absent: 0,
  });

  useEffect(() => {
    const presentCount = students.filter(s => s.status === 'Présent' || s.status === 'Retard').length;
    const retardCount = students.filter(s => s.status === 'Retard').length;
    const absentCount = students.filter(s => s.status === 'Absent').length;
    
    setStudentCount({
      total: students.length,
      present: presentCount,
      retard: retardCount,
      absent: absentCount
    });
  }, [students]);

  const updateStudentStatus = (studentId: string, status: StudentStatus) => {
    setStudents(currentStudents =>
      currentStudents.map(student =>
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  const updateStudentComment = (studentId: string, comment: string) => {
    setStudents(currentStudents =>
      currentStudents.map(student =>
        student.id === studentId ? { ...student, comment } : student
      )
    );
  };

  return (
    <StudentContext.Provider value={{ students, updateStudentStatus, updateStudentComment, studentCount }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = (): StudentContextType => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
}; 
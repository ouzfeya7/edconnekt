import { Eye, Pencil } from "lucide-react";
import { useState } from "react";

interface Student {
  id: number;
  name: string;
  competence: string;
  date: string;
  status: 'Présent' | 'Retard' | 'Absent';
  avatar: string;
  imageUrl?: string;
}

interface StudentListProps {
  onStudentClick?: (student: Student) => void;
}

const students: Student[] = new Array(10).fill(null).map((_, i) => ({
  id: i + 1,
  name: i === 0 ? "Khadija Ndiaye" : i === 1 ? "Maty Diop" : "Mouhamed Fall",
  avatar: "/avatar.png", // Assurez-vous que ce chemin est correct ou remplacez par une URL
  competence: "Lecture anglais",
  date: "2 Mars 2025",
  status: i === 5 ? "Retard" : i === 7 ? "Absent" : "Présent",
} as Student));

const statusOptions = ["Présent", "Retard", "Absent"] as const;

const statusStyle = {
  Présent: "bg-green-100 text-green-700",
  Retard: "bg-yellow-100 text-yellow-700",
  Absent: "bg-red-100 text-red-700",
};

const StudentList: React.FC<StudentListProps> = ({ onStudentClick }) => {
  const [studentData, setStudentData] = useState(students);

  const handleStatusChange = (studentId: number, newStatus: string) => {
    setStudentData(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId ? { ...student, status: newStatus as 'Présent' | 'Retard' | 'Absent' } : student
      )
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Liste des élèves</h2>
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs uppercase tracking-wide border-b">
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Nom</th>
              <th className="py-3 px-4 text-left">Compétence</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Statut</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {studentData.map((student, idx) => (
              <tr
                key={student.id}
                className={`border-b hover:bg-gray-50 transition ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="py-3 px-4">{student.id}</td>
                <td 
                  className="py-3 px-4 flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => onStudentClick?.(student)}
                >
                  <img
                    src={student.avatar} // Vérifiez ce chemin d'avatar
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-medium text-gray-800">{student.name}</span>
                </td>
                <td className="py-3 px-4 text-gray-700">{student.competence}</td>
                <td className="py-3 px-4 text-gray-600">{student.date}</td>
                <td className="py-3 px-4">
                  <select
                    value={student.status}
                    onChange={(e) => handleStatusChange(student.id, e.target.value)}
                    className={`px-2 py-1 rounded-full text-xs font-semibold border-none focus:ring-2 focus:ring-offset-2 ${
                      statusStyle[student.status as keyof typeof statusStyle]
                    }`}
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 px-4 flex gap-3">
                  <button className="text-orange-500 hover:text-orange-600 transition">
                    <Pencil size={18} />
                  </button>
                  <button 
                    className="text-blue-500 hover:text-blue-600 transition"
                    onClick={() => onStudentClick?.(student)}
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList; 
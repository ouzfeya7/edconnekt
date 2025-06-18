// import React from "react";
// import StudentNameColumn from "./StudentNameColumn";
// import DateColumn from "./DateColumn";
// import SubjectColumn from "./SubjectColumn";
// import ProgressColumn from "./ProgressColumn";
// import ActionColumn from "./ActionColumn";

// interface StudentTableProps {
//   selectedSubject: string;
//   onAction: (action: string, studentId: number) => void;
// }

// const StudentTable: React.FC<StudentTableProps> = ({
//     selectedSubject,
//     onAction,
// }) => {
//     console.log(selectedSubject); // Ensure selectedSubject is used to avoid the warning

//     return (
//         <div className="flex flex-wrap justify-center items-start mt-3 max-md:max-w-full">
//             <StudentNameColumn />
//             <DateColumn />

//             {/* Subject columns - these would change based on selectedSubject */}
//             <SubjectColumn
//                 title="Langage"
//                 values={[
//                     "75%",
//                     "86%",
//                     "71%",
//                     "18%"
//                 ]}
//                 isAlternate={false}
//             />
//             <SubjectColumn
//                 title="Conte"
//                 values={[
//                     "79%",
//                     "83%",
//                     "1%",
//                 ]}
//                 isAlternate={true}
//             />
//             <SubjectColumn
//                 title="Vocabulaire"
//                 values={[
//                     "68%",
//                     "56%",
//                     "72%",
//                 ]}
//                 isAlternate={false}
//                 width="110px"
//             />
//             <SubjectColumn
//                 title="Lecture"
//                 values={[
//                     "40%",
//                     "82%",
//                     "65%",
//                 ]}
//                 isAlternate={true}
//                 width="110px"
//             />
//             <SubjectColumn
//                 title="Graphisme"
//                 values={[
//                     "79%",
//                     "28%",
//                     "63%",
//                 ]}
//                 isAlternate={false}
//                 width="110px"
//             />

//             <ProgressColumn />
//             <ActionColumn onAction={onAction} />
            
//         </div>
//     );
// };

// export default StudentTable;
import ProgressSteps from '../ui/ProgressSteps';

// Exemple de données d'étudiants
const mockStudents = [
  { firstName: "Emma", lastName: "Dupont", subject: "Math", weeklySkill: "Logique", skill: "Résolution", grade: 88, progress: 80 },
  { firstName: "Léo", lastName: "Martin", subject: "Français", weeklySkill: "Écriture", skill: "Orthographe", grade: 76, progress: 60 },
  { firstName: "Clara", lastName: "Bernard", subject: "SVT", weeklySkill: "Observation", skill: "Rapports", grade: 92, progress: 95 },
  { firstName: "Lucas", lastName: "Petit", subject: "Histoire", weeklySkill: "Analyse", skill: "Chronologie", grade: 85, progress: 70 },
  { firstName: "Jade", lastName: "Moreau", subject: "Anglais", weeklySkill: "Vocabulaire", skill: "Compréhension", grade: 67, progress: 50 },
];

interface StudentTableProps {
  selectedSubject: string;  // Matière sélectionnée
}

const StudentTable: React.FC<StudentTableProps> = ({ selectedSubject }) => {
  // Filtrage des étudiants par matière
  const filteredStudents = mockStudents.filter(
    (student) => student.subject === selectedSubject
  );

  return (
    <div className="mt-6 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">Tableau des étudiants</h3>
      <table className="min-w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Prénom</th>
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Matière</th>
            <th className="p-2 border">Compétence Hebdo</th>
            <th className="p-2 border">Compétence</th>
            <th className="p-2 border">Note</th>
            <th className="p-2 border">Progression</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-2 text-center">
                Aucun étudiant trouvé pour la matière sélectionnée.
              </td>
            </tr>
          ) : (
            filteredStudents.map((student, idx) => (
              <tr key={idx} className="text-center">
                <td className="p-2 border">{student.firstName}</td>
                <td className="p-2 border">{student.lastName}</td>
                <td className="p-2 border">{student.subject}</td>
                <td className="p-2 border">{student.weeklySkill}</td>
                <td className="p-2 border">{student.skill}</td>
                <td className="p-2 border">{student.grade}%</td>
                <td className="p-2 border">
                  <ProgressSteps progress={student.progress} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;

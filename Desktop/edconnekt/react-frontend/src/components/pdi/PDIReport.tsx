import React, { useState } from 'react';
import { Search, Eye, Pencil } from 'lucide-react';
import PdiProgressRow from './PdiProgressRow'; // Modifié le chemin pour être relatif au dossier pdi

type Student = {
  id: number;
  nom: string;
  avatar: string;
  dateEvaluation: string;
  langage: number;
  conte: number;
  vocabulaire: number;
  lecture: number;
  graphisme: number;
  progression: number;
};

interface PDIReportProps {
  evaluationType: string;
}

const students: Student[] = [
  {
    id: 1,
    nom: "Khadija Ndiaye",
    avatar: "/avatar.png",
    dateEvaluation: "2 Mars 2025",
    langage: 75,
    conte: 79,
    vocabulaire: 68,
    lecture: 40,
    graphisme: 79,
    progression: 3
  },
  // ... (autres données étudiant omises pour la concision)
];

const PDIReport: React.FC<PDIReportProps> = ({ evaluationType }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = students.filter(s => s.nom.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* ... (logique d'affichage conditionnel pour les boutons Français/Anglais et recherche) ... */}
      {evaluationType === "Continue" && (
        <div className="p-4 flex items-center justify-between">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher"
              className="pl-10 pr-4 py-2 border rounded-lg w-[300px]"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-2 bg-[#184867] text-white rounded-full">
              Français
            </button>
            <button className="px-6 py-2 bg-white border rounded-full">
              Anglais
            </button>
          </div>
        </div>
      )}

      {evaluationType === "Intégration" && (
         <div className="p-4 flex items-center justify-between">
         <div className="relative">
           <input
             type="text"
             placeholder="Rechercher"
             className="pl-10 pr-4 py-2 border rounded-lg w-[300px]"
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
           />
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
         </div>
         <div></div> 
       </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-3 px-4 font-medium">#</th>
              <th className="py-3 px-4 font-medium">Prénom et Nom</th>
              <th className="py-3 px-4 font-medium">Date d'évaluation</th>
              {evaluationType === "Continue" && (
                <>
                  <th className="py-3 px-4 font-medium">Langage</th>
                  <th className="py-3 px-4 font-medium">Conte</th>
                  <th className="py-3 px-4 font-medium">Vocabulaire</th>
                  <th className="py-3 px-4 font-medium">Lecture</th>
                  <th className="py-3 px-4 font-medium">Graphisme</th>
                </>
              )}
              <th className="py-3 px-4 font-medium">Progression</th>
              <th className="py-3 px-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student) => (
              <tr key={student.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{student.id}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <img src={student.avatar} alt="" className="w-8 h-8 rounded-full" />
                    <span>{student.nom}</span>
                  </div>
                </td>
                <td className="py-3 px-4">{student.dateEvaluation}</td>
                {evaluationType === "Continue" && (
                  <>
                    <td className="py-3 px-4">{student.langage}%</td>
                    <td className="py-3 px-4">{student.conte}%</td>
                    <td className="py-3 px-4">{student.vocabulaire}%</td>
                    <td className="py-3 px-4">{student.lecture}%</td>
                    <td className="py-3 px-4">{student.graphisme}%</td>
                  </>
                )}
                <td className="py-3 px-4">
                  <PdiProgressRow level={student.progression} />
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button className="p-1 rounded-md hover:bg-gray-100">
                      <Pencil className="w-4 h-4 text-orange-500" />
                    </button>
                    <button className="p-1 rounded-md hover:bg-gray-100">
                      <Eye className="w-4 h-4 text-blue-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 flex items-center justify-between text-sm">
        <span className="text-gray-600">Page 1-04</span>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded border hover:bg-gray-50">&lt;</button>
          <button className="p-1.5 rounded border hover:bg-gray-50">&gt;</button>
          <button className="p-1.5 rounded border hover:bg-gray-50">↓</button>
          <button className="p-1.5 rounded border hover:bg-gray-50">⋮</button>
        </div>
      </div>
    </div>
  );
};

export default PDIReport; 
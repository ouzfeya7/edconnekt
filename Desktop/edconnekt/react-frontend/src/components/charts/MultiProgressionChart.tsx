import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Nouvelle structure : focus sur les compétences
type CompetenceProgression = {
  competence: string;
  Khadija: number;
  Maty: number;
  Mouhamed: number;
};

const data: CompetenceProgression[] = [
  { competence: "Lecture", Khadija: 10, Maty: 15, Mouhamed: 20 },
  { competence: "Grammaire", Khadija: 20, Maty: 25, Mouhamed: 10 },
  { competence: "Orthographe", Khadija: 15, Maty: 20, Mouhamed: 25 },
  { competence: "Expression", Khadija: 25, Maty: 15, Mouhamed: 20 },
  { competence: "Compréhension", Khadija: 20, Maty: 15, Mouhamed: 15 },
  { competence: "Autre", Khadija: 10, Maty: 10, Mouhamed: 10 },
];

const MultiProgressionChart: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-br from-indigo-100 via-white to-sky-100 p-6 rounded-2xl shadow-2xl border border-indigo-300 hover:shadow-indigo-400 transition-shadow duration-300">
      <h2 className="text-2xl font-extrabold text-center text-indigo-700 mb-6 underline underline-offset-4">
        📊 Suivi intelligent par compétence
      </h2>

      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#d1d5db" />
            <XAxis dataKey="competence" stroke="#4f46e5" tick={{ fontWeight: "bold" }} />
            <YAxis stroke="#4f46e5" />
            <Tooltip />
            <Legend />
            <Bar dataKey="Khadija" fill="#6366f1" />
            <Bar dataKey="Maty" fill="#f59e0b" />
            <Bar dataKey="Mouhamed" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MultiProgressionChart; 
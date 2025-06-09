// src/components/PDIView.tsx

import React, { useState } from "react";

interface PDIEntry {
  domain: string;
  subject: string;
  weeklySkill: string;
  skill: string;
  grade: number;
}

const pdiEntries: PDIEntry[] = [
  { domain: "Science", subject: "Math", weeklySkill: "Numérique", skill: "Numérique", grade: 84 },
  { domain: "Langue et Com", subject: "Français", weeklySkill: "Numérique", skill: "Géométrie", grade: 4 },
  { domain: "Langue et Com", subject: "Anglais", weeklySkill: "Numérique", skill: "Lecture", grade: 46 },
  { domain: "Science", subject: "Math", weeklySkill: "Numérique", skill: "Orthographe", grade: 24 },
  { domain: "Art créatif", subject: "Dessin", weeklySkill: "Numérique", skill: "Numérique", grade: 97 },
  { domain: "Science", subject: "IST", weeklySkill: "Numérique", skill: "Numérique", grade: 87 },
  { domain: "Science", subject: "IST", weeklySkill: "Numérique", skill: "Numérique", grade: 31 },
  { domain: "Science", subject: "IST", weeklySkill: "Numérique", skill: "Numérique", grade: 10 },
  { domain: "Science", subject: "IST", weeklySkill: "Numérique", skill: "Numérique", grade: 13 },
];

const PDIView: React.FC = () => {
  const [search, setSearch] = useState("");

  const filteredEntries = pdiEntries.filter(
    (entry) =>
      entry.domain.toLowerCase().includes(search.toLowerCase()) ||
      entry.subject.toLowerCase().includes(search.toLowerCase()) ||
      entry.skill.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Titre */}
      <div className="space-y-2">
        <div className="text-sm text-gray-500">Annuelle {'>'} Trimestre T1 {'>'} Octobre {'>'} <span className="text-orange-500 font-semibold">PDI - (Nom du PDI)</span></div>
        <h1 className="text-2xl font-bold">Cross-channel analysis</h1>
      </div>

      {/* Recherche et filtres */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-1/3 text-sm"
        />
        <div className="flex gap-2 items-center">
          <button className="px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300">Filtrer</button>
          <span className="text-sm text-gray-600">Page 1-04</span>
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Domaines</th>
              <th className="p-2 border">Matières</th>
              <th className="p-2 border">Compét Hebdo</th>
              <th className="p-2 border">Compétences</th>
              <th className="p-2 border">Notes</th>
              <th className="p-2 border">Progression</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry, idx) => (
              <tr key={idx} className="text-center">
                <td className="p-2 border">{entry.domain}</td>
                <td className="p-2 border">{entry.subject}</td>
                <td className="p-2 border">{entry.weeklySkill}</td>
                <td className="p-2 border">{entry.skill}</td>
                <td className="p-2 border font-semibold">{entry.grade}%</td>
                <td className="p-2 border">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${
                        entry.grade >= 80
                          ? "bg-green-400"
                          : entry.grade >= 50
                          ? "bg-orange-400"
                          : "bg-red-400"
                      }`}
                      style={{ width: `${entry.grade}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {filteredEntries.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500">
                  Aucun résultat trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PDIView; 
// src/components/OngletsRapports.tsx

import React, { useState } from "react";

type OngletType = "Annuel" | "Trimestre" | "Mois";
type BoutonType = { label: string; type: "rapport" | "pdi" };

const fakeEleves = [
  { prenom: "Lina", nom: "Dupont", matiere: "Mathématiques", competenceHebdo: "Calcul mental", competence: "Addition", note: 15, progression: 70 },
  { prenom: "Noah", nom: "Martin", matiere: "Français", competenceHebdo: "Lecture", competence: "Compréhension orale", note: 18, progression: 90 },
  { prenom: "Emma", nom: "Bernard", matiere: "SVT", competenceHebdo: "Biologie", competence: "Système digestif", note: 14, progression: 60 },
  { prenom: "Lucas", nom: "Robert", matiere: "Anglais", competenceHebdo: "Vocabulaire", competence: "Expression écrite", note: 12, progression: 50 },
];

const OngletsRapports: React.FC = () => {
  const [ongletActif, setOngletActif] = useState<OngletType>("Annuel");
  const [tableauVisible, setTableauVisible] = useState<boolean>(false);

  const moisActuel = new Date().toLocaleString("fr-FR", { month: "long" });
  const moisPrecedents = ["Janvier", "Février", "Mars"];

  const boutons: BoutonType[] = (() => {
    if (ongletActif === "Trimestre") {
      return [...moisPrecedents, moisActuel].map(mois => ({ label: mois, type: "rapport" }));
    }
    if (ongletActif === "Mois") {
      return [
        { label: "PDI 01-08", type: "pdi" },
        { label: "PDI 14-21", type: "pdi" },
        { label: "PDI 28-05", type: "pdi" },
      ];
    }
    return [];
  })();

  const downloadCSV = (label: string) => {
    const headers = "Prénom,Nom,Matière,Compétence Hebdo,Compétence,Note,Progression\n";
    const rows = fakeEleves
      .map(eleve => `${eleve.prenom},${eleve.nom},${eleve.matiere},${eleve.competenceHebdo},${eleve.competence},${eleve.note},${eleve.progression}%`)
      .join("\n");
    const csv = headers + rows;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${label.replace(/ /g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setTableauVisible(true);
  };

  return (
    <div className="p-6">
      {/* Onglets */}
      <div className="flex space-x-4 mb-6">
        {(["Annuel", "Trimestre", "Mois"] as OngletType[]).map(onglet => (
          <button
            key={onglet}
            onClick={() => { setOngletActif(onglet); setTableauVisible(false); }}
            className={`px-4 py-2 rounded-full ${ongletActif === onglet ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"} transition`}
          >
            {onglet === "Mois" ? `Mois Actuel (${moisActuel})` : onglet}
          </button>
        ))}
      </div>

      {/* Boutons de rapport */}
      <div className="flex flex-wrap gap-4 mb-6">
        {boutons.map(b => (
          <button
            key={b.label}
            onClick={() => downloadCSV(b.label)}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
          >
            Télécharger {b.label}
          </button>
        ))}
      </div>

      {/* Tableau */}
      {tableauVisible && (
        <div className="overflow-x-auto mt-8">
          <table className="min-w-full bg-white border rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">Prénom</th>
                <th className="py-2 px-4 border-b">Nom</th>
                <th className="py-2 px-4 border-b">Matière</th>
                <th className="py-2 px-4 border-b">Compétence Hebdo</th>
                <th className="py-2 px-4 border-b">Compétence</th>
                <th className="py-2 px-4 border-b">Note</th>
                <th className="py-2 px-4 border-b">Progression</th>
              </tr>
            </thead>
            <tbody>
              {fakeEleves.map((eleve, index) => (
                <tr key={index} className="text-center">
                  <td className="py-2 px-4 border-b">{eleve.prenom}</td>
                  <td className="py-2 px-4 border-b">{eleve.nom}</td>
                  <td className="py-2 px-4 border-b">{eleve.matiere}</td>
                  <td className="py-2 px-4 border-b">{eleve.competenceHebdo}</td>
                  <td className="py-2 px-4 border-b">{eleve.competence}</td>
                  <td className="py-2 px-4 border-b">{eleve.note}/20</td>
                  <td className="py-2 px-4 border-b">
                    <div className="relative w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-500 h-4 rounded-full"
                        style={{ width: `${eleve.progression}%` }}
                      ></div>
                      <span className="absolute inset-0 text-xs flex items-center justify-center font-bold text-white">{eleve.progression}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OngletsRapports;

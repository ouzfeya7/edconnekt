import React from "react";

interface Evaluation {
  subject: string;
  scores: number[];
  average: number;
}

const evaluationData: Evaluation[] = [
  { subject: "Mathématiques", scores: [85, 90, 78], average: 84.33 },
  { subject: "Physique", scores: [88, 92, 95], average: 91.67 },
  { subject: "Anglais", scores: [80, 75, 85], average: 80 },
];

const EvaluationTable: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Tableau des évaluations</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Matière</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Notes</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Moyenne</th>
          </tr>
        </thead>
        <tbody>
          {evaluationData.map((evaluation, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{evaluation.subject}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {evaluation.scores.join(", ")}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                {evaluation.average.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EvaluationTable;

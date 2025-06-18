import { useState } from "react";
import { FiFilter } from "react-icons/fi";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdOutlineInsertDriveFile, MdOpenInNew } from "react-icons/md";
import dayjs from "dayjs";

// Exemple de données PDI (à remplacer par du fetch ou props)
const fakePdiData = Array.from({ length: 12 }, () => ({
    domaine: "Science",
    matiere: "Math",
    competHebdo: "Numérique",
    competence: "Orthographe",
    note: `${Math.floor(Math.random() * 100)}%`,
}));

export default function PdiDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(fakePdiData.length / itemsPerPage);
  const currentMonth = dayjs().format("MMMM");
  const lastThreeMonths = Array.from({ length: 3 }, (_, i) =>
    dayjs().subtract(i, "month").format("MMMM")
  );

  const paginatedData = fakePdiData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex flex-wrap gap-4 items-center mb-4 border-b pb-2">
        {["Annuelle", "Trimestre actuel", currentMonth, "PDI - (Nom du PDI)"].map((label, idx) => (
          <span
            key={idx}
            className={`text-sm font-medium px-2 pb-1 border-b-2 ${
              idx === 0 ? "border-orange-400 text-orange-500" : "border-transparent text-gray-500"
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Rechercher"
            className="px-4 py-2 border rounded-md w-full sm:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <button className="text-gray-500 hover:text-orange-500">
            <FiFilter size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          Page {currentPage} / {totalPages}
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} className="hover:text-orange-500">
            <FaArrowLeft />
          </button>
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} className="hover:text-orange-500">
            <FaArrowRight />
          </button>
          <span className="text-lg">•••</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {lastThreeMonths.map((month, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 px-4 py-3 rounded-lg border shadow-sm cursor-pointer bg-slate-50 text-slate-700"
          >
            {idx % 2 === 0 ? <MdOutlineInsertDriveFile size={20} /> : <MdOpenInNew size={20} />}
            Rapport {month}
          </div>
        ))}
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              {["Domaines", "Matières", "Compét Hebdo", "Compétences", "Notes", "Progression"].map((head, i) => (
                <th key={i} className="text-left p-2 font-semibold text-gray-600">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-2">{item.domaine}</td>
                <td className="p-2">{item.matiere}</td>
                <td className="p-2">{item.competHebdo}</td>
                <td className="p-2">{item.competence}</td>
                <td className="p-2 font-bold">{item.note}</td>
                <td className="p-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-2 rounded-full ${
                          i < parseInt(item.note) / 20
                            ? ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-green-600"][i]
                            : "bg-gray-200"
                        }`}
                      ></div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
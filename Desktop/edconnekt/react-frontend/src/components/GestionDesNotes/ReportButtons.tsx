import { monthNames } from "./constants"; // On peut extraire les noms des mois dans un fichier de constants pour réutilisation
const currentDate = new Date();
const currentMonth = new Date().toLocaleString('fr-FR', { month: 'long' });
const currentMonthIndex = currentDate.getMonth();
const months = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre"
];

interface ReportButtonsProps {
  selectedView: "Annuel" | "Trimestre" | "Mois" | "PDI";
}

const ReportButtons: React.FC<ReportButtonsProps> = ({ selectedView }) => {
  const handleDownload = (name: string) => {
    alert(`Téléchargement de ${name}`);
  };

  if (selectedView === "Annuel") {
    return (
      <div className="flex gap-2 flex-wrap">
        {["Rapport Trimestre 1", "Rapport Trimestre 2", "Rapport Trimestre 3", "Rapport Trimestre 4"].map((name, idx) => (
          <button
            key={idx}
            onClick={() => handleDownload(name)}
            className="px-4 py-2 h-15 rounded-lg text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold"
          >
            {name}
          </button>
        ))}
      </div>
    );
  }

  if (selectedView === "Trimestre") {
    return (
      <div className="flex gap-2 flex-wrap">
        {months.map((month, idx) => (
          <button
            key={idx}
            onClick={() => handleDownload(`Rapport ${month}`)}
            className="px-4 h-15 py-2 rounded-lg text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold"
          >
            Rapport {month.charAt(0).toUpperCase() + month.slice(1)}
          </button>
        ))}
      </div>
    );
  }

  if (selectedView === "Mois") {
    return (
      <div className="flex gap-2 flex-wrap">
        {["Rapport du mois", "Bilan mensuel", `Avancement ${currentMonth}`].map((name, idx) => (
          <button
            key={idx}
            onClick={() => handleDownload(name)}
            className="px-4 h-15 py-2 rounded-lg text-sm bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold"
          >
            {name}
          </button>
        ))}
      </div>
    );
  }

  return null;
};

export default ReportButtons;

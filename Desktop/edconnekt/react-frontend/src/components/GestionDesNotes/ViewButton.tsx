interface ViewButtonProps {
    selectedView: "Annuel" | "Trimestre" | "Mois" | "PDI";
    setSelectedView: React.Dispatch<React.SetStateAction<"Annuel" | "Trimestre" | "Mois" | "PDI">>;
  }
  
  const ViewButton: React.FC<ViewButtonProps> = ({ selectedView, setSelectedView }) => {
    return (
      <div className="flex flex-row gap-2 mb-6">
        {["Annuel", "Trimestre", "Mois", "PDI"].map((view) => (
          <button
            key={view}
            onClick={() => setSelectedView(view as "Annuel" | "Trimestre" | "Mois" | "PDI")}
            className={`text-left px-4 py-2 rounded-lg font-semibold ${
              selectedView === view ? "bg-orange-400 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            {view === "Trimestre" ? "Trimestre actuel" : view === "Mois" ? "Mois actuel" : view}
          </button>
        ))}
      </div>
    );
  };
  
export default ViewButton;
  
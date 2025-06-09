const ProgressionEleves = () => {
    const eleves = [
      {
        nom: "Khadija Ndiaye",
        pdi: "Lecture anglais",
        date: "2 Mars 2025",
        progression: 85,
      },
      {
        nom: "Maty Diop",
        pdi: "Lecture anglais",
        date: "2 Mars 2025",
        progression: 50,
      },
      {
        nom: "Mouhamed Fall",
        pdi: "Lecture anglais",
        date: "2 Mars 2025",
        progression: 20,
      },
    ];
  
    const colors = ["bg-red-500", "bg-orange-400", "bg-yellow-300", "bg-green-500", "bg-blue-500"];
  
    return (
      <div className="rounded-2xl shadow-md p-6 bg-white w-full overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Progression des élèves</h2>
          <button className="text-sm text-blue-600 hover:underline flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Voir tout
          </button>
        </div>
  
        <div className="grid grid-cols-4 gap-4 font-semibold text-gray-600 border-b pb-2">
          <div>Nom</div>
          <div>PDI actifs</div>
          <div>Date</div>
          <div>Progression</div>
        </div>
  
        {eleves.map((eleve, index) => {
          const activeSegment = Math.floor((eleve.progression / 100) * 5);
          return (
            <div
              key={index}
              className="grid grid-cols-4 gap-4 items-center py-3 border-b hover:bg-gray-50 transition duration-150"
            >
              <div className="text-gray-800">{eleve.nom}</div>
              <div className="text-gray-600">{eleve.pdi}</div>
              <div className="text-gray-600">{eleve.date}</div>
              <div>
                <div className="flex w-full h-4 overflow-hidden rounded-full bg-gray-200">
                  {colors.map((color, i) => (
                    <div
                      key={i}
                      className={`h-full w-1/5 ${i < activeSegment ? color : "bg-gray-100"}`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-500 mt-1 text-right">{eleve.progression}%</div>
              </div>
            </div>
          );
        })}
  
        {/* Légende */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Légende :</h3>
          <div className="flex space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-1 bg-red-500 rounded-full" />
              <span>Très faible</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-6 h-1 bg-orange-400 rounded-full" />
              <span>Faible</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-6 h-1 bg-yellow-300 rounded-full" />
              <span>Moyenne</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-6 h-1 bg-green-500 rounded-full" />
              <span>Bonne</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-6 h-1 bg-blue-500 rounded-full" />
              <span>Très bonne</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProgressionEleves; 
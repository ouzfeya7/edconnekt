
// import { FaArrowRight, FaArrowLeft } from "react-icons/fa";om "react-icons/md";
import RapportView from "../../components/GestionDesNotes/RapportView";
const EvaluationPage = () => {

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Evaluation</h1>

      {/* Onglets */}
      <div className="flex gap-6 overflow-x-auto mb-6">
        {['Examen à venir', 'Activités récentes'].map((tab, idx) => (
          <div
            key={idx}
            className={`whitespace-nowrap text-sm font-medium px-4 py-2 border-b-2 ${idx === 0 ? 'border-orange-400 text-orange-500' : 'border-transparent text-gray-500'}`}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Devoirs à faire */}
      <h2 className="text-lg font-semibold mb-3">Devoirs à faire</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="bg-white shadow-md rounded-xl p-4">
            <h3 className="font-semibold text-base">Francais</h3>
            <p className="text-sm text-gray-500">lecture</p>
            <div className="flex justify-between text-xs mt-4">
              <span className="text-gray-400">📅 25ᵗʰ March 2022</span>
              <span className="text-red-400">🔥 8ᵗʰ April 2022</span>
            </div>
            <button className="mt-4 px-4 py-2 text-white bg-slate-800 rounded-md hover:bg-slate-700">
              Soumettre
            </button>
            <div className="h-1 bg-gradient-to-r from-blue-500 to-orange-400 mt-2 rounded-full" />
          </div>
        ))}
      </div>

      {/* Filtres et Rapports */}
    <div className="bg-white rounded-xl p-6 shadow-md">

      
    <RapportView />

        {/* <div className="flex flex-wrap justify-between items-center mb-6 gap-4"> */}
          {/* <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Rechercher"
              className="px-4 py-2 border rounded-md w-full sm:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <button className="text-gray-500 hover:text-orange-500">
              <FiFilter size={18} />
            </button>
          </div> */}

          {/* <div className="flex items-center gap-2 text-sm text-gray-500">
            Page 1-04
            <button className="hover:text-orange-500"><FaArrowLeft /></button>
            <button className="hover:text-orange-500"><FaArrowRight /></button>
            <span className="text-lg">•••</span>
          </div> */}
        {/* </div> */}

        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((trimestre) => (
            <div
              key={trimestre}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border shadow-sm cursor-pointer ${
                trimestre === 0
                  ? 'bg-slate-100 text-slate-600'
                  : trimestre === 1
                  ? 'bg-orange-50 text-orange-600'
                  : trimestre === 2
                  ? 'bg-red-50 text-red-600'
                  : 'bg-indigo-50 text-indigo-600'
              }`}
            >
              {trimestre === 0 || trimestre === 3 ? (
                <MdOutlineInsertDriveFile size={20} />
              ) : (
                <MdOpenInNew size={20} />
              )}
              Rapport trimestre {trimestre}
            </div>
          ))}
        </div> */}
      </div>
      {/* <PDIView /> */}
    </div>
  );
};

export default EvaluationPage;
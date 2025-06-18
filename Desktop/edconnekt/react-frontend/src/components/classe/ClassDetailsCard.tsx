interface ClassDetailsCardProps {
  className: string; // ex: "4ème B"
  seriesName: string; // ex: "Series one"
  seriesPrefix?: string; // ex: "1ere", optionnel pour plus de flexibilité
  teacherName: string;
  genderCount: {
    male: number;
    female: number;
  };
}

const ClassDetailsCard: React.FC<ClassDetailsCardProps> = ({
  className,
  seriesName,
  seriesPrefix = "1ere", // Valeur par défaut si non fournie
  teacherName,
  genderCount
}) => {
  const totalStudents = genderCount.male + genderCount.female;
  // Calculer les pourcentages pour les barres, éviter la division par zéro
  const malePercentage = totalStudents > 0 ? (genderCount.male / totalStudents) * 100 : 0;
  const femalePercentage = totalStudents > 0 ? (genderCount.female / totalStudents) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs mx-auto font-sans">
      {/* Cercle avec nom de la classe */}
      <div className="w-24 h-24 bg-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
        {className}
      </div>

      {/* Titre de la classe */}
      <h2 className="text-xl font-semibold text-center mt-4 text-gray-800">
        Classe {className}
      </h2>

      {/* Section Série */}
      <div className="flex items-center mt-4">
        <div className="w-1 bg-blue-600 h-10 mr-3"></div>
        <div>
          <span className="text-3xl font-bold text-gray-700">{seriesPrefix}</span>
          <span className="ml-2 text-gray-500 text-sm align-bottom">{seriesName}</span>
        </div>
      </div>

      {/* Professeur titulaire */}
      <div className="mt-6">
        <p className="text-xs text-gray-500 uppercase tracking-wider">Professeur titulaire</p>
        <p className="text-md font-semibold text-gray-800 mt-1">{teacherName}</p>
      </div>

      {/* Comptage par genre */}
      <div className="mt-6">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-gray-500">Masculin</p>
            <p className="text-2xl font-bold text-gray-800">{genderCount.male}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 text-right">Féminin</p>
            <p className="text-2xl font-bold text-gray-800 text-right">{genderCount.female}</p>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          {/* Barre Masculin */}
          <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
            <div 
              className="bg-red-500 h-1.5 rounded-full"
              style={{ width: `${malePercentage}%` }}
            ></div>
          </div>
          {/* Barre Féminin */}
          <div className="w-full bg-gray-200 rounded-full h-1.5 ml-2">
            <div 
              className="bg-blue-600 h-1.5 rounded-full"
              style={{ width: `${femalePercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailsCard; 
const Evaluations = () => {
    // Fonction pour déterminer la couleur des notes en pourcentage
    const getPercentageColor = (percent: number) => {
      if (percent >= 70) return 'text-green-600 bg-green-100'
      if (percent >= 40) return 'text-yellow-600 bg-yellow-100'
      return 'text-red-600 bg-red-100'
    }
  
    return (
      <div className="p-6 space-y-8 bg-gray-50">
        {/* Premier tableau */}
        <div className="overflow-x-auto rounded-lg shadow-sm">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-900 uppercase bg-gray-200">
              <tr>
                <th className="px-4 py-3">Matières</th>
                <th className="px-4 py-3">1ère Devoir</th>
                <th className="px-4 py-3">2ème Devoir</th>
                <th className="px-4 py-3">3ème Devoir</th>
                <th className="px-4 py-3">Examen T1</th>
                <th className="px-4 py-3">Moyenne</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Français', 11, 17, 6, 9, 9],
                ['Anglais', 16, 20, 14, 16, 16],
                ['Mathématique', 6, 13, 14, 20, 20],
                ['Histoire et Géographie', 19, 5, 14, 10, 10],
                ['2 Mars 2025', 17, 8, 12, 16, 16],
                ['2 Mars 2025', 8, 8, 14, 8, 16],
                ['2 Mars 2025', 8, 14, 10, 20, 18],
              ].map((row, index) => (
                <tr key={index} className="bg-white border-b even:bg-gray-50">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3 font-medium">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Deuxième tableau */}
        <div className="overflow-x-auto rounded-lg shadow-sm">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-gray-900 uppercase bg-gray-200">
              <tr>
                <th className="px-4 py-3">Domaines</th>
                <th className="px-4 py-3">Matières</th>
                <th className="px-4 py-3">Compét Hebdo</th>
                <th className="px-4 py-3">Compétences</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3">Progression</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Science', 'Math', 'Numérique', 'Numérique', 84],
                ['Langue et Com', 'Français', 'Numérique', 'Géométrie', 4],
                ['Langue et Com', 'Anglais', 'Numérique', 'Lecture', 46],
                ['Science', 'Math', 'Numérique', 'Orthographe', 24],
                ['Art créatif', 'Dessin', 'Numérique', 'Numérique', 97],
                ['Science', 'IST', 'Numérique', 'Numérique', 87],
              ].map((row, index) => (
                <tr key={index} className="bg-white border-b even:bg-gray-50">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`px-4 py-3 ${
                        cellIndex === 4
                          ? `font-bold ${getPercentageColor(Number(cell))} px-2 py-1 rounded`
                          : ''
                      }`}
                    >
                      {cellIndex === 4 ? `${cell}%` : cell}
                    </td>
                  ))}
                  <td className="px-4 py-3">—</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end p-4 bg-white">
            <span className="text-2xl font-bold text-blue-600">31%</span>
          </div>
        </div>
      </div>
    )
  }
  export default Evaluations 
import { useUser } from '../../layouts/DashboardLayout';
import { Student } from '../../contexts/StudentContext';

const StudentDetailPage = () => {
  const { user } = useUser();

  if (!user) {
    return <div>Chargement des données de l'élève...</div>;
  }

  // Adapter l'objet `user` du layout à l'objet `student` attendu par les composants
  const student: Student = {
    id: 1, // L'ID n'est pas dans le contexte, à voir comment le gérer
    name: user.name,
    imageUrl: user.imageUrl || '',
    ref: 'STU_KEYCLOAK_USER', // Donnée non disponible, valeur par défaut
    gender: user.gender || 'Non spécifié',
    birthDate: user.birthDate || 'Date de naissance non disponible',
    email: user.email,
    address: user.address,
    department: user.department || 'Département non disponible',
    class: '4ème B', // Donnée non disponible, valeur par défaut
    admissionDate: user.entryDate || 'Date non disponible',
    status: 'Présent', // Statut non disponible, valeur par défaut
    competence: "Lecture anglais",
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* Section principale */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Colonne gauche */}
        <div className="space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-2 gap-4 text-sm bg-white shadow-md rounded-lg p-4">
            <div>
              <p className="font-semibold text-gray-700">Lundi</p>
              <p className="text-gray-500">24 Mars 2025</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Classe</p>
              <p className="text-gray-500">{student.class}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Présent</p>
              <p className="text-green-600 font-bold">95%</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Retard</p>
              <p className="text-yellow-500 font-bold">2,5%</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Absent</p>
              <p className="text-red-600 font-bold">2,5%</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Année Scolaire</p>
              <p className="text-gray-500">2024/2025</p>
            </div>
          </div>

          {/* Devoirs à faire */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Devoirs à faire</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <p className="font-medium text-gray-700">Géométrie</p>
                <p className="text-gray-500">Mathématique</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-500">25 Mars 2025</p>
                <p className="text-gray-500">8 Avril 2025</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-green-600 font-bold">12 Soumis</p>
                <p className="text-red-600 font-bold">8 Non soumis</p>
              </div>
            </div>
          </div>

          {/* Évaluation */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Évaluation T1</h3>
            <p className="text-sm text-gray-500 mb-4">PDI 01-07</p>
            <div className="overflow-auto">
              <table className="table-auto w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border-b text-gray-700">Matières</th>
                    <th className="p-2 border-b text-gray-700">1ère Devoir</th>
                    <th className="p-2 border-b text-gray-700">2ème Devoir</th>
                    <th className="p-2 border-b text-gray-700">3ème Devoir</th>
                    <th className="p-2 border-b text-gray-700">Examen T1</th>
                    <th className="p-2 border-b text-gray-700">Moyenne</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border-b">Français</td>
                    <td className="p-2 border-b">11</td>
                    <td className="p-2 border-b">17</td>
                    <td className="p-2 border-b">6</td>
                    <td className="p-2 border-b">9</td>
                    <td className="p-2 border-b">9</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-b">Anglais</td>
                    <td className="p-2 border-b">16</td>
                    <td className="p-2 border-b">20</td>
                    <td className="p-2 border-b">14</td>
                    <td className="p-2 border-b">16</td>
                    <td className="p-2 border-b">16</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-b">Mathématique</td>
                    <td className="p-2 border-b">6</td>
                    <td className="p-2 border-b">13</td>
                    <td className="p-2 border-b">14</td>
                    <td className="p-2 border-b">20</td>
                    <td className="p-2 border-b">20</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Colonne droite */}
        <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{student.name}</h2>
            <p className="text-gray-500">Ref ID: {student.ref}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-gray-700">Sexe</p>
              <p className="text-gray-500">{student.gender}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Date de naissance</p>
              <p className="text-gray-500">{student.birthDate}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Email</p>
              <p className="text-gray-500">{student.email}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Adresse</p>
              <p className="text-gray-500">{student.address}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Département</p>
              <p className="text-gray-500">{student.department}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Classe</p>
              <p className="text-gray-500">{student.class}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Date d'admission</p>
              <p className="text-gray-500">{student.admissionDate}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Statut</p>
              <p className="text-green-600 font-bold">{student.status}</p>
            </div>
          </div>
          <div className="flex justify-between">
            <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Retour</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Modifier</button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default StudentDetailPage; 
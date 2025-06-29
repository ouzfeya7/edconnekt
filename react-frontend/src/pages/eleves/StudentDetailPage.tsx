import { useUser } from '../../layouts/DashboardLayout';
import { Student } from '../../contexts/StudentContext';
import { useTranslation } from 'react-i18next';

const StudentDetailPage = () => {
  const { user } = useUser();
  const { t } = useTranslation();

  if (!user) {
    return <div>{t('loading_student_data', "Chargement des données de l'élève...")}</div>;
  }

  // Adapter l'objet `user` du layout à l'objet `student` attendu par les composants
  const student: Student = {
    id: 1, // L'ID n'est pas dans le contexte, à voir comment le gérer
    name: user.name,
    imageUrl: user.imageUrl || '',
    ref: 'STU12340', // Donnée non disponible, valeur par défaut
    gender: user.gender || t('unspecified', 'Non spécifié'),
    birthDate: user.birthDate || t('dob_unavailable', 'Date de naissance non disponible'),
    email: user.email,
    address: user.address,
    department: user.classLabel || t('class_unavailable', 'Classe non disponible'),
    class: user.classId || 'CP1', // Utiliser la classe de l'utilisateur
    admissionDate: user.entryDate || t('date_unavailable', 'Date non disponible'),
    status: t('present'), // Statut non disponible, valeur par défaut
    competence: "Lecture anglais",
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* Section principale */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Colonne de gauche (2/3 de la largeur) */}
        <div className="xl:col-span-2 space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm bg-white shadow-md rounded-lg p-4">
            <div>
              <p className="font-semibold text-gray-700">{t('monday', 'Lundi')}</p>
              <p className="text-gray-500">24 Mars 2025</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">{t('class', 'Classe')}</p>
              <p className="text-gray-500">{student.class}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">{t('present', 'Présent')}</p>
              <p className="text-green-600 font-bold">95%</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">{t('late', 'Retard')}</p>
              <p className="text-yellow-500 font-bold">2,5%</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">{t('absent', 'Absent')}</p>
              <p className="text-red-600 font-bold">2,5%</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">{t('school_year', 'Année Scolaire')}</p>
              <p className="text-gray-500">2024/2025</p>
            </div>
          </div>

          {/* Devoirs à faire */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">{t('homework_to_do', 'Devoirs à faire')}</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <p className="font-medium text-gray-700">{t('geometry', 'Géométrie')}</p>
                <p className="text-gray-500">{t('subject_math', 'Mathématique')}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-500">25 Mars 2025</p>
                <p className="text-gray-500">8 Avril 2025</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-green-600 font-bold">{t('submitted', '{count} Soumis', { count: 12 })}</p>
                <p className="text-red-600 font-bold">{t('not_submitted', '{count} Non soumis', { count: 8 })}</p>
              </div>
            </div>
          </div>

          {/* Évaluation */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">{t('evaluation_t1', 'Évaluation T1')}</h3>
            <p className="text-sm text-gray-500 mb-4">PDI 01-07</p>
            <div className="overflow-auto">
              <table className="table-auto w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border-b text-gray-700">{t('subjects', 'Matières')}</th>
                    <th className="p-2 border-b text-gray-700">{t('first_assignment', '1ère Devoir')}</th>
                    <th className="p-2 border-b text-gray-700">{t('second_assignment', '2ème Devoir')}</th>
                    <th className="p-2 border-b text-gray-700">{t('third_assignment', '3ème Devoir')}</th>
                    <th className="p-2 border-b text-gray-700">{t('exam_t1', 'Examen T1')}</th>
                    <th className="p-2 border-b text-gray-700">{t('average', 'Moyenne')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border-b">{t('french', 'Français')}</td>
                    <td className="p-2 border-b">11</td>
                    <td className="p-2 border-b">17</td>
                    <td className="p-2 border-b">6</td>
                    <td className="p-2 border-b">9</td>
                    <td className="p-2 border-b">9</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-b">{t('english', 'Anglais')}</td>
                    <td className="p-2 border-b">16</td>
                    <td className="p-2 border-b">20</td>
                    <td className="p-2 border-b">14</td>
                    <td className="p-2 border-b">16</td>
                    <td className="p-2 border-b">16</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-b">{t('subject_math', 'Mathématique')}</td>
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

        {/* Colonne droite (1/3 de la largeur) */}
        <div className="bg-white shadow-md rounded-lg p-6 space-y-6 xl:col-span-1">
          <div className="flex flex-col items-center">
            <button className="self-start text-sm flex items-center text-gray-600 hover:text-gray-800 mb-4">
              &lt; {t('back', 'Retour')}
            </button>
            <img src={student.imageUrl} alt={student.name} className="w-24 h-24 rounded-full object-cover mb-4" />
            <h2 className="text-xl font-bold text-gray-800">{student.name}</h2>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold text-gray-500 uppercase text-xs">{t('ref_id', 'RÉF. ID')}</p>
              <p className="text-gray-800">{student.ref}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-500 uppercase text-xs">{t('sex', 'SEXE')}</p>
              <p className="text-gray-800">{student.gender === 'F' ? t('female', 'Féminin') : t('male', 'Masculin')}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-500 uppercase text-xs">{t('date_of_birth', 'DATE DE NAISSANCE')}</p>
              <p className="text-gray-800">{student.birthDate}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-500 uppercase text-xs">{t('email', 'EMAIL')}</p>
              <p className="text-gray-800">{student.email}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-500 uppercase text-xs">{t('address', 'ADRESSE')}</p>
              <p className="text-gray-800">{student.address}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-500 uppercase text-xs">{t('admission_date', "Date d'admission")}</p>
              <p className="text-gray-800">{student.admissionDate}</p>
            </div>
             <div>
              <p className="font-semibold text-gray-500 uppercase text-xs">{t('status_header', 'Statut')}</p>
              <p className="text-green-600 font-bold">{student.status}</p>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button className="bg-white text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 border border-gray-200 shadow">{t('edit', 'Modifier')}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage; 
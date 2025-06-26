"use client";
import ClassInfoSection from "../../components/eleve/ClassInfoSection";
import AssignmentsSection from "../../components/eleve/AssignmentsSection";
import StudentProfileSection from "../../components/eleve/StudentProfileSection";
import StudentProgressionChart from "../../components/eleve/StudentProgressionChart";
import { useUser } from '../../layouts/DashboardLayout';
import { Student } from '../../contexts/StudentContext';

function Globale() {
  const { user } = useUser();

  const handleBack = () => {
    console.log("Retour cliqué");
    // Mettre ici la logique de navigation si nécessaire
  };

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
    class: 'CP1',
    admissionDate: user.entryDate || 'Date non disponible',
    status: 'Présent',// Statut non disponible, valeur par défaut
    competence: "Lecture anglais",
  };


  return (
    <main className="flex gap-6 items-start p-6">
      <section className="flex flex-col flex-1 gap-6">
        <ClassInfoSection studentClassName={student.class} />
        <AssignmentsSection />
        <StudentProgressionChart />
      </section>
      <aside className="w-[287px] flex-shrink-0">
        <StudentProfileSection student={student} onBack={handleBack} />
      </aside>
    </main>
  );
}

export default Globale;

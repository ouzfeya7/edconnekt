"use client";
import ClassInfoSection from "../../components/eleve/ClassInfoSection";
import AssignmentsSection from "../../components/eleve/AssignmentsSection";
import StudentProfileSection from "../../components/eleve/StudentProfileSection";
import StudentProgressionChart from "../../components/eleve/StudentProgressionChart";
import { mockStudent } from "../../lib/mock-data";

function Globale() {
  const handleBack = () => {
    console.log("Retour cliqué");
    // Mettre ici la logique de navigation si nécessaire
  };

  return (
    <main className="flex gap-6 items-start">
      <section className="flex flex-col flex-1 gap-6">
        <ClassInfoSection studentClassName={mockStudent.class} />
        <AssignmentsSection />
        <StudentProgressionChart />
      </section>
      <aside className="w-[287px] flex-shrink-0">
        <StudentProfileSection student={mockStudent} onBack={handleBack} />
      </aside>
    </main>
  );
}

export default Globale;

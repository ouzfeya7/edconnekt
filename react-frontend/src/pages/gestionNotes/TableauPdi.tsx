"use client";
import { useState } from "react";
import Breadcrumbs from "../../components/GestionDesNotes/Breadcrumbs";
import PeriodSelector from "../../components/GestionDesNotes/PeriodSelector";
import PerformanceMetrics from "../../components/GestionDesNotes/PerformanceMetrics";
import SubjectTabs from "../../components/GestionDesNotes/SubjectTabs";
import TableControls from "../../components/GestionDesNotes/TableControls";
import StudentTable from "../../components/GestionDesNotes/StudentTable";
import OngletsRapports from "../../components/GestionDesNotes/OngletsRapports";

function TableauPDI() {
  const [selectedSubject, setSelectedSubject] = useState("langue");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  // Fonction pour changer de matière
  function handleSubjectChange(subject: string) {
    setSelectedSubject(subject);
  }

  // Fonction pour gérer les actions (par exemple : supprimer, mettre à jour, etc.)

  // Navigation des pages
  function nextPage() {
    setCurrentPage((prev) => prev + 1);
  }

  function prevPage() {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }

  return (
    <section className="px-2.5 pt-2.5 bg-white rounded-xl">
      <div className="flex flex-col items-start w-full max-w-[1120px] min-h-[810px] max-md:max-w-full">
        <Breadcrumbs />

        <div className="flex flex-wrap gap-2.5 items-center mt-3 max-md:max-w-full">
          <PeriodSelector />
          <PerformanceMetrics />
        </div>

        <SubjectTabs
          selectedSubject={selectedSubject}
          onSubjectChange={handleSubjectChange} // Appel de la fonction pour changer de matière
        />

        <TableControls
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalItems={10}
          onNextPage={nextPage}
          onPrevPage={prevPage}
        />

        <StudentTable
          selectedSubject={selectedSubject}  // Passe la matière sélectionnée au tableau
        />
        
        <OngletsRapports />
      </div>
    </section>
  );
}

export default TableauPDI;

import React, { useState } from "react";
import ViewButton from "./ViewButton";
import ReportButtons from "./ReportButtons";
import StudentTable from "./StudentTable";

const RapportView: React.FC = () => {
  const [selectedView, setSelectedView] = useState<"Annuel" | "Trimestre" | "Mois" | "PDI">("Annuel");

  return (
    <div className="p-6">
      <ViewButton selectedView={selectedView} setSelectedView={setSelectedView} />
      <ReportButtons 
        selectedView={selectedView} 
        currentPeriod=""
        onPeriodChange={() => {}}
        periods={[]}
      />
      {selectedView === "PDI" && <StudentTable selectedSubject={""} />}
    </div>
  );
};

export default RapportView;

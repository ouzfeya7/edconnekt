import DateCard from "../Header/DateCard";
import ClassNameCard from "../Header/ClassNameCard";
import AttendanceStats from "./AttendanceStats";
import { useState } from "react";
import { useAuth } from "../../pages/authentification/useAuth";

interface ClassInfoSectionProps {
  studentClassName: string;
}

const ClassInfoSection: React.FC<ClassInfoSectionProps> = ({ studentClassName }) => {
  const { roles } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());

  const isClassEditable = !roles.includes('eleve');

  return (
    <section className="flex flex-wrap gap-4 items-stretch w-full max-md:max-w-full">
      {/* Remplacer InfoCard par DateCard */}
      <div className="flex-grow min-w-[180px]"> {/* Ajout de flex-grow et min-w pour une meilleure responsivité */}
        <DateCard value={currentDate} onChange={setCurrentDate} />
      </div>

      {/* Remplacer InfoCard par ClassNameCard */}
      <div className="flex-grow min-w-[180px]"> {/* Ajout de flex-grow et min-w */}
        <ClassNameCard
          className={studentClassName}
          onClassChange={() => {}}
          isEditable={isClassEditable}
        />
      </div>

      <div className="flex-grow min-w-[250px]"> {/* Ajout de flex-grow et min-w */}
        <AttendanceStats
          stats={[
            { label: "Present", value: "95%", color: "text-emerald-600" },
            { label: "Retard", value: "2,5%", color: "text-amber-500" },
            { label: "Absent", value: "2,5%", color: "text-red-600" },
          ]}
        />
      </div>
    </section>
  );
};

export default ClassInfoSection;

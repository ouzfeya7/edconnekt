import DateCard from "../Header/DateCard";
import ClassNameCard from "../Header/ClassNameCard";
import AttendanceStats from "./AttendanceStats";

interface ClassInfoSectionProps {
  studentClassName: string;
}

const ClassInfoSection: React.FC<ClassInfoSectionProps> = ({ studentClassName }) => {
  // Fonction pour formater la date en "jour Mois Année"
  const formatDate = (date: Date): string => {
    const day = date.getDate();
    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const currentDate = formatDate(new Date());
  // La classe provient maintenant des props
  // const studentClassName = "4e B"; 

  return (
    <section className="flex flex-wrap gap-4 items-stretch w-full max-md:max-w-full">
      {/* Remplacer InfoCard par DateCard */}
      <div className="flex-grow min-w-[180px]"> {/* Ajout de flex-grow et min-w pour une meilleure responsivité */}
        <DateCard value={currentDate} />
      </div>

      {/* Remplacer InfoCard par ClassNameCard */}
      <div className="flex-grow min-w-[180px]"> {/* Ajout de flex-grow et min-w */}
        <ClassNameCard value={studentClassName} isEditable={false} />
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

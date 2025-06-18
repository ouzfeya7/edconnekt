
interface GradeTableProps {
  subjects: string[];
  grades: {
    [category: string]: string[];
  };
}

const GradeTable = ({ subjects, grades }: GradeTableProps) => {
  const categories = Object.keys(grades);

  return (
    <div className="flex flex-wrap gap-8 items-start mt-3 w-full text-sm font-bold leading-none text-gray-600 max-md:max-w-full">
      {/* Subjects column */}
      <div className="grow shrink w-[153px]">
        <h3 className="p-2.5 w-36 max-w-full font-medium text-gray-800 whitespace-nowrap">
          Matières
        </h3>
        {subjects.map((subject, index) => (
          <p key={index} className="p-2.5 mt-1.5 w-full whitespace-nowrap">
            {subject}
          </p>
        ))}
      </div>

      {/* Grade columns */}
      {categories.map((category, categoryIndex) => {
        const categoryGrades = grades[category];
        const width =
          category === "Moyenne"
            ? "w-[66px]"
            : category === "Examen T1"
              ? "w-[77px]"
              : category === "1ère Devoir"
                ? "w-[79px]"
                : "w-[89px]";

        return (
          <div
            key={categoryIndex}
            className={`grow shrink ${width} ${category === "Moyenne" ? "whitespace-nowrap" : ""}`}
          >
            <h3 className="p-2.5 font-medium text-gray-800">{category}</h3>
            {categoryGrades.map((grade, gradeIndex) => (
              <p
                key={gradeIndex}
                className={`p-2.5 mt-1.5 w-full ${categoryIndex < categories.length - 1 ? "whitespace-nowrap" : ""}`}
              >
                {grade}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default GradeTable;

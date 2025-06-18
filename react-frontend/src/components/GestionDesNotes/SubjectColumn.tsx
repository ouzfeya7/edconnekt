import React from "react";

interface SubjectColumnProps {
  title: string;
  values: string[];
  isAlternate?: boolean;
  width?: string;
}

const SubjectColumn: React.FC<SubjectColumnProps> = ({
  title,
  values,
  isAlternate = false,
  width = "100px",
}) => {
  return (
    <div
      className={`text-sm font-bold leading-none text-gray-600 whitespace-nowrap ${isAlternate ? "bg-gray-50" : ""} w-[${width}]`}
    >
      <div
        className={`gap-2.5 self-stretch p-2.5 ${width === "110px" ? "max-w-full" : "w-full"} font-medium text-gray-800 bg-gray-50 border-t border-b border-solid border-b-[color:var(--Foundation-Green-G50,#E8EDF0)] border-t-[color:var(--Foundation-Green-G50,#E8EDF0)] ${width === "110px" ? `w-[${width}]` : ""}`}
      >
        {title}
      </div>

      {values.map((value, index) => (
        <div
          key={index}
          className={`gap-2.5 ${index === 0 && title === "Langage" ? "" : "self-stretch"} p-2.5 mt-1.5 ${width === "110px" ? `max-w-full w-[${width}]` : "w-full"}`}
        >
          {value}
        </div>
      ))}
    </div>
  );
};

export default SubjectColumn;

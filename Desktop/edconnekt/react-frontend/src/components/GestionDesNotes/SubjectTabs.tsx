"use client";
import React from "react";

interface SubjectTabsProps {
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
}

const SubjectTabs: React.FC<SubjectTabsProps> = ({
  selectedSubject,
  onSubjectChange,
}) => {
  return (
    <div className="flex flex-col justify-center self-stretch p-2.5 mt-3 w-full">
      <div className="flex flex-col w-full max-md:max-w-full">
        <div className="flex flex-wrap gap-8 items-center self-start text-base font-medium text-center text-sky-950 max-md:max-w-full">
          <button
            className="gap-2.5 self-stretch px-2 py-2.5 my-auto rounded cursor-pointer duration-[0.2s] ease-[ease] transition-[background-color]"
            onClick={() => onSubjectChange("langue")}
            style={{
              backgroundColor:
                selectedSubject === "langue"
                  ? "var(--Foundation-Orange-O50, #FEF2E7)"
                  : "transparent",
            }}
          >
            Langue et communication
          </button>
          <button
            className="gap-2.5 self-stretch p-2.5 my-auto rounded cursor-pointer duration-[0.2s] ease-[ease] transition-[background-color]"
            onClick={() => onSubjectChange("social")}
            style={{
              backgroundColor:
                selectedSubject === "social"
                  ? "var(--Foundation-Orange-O50, #FEF2E7)"
                  : "transparent",
            }}
          >
            Sciences Sociales
          </button>
          <button
            className="gap-2.5 self-stretch p-2.5 my-auto whitespace-nowrap rounded cursor-pointer duration-[0.2s] ease-[ease] transition-[background-color]"
            onClick={() => onSubjectChange("stem")}
            style={{
              backgroundColor:
                selectedSubject === "stem"
                  ? "var(--Foundation-Orange-O50, #FEF2E7)"
                  : "transparent",
            }}
          >
            STEM
          </button>
          <button
            className="gap-2.5 self-stretch p-2.5 my-auto rounded cursor-pointer duration-[0.2s] ease-[ease] min-w-60 transition-[background-color]"
            onClick={() => onSubjectChange("art")}
            style={{
              backgroundColor:
                selectedSubject === "art"
                  ? "var(--Foundation-Orange-O50, #FEF2E7)"
                  : "transparent",
            }}
          >
            CREATIVITE ARTISTIQUE / SPORTIVE
          </button>
        </div>
        <div className="px-px w-full">
          <div className="flex flex-col items-start bg-gray-200 max-md:pr-5 max-md:max-w-full">
            <div className="flex shrink-0 h-0.5 bg-orange-500 w-[212px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectTabs;

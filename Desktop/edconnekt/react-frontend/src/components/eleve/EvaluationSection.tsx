import { useState } from "react";
import GradeTable from "./GradeTable";
import { LevelIndicator } from "./LevelIndicator";
import { EvaluationRowProps } from "./types";

const EvaluationSection = () => {
  const [view, setView] = useState<"grades" | "pdi">("grades");

  const subjects = [
    "Français",
    "Anglais",
    "Mathématique",
    "Histoire et Géographie",
  ];

  const grades = {
    "1er Devoir": ["11", "16", "6", "19"],
    "2e Devoir": ["17", "20", "13", "5"],
    "3e Devoir": ["6", "14", "14", "14"],
    "Examen T1": ["9", "16", "20", "10"],
    Moyenne: ["10", "16.5", "13.25", "12"],
  };

  const evaluationRows: EvaluationRowProps[] = [
    { domain: "Science", subject: "Math", weeklyCompetence: "Numérique", competence: "Numération", grade: "84%", progressLevel: 4 },
    { domain: "Langue et Com", subject: "Français", weeklyCompetence: "Lecture", competence: "Compréhension", grade: "72%", progressLevel: 3 },
    { domain: "Langue et Com", subject: "Anglais", weeklyCompetence: "Oral", competence: "Vocabulaire", grade: "65%", progressLevel: 2 },
  ];

  return (
    <section className="flex flex-col justify-center py-2.5 pr-1.5 pl-2.5 mt-3.5 w-full bg-white rounded-xl max-md:max-w-full">
      <div className="w-full max-w-[817px] max-md:max-w-full">
        <div className="flex flex-col justify-center p-2.5 w-full">
          <div className="flex flex-col w-full max-md:max-w-full">
            <div className="flex gap-8 items-center self-start font-medium">
              <h2
                className={`py-2.5 my-auto text-base text-center cursor-pointer ${
                  view === "grades" ? "text-sky-950 font-bold" : "text-gray-500"
                }`}
                onClick={() => setView("grades")}
              >
                Evaluation T1
              </h2>
              <p
                className={`p-2.5 my-auto text-sm leading-none cursor-pointer ${
                  view === "pdi" ? "text-sky-950 font-bold" : "text-gray-500"
                }`}
                onClick={() => setView("pdi")}
              >
                PDI 01-07
              </p>
            </div>
            <div className="w-full max-md:max-w-full">
              <div className="flex flex-col items-start bg-gray-200 max-md:pr-5 max-md:max-w-full">
                <div className="flex shrink-0 h-0.5 bg-orange-500 w-[102px]" />
              </div>
            </div>
          </div>
        </div>

        {view === "grades" ? (
          <GradeTable subjects={subjects} grades={grades} />
        ) : (
          <div className="flex flex-wrap items-start mt-3 w-full max-md:max-w-full">
            <div className="flex-1 shrink text-sm text-gray-600 basis-[15px]">
              <div className="p-2.5 w-36 font-medium text-gray-800 bg-gray-50 border-y border-gray-100">
                Domaines
              </div>
              {evaluationRows.map((row, index) => (
                <div key={`domain-${index}`} className="p-2.5 mt-1.5 bg-white">
                  {row.domain}
                </div>
              ))}
            </div>

            <div className="flex-1 shrink pr-1 text-sm text-gray-600 bg-gray-50 basis-[11px]">
              <div className="p-2.5 font-medium text-gray-800 bg-gray-50 border-y border-gray-100 w-[131px]">
                Matières
              </div>
              {evaluationRows.map((row, index) => (
                <div key={`subject-${index}`} className="p-2.5 mt-1.5">
                  {row.subject}
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-600 w-[122px]">
              <div className="p-2.5 font-medium text-gray-800 bg-gray-50 border-y border-gray-100">
                Compét Hebdo
              </div>
              {evaluationRows.map((row, index) => (
                <div key={`weekly-${index}`} className="p-2.5 mt-1.5">
                  {row.weeklyCompetence}
                </div>
              ))}
            </div>

            <div className="flex-1 shrink text-sm text-gray-600 bg-gray-50 basis-[15px]">
              <div className="p-2.5 font-medium text-gray-800 bg-gray-50 border-y border-gray-100 w-[134px]">
                Compétences
              </div>
              {evaluationRows.map((row, index) => (
                <div key={`competence-${index}`} className="p-2.5 mt-1.5">
                  {row.competence}
                </div>
              ))}
            </div>

            <div className="flex flex-col flex-1 shrink items-start text-sm font-bold text-gray-600 basis-[15px] w-[135px]">
              <div className="p-2.5 font-medium text-gray-800 bg-gray-50 border-y border-gray-100">
                Notes
              </div>
              {evaluationRows.map((row, index) => (
                <div key={`grade-${index}`} className="p-2.5 mt-1.5 bg-white w-[110px]">
                  {row.grade}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-start pr-4 bg-gray-50 w-[156px]">
              <div className="p-2.5 text-sm font-medium text-gray-800 border-y border-gray-100">
                Progression
              </div>
              {evaluationRows.map((row, index) => (
                <LevelIndicator key={`progress-${index}`} level={row.progressLevel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EvaluationSection;

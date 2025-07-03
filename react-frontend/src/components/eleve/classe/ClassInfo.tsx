import { ClassData } from "./types";

interface ClassInfoCardProps {
  classData: ClassData;
}

export function ClassInfoCard({ classData }: ClassInfoCardProps) {
  return (
    <article className="flex flex-col px-7 py-7 w-full bg-white rounded-xl max-md:px-5">
      <div className="self-center px-3.5 text-xl font-bold leading-snug text-white bg-pink-700 rounded-full aspect-[1/1] fill-pink-700 h-[100px] w-[100px] flex items-center justify-center">
        4ème B
      </div>

      <h2 className="self-center mt-2 text-xl font-bold leading-snug text-sky-950">
        Classe 4e B
      </h2>

      <div className="flex gap-3 items-center font-bold text-center bg-white rounded-lg shadow-[0px_14px_18px_rgba(0,0,0,0.04)] text-indigo-950 mt-4">
        <div className="flex shrink-0 self-stretch w-2 bg-blue-900 rounded-lg h-[52px]" />
        <div className="self-stretch my-auto text-2xl flex items-center">
          1ere
        </div>
        <div className="grow shrink self-stretch my-auto text-base w-[143px] flex items-center">
          {classData.series}
        </div>
      </div>

      <div className="self-start mt-5 max-md:ml-0.5">
        <h3 className="text-xs tracking-wide text-black">
          Professeur titulaire
        </h3>
        <p className="text-sm font-semibold leading-7 text-black">
          {classData.teacherName}
        </p>
      </div>

      <div className="flex gap-8 items-center self-start mt-2.5 text-black whitespace-nowrap max-md:ml-0.5">
        <div className="self-stretch my-auto w-[93px]">
          <h4 className="text-xs tracking-wide">Masculin</h4>
          <p className="mt-1 text-base font-bold">
            {classData.maleCount.toString().padStart(2, "0")}
          </p>
          <div className="flex mt-1 w-full bg-rose-600 rounded-sm min-h-1" />
        </div>

        <div className="self-stretch my-auto w-[93px]">
          <h4 className="text-xs tracking-wide">Féminin</h4>
          <p className="mt-1 text-base font-bold">
            {classData.femaleCount.toString().padStart(2, "0")}
          </p>
          <div className="flex mt-1 w-full bg-blue-600 rounded-sm min-h-1" />
        </div>
      </div>
    </article>
  );
}

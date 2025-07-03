"use client";

import { useState } from "react";
import { ClassData } from "./types";

interface ClassInfoSectionProps {
  currentDate: Date;
  selectedClass: string;
  classes: string[];
  classData: ClassData;
  onClassSelect: (className: string) => void;
}

export function ClassInfoSection({
  currentDate,
  selectedClass,
  classes,
  classData,
  onClassSelect,
}: ClassInfoSectionProps) {
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);

  function toggleClassDropdown() {
    setIsClassDropdownOpen(!isClassDropdownOpen);
  }

  function selectClass(className: string) {
    onClassSelect(className);
    setIsClassDropdownOpen(false);
  }

  function formatDate() {
    const days = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    const months = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];
    const day = days[currentDate.getDay()];
    const date = currentDate.getDate();
    const month = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    return {
      day,
      fullDate: `${date} ${month} ${year}`,
    };
  }

  return (
    <section className="flex flex-wrap gap-2.5 items-center w-full max-md:max-w-full">
      <article className="flex gap-9 items-center self-stretch px-5 py-7 my-auto font-semibold text-cyan-900 bg-white rounded-xl">
        <div className="self-stretch my-auto w-[135px]">
          <h2 className="flex justify-between items-center self-stretch w-full text-base whitespace-nowrap">
            {formatDate().day}
          </h2>
          <p className="mt-3 text-xl leading-snug">
            {formatDate().fullDate}
          </p>
        </div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/e199dc3bd90a37eeae2be9a201e5baecb4c7b293?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062"
          className="object-contain overflow-hidden shrink-0 self-stretch my-auto aspect-square fill-cyan-900 w-[13px]"
          alt="Calendar icon"
        />
      </article>

      <article className="flex gap-9 items-center self-stretch px-6 py-7 my-auto font-semibold text-cyan-900 bg-white rounded-xl max-md:px-5">
        <div className="self-stretch my-auto w-[53px]">
          <h2 className="self-stretch w-full text-base whitespace-nowrap">
            Classe
          </h2>
          <div
            className="relative cursor-pointer"
            onClick={toggleClassDropdown}
          >
            <p className="mt-3 text-xl leading-snug">
              {selectedClass}
            </p>
            {isClassDropdownOpen && (
              <ul className="absolute left-0 top-full z-10 mt-1 w-full bg-white rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
                {classes.map((className) => (
                  <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    key={className}
                    onClick={() => selectClass(className)}
                  >
                    {className}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/660faa5f0fcf403295022fda5645aea11d0edca5?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062"
          className="object-contain overflow-hidden shrink-0 self-stretch my-auto aspect-square fill-cyan-900 w-[13px]"
          alt="Dropdown icon"
        />
      </article>

      <article className="flex gap-3 items-center self-stretch px-10 py-7 my-auto bg-white rounded-xl min-w-60 max-md:px-5 max-md:max-w-full">
        <div className="self-stretch pr-3.5 my-auto text-cyan-900 w-[124px]">
          <h3 className="self-stretch w-full text-sm font-medium leading-none">
            Nombre d'eleves
          </h3>
          <p className="mt-3 text-2xl font-bold leading-none">
            {classData.totalStudents}
          </p>
        </div>

        <div className="flex shrink-0 self-stretch my-auto w-px bg-gray-100 rounded-sm h-[60px]" />

        <div className="self-stretch px-1.5 my-auto w-16 whitespace-nowrap">
          <h3 className="self-stretch w-full text-sm font-medium leading-none text-cyan-900">
            Present
          </h3>
          <p className="mt-3 text-2xl font-semibold leading-none text-emerald-600">
            {classData.present.toString().padStart(2, '0')}
          </p>
        </div>

        <div className="flex shrink-0 self-stretch my-auto w-px bg-gray-100 rounded-sm h-[60px]" />

        <div className="self-stretch my-auto whitespace-nowrap w-[45px]">
          <h3 className="self-stretch w-full text-sm font-medium leading-none text-cyan-900">
            Retard
          </h3>
          <p className="mt-3 text-2xl font-semibold leading-none text-amber-500">
            {classData.late.toString().padStart(2, '0')}
          </p>
        </div>

        <div className="flex shrink-0 self-stretch my-auto w-px bg-gray-100 rounded-sm h-[60px]" />

        <div className="self-stretch my-auto w-12 whitespace-nowrap">
          <h3 className="self-stretch w-full text-sm font-medium leading-none text-cyan-900">
            Absent
          </h3>
          <p className="mt-3 text-2xl font-semibold leading-none text-red-600">
            {classData.absent.toString().padStart(2, '0')}
          </p>
        </div>
      </article>
    </section>
  );
}

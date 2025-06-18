"use client";

import { useState } from "react";
import { ClassInfoSection } from "../../components/eleve/classe/ClassInfoSection";
import { FilterBar } from "../../components/eleve/classe/FilterBar";
import { StudentTable } from "../../components/eleve/classe/StudentTable";
import { ClassInfoCard } from "../../components/eleve/classe/ClassInfo";
import { EventsCard } from "../../components/eleve/classe/EventsCard";
import { ClassData, Event, FilterOptions, FilterState, Student } from "../../components/eleve/classe/types";

function Classe() {
const [currentDate] = useState(() => new Date());
  const [selectedClass, setSelectedClass] = useState(() => "4e B");
const [classes] = useState(() => [
    "4e A",
    "4e B",
    "4e C",
    "4e D",
]);

  const [filters, setFilters] = useState<FilterState>(() => ({
    trimester: "",
    type: "",
    status: "",
  }));

  const [filterOptions] = useState<FilterOptions>(() => ({
    trimester: ["1er Trimestre", "2ème Trimestre", "3ème Trimestre"],
    type: ["Devoir", "Examen", "Contrôle"],
    status: ["Présent", "Absent", "Retard"],
  }));

  const [classData] = useState<ClassData>(() => ({
    name: "4e B",
    totalStudents: 20,
    present: 18,
    late: 1,
    absent: 1,
    teacherName: "M. Ibrahima Diouf",
    maleCount: 12,
    femaleCount: 8,
    series: "Series one",
  }));

  const [events] = useState<Event[]>(() => [
    { title: "Activite musicale", time: "12:00 GMT" },
    { title: "Activite musicale", time: "15:00 GMT" },
    { title: "Activite musicale", time: "12:00 GMT" },
  ]);

  const [students] = useState<Student[]>(() => [
    {
      id: 1,
      name: "Khadija Ndiaye",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/8cd5d04111d9b90783d45463dc53bf4bf03fab10?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062",
      competence: "Lecture anglais",
      date: "2 Mars 2025",
      status: "Present",
    },
    {
      id: 2,
      name: "Maty Diop",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/2b68eb1f2c9d7d53f1336322dad2dec958347753?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062",
      competence: "Lecture anglais",
      date: "2 Mars 2025",
      status: "Present",
    },
    {
      id: 3,
      name: "Mouhamed Fall",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/d28692e5497ade73065e9a71e70762f47780197b?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062",
      competence: "Lecture anglais",
      date: "2 Mars 2025",
      status: "Present",
    },
    {
      id: 4,
      name: "Mouhamed Fall",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/d28692e5497ade73065e9a71e70762f47780197b?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062",
      competence: "Lecture anglais",
      date: "2 Mars 2025",
      status: "Present",
    },
    {
      id: 5,
      name: "Mouhamed Fall",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/d28692e5497ade73065e9a71e70762f47780197b?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062",
      competence: "Lecture anglais",
      date: "2 Mars 2025",
      status: "Retard",
    },
    {
      id: 6,
      name: "Mouhamed Fall",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/d28692e5497ade73065e9a71e70762f47780197b?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062",
      competence: "Lecture anglais",
      date: "2 Mars 2025",
      status: "Present",
    },
    {
      id: 7,
      name: "Mouhamed Fall",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/d28692e5497ade73065e9a71e70762f47780197b?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062",
      competence: "Lecture anglais",
      date: "2 Mars 2025",
      status: "Present",
    },
    {
      id: 8,
      name: "Mouhamed Fall",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/d28692e5497ade73065e9a71e70762f47780197b?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062",
      competence: "Lecture anglais",
      date: "2 Mars 2025",
      status: "Absent",
    },
    {
      id: 9,
      name: "Mouhamed Fall",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/d28692e5497ade73065e9a71e70762f47780197b?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062",
      competence: "Lecture anglais",
      date: "2 Mars 2025",
      status: "Present",
    },
    {
      id: 10,
      name: "Mouhamed Fall",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/d28692e5497ade73065e9a71e70762f47780197b?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062",
      competence: "Lecture anglais",
      date: "2 Mars 2025",
      status: "Present",
    },
  ]);

  function selectClass(className: string) {
    setSelectedClass(className);
  }

  function setFilter(filterType: string, value: string) {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  }

  function resetFilters() {
    setFilters({
      trimester: "",
      type: "",
      status: "",
    });
  }

  return (
    <main className="flex flex-wrap gap-6 items-start p-5 bg-gray-100 max-md:flex-col">
      {/* Mobile view for events and program */}
      <aside className="hidden flex-col min-w-60 w-[330px] max-md:flex max-md:w-full max-md:-order-1">
        <div className="px-7 py-7 w-full bg-white rounded-xl max-md:px-5" />
      </aside>

      {/* Main content area */}
      <section className="flex flex-col min-w-60 w-[832px] max-md:max-w-full">
        <ClassInfoSection
          currentDate={currentDate}
          selectedClass={selectedClass}
          classes={classes}
          classData={classData}
          onClassSelect={selectClass}
        />

        <FilterBar
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={setFilter}
          onResetFilters={resetFilters}
        />
    <StudentTable
      students={students.filter((student) => {
        const statusMatch = filters.status ? student.status === filters.status : true;
        // Pour l'instant les filtres "type" et "trimester" ne sont pas utilisés par les données fictives
        return statusMatch;
      })}
    />

      </section>

      {/* Sidebar for desktop view */}
      <aside className="min-w-60 w-[330px] max-md:hidden ">
        <ClassInfoCard classData={classData} />
        <EventsCard events={events} />
      </aside>
    </main>
  );
}

export default Classe;

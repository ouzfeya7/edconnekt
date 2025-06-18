"use client";

import { useState } from "react";
import { FilterOptions, FilterState } from "./types";
import { ChevronDown, ChevronUp, Filter, RefreshCcw, ListChecks, LayoutGrid } from "lucide-react";

interface FilterBarProps {
  filters: FilterState;
  filterOptions: FilterOptions;
  onFilterChange: (filterType: string, value: string) => void;
  onResetFilters: () => void;
}

export function FilterBar({
  filters,
  filterOptions,
  onFilterChange,
  onResetFilters,
}: FilterBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState({
    trimester: false,
    type: false,
    status: false,
  });

  function toggleFilter(filterType: string) {
    setIsFilterOpen((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        newState[key as keyof typeof newState] =
          key === filterType ? !prev[key as keyof typeof prev] : false;
      });
      return newState;
    });
  }

  return (
    <section className="self-end mt-3.5 w-full text-sm font-bold whitespace-nowrap rounded-none max-w-[832px] text-neutral-800 max-md:max-w-full">
      <div className="flex gap-10 pr-10 pl-20 w-full bg-white rounded-xl border-[0.6px] border-neutral-300 h-[40px] items-center max-md:px-5 max-md:max-w-full">
        <div className="flex items-center gap-2">
          <Filter size={18} />
          <h3>Filtre</h3>
        </div>

        {/** Trimester */}
        <div className="flex items-center gap-2 relative cursor-pointer" onClick={() => toggleFilter("trimester")}>
          <LayoutGrid size={16} />
          <span>{filters.trimester || "Trimestre"}</span>
          {isFilterOpen.trimester ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {isFilterOpen.trimester && (
            <ul className="absolute top-full left-0 z-10 bg-white rounded min-w-[150px] shadow-md mt-1">
              {filterOptions.trimester.map((option) => (
                <li
                  key={option}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterChange("trimester", option);
                    toggleFilter("trimester");
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/** Type */}
        <div className="flex items-center gap-2 relative cursor-pointer" onClick={() => toggleFilter("type")}>
          <ListChecks size={16} />
          <span>{filters.type || "Type"}</span>
          {isFilterOpen.type ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {isFilterOpen.type && (
            <ul className="absolute top-full left-0 z-10 bg-white rounded min-w-[150px] shadow-md mt-1">
              {filterOptions.type.map((option) => (
                <li
                  key={option}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterChange("type", option);
                    toggleFilter("type");
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/** Status */}
        <div className="flex items-center gap-2 relative cursor-pointer" onClick={() => toggleFilter("status")}>
          <ListChecks size={16} />
          <span>{filters.status || "Status"}</span>
          {isFilterOpen.status ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {isFilterOpen.status && (
            <ul className="absolute top-full left-0 z-10 bg-white rounded min-w-[150px] shadow-md mt-1">
              {filterOptions.status.map((option) => (
                <li
                  key={option}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterChange("status", option);
                    toggleFilter("status");
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/** Reset */}
        <div className="flex items-center gap-2 text-rose-600 font-semibold ml-auto cursor-pointer" onClick={onResetFilters}>
          <RefreshCcw size={16} />
          <span>Réinitialiser</span>
        </div>
      </div>
    </section>
  );
}

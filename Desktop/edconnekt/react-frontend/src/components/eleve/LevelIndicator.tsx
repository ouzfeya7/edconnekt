import React from "react";

interface LevelIndicatorProps {
  level: number; // 1-5 scale
}

export const LevelIndicator: React.FC<LevelIndicatorProps> = ({ level }) => {
  return (
    <div className="flex gap-1 items-start px-2.5 py-4 mt-1.5">
      <div
        className={`flex shrink-0 h-1.5 ${level >= 1 ? "bg-red-600" : "bg-gray-200"} rounded w-[21px]`}
      />
      <div
        className={`flex shrink-0 h-1.5 ${level >= 2 ? "bg-orange-500" : "bg-gray-200"} w-[21px]`}
      />
      <div
        className={`flex shrink-0 h-1.5 ${level >= 3 ? "bg-amber-400" : "bg-gray-200"} w-[21px]`}
      />
      <div
        className={`flex shrink-0 h-1.5 ${level >= 4 ? "bg-emerald-300" : "bg-gray-200"} w-[21px]`}
      />
      <div
        className={`flex shrink-0 h-1.5 ${level >= 5 ? "bg-emerald-600" : "bg-gray-200"} rounded-none w-[21px]`}
      />
    </div>
  );
}; 
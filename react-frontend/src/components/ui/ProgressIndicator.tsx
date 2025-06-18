import React from "react";

interface ProgressIndicatorProps {
  level: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ level }) => {
  // Map level to color class
  const getColorClass = () => {
    switch (level) {
      case 1:
        return "bg-red-600";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-amber-400";
      case 4:
        return "bg-emerald-300";
      case 5:
        return "bg-emerald-600";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div
      className={`flex shrink-0 h-1.5 ${getColorClass()} ${level === 0 || level === 5 ? "rounded-none" : "rounded"} w-[21px]`}
    />
  );
};

export default ProgressIndicator; 
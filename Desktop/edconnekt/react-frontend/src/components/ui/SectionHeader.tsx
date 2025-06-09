import React from "react";

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <div className="flex flex-col justify-center p-2.5 w-full">
      <div className="flex flex-col w-full max-md:max-w-full">
        <div className="flex gap-8 items-center self-start text-base font-medium text-center text-sky-950">
          <h2 className="gap-2.5 self-stretch py-2.5 my-auto">{title}</h2>
        </div>
        <div className="w-full max-md:max-w-full">
          <div className="flex shrink-0 h-0.5 bg-gray-200 max-md:max-w-full" />
        </div>
      </div>
    </div>
  );
};

export default SectionHeader; 
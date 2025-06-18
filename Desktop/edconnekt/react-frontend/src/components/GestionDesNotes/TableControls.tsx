"use client";
import React from "react";

interface TableControlsProps {
  currentPage: number;
  rowsPerPage: number;
  totalItems: number;
  onNextPage: () => void;
  onPrevPage: () => void;
}

const TableControls: React.FC<TableControlsProps> = ({
  currentPage,
  rowsPerPage,
  totalItems,
  onNextPage,
  onPrevPage,
}) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  return (
    <div className="flex flex-wrap gap-10 justify-between items-center py-2 pr-3 pl-6 mt-3 max-w-full min-h-14 w-[1086px] max-md:pl-5">
      <div className="flex flex-wrap gap-6 items-center self-stretch my-auto text-sm font-semibold min-w-60 max-md:max-w-full">
        <div className="self-stretch my-auto leading-none text-center text-gray-400 whitespace-nowrap rounded-none min-w-60 w-[388px]">
          <div className="flex flex-col justify-center items-start px-4 py-2.5 w-full rounded-xl max-md:pr-5">
            <div className="flex gap-2.5 items-end min-h-[21px]">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/f9f7beec143eb3c7513c3c41cc6d48a368123511?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062"
                className="object-contain overflow-hidden shrink-0 w-5 aspect-square"
                alt="Search icon"
              />
              <span>Rechercher</span>
            </div>
          </div>
        </div>
        <div className="self-stretch my-auto text-white whitespace-nowrap rounded-2xl w-[147px]">
          <div className="px-4 py-2 bg-cyan-900 rounded-2xl border-solid shadow-lg border-[0.6px] border-neutral-400 max-md:px-5">
            Français
          </div>
        </div>
        <div className="self-stretch my-auto rounded-2xl text-neutral-800 w-[147px]">
          <div className="px-4 py-2 rounded-2xl border border-solid border-neutral-400 max-md:px-5">
            Anglais
          </div>
        </div>
      </div>
      <div className="flex items-start self-stretch my-auto">
        <div className="flex gap-3.5 items-center self-stretch text-sm font-semibold bg-blend-normal text-neutral-800">
          <span>Page </span>
          <span>{currentPage}</span>
          <span> of </span>
          <span>{totalPages}</span>
        </div>
        <button
          className="px-3 py-1.5 rounded border-[none]"
          disabled={currentPage === 1}
          onClick={onPrevPage}
          style={{
            backgroundColor:
              currentPage === 1
                ? "#E5E7EB"
                : "var(--Foundation-Green-G300, #184867)",
            color: currentPage === 1 ? "#9CA3AF" : "white",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          Previous
        </button>
        <button
          className="px-3 py-1.5 rounded border-[none]"
          disabled={currentPage >= totalPages}
          onClick={onNextPage}
          style={{
            backgroundColor:
              currentPage >= totalPages
                ? "#E5E7EB"
                : "var(--Foundation-Green-G300, #184867)",
            color: currentPage >= totalPages ? "#9CA3AF" : "white",
            cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
          }}
        >
          Next
        </button>
        <div className="flex gap-2.5 items-center p-1.5 w-8 rounded-[32px]">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/7f47f6702cb0d83f19b35f9e1f63a2dd4cd93bcd?placeholderIfAbsent=true&apiKey=59d0a962469d4736a46bca5045c61062"
            className="object-contain overflow-hidden self-stretch my-auto w-5 aspect-square"
            alt="Settings icon"
          />
        </div>
      </div>
    </div>
  );
};

export default TableControls;

import React from "react";

type Props = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
};

export const ActionCard: React.FC<Props> = ({ icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer p-4 bg-white shadow rounded-2xl flex gap-2 items-center justify-center hover:bg-gray-50 transition"
  >
    <div>{icon}</div>
    <div className="text-gray-700 font-semibold">{label}</div>
  </div>
); 
import React from "react";

type Props = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  download?: boolean | string;
  className?: string;
};

export const ActionCard: React.FC<Props> = ({ icon, label, onClick, href, download, className }) => {
  const baseClasses = "cursor-pointer p-4 bg-white shadow rounded-2xl flex gap-2 items-center justify-center hover:text-orange-500 transition border border-gray-200";
  
  const content = (
    <>
      <div>{icon}</div>
      <div className="text-gray-700 font-semibold">{label}</div>
    </>
  );

  if (href) {
    return (
      <a href={href} download={download} className={`${baseClasses} ${className || ''}`}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${className || ''}`}>
      {content}
    </button>
  );
}; 
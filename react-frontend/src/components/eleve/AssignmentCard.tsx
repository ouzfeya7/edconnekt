"use client";
import React from 'react';

interface AssignmentCardProps {
  title: string;
  subject: string;
  time: string;
  teacher: string;
  teacherImage?: string; // Optional: pour l'image du professeur
  presentCount: number;
  absentCount: number;
  onViewDetails: () => void;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  title,
  subject,
  time,
  teacher,
  teacherImage = "/avatar.png", // Image par défaut si non fournie
  presentCount,
  absentCount,
  onViewDetails,
}) => {
  return (
    <article className="flex flex-col w-[calc(33.333%-1rem)] max-md:ml-0 max-md:w-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Changement de la largeur pour s'adapter à 3 cartes par ligne avec un gap de 1rem (environ) */}
      {/* Utilisation de w-[calc(33.333%-1rem)] ou d'une classe de grille sur le parent */}
      <div className="flex flex-col p-4 grow">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{subject}</p>
        <p className="mt-1 text-xs text-orange-500 font-medium">{time}</p>
        
        <div className="flex items-center mt-3">
          <img 
            src={teacherImage} 
            alt={teacher} 
            className="w-6 h-6 rounded-full mr-2"
          />
          <span className="text-xs text-gray-700">{teacher}</span>
        </div>

        <div className="flex justify-start gap-4 mt-3 text-xs">
          <div className="flex items-center">
            <span className="font-semibold text-green-600 mr-1">{String(presentCount).padStart(2, '0')}</span>
            <span className="text-gray-500">Présents</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold text-red-600 mr-1">{String(absentCount).padStart(2, '0')}</span>
            <span className="text-gray-500">Absents</span>
          </div>
        </div>

        <button 
          onClick={onViewDetails}
          className="mt-4 w-full px-4 py-2 text-sm font-medium text-orange-600 bg-orange-100 rounded-md hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer"
        >
          Voir détails
        </button>
      </div>
    </article>
  );
};

export default AssignmentCard;

import React from 'react';

interface CourseCardProps {
  title: string;
  subject: string;
  time: string;
  teacher: string;
  presentCount: number;
  absentCount: number;
  onClick: () => void;
  }

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  subject,
  time,
  teacher,
  presentCount,
  absentCount,
  onClick,
}) => {
  return (
    <article 
      className="flex flex-col p-4 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full justify-between"
    >
      <div onClick={onClick}>
        <h3 className="text-lg font-bold text-gray-800 truncate">{title}</h3>
        <p className="text-sm text-gray-500">{subject}</p>
        <p className="text-sm text-yellow-600 font-semibold my-2">{time}</p>
      </div>
      
      <div className="flex items-center my-3" onClick={onClick}>
        <span className="flex items-center justify-center w-8 h-8 bg-orange-200 text-orange-600 rounded-full font-bold text-sm mr-2">
          {teacher.split(' ').map(n => n[0]).join('')}
        </span>
        <span className="text-sm font-medium text-gray-700">{teacher}</span>
      </div>

      <div className="flex items-center justify-between text-sm border-t pt-3">
        <div className="flex items-center">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></span>
          <span className="font-semibold text-green-700">{String(presentCount).padStart(2, '0')}</span>
          <span className="text-gray-500 ml-1">Présents</span>
        </div>
        <div className="flex items-center">
          <span className="w-2.5 h-2.5 bg-red-500 rounded-full mr-2"></span>
          <span className="font-semibold text-red-700">{String(absentCount).padStart(2, '0')}</span>
          <span className="text-gray-500 ml-1">Absents</span>
        </div>
      </div>
      
      <button
        onClick={onClick}
        className="mt-4 w-full px-4 py-2 text-sm font-medium text-orange-600 bg-orange-100 rounded-lg hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        Voir détails
      </button>
    </article>
  );
};

export default CourseCard; 
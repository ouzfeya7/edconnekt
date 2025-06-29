import React from 'react';
import backgroundImage from '../../assets/backgroung.png';

interface CourseDetailHeaderProps {
  title: string;
}

const CourseDetailHeader: React.FC<CourseDetailHeaderProps> = ({ title }) => {
  return (
    <div className="relative">
      {/* En-tête compacte comme chez l'enseignant */}
      <div 
        className="w-full h-16 relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-800 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        {/* Overlay violet léger */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-purple-800/30"></div>
        
        {/* Contenu avec le titre - aligné verticalement */}
        <div className="absolute inset-0 flex items-center justify-start px-6">
          <div className="relative z-10">
            <h1 className="text-lg font-semibold text-white drop-shadow-sm">
              {title}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailHeader; 
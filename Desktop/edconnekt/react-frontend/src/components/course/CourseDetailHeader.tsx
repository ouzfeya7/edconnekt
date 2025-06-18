import React from 'react';
import backgroundImage from '../../assets/backgroung.png'; // Modifié le chemin de l'image

interface CourseDetailHeaderProps {
  title: string; // Seulement le titre du thème
}

const CourseDetailHeader: React.FC<CourseDetailHeaderProps> = ({ title }) => {
  return (
    <div 
      className="py-3 px-6 text-white relative overflow-hidden bg-center bg-cover mt-[-1.5rem] mx-[-1.5rem]"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        width: 'calc(100% + 3rem)', // Compense les marges négatives horizontales (1.5rem de chaque côté)
      }}
    >
      <div className="relative z-10">
        {/* Afficher seulement le thème avec une taille de police ajustée */}
        <h1 className="text-xl font-semibold">{title}</h1> 
      </div>
    </div>
  );
};

export default CourseDetailHeader; 
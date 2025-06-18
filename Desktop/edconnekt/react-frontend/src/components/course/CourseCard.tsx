import React from 'react';
import {
  Calculator, 
  BookOpenText, 
  Languages, 
  BookMarked, 
  Archive 
} from 'lucide-react'; // Import des icônes

interface CourseCardProps {
  subject: string;
  teacher: string;
  onViewDetails: () => void;
}

interface SubjectPresentation {
  bgColor: string;
  IconComponent: React.ElementType;
}

// Fonction pour obtenir la couleur de fond et l'icône en fonction de la matière
const getSubjectPresentation = (subject: string): SubjectPresentation => {
  const subjectNormalized = subject.toLowerCase();
  if (subjectNormalized.includes('mathématique')) {
    return { bgColor: 'bg-sky-300', IconComponent: Calculator };
  } else if (subjectNormalized.includes('français')) {
    return { bgColor: 'bg-rose-300', IconComponent: BookOpenText };
  } else if (subjectNormalized.includes('anglais')) {
    return { bgColor: 'bg-emerald-300', IconComponent: Languages };
  } else if (subjectNormalized.includes('coran')) {
    return { bgColor: 'bg-violet-300', IconComponent: BookMarked };
  } else if (subjectNormalized.includes('el hadji m. samb')) { // Spécifique à l'image, assimilé à Coran
    return { bgColor: 'bg-violet-300', IconComponent: BookMarked }; 
  } else if (subjectNormalized.includes('modou diouf')) { // Spécifique à l'image, assimilé à Français
    return { bgColor: 'bg-rose-300', IconComponent: BookOpenText };
  }
  return { bgColor: 'bg-slate-300', IconComponent: Archive }; // Style par défaut
};

const CourseCard: React.FC<CourseCardProps> = ({
  subject,
  teacher,
  onViewDetails,
}) => {
  const { bgColor, IconComponent } = getSubjectPresentation(subject);

  return (
    <article className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md w-full max-w-xs hover:shadow-lg transition-shadow duration-200 h-full">
      <div 
        className={`w-24 h-24 rounded-full ${bgColor} mb-4 flex items-center justify-center`} 
        title={subject} // Ajout d'un title pour l'accessibilité de l'icône
      >
        <IconComponent className="w-12 h-12 text-white" /> {/* Icône blanche, taille ajustée */}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1 text-center">{subject}</h3>
      <p className="text-sm text-gray-600 mb-4 text-center">{teacher}</p>
      <button
        onClick={onViewDetails}
        className="mt-auto w-full px-4 py-2 text-sm font-medium text-orange-600 bg-orange-100 rounded-md hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        Voir détails
      </button>
    </article>
  );
};

export default CourseCard; 
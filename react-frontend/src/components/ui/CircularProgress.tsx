import React, { useState, useEffect } from 'react';

const getColorClass = (percentage: number): string => {
  if (percentage >= 90) return 'text-green-700'; // Très Bien Réussi (vert foncé)
  if (percentage >= 70) return 'text-green-500';  // Bien Réussi (vert clair)
  if (percentage >= 50) return 'text-yellow-500'; // Réussi (jaune)
  if (percentage >= 30) return 'text-orange-500'; // Peu Réussi (orange)
  return 'text-red-600'; // Pas Réussi (rouge)
};

const CircularProgress: React.FC<{ percentage: number, size?: number, strokeWidth?: number, showPercentage?: boolean, animationDuration?: number }> = ({ 
  percentage, 
  size = 64, 
  strokeWidth = 10, 
  showPercentage = true,
  animationDuration = 1500 
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, animatedPercentage)); 
  const offset = circumference - (progress / 100) * circumference;

  const colorClass = getColorClass(percentage);

  // Animation de chargement au montage du composant
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
      const targetPercentage = Math.max(0, Math.min(100, percentage));
      
      // Animation fluide avec easing
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progressRatio = Math.min(elapsed / animationDuration, 1);
        
        // Fonction d'easing (ease-out)
        const easedProgress = 1 - Math.pow(1 - progressRatio, 3);
        const currentPercentage = easedProgress * targetPercentage;
        
        setAnimatedPercentage(currentPercentage);
        
        if (progressRatio < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    }, 100); // Petit délai avant de commencer l'animation

    return () => clearTimeout(timer);
  }, [percentage, animationDuration]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle 
          className="text-gray-200" 
          strokeWidth={strokeWidth}
          stroke="currentColor" 
          fill="transparent" 
          r={radius} 
          cx="50" 
          cy="50"
        />
        <circle 
          className={colorClass}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round" 
          stroke="currentColor" 
          fill="transparent" 
          r={radius} 
          cx="50" 
          cy="50"
          style={{
            transition: isAnimating ? 'none' : 'stroke-dashoffset 0.3s ease-in-out'
          }}
        />
      </svg>
      {showPercentage && percentage !== undefined && (
        <span 
          className={`absolute text-sm font-bold ${colorClass} transition-all duration-300`} 
          style={{ 
            fontSize: size / 4.5,
            transform: isAnimating ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          {Math.round(animatedPercentage)}%
        </span>
      )}
    </div>
  );
};

export default CircularProgress; 
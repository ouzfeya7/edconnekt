import React from 'react';
import { useTranslation } from 'react-i18next';

interface RadarDataPoint {
  subject: string;
  score: number;
  maxScore?: number;
}

interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
  className?: string;
}

const RadarChart: React.FC<RadarChartProps> = ({ 
  data, 
  size = 300, 
  className = "" 
}) => {
  const { t } = useTranslation();
  
  // Configuration du graphique
  const center = size / 2;
  const radius = (size * 0.42); // Augmenté de 0.35 à 0.42
  const levels = 5; // Nombre de niveaux concentriques
  
  // Calculer les points pour chaque niveau
  const getPolygonPoints = (level: number) => {
    const points = data.map((_, index) => {
      const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
      const r = (radius * level) / levels;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    });
    return points.join(' ');
  };

  // Calculer les points des données
  const getDataPoints = () => {
    return data.map((item, index) => {
      const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
      const normalizedScore = Math.min(item.score, 100) / 100;
      const r = radius * normalizedScore;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return { x, y, ...item };
    });
  };

  // Calculer les positions des labels
  const getLabelPositions = () => {
    return data.map((item, index) => {
      const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
      const labelRadius = radius + 20; // Réduit de 25 à 20
      const x = center + labelRadius * Math.cos(angle);
      const y = center + labelRadius * Math.sin(angle);
      
      // Ajuster l'ancrage du texte selon la position
      let textAnchor = 'middle';
      if (x > center + 5) textAnchor = 'start';
      if (x < center - 5) textAnchor = 'end';
      
      return { 
        x, 
        y, 
        textAnchor, 
        subject: item.subject,
        score: item.score 
      };
    });
  };

  const dataPoints = getDataPoints();
  const labelPositions = getLabelPositions();
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Déterminer la couleur selon le score moyen
  const averageScore = data.reduce((sum, item) => sum + item.score, 0) / data.length;
  const getScoreColor = (score: number) => {
    if (score >= 90) return '#15803d'; // green-700
    if (score >= 70) return '#22c55e'; // green-500
    if (score >= 50) return '#eab308'; // yellow-500
    if (score >= 30) return '#f97316'; // orange-500
    return '#dc2626'; // red-600
  };

  const chartColor = getScoreColor(averageScore);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          {/* Gradient pour la zone de données */}
          <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: chartColor, stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: chartColor, stopOpacity: 0.1 }} />
          </radialGradient>
          
          {/* Filtre d'ombre */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.2"/>
          </filter>
        </defs>

        {/* Cercles concentriques (grille) */}
        {Array.from({ length: levels }, (_, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={(radius * (i + 1)) / levels}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
            opacity={0.5}
          />
        ))}

        {/* Lignes radiales */}
        {data.map((_, index) => {
          const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);
          
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="#e5e7eb"
              strokeWidth="1"
              opacity={0.5}
            />
          );
        })}

        {/* Labels de pourcentage sur l'axe vertical */}
        {Array.from({ length: levels }, (_, i) => {
          const level = ((i + 1) * 100) / levels;
          const y = center - ((radius * (i + 1)) / levels);
          
          return (
            <text
              key={i}
              x={center + 8}
              y={y}
              fill="#6b7280"
              fontSize="10"
              textAnchor="start"
              dominantBaseline="middle"
            >
              {level}%
            </text>
          );
        })}

        {/* Zone des données */}
        {dataPoints.length > 2 && (
          <polygon
            points={dataPolygon}
            fill="url(#radarGradient)"
            stroke={chartColor}
            strokeWidth="2"
            filter="url(#shadow)"
          />
        )}

        {/* Points de données */}
        {dataPoints.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill={chartColor}
              stroke="white"
              strokeWidth="2"
              className="hover:r-6 transition-all duration-200"
            />
            {/* Tooltip au survol */}
            <circle
              cx={point.x}
              cy={point.y}
              r="12"
              fill="transparent"
              className="hover:fill-black hover:fill-opacity-10 transition-all duration-200"
            >
              <title>{`${point.subject}: ${point.score}%`}</title>
            </circle>
          </g>
        ))}
      </svg>

      {/* Labels des matières */}
      <div className="relative" style={{ width: size, height: size, marginTop: -size }}>
        {labelPositions.map((label, index) => (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ 
              left: label.x, 
              top: label.y,
              textAlign: label.textAnchor as any
            }}
          >
            <div className="bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-200 text-xs font-medium text-gray-700">
              <div className="truncate max-w-20 text-center">{label.subject}</div>
              <div className={`text-center font-bold ${
                label.score >= 90 ? 'text-green-700' :
                label.score >= 70 ? 'text-green-500' :
                label.score >= 50 ? 'text-yellow-500' :
                label.score >= 30 ? 'text-orange-500' : 'text-red-600'
              }`}>
                {label.score}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Légende */}
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="text-sm font-bold text-gray-900 mb-3">LÉGENDE/LEGEND:</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
          {/* Très Bien Réussi */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-gradient-to-r from-green-700 to-green-800 rounded-sm"></div>
            <span className="text-gray-700">de 90 à 100 Très Bien Réussi</span>
          </div>
          
          {/* Bien Réussi */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-sm"></div>
            <span className="text-gray-700">de 70 à 90 Bien Réussi</span>
          </div>
          
          {/* Réussi */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-sm"></div>
            <span className="text-gray-700">de 50 à 70 Réussi</span>
          </div>
          
          {/* Peu Réussi */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-sm"></div>
            <span className="text-gray-700">de 30 à 50 Peu Réussi</span>
          </div>
          
          {/* Pas Réussi */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-sm"></div>
            <span className="text-gray-700">de 0 à 30 Pas Réussi</span>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default RadarChart; 
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

// Structure de données mise à jour, sans la propriété 'status'
interface DataPoint {
  x: number; // Progression académique
  y: number; // Niveau d'engagement
  studentName: string;
}

interface QuadrantChartProps {
  data: DataPoint[];
}

// Props pour le Tooltip personnalisé
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: DataPoint;
  }>;
}

const QuadrantChart: React.FC<QuadrantChartProps> = ({ data }) => {
  if (!Array.isArray(data)) {
    console.error("QuadrantChart expects 'data' prop to be an array.", data);
    return null;
  }

  // Couleurs de fond des quadrants (corrigées selon la description)
  const quadrantColors = {
    highProgressionHighEngagement: 'rgba(187, 247, 208, 0.7)', // Vert 
    lowProgressionHighEngagement: 'rgba(254, 215, 170, 0.7)',   // Orange
    lowProgressionLowEngagement: 'rgba(254, 202, 202, 0.7)',    // Rouge
    highProgressionLowEngagement: 'rgba(254, 240, 138, 0.7)',   // Jaune
  };

  // Couleurs pleines pour les points, correspondant aux quadrants
  const pointColors = {
      green: '#2E7D32',
      orange: '#EF6C00',
      red: '#C62828',
      yellow: '#F9A825'
  };

  // Infobulle personnalisée
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const pointData = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200 text-sm">
          <p className="font-bold text-gray-800">{pointData.studentName}</p>
          <p className="text-gray-600">{`Progression: ${pointData.x}%`}</p>
          <p className="text-gray-600">{`Engagement: ${pointData.y}%`}</p>
        </div>
      );
    }
    return null;
  };
  
  // Filtrage des données par quadrant pour la couleur des points
  const greenData = data.filter(d => d.x >= 50 && d.y >= 50);
  const orangeData = data.filter(d => d.x < 50 && d.y >= 50);
  const redData = data.filter(d => d.x < 50 && d.y < 50);
  const yellowData = data.filter(d => d.x >= 50 && d.y < 50);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        
        <XAxis 
          type="number" 
          dataKey="x" 
          name="Progression académique" 
          unit="%" 
          domain={[0, 100]} 
          ticks={[0, 25, 50, 75, 100]} 
          tick={{ fontSize: 12, fill: '#6B7280' }}
        />
        <YAxis 
          type="number" 
          dataKey="y" 
          name="Niveau d'engagement" 
          unit="%" 
          domain={[0, 100]} 
          ticks={[0, 25, 50, 75, 100]}
          tick={{ fontSize: 12, fill: '#6B7280' }}
        />

        {/* Fonds des quadrants */}
        <ReferenceArea x1={50} x2={100} y1={50} y2={100} strokeOpacity={0} fill={quadrantColors.highProgressionHighEngagement} ifOverflow="visible" />
        <ReferenceArea x1={0} x2={50} y1={50} y2={100} strokeOpacity={0} fill={quadrantColors.lowProgressionHighEngagement} ifOverflow="visible" /> 
        <ReferenceArea x1={0} x2={50} y1={0} y2={50} strokeOpacity={0} fill={quadrantColors.lowProgressionLowEngagement} ifOverflow="visible" />
        <ReferenceArea x1={50} x2={100} y1={0} y2={50} strokeOpacity={0} fill={quadrantColors.highProgressionLowEngagement} ifOverflow="visible" />

        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
        
        {/* Séries de points colorés par quadrant */}
        <Scatter name="Forte progression et engagement" data={greenData} fill={pointColors.green} shape="circle" r={8} /> 
        <Scatter name="Faible progression, bon engagement" data={orangeData} fill={pointColors.orange} shape="circle" r={8} />
        <Scatter name="Faible progression et engagement" data={redData} fill={pointColors.red} shape="circle" r={8} />
        <Scatter name="Progression modérée, faible engagement" data={yellowData} fill={pointColors.yellow} shape="circle" r={8} />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default QuadrantChart;
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Nouvelle structure pour un point de données du graphique
interface DataPoint {
  date: string;       // ex: "Trimestre 1"
  progression: number; // Note de 0 à 20
}

interface ProgressionChartProps {
  data: DataPoint[];
}

// Props pour l'infobulle personnalisée
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: DataPoint;
  }>;
}

// L'infobulle personnalisée
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200 text-sm">
        <p className="font-semibold text-gray-700">{`${data.date} : ${data.progression}/20`}</p>
      </div>
    );
  }
  return null;
};

const ProgressionChart: React.FC<ProgressionChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-sm">Aucune donnée de progression à afficher.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: -10, // Ajustement pour l'axe Y
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12, fill: '#6B7280' }} 
          axisLine={false} 
          tickLine={false}
          padding={{ left: 30 }}
        />
        <YAxis 
          domain={[0, 20]} // Echelle de 0 à 20
          unit="/20"
          tick={{ fontSize: 12, fill: '#6B7280' }} 
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="progression" 
          stroke="#184867" // Couleur de la ligne principale
          strokeWidth={3}
          dot={{ r: 5, fill: '#184867' }} // Style des points sur la ligne
          activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }} // Style du point survolé
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProgressionChart;
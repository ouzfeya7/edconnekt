interface Props {
  level: number; // Niveau de progression de 1 à 5
}

const PdiProgressRow = ({ level }: Props) => {
  return (
    <div className="flex gap-1">
      <div className={`h-1.5 w-4 rounded-sm ${level >= 1 ? 'bg-red-500' : 'bg-gray-200'}`} />
      <div className={`h-1.5 w-4 rounded-sm ${level >= 2 ? 'bg-orange-400' : 'bg-gray-200'}`} />
      <div className={`h-1.5 w-4 rounded-sm ${level >= 3 ? 'bg-yellow-400' : 'bg-gray-200'}`} />
      <div className={`h-1.5 w-4 rounded-sm ${level >= 4 ? 'bg-green-400' : 'bg-gray-200'}`} />
      <div className={`h-1.5 w-4 rounded-sm ${level >= 5 ? 'bg-green-600' : 'bg-gray-200'}`} />
    </div>
  );
};

export default PdiProgressRow; 
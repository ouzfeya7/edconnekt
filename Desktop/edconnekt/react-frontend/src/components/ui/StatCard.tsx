type StatCardProps = {
    title: string;
    value: string | number;
    isCircular?: boolean;
  };
  
  export const StatCard = ({ title, value, isCircular = false }: StatCardProps) => (
    <div className="flex flex-col items-center px-4 py-2 border-r last:border-r-0">
      <p className="text-sm text-gray-500">{title}</p>
      <div className="flex items-center gap-2 mt-1">
        {isCircular ? (
          <div className="w-6 h-6 rounded-full border-4 border-orange-500 border-t-gray-200 animate-spin" />
        ) : null}
        <span className="text-lg font-bold text-gray-800">{value}</span>
      </div>
    </div>
  ); 
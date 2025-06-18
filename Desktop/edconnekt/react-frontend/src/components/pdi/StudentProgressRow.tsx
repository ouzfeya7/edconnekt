type Props = {
  name: string;
  avatar: string;
  pdi: string;
  date: string;
};

const StudentProgressRow = ({ name, avatar, pdi, date }: Props) => {
  return (
    <div className="grid grid-cols-4 items-center py-2 text-sm border-b border-gray-100">
      <div className="flex items-center gap-2">
        <img src={avatar} alt={name} className="w-8 h-8 rounded-full object-cover" />
        <span className="text-blue-600 underline cursor-pointer">{name}</span>
      </div>
      <div>{pdi}</div>
      <div>{date}</div>
      <div className="flex space-x-1">
        <div className="h-2 w-1/6 bg-red-500 rounded-sm" />
        <div className="h-2 w-1/6 bg-orange-400 rounded-sm" />
        <div className="h-2 w-1/6 bg-yellow-400 rounded-sm" />
        <div className="h-2 w-1/6 bg-green-300 rounded-sm" />
        <div className="h-2 w-1/6 bg-green-600 rounded-sm" />
        <div className="h-2 w-1/6 bg-gray-200 rounded-sm" />
      </div>
    </div>
  );
};

export default StudentProgressRow; 
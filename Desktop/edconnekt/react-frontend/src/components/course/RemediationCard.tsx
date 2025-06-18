import { Calendar } from 'lucide-react';
import React from 'react';

interface RemediationCardProps {
    title: string;
    subject: string;
    time: string;
    teacher: string;
}

const RemediationCard: React.FC<RemediationCardProps> = ({ title, subject, time, teacher }) => {
  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(n => n[0])
      .join('');
  };

  const initials = getInitials(teacher);
  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(initials)}&backgroundColor=ff8c00`;

  return (
    <div className="bg-[#184867] text-white p-4 rounded-lg flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1 rounded-full">
                <Calendar className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">Rappel</span>
        </div>
      </div>
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-sm text-gray-300">{subject}</p>
      </div>
      <p className="text-sm font-semibold text-orange-400">{time}</p>
      <div className="flex items-center gap-2">
        <img src={avatarUrl} alt={teacher} className="w-8 h-8 rounded-full" />
        <span className="text-sm">{teacher}</span>
      </div>
    </div>
  );
};

export default RemediationCard; 
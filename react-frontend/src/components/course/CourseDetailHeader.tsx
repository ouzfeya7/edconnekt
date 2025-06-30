import React from 'react';
import { GraduationCap } from 'lucide-react';

interface CourseDetailHeaderProps {
  title: string;
}

const CourseDetailHeader: React.FC<CourseDetailHeaderProps> = ({ title }) => {
  return (
    <div className="relative mb-1 overflow-hidden rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 shadow-sm border border-violet-200/50">
      {/* Motifs décoratifs avec cercles colorés */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-400/8 to-purple-400/6"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/12 rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full translate-y-24 -translate-x-24"></div>
      <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-indigo-500/8 rounded-full -translate-x-16 -translate-y-16"></div>
      <div className="absolute top-0 left-1/4 w-20 h-20 bg-fuchsia-400/10 rounded-full -translate-y-10"></div>
      <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-pink-400/8 rounded-full translate-y-12"></div>
      
      <div className="relative p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-xl border border-violet-200 shadow-sm">
            <GraduationCap className="w-8 h-8 text-violet-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              {title}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailHeader;
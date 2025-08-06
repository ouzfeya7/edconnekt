import React from 'react';
import { PdiSessionStudent } from '../../types/pdi';

interface StudentObservationCardProps {
  student: PdiSessionStudent;
  onObservationChange: (studentId: string, observation: string) => void;
}

const StudentObservationCard: React.FC<StudentObservationCardProps> = ({
  student,
  onObservationChange
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full" />
        <div>
          <h4 className="font-medium text-gray-800">{student.name}</h4>
          <p className="text-sm text-gray-500">Score: {student.globalScore}%</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <textarea
          placeholder="Observations individuelles..."
          value={student.observations || ''}
          onChange={(e) => onObservationChange(student.id, e.target.value)}
          className="w-full text-sm border border-gray-300 rounded px-2 py-1 resize-none"
          rows={3}
        />
      </div>
    </div>
  );
};

export default StudentObservationCard; 
import React, { useState } from 'react';

interface ClassTabsProps {
  classes: string[];
  onTabChange: (selectedClass: string) => void;
}

const ClassTabs: React.FC<ClassTabsProps> = ({ classes, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(classes[0]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {classes.map((className) => (
          <button
            key={className}
            onClick={() => handleTabClick(className)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                activeTab === className
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {className}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ClassTabs; 
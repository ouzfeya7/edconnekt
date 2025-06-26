import React from 'react';
import logo from '../../assets/logo.svg';

const AppLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-pulse">
        <img src={logo} alt="Edconnekt Logo" className="h-24 w-auto" />
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-600">
        Chargement de l'application...
      </p>
    </div>
  );
};

export default AppLoader; 
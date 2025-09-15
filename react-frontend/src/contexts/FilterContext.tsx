/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import 'dayjs/locale/fr';
import 'dayjs/locale/en';

interface FilterContextType {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  formattedCurrentDate: string;
  currentClasse: string;
  setCurrentClasse: (classe: string) => void;
  currentTrimestre: string;
  setCurrentTrimestre: (trimestre: string) => void;
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
  currentSubject: string;
  setCurrentSubject: (subject: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentClasse, setCurrentClasse] = useState("cp1");
  const [currentTrimestre, setCurrentTrimestre] = useState("Trimestre 1");
  const [currentMonth, setCurrentMonth] = useState("Septembre");
  const [currentSubject, setCurrentSubject] = useState("Tout");
  const [formattedCurrentDate, setFormattedCurrentDate] = useState('');

  useEffect(() => {
    dayjs.locale(i18n.language);
    setFormattedCurrentDate(dayjs(currentDate).format('D MMMM YYYY'));
  }, [i18n.language, currentDate]);

  const value = {
    currentDate,
    setCurrentDate,
    formattedCurrentDate,
    currentClasse,
    setCurrentClasse,
    currentTrimestre,
    setCurrentTrimestre,
    currentMonth,
    setCurrentMonth,
    currentSubject,
    setCurrentSubject
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}; 
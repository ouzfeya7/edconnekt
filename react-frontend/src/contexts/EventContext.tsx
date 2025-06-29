import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { SchoolEvent } from '../components/agenda/agenda_data';
import { getStudentAgendaEvents } from '../lib/mock-student-data';

interface EventContextType {
  events: SchoolEvent[];
  setEvents: React.Dispatch<React.SetStateAction<SchoolEvent[]>>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<SchoolEvent[]>([]);

  // Initialiser avec les données synchronisées du dashboard
  useEffect(() => {
    const studentEvents = getStudentAgendaEvents();
    const formattedEvents: SchoolEvent[] = studentEvents.map(event => ({
      id: event.id.toString(),
      title: event.title,
      description: event.description,
      location: event.location,
      start: event.fullDate,
      end: event.fullDate, // Même date pour les événements ponctuels
      allDay: false,
      category: 'reunion' as const, // Catégorie par défaut
      targetAudience: ['Élèves'],
      className: 'event-reunion'
    }));
    
    setEvents(formattedEvents);
  }, []);

  return (
    <EventContext.Provider value={{ events, setEvents }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}; 
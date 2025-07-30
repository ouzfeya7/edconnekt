import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { SchoolEvent } from '../components/agenda/agenda_data';
import { getStudentAgendaEvents } from '../lib/mock-student-data';
import dayjs from 'dayjs';

interface EventContextType {
  events: SchoolEvent[];
  setEvents: React.Dispatch<React.SetStateAction<SchoolEvent[]>>;
  getUpcomingEvents: (limit?: number) => SchoolEvent[];
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<SchoolEvent[]>([]);

  // Initialiser avec les données synchronisées du dashboard
  useEffect(() => {
    const studentEvents = getStudentAgendaEvents();
    const formattedEvents: SchoolEvent[] = studentEvents.map(event => {
      // Déterminer la catégorie basée sur le type d'événement
      let category: 'reunion' | 'activite' | 'sportif' | 'autre' = 'reunion';
      switch (event.type) {
        case 'evaluation':
          category = 'reunion';
          break;
        case 'meeting':
          category = 'reunion';
          break;
        case 'activity':
          category = 'activite';
          break;
        default:
          category = 'autre';
      }

      return {
        id: event.id.toString(),
        title: event.title,
        description: event.description,
        location: event.location,
        start: event.fullDate,
        end: event.fullDate, // Même date pour les événements ponctuels
        allDay: event.allDay || false,
        category: category,
        targetAudience: ['Élèves'],
        className: `event-${category}`
      };
    });
    
    setEvents(formattedEvents);
  }, []);

  // Fonction pour obtenir les événements les plus proches
  const getUpcomingEvents = (limit: number = 3): SchoolEvent[] => {
    const now = dayjs();
    
    return events
      .filter(event => {
        const eventDate = dayjs(event.start as string);
        // Inclure les événements d'aujourd'hui et futurs
        return eventDate.isSame(now, 'day') || eventDate.isAfter(now);
      })
      .sort((a, b) => {
        const dateA = dayjs(a.start as string);
        const dateB = dayjs(b.start as string);
        return dateA.diff(dateB);
      })
      .slice(0, limit);
  };

  return (
    <EventContext.Provider value={{ events, setEvents, getUpcomingEvents }}>
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
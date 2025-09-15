/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

// Définir le type pour un événement
interface Event {
  id: string;
  title: string;
  date: string;
}

// Créer un contexte d'événements
const EventContext = createContext<{
  events: Event[];
  addEvent: (event: Event) => void;
}>({
  events: [],
  addEvent: () => {}
});

// Créer un provider pour le contexte
export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [events, setEvents] = useState<Event[]>([]);

    const addEvent = (event: Event) => {
        setEvents(prevEvents => [...prevEvents, event]);
    };

    return (
        <EventContext.Provider value={{ events, addEvent }}>
            {children}
        </EventContext.Provider>
    );
};

// Utiliser le contexte dans n'importe quel composant
export const useEvents = () => useContext(EventContext); 
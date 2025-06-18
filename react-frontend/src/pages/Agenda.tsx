import React, { useState, useMemo, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import { EventInput, ViewApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { useLocation } from 'react-router-dom';

import AgendaSidebar from '../components/agenda/AgendaSidebar';
import EventDetailsModal from '../components/agenda/EventDetailsModal';
import EventFormModal from '../components/agenda/EventFormModal';
import { SchoolEvent, defaultEventState, eventCategories } from '../components/agenda/agenda_data';
import CalendarHeader from '../components/agenda/CalendarHeader';
import { useEvents } from '../contexts/EventContext';

const Agenda: React.FC = () => {
  const { events, setEvents } = useEvents();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<SchoolEvent>(defaultEventState);
  const [viewingEvent, setViewingEvent] = useState<SchoolEvent | null>(null);
  const [errors, setErrors] = useState<{ title?: string }>({});
  const calendarRef = useRef<FullCalendar>(null);
  const [calendarTitle, setCalendarTitle] = useState('');
  const [currentView, setCurrentView] = useState('dayGridMonth');

  const location = useLocation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleAudienceChange = (audience: string) => {
    setCurrentEvent(prev => {
      const newAudience = prev.targetAudience.includes(audience)
        ? prev.targetAudience.filter(a => a !== audience)
        : [...prev.targetAudience, audience];
      return { ...prev, targetAudience: newAudience };
    });
  };
  
  const handleAllDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentEvent(p => ({...p, allDay: e.target.checked}));
  };

  const openDetailsModal = (eventData: EventInput) => {
    setViewingEvent(eventData as SchoolEvent);
    setIsDetailsOpen(true);
  };

  const openFormForNewEvent = (arg?: DateClickArg) => {
    setIsEditMode(false);
    const startDate = arg ? arg.dateStr + 'T09:00' : new Date().toISOString().slice(0, 16);
    const endDate = arg ? arg.dateStr + 'T10:00' : new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().slice(0, 16);
    setCurrentEvent({ ...defaultEventState, start: startDate, end: endDate });
    setErrors({});
    setIsFormOpen(true);
  };

  const openFormForExistingEvent = (eventData: SchoolEvent) => {
    setIsEditMode(true);
    setCurrentEvent({
      ...defaultEventState,
      ...eventData,
      start: eventData.start ? new Date(eventData.start as string).toISOString().slice(0, 16) : defaultEventState.start,
      end: eventData.end ? new Date(eventData.end as string).toISOString().slice(0, 16) : defaultEventState.end,
      targetAudience: eventData.targetAudience || [],
    });
    setErrors({});
    setIsFormOpen(true);
  };
  
  const closeFormModal = () => setIsFormOpen(false);
  const closeDetailsModal = () => setIsDetailsOpen(false);

  const validateForm = () => {
    const newErrors: { title?: string } = {};
    if (!(currentEvent.title || '').trim()) {
      newErrors.title = "Le titre est obligatoire.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEvent = () => {
    if (!validateForm()) return;

    const eventToSave: SchoolEvent = {
        ...currentEvent,
        className: eventCategories[currentEvent.category].className,
    };
    
    if (isEditMode) {
      setEvents(events.map(event => event.id === eventToSave.id ? eventToSave : event));
    } else {
      setEvents([...events, { ...eventToSave, id: new Date().getTime().toString() }]);
    }
    setIsFormOpen(false);
  };

  const handleDeleteEvent = () => {
    setEvents(events.filter(event => event.id !== currentEvent.id));
    setIsFormOpen(false);
  };

  const groupedEvents = useMemo(() => {
    const grouped: { [key: string]: SchoolEvent[] } = {};
    const sortedEvents = [...events].sort((a, b) => 
        new Date(a.start as string).getTime() - new Date(b.start as string).getTime()
    );

    for (const event of sortedEvents) {
        if (event.start) {
            const dateKey = (event.start as string).slice(0, 10);
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(event);
        }
    }
    return grouped;
  }, [events]);

  const handleSidebarEventClick = (date: string) => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(date);
    }
  };

  const handleDatesSet = (dateInfo: { view: ViewApi }) => {
    setCalendarTitle(dateInfo.view.title);
    setCurrentView(dateInfo.view.type);
  };

  const calendarApi = calendarRef.current?.getApi();

  useEffect(() => {
    if (location.state?.showAddEventModal) {
      openFormForNewEvent();
    }
  }, [location.state]);

  return (
    <>
    <style>{`
      /* --- Style pour les boutons de FullCalendar --- */
      .fc .fc-button-primary {
        background-color: #f3f4f6; /* gray-100 */
        border-color: #d1d5db; /* gray-300 */
        color: #374151; /* gray-700 */
        transition: background-color 0.2s, border-color 0.2s, color 0.2s;
        font-weight: 600;
        padding: 0.5rem 1rem;
      }
      .fc .fc-button-primary:hover {
        background-color: #e5e7eb; /* gray-200 */
        border-color: #d1d5db; /* gray-300 */
        color: #184867;
      }
      .fc .fc-button-primary:focus {
        box-shadow: 0 0 0 2px #184867;
      }
      /* Bouton actif (thème sombre) */
      .fc .fc-button-primary:not(:disabled).fc-button-active,
      .fc .fc-button-primary:not(:disabled):active {
        background-color: #184867; /* blue-600 */
        border-color: #184867; /* blue-700 */
        color: white;
      }
      .fc .fc-button-primary:disabled {
        background-color: #f3f4f6;
        border-color: #d1d5db;
        color: #9ca3af; /* gray-400 */
      }
      .fc .fc-today-button {
        background-color: #f3f4f6; /* blue-50 */
        border-color: #184867; /* blue-200 */
        color: #184867; /* blue-600 */
      }
       .fc .fc-today-button:hover {
        background-color: #dbeafe; /* blue-100 */
      }
      .fc .fc-today-button:disabled {
        background-color:rgb(218, 221, 225);
        color:rgb(131, 132, 135);
      }

      /* --- Style pour les événements du calendrier --- */
      /* Forcer la couleur du texte pour une meilleure lisibilité */
      .fc-event.event-reunion .fc-event-title, .fc-event.event-reunion .fc-event-time { color: #1e3a8a !important; }
      .fc-event.event-activite .fc-event-title, .fc-event.event-activite .fc-event-time { color: #5b21b6 !important; }
      .fc-event.event-sportif .fc-event-title, .fc-event.event-sportif .fc-event-time { color: #14532d !important; }
      .fc-event.event-autre .fc-event-title, .fc-event.event-autre .fc-event-time { color: #374151 !important; }
      
      .fc-event .fc-event-title {
        font-weight: 500;
        cursor: pointer;
      }

      .fc-event.event-reunion { 
        border-color: #3b82f6; 
        background-color: rgba(59, 130, 246, 0.2); 
        cursor: pointer;
      }
      .fc-event.event-activite { 
        border-color: #8b5cf6; 
        background-color: rgba(139, 92, 246, 0.2); 
        cursor: pointer;
      }
      .fc-event.event-sportif { 
        border-color: #22c55e; 
        background-color: rgba(34, 197, 94, 0.2); 
        cursor: pointer;
      }
      .fc-event.event-autre { 
        border-color: #6b7280; 
        background-color: rgba(107, 114, 128, 0.2); 
        cursor: pointer;
      }
      
      .fc-event-main { padding: 4px 6px; }
    `}</style>
    <div className="flex gap-6 p-6 bg-gray-50 h-full">
      <AgendaSidebar
        groupedEvents={groupedEvents}
        onAddEvent={() => openFormForNewEvent()}
        onEventClick={handleSidebarEventClick}
        onEditEvent={openFormForExistingEvent}
      />

      <div className="flex-1 bg-white rounded-xl shadow-sm p-6 flex flex-col min-w-0">
        <CalendarHeader
          title={calendarTitle}
          currentView={currentView}
          onPrev={() => calendarApi?.prev()}
          onNext={() => calendarApi?.next()}
          onToday={() => calendarApi?.today()}
          onViewChange={(view) => calendarApi?.changeView(view)}
        />
        <div className="flex-1">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={currentView}
              headerToolbar={false}
              events={events}
              dateClick={(arg) => openFormForNewEvent(arg)}
              eventClick={(clickInfo) => openDetailsModal(clickInfo.event.toPlainObject({ collapseExtendedProps: true }))}
              locale={frLocale}
              height="100%"
              eventClassNames="border-l-4"
              buttonText={{ today: "Aujourd'hui", month: 'Mois', week: 'Semaine', day: 'Jour' }}
              viewDidMount={handleDatesSet}
              datesSet={handleDatesSet}
            />
        </div>
      </div>

      <EventFormModal
        isOpen={isFormOpen}
        onClose={closeFormModal}
        isEditMode={isEditMode}
        currentEvent={currentEvent}
        onInputChange={handleInputChange}
        onAudienceChange={handleAudienceChange}
        onAllDayChange={handleAllDayChange}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        errors={errors}
      />

      <EventDetailsModal
        isOpen={isDetailsOpen}
        onClose={closeDetailsModal}
        event={viewingEvent}
      />
    </div>
    </>
  );
};

export default Agenda;

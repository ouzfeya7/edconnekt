import React, { useState, useMemo, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import { EventInput, ViewApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import enLocale from '@fullcalendar/core/locales/en-gb';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import AgendaSidebar from '../components/agenda/AgendaSidebar';
import EventDetailsModal from '../components/agenda/EventDetailsModal';
import { SchoolEvent } from '../components/agenda/agenda_data';
import CalendarHeader from '../components/agenda/CalendarHeader';
import { useEvents } from '../contexts/EventContext';
import Toast from '../components/ui/Toast';

const Agenda: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { events } = useEvents();
  const navigate = useNavigate();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<SchoolEvent | null>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const [calendarTitle, setCalendarTitle] = useState('');
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const location = useLocation();

  const openDetailsModal = (eventData: EventInput) => {
    setViewingEvent(eventData as SchoolEvent);
    setIsDetailsOpen(true);
  };

  const openFormForNewEvent = (arg?: DateClickArg) => {
    const dateStr = arg?.dateStr || new Date().toISOString().slice(0, 10);
    navigate('/agenda/create', { 
      state: { date: dateStr }
    });
  };

  const openFormForExistingEvent = (eventData: SchoolEvent) => {
    navigate(`/agenda/edit/${eventData.id}`);
  };
  
  const closeDetailsModal = () => setIsDetailsOpen(false);

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
    setIsSidebarOpen(false); // Fermer la sidebar sur mobile après sélection
  };

  const handleDatesSet = (dateInfo: { view: ViewApi }) => {
    setCalendarTitle(dateInfo.view.title);
    setCurrentView(dateInfo.view.type);
  };

  const calendarApi = calendarRef.current?.getApi();

  // Afficher un message de succès s'il y en a un
  useEffect(() => {
    if (location.state?.message) {
      setToastMessage(location.state.message);
      // Nettoyer le state pour éviter de réafficher le message
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <>
    <style>{`
      /* --- Style pour les boutons de FullCalendar --- */
      .fc .fc-button-primary {
        background-color: #ffffff;
        border-color: #e5e7eb;
        color: #374151;
        transition: all 0.2s ease;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      }
      .fc .fc-button-primary:hover {
        background-color: #f97316;
        border-color: #f97316;
        color: white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }
      .fc .fc-button-primary:focus {
        box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        outline: none;
      }
      /* Bouton actif */
      .fc .fc-button-primary:not(:disabled).fc-button-active,
      .fc .fc-button-primary:not(:disabled):active {
        background-color: #f97316;
        border-color: #f97316;
        color: white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }
      .fc .fc-button-primary:disabled {
        background-color: #f9fafb;
        border-color: #e5e7eb;
        color: #9ca3af;
      }
      .fc .fc-today-button {
        background-color: #fff7ed;
        border-color: #fed7aa;
        color: #ea580c;
        font-weight: 500;
      }
      .fc .fc-today-button:hover {
        background-color: #f97316;
        color: white;
      }
      .fc .fc-today-button:disabled {
        background-color: #f9fafb;
        color: #9ca3af;
      }

      /* --- Style pour les événements du calendrier --- */
      .fc-event .fc-event-title {
        font-weight: 500;
        cursor: pointer;
      }

      .fc-event.event-reunion { 
        border-color: #3b82f6; 
        background-color: rgba(59, 130, 246, 0.1);
        border-left-width: 4px;
        cursor: pointer;
      }
      .fc-event.event-activite { 
        border-color: #8b5cf6; 
        background-color: rgba(139, 92, 246, 0.1);
        border-left-width: 4px;
        cursor: pointer;
      }
      .fc-event.event-sportif { 
        border-color: #10b981; 
        background-color: rgba(16, 185, 129, 0.1);
        border-left-width: 4px;
        cursor: pointer;
      }
      .fc-event.event-autre { 
        border-color: #6b7280; 
        background-color: rgba(107, 114, 128, 0.1);
        border-left-width: 4px;
        cursor: pointer;
      }
      
      .fc-event-main { 
        padding: 6px 8px; 
        border-radius: 6px;
      }

      /* Style pour le calendrier */
      .fc-theme-standard .fc-scrollgrid {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        overflow: hidden;
      }

      .fc .fc-daygrid-day-number {
        color: #374151;
        font-weight: 500;
      }

      .fc .fc-day-today {
        background-color: #fff7ed !important;
      }

      .fc .fc-col-header-cell {
        background-color: #f9fafb;
        border-color: #e5e7eb;
        font-weight: 600;
        color: #374151;
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        .fc .fc-toolbar {
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .fc .fc-button {
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
        }
      }
    `}</style>
    
    <div className="flex h-full bg-white">
      {/* Sidebar fixe */}
      <div className={`
        fixed lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out z-30
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-80 h-full
      `}>
        <AgendaSidebar
          groupedEvents={groupedEvents}
          onAddEvent={() => {
            openFormForNewEvent();
            setIsSidebarOpen(false);
          }}
          onEventClick={handleSidebarEventClick}
          onEditEvent={(event) => {
            openFormForExistingEvent(event);
            setIsSidebarOpen(false);
          }}
          onCloseSidebar={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Overlay pour mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Contenu principal avec marge pour la sidebar */}
      <div className={`flex-1 flex flex-col min-w-0 ${isSidebarOpen ? '' : 'lg:ml-0'}`}>
        {/* En-tête */}
        <div className="bg-white border-b border-gray-200 p-4 lg:p-6 flex-shrink-0 border-l border-l-gray-200">
          <CalendarHeader
            title={calendarTitle}
            currentView={currentView}
            onPrev={() => calendarApi?.prev()}
            onNext={() => calendarApi?.next()}
            onToday={() => calendarApi?.today()}
            onViewChange={(view) => calendarApi?.changeView(view)}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
          />
        </div>
        
        {/* Calendrier - occupe tout l'espace restant */}
        <div className="flex-1 min-h-0">
          <div className="bg-white h-full border-l border-l-gray-200">
            <div className="h-full p-4">
              <FullCalendar
                key={i18n.language}
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={currentView}
                headerToolbar={false}
                events={events}
                locale={i18n.language === 'fr' ? frLocale : enLocale}
                editable={true}
                selectable={true}
                selectMirror={true}
                dateClick={(arg) => openFormForNewEvent(arg)}
                eventClick={(clickInfo) => openDetailsModal(clickInfo.event.toPlainObject({ collapseExtendedProps: true }))}
                height="100%"
                eventClassNames="border-l-4"
                buttonText={{ today: "Aujourd'hui", month: 'Mois', week: 'Semaine', day: 'Jour' }}
                viewDidMount={handleDatesSet}
                datesSet={handleDatesSet}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Seule la modale de détails reste */}
      <EventDetailsModal
        isOpen={isDetailsOpen}
        onClose={closeDetailsModal}
        event={viewingEvent}
      />

      {/* Toast de notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
    </>
  );
};

export default Agenda;

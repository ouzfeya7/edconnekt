import { EventInput } from '@fullcalendar/core';

export const eventCategories = {
  reunion: { label: 'Réunion', className: 'event-reunion', tailwindColors: 'bg-blue-100 text-blue-800' },
  activite: { label: 'Activité Scolaire', className: 'event-activite', tailwindColors: 'bg-purple-100 text-purple-800' },
  sportif: { label: 'Événement Sportif', className: 'event-sportif', tailwindColors: 'bg-green-100 text-green-800' },
  autre: { label: 'Autre', className: 'event-autre', tailwindColors: 'bg-gray-100 text-gray-800' },
};

export const targetAudiences = ['Élèves', 'Parents', 'Professeurs', 'Personnel', 'Tous'];

export interface SchoolEvent extends EventInput {
  start?: string;
  end?: string;
  allDay: boolean;
  location?: string;
  description?: string;
  category: keyof typeof eventCategories;
  targetAudience: string[];
}

export const defaultEventState: SchoolEvent = {
  id: '',
  title: '',
  description: '',
  location: '',
  start: new Date().toISOString().slice(0, 16),
  end: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().slice(0, 16),
  allDay: false,
  category: 'reunion',
  targetAudience: [],
  className: eventCategories.reunion.className,
};

// Fonction pour formater l'en-tête de date pour la barre latérale
export const formatDateHeader = (dateStr: string) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const todayStr = today.toISOString().slice(0, 10);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  if (dateStr === todayStr) return "Aujourd'hui";
  if (dateStr === tomorrowStr) return "Demain";
  
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}; 
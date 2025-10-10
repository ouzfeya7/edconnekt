import { EventInput } from '@fullcalendar/core';
import { TFunction } from 'i18next';

export const getEventCategories = (t: TFunction) => ({
  reunion: { label: t('reunion', 'Réunion'), className: 'event-reunion', tailwindColors: 'bg-blue-100 text-blue-800' },
  activite: { label: t('school_activity', 'Activité Scolaire'), className: 'event-activite', tailwindColors: 'bg-purple-100 text-purple-800' },
  sportif: { label: t('sporting_event', 'Événement Sportif'), className: 'event-sportif', tailwindColors: 'bg-green-100 text-green-800' },
  remediation: { label: t('remediation', 'Remédiation'), className: 'event-remediation', tailwindColors: 'bg-red-500 text-white' },
  autre: { label: t('other', 'Autre'), className: 'event-autre', tailwindColors: 'bg-gray-100 text-gray-800' },
});

export const getTargetAudiences = (t: TFunction) => [t('students_label', 'Élèves'), t('parents', 'Parents'), t('teachers', 'Professeurs'), t('staff', 'Personnel'), t('all', 'Tous')];

export interface SchoolEvent extends EventInput {
  start?: string;
  end?: string;
  allDay: boolean;
  location?: string;
  description?: string;
  category: keyof ReturnType<typeof getEventCategories>;
  targetAudience: string[];
}

export const defaultEventState = (t: TFunction): SchoolEvent => ({
  id: '',
  title: '',
  description: '',
  location: '',
  start: new Date().toISOString().slice(0, 16),
  end: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().slice(0, 16),
  allDay: false,
  category: 'reunion',
  targetAudience: [],
  className: getEventCategories(t).reunion.className,
});

// Fonction pour formater l'en-tête de date pour la barre latérale
export const formatDateHeader = (dateStr: string, lang: string) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const todayStr = today.toISOString().slice(0, 10);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  // This part is tricky to translate without a t function.
  // We'll handle it in the component or use a more robust date library if needed.
  // For now, "Aujourd'hui" and "Demain" might remain in French from here.
  // A better approach would be to pass `t` function here.
  if (lang === 'fr') {
  if (dateStr === todayStr) return "Aujourd'hui";
  if (dateStr === tomorrowStr) return "Demain";
  } else {
    if (dateStr === todayStr) return "Today";
    if (dateStr === tomorrowStr) return "Tomorrow";
  }
  
  return new Date(dateStr).toLocaleDateString(lang, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}; 
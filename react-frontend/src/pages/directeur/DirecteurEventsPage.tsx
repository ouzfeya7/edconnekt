import React from 'react';
import { useDirector } from '../../contexts/DirectorContext';
import EventsManager from '../../components/events/EventsManager';

const DirecteurEventsPage: React.FC = () => {
  const { currentEtablissementId } = useDirector();
  return (
    <div className="bg-white min-h-screen p-4 md:p-6">
      <EventsManager etablissementId={currentEtablissementId || undefined} showHeaderTitle />
    </div>
  );
};

export default DirecteurEventsPage;

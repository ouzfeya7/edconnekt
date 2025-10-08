import React, { useState } from 'react';
import { Activity, Calendar, AlertCircle, CheckCircle, Clock, Copy } from 'lucide-react';

interface EventCardProps {
  event: {
    id: string;
    event_type: string;
    aggregate_type: string;
    aggregate_id: string;
    status?: string;
    created_at?: string;
    processed_at?: string;
    tenant_id?: string;
    payload?: object;
  };
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, isSelected, onSelect }) => {
  const [showPayload, setShowPayload] = useState(false);
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'PROCESSED': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'PROCESSED': return <CheckCircle className="w-3 h-3" />;
      case 'FAILED': return <AlertCircle className="w-3 h-3" />;
      case 'PENDING': return <Clock className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'PROCESSED': return 'Traité';
      case 'FAILED': return 'Échec';
      case 'PENDING': return 'En attente';
      default: return status || 'Inconnu';
    }
  };

  return (
    <div
      className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
      onClick={() => onSelect(event.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-gray-900 truncate">{event.event_type}</h3>
        </div>
        <div className="flex items-center gap-2">
          {/* Copier aggregate_id */}
          <button
            onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText?.(event.aggregate_id); }}
            className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
            title="Copier Aggregate ID"
          >
            <span className="inline-flex items-center gap-1"><Copy className="w-3 h-3" />Agg ID</span>
          </button>
          {/* Copier event id */}
          <button
            onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText?.(event.id); }}
            className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
            title="Copier Event ID"
          >
            <span className="inline-flex items-center gap-1"><Copy className="w-3 h-3" />Evt ID</span>
          </button>
          {event.status && (
            <span className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getStatusColor(event.status)}`}>
              {getStatusIcon(event.status)}
              {getStatusLabel(event.status)}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Aggregate:</span> {event.aggregate_type}
        </div>
        <div className="text-xs text-gray-500">
          ID: {event.aggregate_id.substring(0, 8)}...
        </div>
        {event.tenant_id && (
          <div className="text-xs text-gray-500">Tenant: {event.tenant_id.substring(0, 8)}...</div>
        )}
        {event.created_at && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            {new Date(event.created_at).toLocaleString('fr-FR')}
          </div>
        )}
        {event.processed_at && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            Traité le {new Date(event.processed_at).toLocaleString('fr-FR')}
          </div>
        )}
      </div>

      <div className="text-xs text-gray-400">
        Event ID: {event.id.substring(0, 8)}...
      </div>

      {/* Payload viewer */}
      {event.payload && (
        <div className="mt-3">
          <button
            onClick={(e) => { e.stopPropagation(); setShowPayload(!showPayload); }}
            className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
          >
            {showPayload ? 'Masquer payload' : 'Voir payload'}
          </button>
          {showPayload && (
            <pre className="mt-2 p-2 bg-gray-50 border rounded text-xs overflow-auto max-h-48">
              {JSON.stringify(event.payload, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCard;

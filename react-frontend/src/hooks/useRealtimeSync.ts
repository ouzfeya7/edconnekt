import { useEffect, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useConversations } from './useMessageConversations';
import { useConversationMessages } from './useMessageMessages';

/**
 * Hook pour synchroniser les données en temps réel
 * - Utilise WebSocket quand disponible
 * - Fait du polling comme fallback
 * - Synchronise automatiquement les conversations et messages
 */
export const useRealtimeSync = (selectedConversationId?: string) => {
  const { wsStatus } = useChat();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // React Query hooks pour la synchronisation
  const { refetch: refetchConversations } = useConversations();
  const { refetch: refetchMessages } = useConversationMessages(
    selectedConversationId || '', 
    { limit: undefined }
  );

  // Démarrer/arrêter le polling selon le statut WebSocket
  useEffect(() => {
    const startPolling = () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      // Polling toutes les 5 secondes quand WebSocket non disponible
      pollingIntervalRef.current = setInterval(async () => {
        console.log('[RealtimeSync] Polling - synchronisation des données');
        
        try {
          // Refetch conversations
          await refetchConversations();
          
          // Refetch messages de la conversation active
          if (selectedConversationId) {
            await refetchMessages();
          }
        } catch (error) {
          console.error('[RealtimeSync] Erreur lors du polling:', error);
        }
      }, 5000);

      console.log('[RealtimeSync] Polling activé (WebSocket indisponible)');
    };

    const stopPolling = () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
        console.log('[RealtimeSync] Polling désactivé (WebSocket disponible)');
      }
    };

    // Logique de décision : WebSocket vs Polling
    if (wsStatus === 'connected') {
      stopPolling();
    } else if (wsStatus === 'disconnected' || wsStatus === 'error') {
      startPolling();
    }

    // Nettoyage
    return () => {
      stopPolling();
    };
  }, [wsStatus, selectedConversationId, refetchConversations, refetchMessages]);

  // Synchronisation initiale forcée quand WebSocket se reconnecte
  useEffect(() => {
    if (wsStatus === 'connected') {
      console.log('[RealtimeSync] WebSocket reconnecté - synchronisation forcée');
      refetchConversations();
      if (selectedConversationId) {
        refetchMessages();
      }
    }
  }, [wsStatus, selectedConversationId, refetchConversations, refetchMessages]);

  // Nettoyage final
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  return {
    isPolling: wsStatus !== 'connected' && pollingIntervalRef.current !== null,
    wsStatus,
  };
};

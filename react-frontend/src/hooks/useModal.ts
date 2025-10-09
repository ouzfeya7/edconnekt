import { useEffect } from 'react';

/**
 * Hook personnalisé pour gérer les modals
 * Gère automatiquement le scroll du body et les événements clavier
 */
export function useModal(isOpen: boolean, onClose?: () => void) {
  useEffect(() => {
    if (isOpen) {
      // Empêcher le scroll du body
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      // Gérer la touche Escape
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && onClose) {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);

      // Cleanup function
      return () => {
        document.body.style.overflow = originalStyle;
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);
}

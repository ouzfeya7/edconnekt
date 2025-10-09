/**
 * Utilitaire pour migrer les anciens modals vers la nouvelle architecture
 * avec overlay séparé, portal et hook useModal
 */

export const MODAL_MIGRATION_PATTERNS = {
  // Pattern pour identifier les anciens modals
  OLD_MODAL_PATTERN: /className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-\[?\d+\]?/,
  
  // Imports à ajouter
  REQUIRED_IMPORTS: [
    "import { createPortal } from 'react-dom';",
    "import { useModal } from '../../../hooks/useModal';" // Ajuster le chemin selon le niveau
  ],
  
  // Template pour le nouveau modal
  NEW_MODAL_TEMPLATE: `
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay séparé */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal content */}
      <div className="relative bg-white rounded-lg w-full {{MAX_WIDTH}} p-6 shadow-xl z-10">
        {{CONTENT}}
      </div>
    </div>
  );

  // Utiliser createPortal pour rendre au niveau racine
  return createPortal(modalContent, document.body);
  `,
  
  // Hook à ajouter dans le composant
  USE_MODAL_HOOK: `
  // Utiliser le hook personnalisé pour gérer le modal
  useModal(isOpen, onClose);
  `
};

export const getModalImportPath = (currentPath: string): string => {
  // Calculer le chemin relatif vers le hook useModal
  const depth = currentPath.split('/').length - 2; // -2 pour src/ et le fichier lui-même
  return '../'.repeat(depth) + 'hooks/useModal';
};

export const extractMaxWidth = (content: string): string => {
  const maxWidthMatch = content.match(/max-w-(\w+)/);
  return maxWidthMatch ? `max-w-${maxWidthMatch[1]}` : 'max-w-lg';
};

export const isModalFile = (content: string): boolean => {
  return MODAL_MIGRATION_PATTERNS.OLD_MODAL_PATTERN.test(content) ||
         content.includes('fixed inset-0') && content.includes('bg-black bg-opacity');
};

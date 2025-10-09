import React from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import { useModal } from '../../hooks/useModal';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'lg',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = '',
}) => {
  // Utiliser le hook personnalisé pour gérer le modal
  useModal(isOpen, onClose);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        aria-hidden="true"
      />
      
      {/* Modal content */}
      <div 
        className={`relative bg-white rounded-lg w-full ${maxWidthClasses[maxWidth]} shadow-xl max-h-[90vh] overflow-y-auto z-10 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header avec titre et bouton fermer */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && (
              <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                aria-label="Fermer"
              >
                <FaTimes size={20} />
              </button>
            )}
          </div>
        )}
        
        {/* Contenu */}
        <div className={title || showCloseButton ? 'p-6' : 'p-6'}>
          {children}
        </div>
      </div>
    </div>
  );

  // Utiliser createPortal pour rendre le modal au niveau racine du DOM
  return createPortal(modalContent, document.body);
};

export default Modal;

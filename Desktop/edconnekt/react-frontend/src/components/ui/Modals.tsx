import React from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

const ModalWrapper: React.FC<ModalProps & { title: string; children: React.ReactNode }> = ({
  open,
  onClose,
  title,
  children,
}) =>
  !open ? null : (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );

export const ModalDevoir: React.FC<ModalProps> = props => (
  <ModalWrapper {...props} title="Ajouter un devoir">
    <form className="space-y-4">
      <input className="w-full border p-2 rounded" placeholder="Titre du devoir" />
      <textarea className="w-full border p-2 rounded" placeholder="Consignes..." />
      <button className="bg-orange-500 text-white px-4 py-2 rounded">Valider</button>
    </form>
  </ModalWrapper>
);

export const ModalMessage: React.FC<ModalProps> = props => (
  <ModalWrapper {...props} title="Nouveau message">
    <form className="space-y-4">
      <input className="w-full border p-2 rounded" placeholder="Objet" />
      <textarea className="w-full border p-2 rounded" placeholder="Message..." />
      <button className="bg-orange-500 text-white px-4 py-2 rounded">Envoyer</button>
    </form>
  </ModalWrapper>
);

export const ModalEvenement: React.FC<ModalProps> = props => (
  <ModalWrapper {...props} title="Ajouter un évènement">
    <form className="space-y-4">
      <input className="w-full border p-2 rounded" placeholder="Nom de l'évènement" />
      <input type="date" className="w-full border p-2 rounded" />
      <button className="bg-orange-500 text-white px-4 py-2 rounded">Ajouter</button>
    </form>
  </ModalWrapper>
); 

import React, { useState, useEffect } from 'react';
import { Utilisateur, UserRole } from './mock-utilisateurs';
import { etablissementsData } from '../etablissements/mock-etablissements';
import { Button } from '../../../components/ui/button';
import { FaTimes } from 'react-icons/fa';

interface UtilisateurFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Utilisateur>, isInvitation: boolean) => void;
  utilisateurToEdit?: Utilisateur | null;
}

const UtilisateurFormModal: React.FC<UtilisateurFormModalProps> = ({ isOpen, onClose, onSave, utilisateurToEdit }) => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('enseignant');
  const [etablissementId, setEtablissementId] = useState('');

  const isInvitation = !utilisateurToEdit;

  useEffect(() => {
    if (utilisateurToEdit) {
      setNom(utilisateurToEdit.nom);
      setEmail(utilisateurToEdit.email);
      setRole(utilisateurToEdit.role);
      setEtablissementId(utilisateurToEdit.etablissementId);
    } else {
      // Reset for invitation
      setNom('');
      setEmail('');
      setRole('enseignant');
      setEtablissementId(etablissementsData.length > 0 ? etablissementsData[0].id : '');
    }
  }, [utilisateurToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const etablissement = etablissementsData.find(e => e.id === etablissementId);
    
    onSave({
      id: utilisateurToEdit?.id,
      nom,
      email,
      role,
      etablissementId,
      etablissementNom: etablissement?.name || 'N/A',
    }, isInvitation);

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg p-8 relative shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{isInvitation ? 'Inviter un nouvel utilisateur' : 'Modifier l\'utilisateur'}</h2>
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <FaTimes size={20} />
        </button>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isInvitation && (
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom complet</label>
              <input type="text" name="nom" id="nom" value={nom} onChange={e => setNom(e.target.value)} required 
                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required 
                   disabled={!isInvitation} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rôle</label>
              <select name="role" id="role" value={role} onChange={e => setRole(e.target.value as UserRole)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="directeur">Directeur</option>
                <option value="enseignant">Enseignant</option>
                <option value="eleve">Élève</option>
                <option value="parent">Parent</option>
                <option value="administrateur">Administrateur</option>
              </select>
            </div>
            <div>
              <label htmlFor="etablissementId" className="block text-sm font-medium text-gray-700">Établissement</label>
              <select name="etablissementId" id="etablissementId" value={etablissementId} onChange={e => setEtablissementId(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                 {etablissementsData.map(etab => <option key={etab.id} value={etab.id}>{etab.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-6">
            <Button type="button" variant="secondary" onClick={onClose} className="mr-2">Annuler</Button>
            <Button type="submit">{isInvitation ? 'Envoyer l\'invitation' : 'Enregistrer'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UtilisateurFormModal;


import React, { useState, useMemo } from 'react';
import { utilisateursData, Utilisateur } from './mock-utilisateurs';
import { etablissementsData } from '../etablissements/mock-etablissements';
import { FaEdit, FaToggleOn, FaToggleOff, FaSearch, FaEnvelope } from 'react-icons/fa';
import { Button } from '../../../components/ui/button';
import Badge from '../../../components/ui/Badge';
import UtilisateurFormModal from './UtilisateurFormModal';

const UtilisateursPage: React.FC = () => {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>(utilisateursData);
  const [searchTerm, setSearchTerm] = useState('');
  const [etablissementFilter, setEtablissementFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUtilisateur, setEditingUtilisateur] = useState<Utilisateur | null>(null);

  const filteredUtilisateurs = useMemo(() => {
    return utilisateurs
      .filter(user => user.nom.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(user => etablissementFilter === 'all' || user.etablissementId === etablissementFilter)
      .filter(user => roleFilter === 'all' || user.role === roleFilter);
  }, [utilisateurs, searchTerm, etablissementFilter, roleFilter]);

  const handleToggleStatus = (id: string) => {
    // Cette logique serait plus complexe en réel (ex: un utilisateur invité devient actif)
    setUtilisateurs(prev =>
      prev.map(user =>
        user.id === id ? { ...user, status: user.status === 'actif' ? 'inactif' : 'actif' } : user
      )
    );
  };

  const handleOpenModal = (utilisateur: Utilisateur | null = null) => {
    setEditingUtilisateur(utilisateur);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUtilisateur(null);
  };

  const handleSaveUtilisateur = (data: Partial<Utilisateur>, isInvitation: boolean) => {
    if (isInvitation) {
      const newInvitation: Utilisateur = {
        id: `user-${Date.now()}`,
        nom: data.email!, // Le nom sera mis à jour après acceptation
        email: data.email!,
        role: data.role!,
        etablissementId: data.etablissementId!,
        etablissementNom: data.etablissementNom!,
        status: 'invité',
        dateInscription: new Date().toISOString().split('T')[0],
      };
      setUtilisateurs(prev => [...prev, newInvitation]);
    } else {
      // Update
      setUtilisateurs(prev => prev.map(user => user.id === data.id ? { ...user, ...data } : user));
    }
  };


  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
          <p className="text-gray-600">Gérez les comptes des directeurs, enseignants, élèves et parents.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <FaEnvelope className="mr-2" />
          Inviter un utilisateur
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
          <div className="md:col-span-2 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              className="w-full pl-10 p-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="p-2 border rounded-md"
            value={etablissementFilter}
            onChange={e => setEtablissementFilter(e.target.value)}
          >
            <option value="all">Tous les établissements</option>
            {etablissementsData.map(etab => <option key={etab.id} value={etab.id}>{etab.name}</option>)}
          </select>
          <select 
            className="p-2 border rounded-md"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="all">Tous les rôles</option>
            <option value="directeur">Directeur</option>
            <option value="enseignant">Enseignant</option>
            <option value="eleve">Élève</option>
            <option value="parent">Parent</option>
            <option value="administrateur">Administrateur</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
              <tr>
                <th className="p-4">Nom</th>
                <th className="p-4">Rôle</th>
                <th className="p-4">Établissement</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Inscrit le</th>
                <th className="p-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUtilisateurs.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-gray-800">{user.nom}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="p-4 capitalize text-gray-700">{user.role}</td>
                  <td className="p-4 text-gray-700">{user.etablissementNom}</td>
                  <td className="p-4">
                    <Badge 
                      text={user.status}
                      bgColor={user.status === 'actif' ? 'bg-green-100' : user.status === 'inactif' ? 'bg-gray-100' : 'bg-yellow-100'}
                      color={user.status === 'actif' ? 'text-green-800' : user.status === 'inactif' ? 'text-gray-800' : 'text-yellow-800'}
                    />
                  </td>
                  <td className="p-4 text-gray-600">{new Date(user.dateInscription).toLocaleDateString()}</td>
                  <td className="p-4 text-center">
                     <Button variant="ghost" size="sm" className="mr-2" onClick={() => handleOpenModal(user)}>
                      <FaEdit size={16} />
                    </Button>
                    {user.status !== 'invité' && (
                      <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(user.id)} className={user.status === 'actif' ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'}>
                        {user.status === 'actif' ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                      </Button>
                    )}
                     {user.status === 'invité' && (
                      <Button variant="ghost" size="sm" title="Renvoyer l'invitation">
                        <FaEnvelope size={16} />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
       <UtilisateurFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUtilisateur}
        utilisateurToEdit={editingUtilisateur}
      />
    </div>
  );
};

export default UtilisateursPage;

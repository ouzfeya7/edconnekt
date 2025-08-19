import React, { useState } from 'react';
import { plansData, Plan } from './mock-plans';
import { Button } from '../../../components/ui/button';
import { FaPlus, FaEdit, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import Badge from '../../../components/ui/Badge';
import PlanFormModal from './PlanFormModal';

const PlanCard: React.FC<{ plan: Plan; onEdit: (plan: Plan) => void; onToggleStatus: (id: string) => void }> = ({ plan, onEdit, onToggleStatus }) => {
  const isActif = plan.status === 'actif';
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-t-4 ${isActif ? 'border-blue-500' : 'border-gray-300'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{plan.nom}</h2>
          <Badge 
            text={plan.status}
            bgColor={isActif ? 'bg-green-100' : 'bg-gray-100'}
            color={isActif ? 'text-green-800' : 'text-gray-800'}
          />
        </div>
        <div className="text-3xl font-bold text-gray-900">{plan.tarif.toLocaleString('fr-SN')} <span className="text-lg font-normal text-gray-500">FCFA/{plan.duree === 'mensuel' ? 'mois' : 'an'}</span></div>
      </div>
      <p className="text-gray-600 my-4 h-12">{plan.description}</p>
      <ul className="space-y-2 text-sm text-gray-700">
        {plan.limitations.fonctionnalites.map((feat, index) => (
          <li key={index} className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            {feat}
          </li>
        ))}
         <li className="flex items-center">
             <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Jusqu'à {plan.limitations.utilisateursMax} utilisateurs
        </li>
      </ul>
      <div className="mt-6 flex justify-end space-x-2">
        <Button variant="ghost" size="sm" onClick={() => onToggleStatus(plan.id)}>
          {isActif ? <FaToggleOn size={20} className="text-green-600"/> : <FaToggleOff size={20} className="text-gray-400" />}
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(plan)}>
          <FaEdit className="mr-2" /> Modifier
        </Button>
      </div>
    </div>
  );
};


const PlansPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>(plansData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const handleOpenModal = (plan: Plan | null = null) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleSavePlan = (plan: Plan) => {
    if (editingPlan) {
      setPlans(prev => prev.map(p => (p.id === plan.id ? plan : p)));
    } else {
      setPlans(prev => [...prev, plan]);
    }
  };


  const handleEdit = (plan: Plan) => {
    handleOpenModal(plan);
  };

  const handleToggleStatus = (id: string) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'actif' ? 'inactif' : 'actif'} : p));
  };

  return (
    <div className="p-8 bg-white min-h-screen">
       <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Plans d'Abonnement</h1>
          <p className="text-gray-600">Créez et configurez les offres d'abonnement pour les établissements.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <FaPlus className="mr-2" />
          Créer un nouveau plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(plan => (
          <PlanCard key={plan.id} plan={plan} onEdit={handleEdit} onToggleStatus={handleToggleStatus} />
        ))}
      </div>
       <PlanFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePlan}
        planToEdit={editingPlan}
      />
    </div>
  );
};

export default PlansPage;

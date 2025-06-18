import  { useState } from "react";
import { ActionCard } from "../ui/ActionCard";
import { Plus, ClipboardList, MessageCircle, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ModalDevoir, ModalMessage, ModalEvenement } from "../ui/Modals";

export const DashboardHeader = () => {
  const navigate = useNavigate();
  const [showDevoir, setShowDevoir] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showEvent, setShowEvent] = useState(false);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <ActionCard
          icon={<Plus className="text-orange-500" />}
          label="Ajouter un devoir"
          onClick={() => setShowDevoir(true)}
        />
        <ActionCard
          icon={<ClipboardList className="text-orange-500" />}
          label="Gestion des notes"
          onClick={() => navigate("/evaluations/notes")}
        />
        <ActionCard
          icon={<MessageCircle className="text-orange-500" />}
          label="Nouveau message"
          onClick={() => setShowMessage(true)}
        />
        <ActionCard
          icon={<Calendar className="text-orange-500" />}
          label="Ajouter un évènement"
          onClick={() => setShowEvent(true)}
        />
      </div>

      {/* Modales */}
      <ModalDevoir open={showDevoir} onClose={() => setShowDevoir(false)} />
      <ModalMessage open={showMessage} onClose={() => setShowMessage(false)} />
      <ModalEvenement open={showEvent} onClose={() => setShowEvent(false)} />
    </>
  );
}; 
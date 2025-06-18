import { FC } from "react";
import {
  PlusCircle,
  BookOpenCheck,
  MessageCircleMore,
  CalendarPlus,
  LucideIcon,
} from "lucide-react";

interface ShortcutButton {
  label: string;
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
  hoverColor: string;
  alertMessage: string;
}

const Shortcuts: FC = () => {
  const shortcutButtons: ShortcutButton[] = [
    {
      label: "Ajouter un devoir",
      icon: PlusCircle,
      bgColor: "bg-rose-100",
      textColor: "text-rose-600",
      hoverColor: "hover:bg-rose-200",
      alertMessage: "Fonctionnalité : Ajouter un devoir",
    },
    {
      label: "Gestion des notes",
      icon: BookOpenCheck,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      hoverColor: "hover:bg-blue-200",
      alertMessage: "Fonctionnalité : Accéder à la gestion des notes",
    },
    {
      label: "Nouveau message",
      icon: MessageCircleMore,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      hoverColor: "hover:bg-green-200",
      alertMessage: "Fonctionnalité : Envoyer un nouveau message",
    },
    {
      label: "Ajouter un événement",
      icon: CalendarPlus,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
      hoverColor: "hover:bg-yellow-200",
      alertMessage: "Fonctionnalité : Ajouter un événement",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {shortcutButtons.map(({ label, icon: Icon, bgColor, textColor, hoverColor, alertMessage }) => (
        <button
          key={label}
          onClick={() => alert(alertMessage)}
          className={`${bgColor} ${textColor} ${hoverColor} flex items-center gap-2 px-4 py-2 rounded-lg shadow font-medium transition`}
        >
          <Icon size={18} />
          {label}
        </button>
      ))}
    </div>
  );
};

export default Shortcuts; 
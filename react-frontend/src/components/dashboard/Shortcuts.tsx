import { FC } from "react";
import {
  PlusCircle,
  BookOpenCheck,
  MessageCircleMore,
  CalendarPlus,
  LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface ShortcutButton {
  labelKey: keyof typeof import('../../../public/locales/fr/translation.json');
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
  hoverColor: string;
  alertMessage: string;
}

const Shortcuts: FC = () => {
  const { t } = useTranslation();
  const shortcutButtons: ShortcutButton[] = [
    {
      labelKey: "ajouter_devoir",
      icon: PlusCircle,
      bgColor: "bg-rose-100",
      textColor: "text-rose-600",
      hoverColor: "hover:bg-rose-200",
      alertMessage: "Fonctionnalité : Ajouter un devoir",
    },
    {
      labelKey: "gestion_notes",
      icon: BookOpenCheck,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      hoverColor: "hover:bg-blue-200",
      alertMessage: "Fonctionnalité : Accéder à la gestion des notes",
    },
    {
      labelKey: "nouveau_message",
      icon: MessageCircleMore,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      hoverColor: "hover:bg-green-200",
      alertMessage: "Fonctionnalité : Envoyer un nouveau message",
    },
    {
      labelKey: "ajouter_evenement",
      icon: CalendarPlus,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
      hoverColor: "hover:bg-yellow-200",
      alertMessage: "Fonctionnalité : Ajouter un événement",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {shortcutButtons.map(({ labelKey, icon: Icon, bgColor, textColor, hoverColor, alertMessage }) => (
        <button
          key={labelKey}
          onClick={() => alert(alertMessage)}
          className={`${bgColor} ${textColor} ${hoverColor} flex items-center gap-2 px-4 py-2 rounded-lg shadow font-medium transition`}
        >
          <Icon size={18} />
          {t(labelKey)}
        </button>
      ))}
    </div>
  );
};

export default Shortcuts; 
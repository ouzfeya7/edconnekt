import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications, Notification as NotificationType } from '../../contexts/NotificationContext'; // Importer le hook et le type
import { cn } from '../../lib/utils'; // Assurez-vous que `cn` est disponible pour combiner les classes

interface NotificationItemProps {
  notification: NotificationType;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { t } = useTranslation();
  
  const getNotificationMessage = () => {
    switch (notification.type) {
      case 'devoir':
        return t('notifications.new_assignment', { defaultValue: notification.message });
      case 'note':
        return t('notifications.new_grade', { defaultValue: notification.message });
      case 'info':
      default:
        return t('notifications.info', { defaultValue: notification.message });
    }
  };

  return (
    <Link 
      to="/notifications" 
      className="flex items-start space-x-3 py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <div className={cn("mt-1 w-2 h-2 rounded-full", !notification.read ? "bg-blue-500" : "bg-gray-300")}></div>
      <div className="flex-1">
        <p className="text-sm text-gray-700">{getNotificationMessage()}</p>
        <p className="text-xs text-gray-400 mt-1">{new Date(notification.date).toLocaleDateString()}</p>
      </div>
    </Link>
  );
};


const Notifications: React.FC = () => {
  const { t } = useTranslation();
  const { notifications } = useNotifications(); // Utiliser le contexte

  // Afficher seulement les 3 notifications les plus récentes
  const recentNotifications = notifications.slice(0, 3);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">{t('notifications', 'Notifications')}</h3>
        <Link to="/notifications" className="text-sm font-semibold text-blue-600 hover:underline">
          {t('see_all', 'Toutes voir')}
        </Link>
      </div>
      <div className="flex-grow">
        {recentNotifications.length > 0 ? (
          <div className="space-y-1">
            {recentNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">{t('notifications.no_new', 'Aucune nouvelle notification.')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications; 
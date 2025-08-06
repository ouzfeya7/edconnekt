import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, BookOpen, FileText, Info, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications, Notification as NotificationType } from '../../contexts/NotificationContext';
import { cn } from '../../lib/utils';

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'devoir':
        return <BookOpen className="h-4 w-4 text-orange-500" />;
      case 'note':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'devoir':
        return 'border-l-orange-500 bg-orange-50';
      case 'note':
        return 'border-l-green-500 bg-green-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'success':
        return 'border-l-green-500 bg-green-50';
      case 'info':
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return 'Hier';
    return notificationDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <Link 
      to="/notifications" 
      className={cn(
        "block p-4 rounded-lg hover:shadow-md transition-colors cursor-pointer border-l-4",
        getNotificationColor(notification.type)
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icône de type */}
        <div className="flex-shrink-0 mt-0.5">
          {getNotificationIcon(notification.type)}
        </div>
        
        {/* Contenu principal */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 leading-tight mb-2 line-clamp-2">
            {getNotificationMessage()}
          </p>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="h-3 w-3 text-gray-400" />
            <span>{getTimeAgo(notification.date)}</span>
            
            {!notification.read && (
              <>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span className="text-blue-600 font-medium">Nouveau</span>
              </>
            )}
          </div>
        </div>
        
        {/* Indicateur de lecture */}
        <div className="flex-shrink-0">
          <div className={cn(
            "w-2 h-2 rounded-full",
            notification.read ? "bg-gray-300" : "bg-blue-500 animate-pulse"
          )}></div>
        </div>
      </div>
    </Link>
  );
};

const Notifications: React.FC = () => {
  const { t } = useTranslation();
  const { notifications } = useNotifications();

  // Afficher seulement les 3 notifications les plus récentes
  const recentNotifications = notifications.slice(0, 3);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full overflow-hidden">
      {/* En-tête avec gradient */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                <Bell className="h-5 w-5 text-white" />
              </div>
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {t('notifications', 'Notifications')}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {recentNotifications.length} notification{recentNotifications.length > 1 ? 's' : ''} récente{recentNotifications.length > 1 ? 's' : ''}
                {unreadCount > 0 && ` • ${unreadCount} non lue${unreadCount > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          <Link 
            to="/notifications" 
            className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline transition-colors flex items-center gap-1"
          >
            {t('see_all', 'Toutes voir')}
            <span className="text-xs">→</span>
          </Link>
        </div>
      </div>
      
      {/* Contenu des notifications */}
      <div className="p-4">
        <div className="space-y-3">
          {recentNotifications.length > 0 ? (
            recentNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Bell className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-sm text-gray-500 mb-2">
                {t('notifications.no_new', 'Aucune nouvelle notification.')}
              </p>
              <p className="text-xs text-gray-400">
                Les notifications apparaîtront ici quand elles arriveront
              </p>
            </div>
          )}
        </div>
        
        {/* Légende des types */}
        {recentNotifications.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Types :</p>
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-1">
                <BookOpen className="h-3 w-3 text-orange-500" />
                <span className="text-gray-600">Devoir</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3 text-green-500" />
                <span className="text-gray-600">Note</span>
              </div>
              <div className="flex items-center gap-1">
                <Info className="h-3 w-3 text-blue-500" />
                <span className="text-gray-600">Info</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-yellow-500" />
                <span className="text-gray-600">Alerte</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications; 
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

type LoadingStateType = 'loading' | 'success' | 'error' | 'warning' | 'info' | 'empty';

interface LoadingStateProps {
  type: LoadingStateType;
  title?: string;
  message?: string;
  details?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingState: React.FC<LoadingStateProps> = ({
  type,
  title,
  message,
  details,
  action,
  className = '',
  size = 'md',
}) => {
  const { t } = useTranslation();

  const getIcon = () => {
    const iconProps = {
      className: `${
        size === 'sm' ? 'w-4 h-4' : 
        size === 'md' ? 'w-6 h-6' : 
        'w-8 h-8'
      }`,
      'aria-hidden': true as const,
    };

    switch (type) {
      case 'loading':
        return <Loader2 {...iconProps} className={`${iconProps.className} animate-spin text-blue-600`} />;
      case 'success':
        return <CheckCircle {...iconProps} className={`${iconProps.className} text-green-600`} />;
      case 'error':
        return <AlertCircle {...iconProps} className={`${iconProps.className} text-red-600`} />;
      case 'warning':
        return <AlertTriangle {...iconProps} className={`${iconProps.className} text-yellow-600`} />;
      case 'info':
      case 'empty':
        return <Info {...iconProps} className={`${iconProps.className} text-gray-500`} />;
      default:
        return null;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'loading':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-900',
          subtext: 'text-blue-700',
        };
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-900',
          subtext: 'text-green-700',
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-900',
          subtext: 'text-red-700',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-900',
          subtext: 'text-yellow-700',
        };
      case 'info':
      case 'empty':
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-900',
          subtext: 'text-gray-600',
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-900',
          subtext: 'text-gray-600',
        };
    }
  };

  const colors = getColors();
  const padding = size === 'sm' ? 'p-3' : size === 'md' ? 'p-4' : 'p-6';

  return (
    <div
      className={`${colors.bg} ${colors.border} border rounded-lg ${padding} ${className}`}
      role={type === 'error' ? 'alert' : type === 'warning' ? 'alert' : 'status'}
      aria-live={type === 'loading' ? 'polite' : type === 'error' ? 'assertive' : 'polite'}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={`${colors.text} font-medium ${
              size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'
            }`}>
              {title}
            </h3>
          )}
          {message && (
            <p className={`${colors.subtext} ${
              size === 'sm' ? 'text-xs' : 'text-sm'
            } ${title ? 'mt-1' : ''}`}>
              {message}
            </p>
          )}
          {details && (
            <details className="mt-2">
              <summary className={`${colors.subtext} text-xs cursor-pointer hover:underline focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 rounded`}>
                {t('show_details', 'Voir les détails')}
              </summary>
              <pre className={`mt-2 p-2 bg-white rounded text-xs whitespace-pre-wrap break-all max-w-full overflow-auto ${colors.border} border`}>
                {details}
              </pre>
            </details>
          )}
          {action && (
            <div className="mt-3">
              <button
                onClick={action.onClick}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                  action.variant === 'primary'
                    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
                }`}
              >
                {action.label}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Composants spécialisés pour des cas d'usage fréquents
export const LoadingSpinner: React.FC<{ message?: string; size?: 'sm' | 'md' | 'lg' }> = ({ 
  message, 
  size = 'md' 
}) => {
  const { t } = useTranslation();
  return (
    <LoadingState
      type="loading"
      title={t('loading', 'Chargement...')}
      message={message}
      size={size}
    />
  );
};

export const EmptyState: React.FC<{ 
  title?: string; 
  message?: string; 
  action?: LoadingStateProps['action'];
}> = ({ 
  title, 
  message, 
  action 
}) => {
  const { t } = useTranslation();
  return (
    <LoadingState
      type="empty"
      title={title || t('no_data', 'Aucune donnée')}
      message={message || t('no_data_message', 'Aucune donnée disponible pour le moment.')}
      action={action}
    />
  );
};

export const ErrorState: React.FC<{ 
  title?: string; 
  message?: string; 
  details?: string;
  onRetry?: () => void;
}> = ({ 
  title, 
  message, 
  details,
  onRetry 
}) => {
  const { t } = useTranslation();
  return (
    <LoadingState
      type="error"
      title={title || t('error_occurred', 'Une erreur est survenue')}
      message={message || t('error_message', 'Impossible de charger les données.')}
      details={details}
      action={onRetry ? {
        label: t('retry', 'Réessayer'),
        onClick: onRetry,
        variant: 'primary'
      } : undefined}
    />
  );
};

export default LoadingState;

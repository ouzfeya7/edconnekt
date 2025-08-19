import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle, XCircle, Mail, User, Calendar } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const InvitationList: React.FC = () => {
  const { t } = useTranslation();
  const { invitations, resendInvitation } = useOnboarding();

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'acceptee':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'expiree':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return t('pending', 'En attente');
      case 'acceptee':
        return t('accepted', 'Acceptée');
      case 'expiree':
        return t('expired', 'Expirée');
      default:
        return t('unknown', 'Inconnu');
    }
  };

  const getStatusBadgeClass = (statut: string) => {
    switch (statut) {
      case 'acceptee':
        return 'bg-green-100 text-green-800';
      case 'expiree':
        return 'bg-red-100 text-red-800';
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (invitations.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('invitations', 'Invitations')}
        </h2>
        <div className="text-center py-8">
          <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">{t('no_invitations', 'Aucune invitation envoyée')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {t('invitations', 'Invitations')} ({invitations.length})
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('user', 'Utilisateur')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('email', 'Email')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('role', 'Rôle')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('status', 'Statut')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('sent_on', 'Envoyée le')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('actions', 'Actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invitations.map((invitation) => (
              <tr key={invitation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {invitation.prenom} {invitation.nom}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{invitation.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {t(invitation.role, invitation.role)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(invitation.statut)}
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(invitation.statut)}`}>
                      {getStatusText(invitation.statut)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(invitation.dateEnvoi).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {invitation.statut === 'en_attente' ? (
                    <button
                      onClick={() => resendInvitation(invitation.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      {t('resend', 'Renvoyer')}
                    </button>
                  ) : (
                    <span className="text-gray-400">
                      {invitation.statut === 'acceptee' ? t('no_action_needed', 'Aucune action') : t('expired', 'Expirée')}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvitationList;

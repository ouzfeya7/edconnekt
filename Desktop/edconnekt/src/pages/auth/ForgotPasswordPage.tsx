import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Intégrer avec Keycloak
      console.log('Password reset request for:', email);
      setSubmitted(true);
    } catch (err) {
      setError(t('auth.reset_error'));
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-sm rounded-lg sm:px-10">
            <div className="text-center">
              <h2 className="text-2xl font-medium text-[#184867] mb-4">
                {t('auth.check_email')}
              </h2>
              <p className="text-gray-600">
                {t('auth.reset_instructions_sent')}
              </p>
              <a
                href="/auth/login"
                className="mt-6 inline-block text-sm text-[#184867] hover:text-[#184867]/80"
              >
                {t('auth.back_to_login')}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-[#184867]">
          {t('auth.reset_password')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t('auth.enter_email_reset')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('auth.email')}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#184867] focus:border-[#184867]"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#184867] hover:bg-[#184867]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#184867]"
            >
              {t('auth.send_reset_link')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/auth/login"
              className="text-sm text-[#184867] hover:text-[#184867]/80"
            >
              {t('auth.back_to_login')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
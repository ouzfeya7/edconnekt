import { useParams, useNavigate } from 'react-router-dom';
import logoWave from '../assets/logo-wave.png';
import logoOM from '../assets/logo-OM.png';
import { useEffect, useState } from 'react';
import { useResources } from '../contexts/ResourceContext';

const PaiementPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const montant = '2350 FCFA'; // Montant fictif
  const { resources } = useResources();
  const resource = resources.find(r => r.id === Number(id));

  const [step, setStep] = useState<'method_selection' | 'phone_entry' | 'processing' | 'done'>("method_selection");
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'om' | ''>('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  // Si la ressource est déjà payée (localStorage), on affiche l'état 'done'
  useEffect(() => {
    const paid = localStorage.getItem('paidResources') || '';
    if (id && paid.split(',').includes(id)) {
      setStep('done');
    }
  }, [id]); // id est la seule dépendance ici car navigate n'est plus utilisé pour cette vérification

  const handlePaymentMethodSelect = (method: 'wave' | 'om') => {
    setPaymentMethod(method);
    setError('');
    setStep('phone_entry'); // Passer à l'étape de saisie du téléphone
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^7[05678][0-9]{7}$/.test(phone)) {
      setError('Numéro de téléphone invalide (ex: 77xxxxxxx).');
      return;
    }
    setStep('processing');
    setTimeout(() => setStep('done'), 2500); // Simulation du paiement
  };

  const handlePaid = () => {
    const paid = localStorage.getItem('paidResources') || '';
    const paidArr = paid ? paid.split(',') : [];
    if (id && !paidArr.includes(id)) {
      paidArr.push(id);
      localStorage.setItem('paidResources', paidArr.join(','));
    }
    navigate(`/ressources/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Paiement de la ressource</h1>
        {resource && (
          <div className="w-full flex flex-col items-center mb-4">
            <img src={resource.imageUrl} alt={resource.title} className="w-24 h-32 object-cover rounded-lg mb-2 shadow" />
            <div className="text-center">
              <div className="font-semibold text-gray-800">{resource.title}</div>
              <div className="text-sm text-gray-500 mb-1">{resource.subject}</div>
              <div className="text-orange-600 font-bold text-lg">{montant}</div>
            </div>
          </div>
        )}
        {/* Étapes visuelles */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${step==='method_selection' ? 'bg-orange-500' : 'bg-green-500'}`}>1</div>
          <div className={`h-1 w-8 ${step==='method_selection' ? 'bg-gray-300' : 'bg-green-500'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${step==='phone_entry' ? 'bg-orange-500' : (step==='processing' || step==='done') ? 'bg-green-500' : 'bg-gray-300'}`}>2</div>
          <div className={`h-1 w-8 ${step==='phone_entry' || step==='processing' ? 'bg-gray-300' : 'bg-green-500'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${step==='done' ? 'bg-green-500' : 'bg-gray-300'}`}>3</div>
        </div>
        {/* Étape 1: Choix du moyen de paiement */}
        {step === 'method_selection' && (
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-center gap-6">
              <button type="button" onClick={() => handlePaymentMethodSelect('wave')} className={`flex flex-col items-center gap-1 border-2 rounded-xl px-4 py-2 transition ${paymentMethod==='wave' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}> <img src={logoWave} alt="Wave" className="w-12 h-12" /> <span className="text-xs font-semibold text-blue-600">Wave</span> </button>
              <button type="button" onClick={() => handlePaymentMethodSelect('om')} className={`flex flex-col items-center gap-1 border-2 rounded-xl px-4 py-2 transition ${paymentMethod==='om' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-gray-50'}`}> <img src={logoOM} alt="Orange Money" className="w-12 h-12" /> <span className="text-xs font-semibold text-orange-600">Orange Money</span> </button>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          </div>
        )}

        {/* Étape 2: Saisie du numéro de téléphone */}
        {step === 'phone_entry' && (
          <form onSubmit={handlePay} className="w-full flex flex-col gap-4">
            <input
              type="tel"
              placeholder="Numéro de téléphone (ex: 77xxxxxxx)"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
              maxLength={9}
              required
            />
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl mt-2 hover:bg-orange-600 transition">Valider le numéro</button>
          </form>
        )}

        {/* Étape 3: Loader de simulation */}
        {step === 'processing' && (
          <div className="flex flex-col items-center gap-4 my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <div className="text-orange-600 font-semibold">Traitement du paiement en cours...</div>
          </div>
        )}
        {/* Confirmation */}
        {step === 'done' && (
          <div className="flex flex-col items-center gap-4 my-8">
            <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-100">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <div className="text-green-700 font-semibold">Paiement réussi !</div>
            <button onClick={handlePaid} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl mt-2 hover:bg-green-700 transition">J’ai payé, accéder à la ressource</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaiementPage;                                                                                                                                        
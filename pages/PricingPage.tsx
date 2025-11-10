
import React, { useState } from 'react';
import { CONTACT_EMAIL } from '../constants';
import Button from '../components/common/Button';
import { useAdmin } from '../hooks/useAdmin';
import { useAuth } from '../hooks/useAuth';
import { PricingPlan } from '../types';
import PurchaseRequestModal from '../components/PurchaseRequestModal';
import { Link } from 'react-router-dom';

const PricingPage: React.FC = () => {
  const { plans, settings } = useAdmin();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

  const handlePurchaseClick = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const getPlanStyles = (type: string) => {
    switch (type) {
        case 'Pro': return 'border-transparent relative before:absolute before:-inset-0.5 before:rounded-xl before:gold-gradient before:p-0.5 before:animate-sweep';
        case 'Normal': return 'border-gray-200/50 dark:border-gray-800/50';
        default: return 'border-gray-200/50 dark:border-gray-800/50';
    }
  };

  return (
    <div className="py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-display text-gray-900 dark:text-white">Credits & Plans</h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Choose a plan that works for you and start creating today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => (
          <div key={plan.id} className={`flex flex-col p-8 glass-card rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300 ${getPlanStyles(plan.type)}`}>
            <div className="relative z-10 flex flex-col h-full">
                {plan.type === 'Pro' && <div className="text-center mb-4"><span className="px-3 py-1 text-xs font-semibold rounded-full gold-gradient text-black">Most Popular</span></div>}
                <div className="flex justify-between items-baseline">
                    <h2 className="text-2xl font-semibold font-display text-gray-900 dark:text-white">{plan.name}</h2>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        plan.type === 'Pro' ? 'bg-goldFrom/20 text-amber-800 dark:text-goldFrom' :
                        plan.type === 'Daily' ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300' :
                        plan.type === 'Normal' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>{plan.type}</span>
                </div>

                {plan.type === 'Daily' && plan.dailyCreditAmount ? (
                     <p className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">{plan.dailyCreditAmount} <span className="text-xl font-medium text-gray-500">/ Day</span></p>
                ) : (
                     <p className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">{plan.credits.toLocaleString()} <span className="text-xl font-medium text-gray-500">Credits</span></p>
                )}

                <p className="mt-2 text-gray-600 dark:text-gray-400 font-semibold">NPR {plan.price.toLocaleString()}</p>
                {plan.durationDays && <p className="text-sm text-gray-500 dark:text-gray-400">Valid for {plan.durationDays} days</p>}
                
                <p className="mt-6 flex-grow text-gray-600 dark:text-gray-300">{plan.description}</p>
                
                {plan.type !== 'Free' && (
                  <div className="mt-8">
                     {user?.isLoggedIn ? (
                        <Button className="w-full" onClick={() => handlePurchaseClick(plan)}>
                            <i data-lucide="shopping-cart" className="w-4 h-4 mr-2"/>
                            Initiate Purchase
                        </Button>
                     ) : (
                        <Link to="/auth">
                            <Button className="w-full" variant="secondary">
                                Login to Purchase
                            </Button>
                        </Link>
                     )}
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>

       <div className="mt-20 p-8 glass-card rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold text-center font-display text-gray-900 dark:text-white">How to Purchase Credits</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-center">
            To purchase credits, please use one of the payment methods below, then click "Initiate Purchase" on your desired plan to submit your payment details for verification.
          </p>
          <div className="mt-8 flex flex-col md:flex-row justify-center items-start gap-8">
            {settings.qrCode && (
              <div className="text-center p-6 glass-card rounded-lg w-full md:w-auto flex-shrink-0">
                <h4 className="font-semibold text-lg text-gray-900 dark:text-white">Scan to Pay</h4>
                <img src={settings.qrCode} alt="Payment QR Code" className="w-40 h-40 mt-3 rounded-lg mx-auto shadow-md"/>
              </div>
            )}
            <div className="flex-grow space-y-4 w-full">
               <div className="flex items-center gap-3 text-lg p-4 glass-card rounded-lg">
                <i data-lucide="mail" className="w-5 h-5 text-brandFrom flex-shrink-0" />
                <div>
                    <strong className="text-gray-800 dark:text-gray-200">Questions? Email Us:</strong> 
                    <a href={`mailto:${CONTACT_EMAIL}`} className="block font-medium text-brandFrom dark:text-brandTo hover:underline">{CONTACT_EMAIL}</a>
                </div>
              </div>
              {settings.paymentMethods.map((method) => (
                <div key={method.id} className="flex items-start gap-4 text-lg p-4 glass-card rounded-lg">
                    <i data-lucide="landmark" className="w-5 h-5 text-brandFrom mt-1 flex-shrink-0" />
                    <div>
                        <strong className="text-gray-800 dark:text-gray-200">{method.name}:</strong>
                        <span className="block text-gray-700 dark:text-gray-300 font-mono text-base">{method.details}</span>
                        <span className="block text-gray-500 dark:text-gray-400 text-sm mt-1">{method.hint}</span>
                    </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedPlan && (
            <PurchaseRequestModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                plan={selectedPlan}
            />
        )}
    </div>
  );
};

export default PricingPage;
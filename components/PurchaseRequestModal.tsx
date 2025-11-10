
import React, { useState } from 'react';
import { PaymentMethod, PricingPlan } from '../types';
import Modal from './common/Modal';
import Button from './common/Button';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin';

interface PurchaseRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PricingPlan;
}

const PurchaseRequestModal: React.FC<PurchaseRequestModalProps> = ({ isOpen, onClose, plan }) => {
  const { user } = useAuth();
  const { addPurchaseRequest, settings } = useAdmin();
  const [transactionId, setTransactionId] = useState('');
  const [note, setNote] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.isLoggedIn || !transactionId || !selectedMethod) {
        if(!selectedMethod) alert('Please select a payment method.');
        return;
    };
    
    setIsSubmitting(true);
    
    addPurchaseRequest({
        userId: user.id,
        userEmail: user.email,
        planId: plan.id,
        planName: plan.name,
        creditsToAward: plan.credits,
        transactionId,
        note: `Paid via ${selectedMethod.name}. ${note}`
    });

    setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
    }, 1000);
  };
  
  const handleClose = () => {
      onClose();
      // Reset state after modal closes
      setTimeout(() => {
        setIsSubmitted(false);
        setTransactionId('');
        setNote('');
        setSelectedMethod(null);
      }, 300);
  }

  const formInputStyles = "mt-1 block w-full rounded-lg bg-white/50 dark:bg-gray-800/50 border-gray-300/50 dark:border-gray-600/50 shadow-sm focus:border-brandFrom focus:ring-brandFrom sm:text-sm";

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isSubmitted ? "Request Submitted!" : "Purchase Credits"}>
      {isSubmitted ? (
        <div className="text-center animate-fade-in">
            <i data-lucide="check-circle-2" className="w-16 h-16 text-brandTo mx-auto" />
            <h3 className="mt-4 text-xl font-semibold font-display text-gray-900 dark:text-white">Thank You!</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
                Your purchase request has been sent for approval. Your credits will be added to your account shortly after verification.
            </p>
            <div className="mt-6">
                <Button onClick={handleClose}>Close</Button>
            </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* --- Step 1 --- */}
            <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 brand-gradient text-white rounded-full text-xs font-bold">1</span>
                    Plan Details
                </h4>
                <div className="mt-2 p-4 bg-gray-500/10 rounded-lg border border-gray-500/10 flex justify-between items-center">
                    <div>
                        <p className="font-bold text-lg text-brandFrom dark:text-brandTo">{plan.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{plan.credits.toLocaleString()} Credits</p>
                    </div>
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-100">NPR {plan.price.toLocaleString()}</p>
                </div>
            </div>
            
            {/* --- Step 2 --- */}
            <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 brand-gradient text-white rounded-full text-xs font-bold">2</span>
                    Make a Payment
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-8">Select a method and follow the payment instructions.</p>
                 <div className="mt-2 ml-8 space-y-2">
                    {settings.paymentMethods.map(method => (
                        <button type="button" key={method.id} onClick={() => setSelectedMethod(method)} className={`w-full p-3 text-left rounded-lg border-2 transition-all duration-200 ${selectedMethod?.id === method.id ? 'border-brandFrom bg-brandFrom/10' : 'border-gray-200/50 dark:border-gray-700/50 hover:border-gray-400/50 dark:hover:border-gray-500/50'}`}>
                             <div className="flex justify-between items-center">
                                <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">{method.name}</span>
                                {selectedMethod?.id === method.id && <i data-lucide="check-circle" className="w-5 h-5 text-brandFrom"/>}
                             </div>
                        </button>
                    ))}
                    {selectedMethod && (
                        <div className="p-3 bg-brandFrom/10 rounded-lg border border-brandFrom/20 animate-fade-in">
                            <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">Account: <span className="font-mono">{selectedMethod.details}</span></p>
                            <p className="text-xs text-brandFrom dark:text-brandTo mt-1">{selectedMethod.hint}</p>
                        </div>
                    )}
                 </div>
            </div>

            {/* --- Step 3 --- */}
            <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 brand-gradient text-white rounded-full text-xs font-bold">3</span>
                    Submit Details for Verification
                </h4>
                 <div className="mt-2 ml-8 space-y-4">
                    <div>
                         <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Transaction ID</label>
                         <input id="transactionId" type="text" value={transactionId} onChange={e => setTransactionId(e.target.value)} required className={formInputStyles} placeholder="Enter your payment transaction ID" />
                    </div>
                     <div>
                         <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Note (Optional)</label>
                         <textarea id="note" value={note} onChange={e => setNote(e.target.value)} rows={2} className={formInputStyles} placeholder="e.g., Paid from number 98..." />
                    </div>
                 </div>
            </div>
          
            <div className="pt-4 flex justify-end gap-3 border-t border-gray-200/50 dark:border-gray-700/50">
                <Button variant="secondary" onClick={handleClose} type="button">Cancel</Button>
                <Button type="submit" isLoading={isSubmitting} disabled={!selectedMethod}>Submit for Approval</Button>
            </div>
        </form>
      )}
    </Modal>
  );
};

export default PurchaseRequestModal;
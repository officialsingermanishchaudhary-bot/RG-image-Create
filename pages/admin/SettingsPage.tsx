
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import Button from '../../components/common/Button';
import { AdminSettings } from '../../types';

const SettingsPage: React.FC = () => {
  const { settings, updateSettings, addPaymentMethod, removePaymentMethod } = useAdmin();
  const [currentSettings, setCurrentSettings] = useState<AdminSettings>(settings);
  const [newMethodName, setNewMethodName] = useState('');
  const [newMethodDetails, setNewMethodDetails] = useState('');
  const [newMethodHint, setNewMethodHint] = useState('');

  useEffect(() => {
    setCurrentSettings(settings);
  }, [settings]);
  
  const handleQrCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setCurrentSettings(prev => ({...prev, qrCode: reader.result as string}));
          };
          reader.readAsDataURL(file);
      }
  };
  
  const handleAddMethod = (e: React.FormEvent) => {
      e.preventDefault();
      if(newMethodName && newMethodDetails && newMethodHint) {
        addPaymentMethod({ name: newMethodName, details: newMethodDetails, hint: newMethodHint });
        setNewMethodName('');
        setNewMethodDetails('');
        setNewMethodHint('');
      }
  };

  const handleSaveSettings = () => {
      updateSettings(currentSettings);
      alert('QR Code settings saved!');
  };

  const formInputStyles = "mt-1 block w-full rounded-lg bg-white/50 dark:bg-gray-800/50 border-gray-300/50 dark:border-gray-600/50 shadow-sm focus:border-brandFrom focus:ring-brandFrom sm:text-sm";


  return (
    <>
      <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-white mb-6">Settings</h1>
      
      <div className="glass-card p-6 rounded-xl shadow-md">
        <div className="space-y-8 divide-y divide-gray-200/50 dark:divide-gray-700/50">
            <div>
                <h2 className="text-xl font-semibold font-display text-gray-900 dark:text-white">Payment Configuration</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Update the QR code and payment instructions shown on the public pricing page.</p>
            </div>
            
            {/* QR Code Upload */}
            <div className="pt-8">
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment QR Code</label>
                <div className="mt-2 flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600 flex-shrink-0">
                        {currentSettings.qrCode ? (
                            <img src={currentSettings.qrCode} alt="QR Code Preview" className="h-full w-full object-cover rounded-lg" />
                        ) : (
                            <span className="text-xs text-gray-500 dark:text-gray-400">No Image</span>
                        )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleQrCodeChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brandFrom/20 file:text-brandFrom hover:file:bg-brandFrom/30 dark:file:bg-gray-700 dark:file:text-brandTo dark:hover:file:bg-gray-600 cursor-pointer"/>
                </div>
                 <div className="pt-4 flex justify-end">
                    <Button onClick={handleSaveSettings}>Save QR Code</Button>
                </div>
            </div>


            {/* Payment Methods */}
             <div className="pt-8">
                <h3 className="text-lg font-medium leading-6 font-display text-gray-900 dark:text-white">Payment Methods</h3>
                <div className="mt-4 space-y-3">
                    {settings.paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-start justify-between p-3 bg-gray-500/10 rounded-lg border border-gray-500/10">
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{method.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300 font-mono">{method.details}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{method.hint}</p>
                            </div>
                            <button onClick={() => removePaymentMethod(method.id)} className="text-accent1 hover:text-red-700 text-sm font-semibold flex-shrink-0 ml-4">Remove</button>
                        </div>
                    ))}
                </div>

                 <form onSubmit={handleAddMethod} className="mt-6 p-4 border-t border-gray-200/50 dark:border-gray-700/50 space-y-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 font-display">Add New Method</h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-3">
                             <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                            <input type="text" value={newMethodName} onChange={(e) => setNewMethodName(e.target.value)} placeholder="e.g., eSewa" required className={formInputStyles}/>
                        </div>
                        <div className="md:col-span-3">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Details</label>
                            <input type="text" value={newMethodDetails} onChange={(e) => setNewMethodDetails(e.target.value)} placeholder="e.g., 98xxxxxxxx" required className={formInputStyles}/>
                        </div>
                         <div className="md:col-span-3">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hint for User</label>
                            <input type="text" value={newMethodHint} onChange={(e) => setNewMethodHint(e.target.value)} placeholder="e.g., Enter Transaction ID" required className={formInputStyles}/>
                        </div>
                     </div>
                    <div className="flex justify-end">
                        <Button type="submit" variant="secondary">Add Payment Method</Button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
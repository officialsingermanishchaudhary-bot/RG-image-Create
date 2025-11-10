
import React, { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import Button from '../../components/common/Button';
import { PricingPlan } from '../../types';

const initialPlanState: Omit<PricingPlan, 'id'> = { name: '', credits: 100, price: 150, description: '', type: 'Normal', durationDays: 30, dailyCreditAmount: null };

const PlansPage: React.FC = () => {
  const { plans, addPlan } = useAdmin();
  const [newPlan, setNewPlan] = useState(initialPlanState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue: string | number | null = value;
    if(name === 'credits' || name === 'durationDays' || name === 'price' || name === 'dailyCreditAmount') {
        processedValue = value ? parseInt(value) : null;
    }
    
    setNewPlan(prev => {
        const updated = { ...prev, [name]: processedValue };
        // If type changes to not-daily, clear daily credits
        if (name === 'type' && value !== 'Daily') {
            updated.dailyCreditAmount = null;
        }
        // If type changes to daily, set default daily credits
        if (name === 'type' && value === 'Daily' && !updated.dailyCreditAmount) {
            updated.dailyCreditAmount = 25;
        }
        return updated;
    });
  };
  
  const formInputStyles = "mt-1 block w-full rounded-lg bg-white/50 dark:bg-gray-800/50 border-gray-300/50 dark:border-gray-600/50 shadow-sm focus:border-brandFrom focus:ring-brandFrom sm:text-sm";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlan.name && newPlan.price !== null && newPlan.description) {
        addPlan(newPlan);
        setNewPlan(initialPlanState);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-white mb-6">Plan Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add New Plan Form */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 font-display text-gray-900 dark:text-white">Create New Plan</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Plan Name</label>
                <input type="text" name="name" value={newPlan.name} onChange={handleInputChange} required className={formInputStyles}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Plan Type</label>
                <select name="type" value={newPlan.type} onChange={handleInputChange} className={formInputStyles}>
                    <option>Free</option>
                    <option>Normal</option>
                    <option>Pro</option>
                    <option>Daily</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {newPlan.type === 'Daily' ? 'Initial Credits' : 'Total Credits'}
                  </label>
                  <input type="number" name="credits" value={newPlan.credits} onChange={handleInputChange} required className={formInputStyles}/>
                </div>
                 {newPlan.type === 'Daily' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Credits / Day</label>
                      <input type="number" name="dailyCreditAmount" value={newPlan.dailyCreditAmount || ''} onChange={handleInputChange} placeholder="e.g. 25" required className={formInputStyles}/>
                    </div>
                 )}
                 <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Duration (days)</label>
                  <input type="number" name="durationDays" value={newPlan.durationDays || ''} onChange={handleInputChange} placeholder="optional" className={formInputStyles}/>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price (NPR)</label>
                  <input type="number" name="price" value={newPlan.price} onChange={handleInputChange} required className={formInputStyles}/>
                </div>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea name="description" value={newPlan.description} onChange={handleInputChange} rows={3} required className={formInputStyles}/>
              </div>
              <Button type="submit" className="w-full !py-3">
                <i data-lucide="plus" className="w-4 h-4 mr-2"/>
                Add Plan
              </Button>
            </form>
          </div>
        </div>
        
        {/* Existing Plans Display */}
        <div className="lg:col-span-2 space-y-4">
            {plans.map(plan => (
                <div key={plan.id} className="glass-card p-4 rounded-xl shadow-md flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div className="flex-grow">
                        <h3 className="font-semibold text-lg font-display text-gray-900 dark:text-white">{plan.name} 
                        <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full ${
                            plan.type === 'Pro' ? 'bg-goldFrom/20 text-amber-800 dark:text-goldFrom' :
                            plan.type === 'Daily' ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300' :
                            plan.type === 'Normal' ? 'bg-brandTo/20 text-green-800 dark:text-brandTo' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>{plan.type}</span>
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {plan.type === 'Daily' ? `${plan.dailyCreditAmount} credits/day` : `${plan.credits.toLocaleString()} Credits`} | NPR {plan.price.toLocaleString()} {plan.durationDays ? `| ${plan.durationDays} days` : ''}
                        </p>
                         <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{plan.description}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default PlansPage;
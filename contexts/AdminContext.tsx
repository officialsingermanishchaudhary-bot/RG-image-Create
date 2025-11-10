
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { PricingPlan, AdminSettings, User, PurchaseRequest, PlanType, RequestStatus, PaymentMethod } from '../types';
import { ESEWA_NUMBER, ADMIN_EMAIL } from '../constants';

// --- Default Data ---
const defaultUsers: User[] = [
    { id: 'admin001', email: ADMIN_EMAIL, credits: 9999, role: 'admin', lastCreditGrantDate: null },
    { id: 'user001', email: 'user1@example.com', credits: 15, role: 'user', lastCreditGrantDate: null },
    { id: 'user002', email: 'user2@example.com', credits: 150, role: 'user', lastCreditGrantDate: '2024-07-28' },
    { id: 'user003', email: 'user3@example.com', credits: 0, role: 'user', lastCreditGrantDate: null },
];

const defaultPlans: PricingPlan[] = [
  { id: '1', name: 'Free', credits: 25, price: 0, description: 'Perfect for trying out the platform.', type: 'Free', durationDays: null, dailyCreditAmount: null },
  { id: '2', name: 'Starter', credits: 100, price: 150, description: 'Great for personal projects.', type: 'Normal', durationDays: 30, dailyCreditAmount: null },
  { id: '3', name: 'Pro', credits: 500, price: 500, description: 'For frequent users and larger projects.', type: 'Pro', durationDays: 90, dailyCreditAmount: null },
  { id: '4', name: 'Daily Creator', credits: 50, price: 300, description: 'Get a fresh batch of credits every day. Perfect for consistent creativity.', type: 'Daily', durationDays: 30, dailyCreditAmount: 25 },
];

const defaultSettings: AdminSettings = {
    qrCode: null,
    paymentMethods: [
        { id: 'pm1', name: 'eSewa', details: ESEWA_NUMBER, hint: 'Send payment and enter the eSewa Transaction ID.'},
        { id: 'pm2', name: 'Bank Transfer', details: 'A/C: 123456789, Bank of Kathmandu', hint: 'Mention your email in the transfer remarks.'}
    ]
};

const defaultRequests: PurchaseRequest[] = [
    { id: 'req1', userId: 'user001', userEmail: 'user1@example.com', planId: '2', planName: 'Starter', creditsToAward: 100, date: '2024-07-28', transactionId: 'TXN12345', status: 'Pending', note: 'Paid via eSewa' },
    { id: 'req2', userId: 'user002', userEmail: 'user2@example.com', planId: '3', planName: 'Pro', creditsToAward: 500, date: '2024-07-27', transactionId: 'TXN67890', status: 'Approved' },
    { id: 'req3', userId: 'user002', userEmail: 'user2@example.com', planId: '4', planName: 'Daily Creator', creditsToAward: 50, date: '2024-07-28', transactionId: 'TXNDAILY', status: 'Approved' },
];

// --- Helper for localStorage ---
const useStickyState = <T,>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};


// --- Context Definition ---
interface AdminContextType {
  users: User[];
  plans: PricingPlan[];
  settings: AdminSettings;
  requests: PurchaseRequest[];
  addPlan: (plan: Omit<PricingPlan, 'id'>) => void;
  updateSettings: (newSettings: AdminSettings) => void;
  updateUser: (updatedUser: User) => void;
  deleteUser: (userId: string) => void;
  addPurchaseRequest: (request: Omit<PurchaseRequest, 'id' | 'date' | 'status'>) => void;
  updateRequestStatus: (requestId: string, status: RequestStatus) => void;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  removePaymentMethod: (methodId: string) => void;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);


// --- Provider Component ---
export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useStickyState<User[]>(defaultUsers, 'admin_users');
  const [plans, setPlans] = useStickyState<PricingPlan[]>(defaultPlans, 'admin_plans');
  const [settings, setSettings] = useStickyState<AdminSettings>(defaultSettings, 'admin_settings');
  const [requests, setRequests] = useStickyState<PurchaseRequest[]>(defaultRequests, 'admin_requests');

  const addPlan = useCallback((planData: Omit<PricingPlan, 'id'>) => {
    const newPlan: PricingPlan = { ...planData, id: Date.now().toString() };
    setPlans(prev => [...prev, newPlan]);
  }, [setPlans]);
  
  const updateSettings = useCallback((newSettings: AdminSettings) => {
    setSettings(newSettings);
  }, [setSettings]);

  const updateUser = useCallback((updatedUser: User) => {
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
  }, [setUsers]);

  const deleteUser = useCallback((userId: string) => {
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
  }, [setUsers]);

  const addPurchaseRequest = useCallback((requestData: Omit<PurchaseRequest, 'id' | 'date' | 'status'>) => {
    const newRequest: PurchaseRequest = {
        ...requestData,
        id: `req_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending'
    };
    setRequests(prev => [newRequest, ...prev]);
  }, [setRequests]);
  
  const updateRequestStatus = useCallback((requestId: string, status: RequestStatus) => {
      const request = requests.find(r => r.id === requestId);
      if (!request) return;

      // The core logic: if approved, find the user in the master list and add credits.
      if (status === 'Approved' && request.status !== 'Approved') {
          setUsers(prevUsers => {
              const userIndex = prevUsers.findIndex(u => u.email === request.userEmail);
              if (userIndex !== -1) {
                  const updatedUsers = [...prevUsers];
                  updatedUsers[userIndex] = {
                      ...updatedUsers[userIndex],
                      credits: updatedUsers[userIndex].credits + request.creditsToAward
                  };
                  return updatedUsers;
              }
              return prevUsers;
          });
      }
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));
  }, [requests, setRequests, setUsers]);
  
  const addPaymentMethod = useCallback((methodData: Omit<PaymentMethod, 'id'>) => {
    if (methodData.name.trim() && methodData.details.trim()) {
      const newMethod: PaymentMethod = { ...methodData, id: `pm_${Date.now()}` };
      setSettings(prev => ({...prev, paymentMethods: [...prev.paymentMethods, newMethod]}));
    }
  }, [setSettings]);

  const removePaymentMethod = useCallback((methodId: string) => {
    setSettings(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter(method => method.id !== methodId)
    }));
  }, [setSettings]);

  return (
    <AdminContext.Provider value={{ users, plans, settings, requests, addPlan, updateSettings, updateUser, deleteUser, addPurchaseRequest, updateRequestStatus, addPaymentMethod, removePaymentMethod }}>
      {children}
    </AdminContext.Provider>
  );
};
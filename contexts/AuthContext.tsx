
import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { User } from '../types';
import { INITIAL_CREDITS, ADMIN_EMAIL } from '../constants';
import { AdminContext } from './AdminContext';


interface AuthContextType {
  user: (User & { isLoggedIn: boolean }) | null;
  login: (email: string) => boolean;
  register: (email: string) => boolean;
  logout: () => void;
  deductCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultUser: User & { isLoggedIn: boolean } = {
    id: '',
    isLoggedIn: false,
    credits: 0,
    email: '',
    role: 'user',
    lastCreditGrantDate: null,
};

// Helper functions to interact with the master user list in localStorage
const getUsersFromStorage = (): User[] => {
    try {
        const storedUsers = localStorage.getItem('admin_users');
        return storedUsers ? JSON.parse(storedUsers) : [];
    } catch {
        return [];
    }
};

const setUsersInStorage = (users: User[]) => {
    localStorage.setItem('admin_users', JSON.stringify(users));
};


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(User & { isLoggedIn: boolean }) | null>(null);
  const adminContext = useContext(AdminContext);

  useEffect(() => {
    try {
      const storedUserString = localStorage.getItem('currentUser');
      if (storedUserString) {
        const storedUser = JSON.parse(storedUserString);
        checkForDailyCredits(storedUser).then(updatedUser => {
             setUser(updatedUser);
        });
      } else {
        setUser({ ...defaultUser, isLoggedIn: false });
      }
    } catch (error) {
        console.error("Failed to parse current user from localStorage", error);
        setUser({ ...defaultUser, isLoggedIn: false });
    }
  }, []);

  const checkForDailyCredits = async (currentUser: User & { isLoggedIn: boolean }): Promise<User & { isLoggedIn: boolean }> => {
    if (!currentUser.isLoggedIn || !adminContext) {
      return currentUser;
    }
  
    const { requests, plans } = adminContext;
    const today = new Date().toISOString().split('T')[0];

    if (currentUser.lastCreditGrantDate === today) {
      return currentUser;
    }

    const latestDailyPlanRequest = requests
      .filter(r => r.userEmail === currentUser.email && r.status === 'Approved')
      .map(r => ({ request: r, plan: plans.find(p => p.id === r.planId) }))
      .filter(item => item.plan && item.plan.type === 'Daily' && item.plan.durationDays && item.plan.dailyCreditAmount)
      .sort((a, b) => new Date(b.request.date).getTime() - new Date(a.request.date).getTime())[0];

    if (latestDailyPlanRequest) {
      const { request, plan } = latestDailyPlanRequest;
      const purchaseDate = new Date(request.date);
      const expiryDate = new Date(purchaseDate.setDate(purchaseDate.getDate() + (plan.durationDays || 0)));

      if (new Date() < expiryDate) {
        console.log(`Granting ${plan.dailyCreditAmount} daily credits to ${currentUser.email}`);
        const updatedUser = {
            ...currentUser,
            credits: currentUser.credits + (plan.dailyCreditAmount || 0),
            lastCreditGrantDate: today,
        };
        updateUserStorage(updatedUser, true); // Update storage including master list
        return updatedUser;
      }
    }
  
    return currentUser;
  };


  const updateUserStorage = (updatedUser: (User & { isLoggedIn: boolean }) | null, updateMasterList = false) => {
    if (updatedUser) {
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
       if (updateMasterList) {
          const users = getUsersFromStorage();
          const userIndex = users.findIndex(u => u.id === updatedUser.id);
          if (userIndex !== -1) {
              users[userIndex] = {
                  id: updatedUser.id,
                  email: updatedUser.email,
                  credits: updatedUser.credits,
                  role: updatedUser.role,
                  lastCreditGrantDate: updatedUser.lastCreditGrantDate,
              };
              setUsersInStorage(users);
          }
      }
    } else {
      localStorage.removeItem('currentUser');
    }
    setUser(updatedUser);
  };

  const login = useCallback((email: string): boolean => {
    const users = getUsersFromStorage();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
        const loggedInUser = { ...existingUser, isLoggedIn: true };
        checkForDailyCredits(loggedInUser).then(finalUser => {
             updateUserStorage(finalUser);
        });
        return true;
    }
    return false;
  }, []);

  const register = useCallback((email: string): boolean => {
    const users = getUsersFromStorage();
    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (emailExists) {
        alert("An account with this email already exists.");
        return false;
    }

    const newUser: User = {
        id: Date.now().toString(),
        email: email,
        credits: INITIAL_CREDITS,
        role: email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'user',
        lastCreditGrantDate: null,
    };
    
    setUsersInStorage([...users, newUser]);
    
    const loggedInUser = { ...newUser, isLoggedIn: true };
    updateUserStorage(loggedInUser);
    return true;
  }, []);


  const logout = useCallback(() => {
    updateUserStorage(null);
  }, []);

  const deductCredits = useCallback((amount: number): boolean => {
    if (user && user.isLoggedIn && user.credits >= amount) {
      const updatedUser = { ...user, credits: user.credits - amount };
      updateUserStorage(updatedUser, true);
      return true;
    }
    return false;
  }, [user]);
  
  const addCredits = useCallback((amount: number) => {
    if(user && user.isLoggedIn) {
        const updatedUser = { ...user, credits: user.credits + amount };
        updateUserStorage(updatedUser, true);
    }
  }, [user]);


  return (
    <AuthContext.Provider value={{ user, login, register, logout, deductCredits, addCredits }}>
      {children}
    </AuthContext.Provider>
  );
};
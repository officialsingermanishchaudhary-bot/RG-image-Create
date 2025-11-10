
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import { INITIAL_CREDITS } from '../constants';
import SparklesIcon from '../components/icons/SparklesIcon';

type AuthMode = 'login' | 'register';

const AuthPage: React.FC = () => {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // For UI purposes only

  useEffect(() => {
    if (user?.isLoggedIn) {
      navigate('/generator');
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      const success = mode === 'login' ? login(email) : register(email);
      if (success) {
        navigate('/generator');
      }
    }
  };

  return (
    <div className="flex justify-center items-center py-16 animate-fade-in">
      <div className="max-w-md w-full p-8 glass-card rounded-xl shadow-lg">
        <div className="text-center">
            <SparklesIcon className="w-12 h-12 mx-auto text-brandFrom"/>
            <h2 className="mt-4 text-3xl font-bold font-display text-gray-900 dark:text-white">
            {mode === 'register' ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
            {mode === 'register' ? `Sign up to get ${INITIAL_CREDITS} free credits!` : 'Log in to continue creating.'}
            </p>
        </div>

        <div className="my-6 flex border-b border-gray-200/50 dark:border-gray-700/50">
            <button onClick={() => setMode('register')} className={`w-1/2 py-3 font-semibold text-center transition-colors duration-200 ${mode === 'register' ? 'text-brandFrom dark:text-brandTo border-b-2 border-brandFrom' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                Register
            </button>
            <button onClick={() => setMode('login')} className={`w-1/2 py-3 font-semibold text-center transition-colors duration-200 ${mode === 'login' ? 'text-brandFrom dark:text-brandTo border-b-2 border-brandFrom' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                Login
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
                <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    autoComplete="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brandFrom focus:border-transparent"
                />
            </div>
            <div>
                <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brandFrom focus:border-transparent"
                    placeholder={mode === 'register' ? "Choose a strong password" : "Enter your password"}
                />
            </div>
            <div>
                <Button type="submit" className="w-full">
                    <i data-lucide={mode === 'register' ? 'user-plus' : 'log-in'} className="w-4 h-4 mr-2" />
                    {mode === 'register' ? 'Create Account' : 'Login'}
                </Button>
            </div>
            <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-500">
            Authentication is simulated. No real accounts are created.
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
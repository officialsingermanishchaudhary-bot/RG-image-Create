
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin';
import { APP_NAME } from '../constants';
import Button from './common/Button';
import SparklesIcon from './icons/SparklesIcon';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { requests } = useAdmin();
  const hasPurchasedPlan = requests.some(req => req.userEmail === user?.email && req.status === 'Approved');

  const navLinkClasses = "px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200";
  const activeLinkClasses = "bg-gray-100/50 text-brandFrom dark:bg-gray-800/50 dark:text-white";
  const inactiveLinkClasses = "text-gray-500 hover:bg-gray-100/50 dark:text-gray-400 dark:hover:bg-gray-800/50";

  return (
    <header className="glass-card sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold font-display text-gray-800 dark:text-white">
            <SparklesIcon className="w-6 h-6 text-brandFrom"/>
            <span>{APP_NAME}</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-2">
            <NavLink to="/generator" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>
              Generator
            </NavLink>
            <NavLink to="/pricing" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>
              Credits & Plans
            </NavLink>
            {user?.role === 'admin' && (
               <NavLink to="/admin" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>
                Admin Panel
              </NavLink>
            )}
          </nav>
          
          <div className="flex items-center gap-3">
            {user?.isLoggedIn ? (
              <>
                <div className="hidden sm:flex items-center gap-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 glass-card px-3 py-1.5 rounded-lg">
                  {hasPurchasedPlan && (
                     <span className="flex items-center gap-1.5 bg-gradient-to-r from-accent2 to-orange-400 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                        <i data-lucide="gem" className="w-3 h-3"/>
                        Premium
                    </span>
                  )}
                  <i data-lucide="database" className="w-4 h-4 text-brandFrom"></i>
                  <span>Credits:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{user.credits}</span>
                </div>
                <button onClick={logout} className={`${inactiveLinkClasses} ${navLinkClasses}`}>Logout</button>
              </>
            ) : (
                <Link to="/auth">
                    <Button variant='primary' className='px-4 py-2 text-sm'>Login / Sign Up</Button>
                </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
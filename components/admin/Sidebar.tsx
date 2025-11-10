
import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { APP_NAME } from '../../constants';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  const navLinkClasses = "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200";
  const activeLinkClasses = "brand-gradient text-white shadow-lg shadow-brandFrom/30";
  const inactiveLinkClasses = "text-gray-300 hover:bg-gray-700/50 hover:text-white";

  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'layout-grid' },
    { name: 'Users', path: '/admin/users', icon: 'users' },
    { name: 'Plans', path: '/admin/plans', icon: 'package' },
    { name: 'Requests', path: '/admin/requests', icon: 'mail-check' },
    { name: 'Settings', path: '/admin/settings', icon: 'settings' },
  ];

  return (
    <div className="flex flex-col w-64 bg-bgDark text-white p-4 h-full">
      <div className="flex items-center gap-2 text-xl font-bold font-display text-white mb-8 px-2">
        <i data-lucide="shield-check" className="w-7 h-7 text-brandFrom"/>
        <span>{APP_NAME}</span>
      </div>

      <nav className="flex-grow space-y-1.5">
        {links.map(link => (
          <NavLink
            key={link.name}
            to={link.path}
            end
            className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
          >
            <i data-lucide={link.icon} className="w-5 h-5 mr-3"/>
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="p-3 bg-gray-900/50 rounded-lg text-sm mb-3 truncate border border-gray-700/50">
            <p className="text-gray-400 text-xs">Signed in as</p>
            <p className="font-semibold truncate">{user?.email}</p>
        </div>
        <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 bg-gray-900/50 hover:bg-accent1/80 hover:text-white rounded-lg transition-colors border border-gray-700/50">
            <i data-lucide="log-out" className="w-4 h-4" />
            Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
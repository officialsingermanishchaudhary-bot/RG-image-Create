
import React from 'react';
import { APP_NAME } from '../../constants';

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className="md:hidden bg-white dark:bg-bgDark text-gray-800 dark:text-white p-4 flex items-center justify-between shadow-md sticky top-0 z-30 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 text-xl font-bold font-display">
        <i data-lucide="shield-check" className="w-6 h-6 text-brandFrom" />
        <span>{APP_NAME}</span>
      </div>
      <button onClick={onMenuToggle} aria-label="Open menu" className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
        <i data-lucide="menu" className="h-6 w-6" />
      </button>
    </header>
  );
};

export default AdminHeader;
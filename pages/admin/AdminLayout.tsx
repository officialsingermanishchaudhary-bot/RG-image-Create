
import React, { useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/AdminHeader';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-dark-gradient">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />
      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
         onClick={(e) => e.stopPropagation()}
      >
        <Sidebar />
      </div>
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <AdminHeader onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none p-4 sm:p-6 lg:p-8">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
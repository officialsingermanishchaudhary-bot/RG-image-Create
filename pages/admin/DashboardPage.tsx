
import React from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { useAuth } from '../../hooks/useAuth';

const StatCard: React.FC<{ title: string; value: string; icon: string }> = ({ title, value, icon }) => (
  <div className="glass-card p-6 rounded-xl shadow-md transform hover:-translate-y-1 transition-transform duration-300 flex items-center gap-4">
    <div className="p-3 bg-brandFrom/20 rounded-lg">
      <i data-lucide={icon} className="w-6 h-6 text-brandFrom dark:text-brandTo"></i>
    </div>
    <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</h3>
        <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const { users, plans, requests } = useAdmin();
  const { user } = useAuth();
  const pendingRequests = requests.filter(r => r.status === 'Pending').length;

  return (
    <>
      <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-white mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={users.length.toLocaleString()} icon="users" />
        <StatCard title="Images Generated (24h)" value="5,678" icon="image"/>
        <StatCard title="Active Plans" value={plans.length.toLocaleString()} icon="package" />
        <StatCard title="Pending Requests" value={pendingRequests.toLocaleString()} icon="mail-check" />
      </div>

      <div className="mt-8 p-8 glass-card rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-2 font-display text-gray-900 dark:text-white">Welcome, {user?.email}!</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
            This is your control center. Manage users, oversee credit plans, and configure payment settings to keep the platform running smoothly. Use the navigation on the left to get started.
        </p>
      </div>
    </>
  );
};

export default DashboardPage;
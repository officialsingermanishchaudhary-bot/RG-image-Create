
import React, { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { User } from '../../types';
import EditUserModal from '../../components/admin/EditUserModal';

const UsersPage: React.FC = () => {
  const { users, updateUser, deleteUser } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  
  const handleDelete = (userId: string) => {
    if(window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
        deleteUser(userId);
    }
  };

  const handleSaveUser = (updatedUser: User) => {
    updateUser(updatedUser);
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-white mb-6">User Management</h1>
      <div className="glass-card p-4 sm:p-6 rounded-xl shadow-md">
        {/* Mobile View: Cards */}
        <div className="sm:hidden space-y-4">
            {users.map(user => (
                <div key={user.id} className="p-4 bg-gray-500/10 rounded-lg border border-gray-500/20">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{user.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Credits: <span className="font-mono">{user.credits.toLocaleString()}</span></p>
                    <div className="mt-2 flex justify-between items-center">
                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' 
                            ? 'bg-brandFrom/20 text-brandFrom' 
                            : 'bg-brandTo/20 text-green-800 dark:text-brandTo'
                         }`}>{user.role}</span>
                         <div className="space-x-4">
                            <button onClick={() => handleEdit(user)} className="text-brandFrom dark:text-brandTo text-sm font-semibold">Edit</button>
                            {user.role !== 'admin' && (
                                <button onClick={() => handleDelete(user.id)} className="text-accent1 text-sm font-semibold">Delete</button>
                            )}
                         </div>
                    </div>
                </div>
            ))}
        </div>
        
        {/* Desktop View: Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50">
            <thead className="bg-transparent">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Credits</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-gray-200/50 dark:divide-gray-700/50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-500/10 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 font-mono">{user.credits.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                     <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' 
                        ? 'bg-brandFrom/20 text-brandFrom' 
                        : 'bg-brandTo/20 text-green-800 dark:text-brandTo'
                     }`}>
                        {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                    <button onClick={() => handleEdit(user)} className="text-brandFrom hover:text-blue-800 dark:text-brandTo dark:hover:text-blue-300 transition-colors">Edit</button>
                    {user.role !== 'admin' && (
                        <button onClick={() => handleDelete(user.id)} className="text-accent1 hover:text-red-800 dark:text-accent1 dark:hover:text-red-300 transition-colors">Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <EditUserModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </>
  );
};

export default UsersPage;
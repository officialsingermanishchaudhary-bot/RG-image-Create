
import React from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { RequestStatus } from '../../types';

const RequestsPage: React.FC = () => {
    const { requests, updateRequestStatus } = useAdmin();

    const handleUpdateStatus = (requestId: string, status: RequestStatus) => {
        updateRequestStatus(requestId, status);
    };

    const getStatusColor = (status: RequestStatus) => {
        switch (status) {
            case 'Pending': return 'bg-accent2/20 text-yellow-800 dark:text-accent2';
            case 'Approved': return 'bg-brandTo/20 text-green-800 dark:text-brandTo';
            case 'Rejected': return 'bg-accent1/20 text-red-800 dark:text-accent1';
        }
    };

  return (
    <>
        <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-white mb-6">Purchase Requests</h1>
        <div className="glass-card p-4 sm:p-6 rounded-xl shadow-md">
        
        {/* Mobile View: Cards */}
        <div className="sm:hidden space-y-4">
            {requests.map(req => (
                <div key={req.id} className="p-4 bg-gray-500/10 rounded-lg border border-gray-500/20 space-y-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white truncate">{req.userEmail}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{req.planName} ({req.creditsToAward} Cr)</p>
                        </div>
                         <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(req.status)}`}>
                            {req.status}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">TXN ID: <span className="font-mono">{req.transactionId}</span></p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Date: {req.date}</p>
                    </div>
                    {req.status === 'Pending' && (
                        <div className="pt-2 border-t border-gray-500/20 flex justify-end gap-4">
                             <button onClick={() => handleUpdateStatus(req.id, 'Approved')} className="text-brandTo text-sm font-semibold">Approve</button>
                            <button onClick={() => handleUpdateStatus(req.id, 'Rejected')} className="text-accent1 text-sm font-semibold">Reject</button>
                        </div>
                    )}
                </div>
            ))}
        </div>

        {/* Desktop View: Table */}
         <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50">
            <thead className="bg-transparent">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Plan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transaction ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-gray-200/50 dark:divide-gray-700/50">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-500/10 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{req.userEmail}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{req.planName} ({req.creditsToAward} Cr)</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 font-mono">{req.transactionId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{req.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                     <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(req.status)}`}>
                        {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                    {req.status === 'Pending' && (
                        <>
                            <button onClick={() => handleUpdateStatus(req.id, 'Approved')} className="text-brandTo hover:text-green-800 dark:text-brandTo dark:hover:text-green-300 transition-colors">Approve</button>
                            <button onClick={() => handleUpdateStatus(req.id, 'Rejected')} className="text-accent1 hover:text-red-800 dark:text-accent1 dark:hover:text-red-300 transition-colors">Reject</button>
                        </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default RequestsPage;
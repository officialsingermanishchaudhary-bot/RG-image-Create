
import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import Modal from '../common/Modal';
import Button from '../common/Button';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (updatedUser: User) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    if (user) {
      setCredits(user.credits);
    }
  }, [user]);

  const handleSave = () => {
    if (user) {
      onSave({ ...user, credits: credits });
    }
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit User: ${user.email}`}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            User ID
          </label>
          <input
            type="text"
            disabled
            value={user.id}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm bg-gray-100 dark:bg-gray-700/50 dark:border-gray-600"
          />
        </div>
        <div>
          <label htmlFor="credits" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Credits
          </label>
          <input
            id="credits"
            type="number"
            value={credits}
            onChange={(e) => setCredits(parseInt(e.target.value, 10) || 0)}
            className="mt-1 block w-full rounded-lg bg-white/50 dark:bg-gray-800/50 border-gray-300/50 dark:border-gray-600/50 shadow-sm focus:border-brandFrom focus:ring-brandFrom sm:text-sm"
          />
        </div>
        <div className="pt-4 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditUserModal;
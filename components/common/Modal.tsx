
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center backdrop-blur-sm" aria-modal="true" role="dialog" onClick={onClose}>
      <div 
        className="glass-card rounded-xl shadow-2xl m-4 max-w-lg w-full transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-lg font-semibold font-display text-gray-900 dark:text-white">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-brandFrom"
              aria-label="Close modal"
            >
               <i data-lucide="x" className="h-5 w-5"></i>
            </button>
          </div>
          <div className="mt-5">
            {children}
          </div>
        </div>
      </div>
       <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale { animation: fadeInScale 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Modal;

import React from 'react';
import { APP_NAME, CONTACT_EMAIL } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent">
      <div className="container mx-auto px-4 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        <p className="mt-1">
          Contact: <a href={`mailto:${CONTACT_EMAIL}`} className="text-brandFrom dark:text-brandTo hover:underline">{CONTACT_EMAIL}</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
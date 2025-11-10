
import React from 'react';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m12 3-1.9 1.9a2 2 0 0 0-1.2 3.8L3 12l1.9-1.9a2 2 0 0 0 3.8-1.2L12 3z"/>
    <path d="M21 12l-1.9 1.9a2 2 0 0 1-3.8-1.2L12 9l1.9 1.9a2 2 0 0 1 1.2 3.8L21 12z"/>
    <path d="M12 21l1.9-1.9a2 2 0 0 0 1.2-3.8L21 12l-1.9 1.9a2 2 0 0 0-3.8 1.2L12 21z"/>
    <path d="M3 12l1.9-1.9a2 2 0 0 1 3.8 1.2L12 15l-1.9-1.9a2 2 0 0 1-1.2-3.8L3 12z"/>
  </svg>
);

export default SparklesIcon;
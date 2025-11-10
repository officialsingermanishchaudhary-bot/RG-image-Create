
import React from 'react';

const Loader: React.FC = () => (
  <svg
    className="w-16 h-16 animate-spin"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="brand-gradient-loader" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#6A4CFF" />
        <stop offset="100%" stopColor="#00E0A8" />
      </linearGradient>
    </defs>
    <circle
      cx="50"
      cy="50"
      r="45"
      fill="none"
      stroke="url(#brand-gradient-loader)"
      strokeWidth="10"
      strokeLinecap="round"
      strokeDasharray="283"
      strokeDashoffset="75"
    />
  </svg>
);

export default Loader;
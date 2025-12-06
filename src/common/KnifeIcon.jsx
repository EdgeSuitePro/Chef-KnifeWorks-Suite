import React from 'react';

const KnifeIcon = ({ className, ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className} 
    {...props}
  >
    {/* Handle */}
    <path d="M4 20L8 16" /> 
    {/* Blade spine */}
    <path d="M8 16L21 3L23 5L10 18L4 20Z" />
    {/* Edge detail */}
    <path d="M9 17L19 7" strokeOpacity="0.5" />
  </svg>
);

export default KnifeIcon;
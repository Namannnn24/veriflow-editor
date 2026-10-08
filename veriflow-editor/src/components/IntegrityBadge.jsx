import React from 'react';

const IntegrityBadge = ({ score }) => {
  let colorClass = '';
  let bgClass = '';
  let label = '';
  let Icon = null;

  if (score > 85) {
    colorClass = 'text-green-700';
    bgClass = 'bg-green-100 border-green-200';
    label = 'Verified';
    Icon = () => (
      <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  } else if (score > 60) {
    colorClass = 'text-amber-700';
    bgClass = 'bg-amber-100 border-amber-200';
    label = 'Mixed';
    Icon = () => (
      <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
  } else {
    colorClass = 'text-red-700';
    bgClass = 'bg-red-100 border-red-200';
    label = 'Flagged';
    Icon = () => (
      <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }

  return (
    <div className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${bgClass} ${colorClass}`}>
      <Icon />
      <span>{label}</span>
      <span className="ml-1 pl-1 border-l border-current opacity-60 font-semibold">{score}</span>
    </div>
  );
};

export default IntegrityBadge;

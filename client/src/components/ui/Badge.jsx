import React from 'react';

export function Badge({ children, variant = 'neutral', icon: Icon, className = '' }) {
  const variants = {
    neutral: 'bg-cinema-800 text-neutral-300 border-neutral-700',
    primary: 'bg-indigo-950/80 text-indigo-400 border-indigo-800/60',
    hifi: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60',
    live: 'bg-red-950/80 text-red-400 border-red-800/60 animate-pulse',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border backdrop-blur-md ${variants[variant] || variants.neutral} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
}

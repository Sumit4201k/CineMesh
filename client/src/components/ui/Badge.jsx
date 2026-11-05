import React from 'react';

/**
 * @file Badge.jsx
 * @description Technical metadata telemetry chip for stream status & codecs.
 */
export function Badge({ children, variant = 'neutral', icon: Icon, className = '' }) {
  const variants = {
    neutral: 'bg-cinema-900/90 text-neutral-400 border-neutral-800',
    live: 'bg-red-500/10 text-red-400 border-red-500/30',
    hifi: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono tracking-tight uppercase rounded-md border backdrop-blur-md select-none ${
        variants[variant] || variants.neutral
      } ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </span>
  );
}

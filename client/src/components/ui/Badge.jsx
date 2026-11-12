import React from 'react';

/**
 * @file Badge.jsx
 * @description Technical metadata telemetry chip for stream status & codecs.
 */
export function Badge({ children, variant = 'neutral', icon: Icon, className = '' }) {
  const variants = {
    neutral: 'bg-brand-card/90 text-neutral-400 border-brand-border',
    live: 'bg-red-500/10 text-red-400 border-red-500/30',
    purple: 'bg-brand-purple/15 text-purple-300 border-brand-purple/40',
    cyan: 'bg-brand-cyan/15 text-cyan-300 border-brand-cyan/40 shadow-sm shadow-cyan-500/10',
    hifi: 'bg-brand-cyan/15 text-cyan-300 border-brand-cyan/40',
    signalAmber: 'bg-brand-card text-brand-cyan border border-brand-border border-l-brand-cyan',
    signalCrimson: 'bg-brand-card text-brand-purpleLight border border-brand-border border-l-brand-purple',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono tracking-tight uppercase border-l-2 select-none ${
        variants[variant] || variants.neutral
      } ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </span>
  );
}

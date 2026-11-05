import React from 'react';

/**
 * @file Button.jsx
 * @description Tactile, weighted interactive button with distinct cinema states.
 */
export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  icon: Icon,
  type = 'button',
  title = '',
}) {
  const base = 'relative inline-flex items-center justify-center font-medium tracking-wide transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cinema-950 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100 select-none';

  const variants = {
    // Projector Gold action
    primary: 'bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-cinema-950 font-semibold shadow-md shadow-amber-500/20 border-t border-amber-300/40 focus-visible:ring-amber-400 rounded-xl',
    
    // Hi-Fi Emerald
    hifi: 'bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20 border-t border-emerald-400/40 focus-visible:ring-emerald-500 rounded-xl',
    
    // Indigo Stream
    indigo: 'bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/20 border-t border-indigo-400/40 focus-visible:ring-indigo-500 rounded-xl',

    // Tactile Cockpit Panel
    secondary: 'bg-cinema-850 hover:bg-cinema-800 text-neutral-200 border border-neutral-700/60 hover:border-neutral-600 shadow-sm focus-visible:ring-neutral-400 rounded-xl',
    
    // Ghost
    ghost: 'bg-transparent hover:bg-white/[0.08] text-neutral-300 hover:text-white rounded-lg',
    
    // Danger
    danger: 'bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-700/40 focus-visible:ring-red-400 rounded-xl',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
    icon: 'p-2',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
}

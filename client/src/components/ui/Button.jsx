import React from 'react';

/**
 * @file Button.jsx
 * @description Tactile interactive button matched to the CineMesh purple/cyan brand.
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
  const base = 'relative inline-flex items-center justify-center font-medium tracking-wide transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-canvas active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100 select-none';

  const variants = {
    // Brand Purple gradient
    primary: 'bg-gradient-to-r from-brand-purple to-purple-600 hover:from-brand-purpleHover hover:to-purple-700 text-white font-semibold shadow-brand-glow border-t border-purple-400/40 focus-visible:ring-brand-purple rounded-xl',
    
    // Brand Electric Cyan
    cyan: 'bg-gradient-to-r from-brand-cyan to-cyan-400 hover:from-brand-cyanHover hover:to-cyan-500 text-brand-navy font-bold shadow-cyan-glow border-t border-white/60 focus-visible:ring-brand-cyan rounded-xl',

    // Hi-Fi Emerald
    hifi: 'bg-gradient-to-r from-brand-cyan to-teal-400 hover:from-brand-cyanHover hover:to-teal-500 text-brand-navy font-bold shadow-cyan-glow border-t border-white/60 focus-visible:ring-brand-cyan rounded-xl',

    // Deep Surface Card
    secondary: 'bg-brand-card hover:bg-brand-cardHover text-neutral-200 border border-brand-border hover:border-brand-borderLight shadow-sm focus-visible:ring-brand-purple rounded-xl',
    
    // Ghost
    ghost: 'bg-transparent hover:bg-white/[0.08] text-neutral-300 hover:text-white rounded-lg',
    
    // Danger
    danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 focus-visible:ring-red-400 rounded-xl',
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

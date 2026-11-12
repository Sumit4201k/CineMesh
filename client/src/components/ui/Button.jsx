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
  ariaLabel,
}) {
  const base = 'relative inline-flex items-center justify-center font-medium tracking-wide transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-canvas disabled:opacity-40 disabled:pointer-events-none select-none';

  const variants = {
    // Brand Purple gradient
    primary: 'bg-brand-purple hover:bg-brand-purpleHover text-white font-semibold border border-brand-purple focus-visible:ring-brand-purple',
    
    // Brand Electric Cyan
    cyan: 'bg-brand-cyan hover:bg-brand-cyanHover text-brand-navy font-bold border border-brand-cyan focus-visible:ring-brand-cyan',

    // Hi-Fi Emerald
    hifi: 'bg-brand-cyan hover:bg-brand-cyanHover text-brand-navy font-bold border border-brand-cyan focus-visible:ring-brand-cyan',

    // Deep Surface Card
    secondary: 'bg-brand-card hover:bg-brand-cardHover text-neutral-200 border border-brand-border hover:border-brand-borderLight focus-visible:ring-brand-purple',
    
    // Ghost
    ghost: 'bg-transparent hover:bg-white/[0.08] text-neutral-300 hover:text-white rounded-lg',
    
    // Danger
    danger: 'bg-transparent hover:bg-red-500/10 text-red-300 border border-red-500/40 focus-visible:ring-red-400',
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
      aria-label={ariaLabel}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
}

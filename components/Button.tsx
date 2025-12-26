
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 border shadow-xl";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white border-blue-400/20 shadow-blue-900/40",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/5 shadow-black/40",
    danger: "bg-rose-600 hover:bg-rose-500 text-white border-rose-400/20 shadow-rose-900/40",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/20 shadow-emerald-900/40",
    warning: "bg-amber-600 hover:bg-amber-500 text-white border-amber-400/20 shadow-amber-900/40",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
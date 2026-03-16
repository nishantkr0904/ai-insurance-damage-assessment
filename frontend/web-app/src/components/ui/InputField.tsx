import type { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function InputField({ label, error, icon, className = '', ...props }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-300">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        )}
        <input
          className={`input-field ${icon ? 'pl-10' : ''} ${error ? 'border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

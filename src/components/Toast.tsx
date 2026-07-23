import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  show: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ show, title, message, type = 'success', onClose }) => {
  if (!show) return null;

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-4 bg-white rounded-2xl shadow-2xl border-l-4 transition-all duration-300 animate-slide-in ${
        type === 'error' ? 'border-red-500' : 'border-teal-500'
      }`}
    >
      {type === 'error' ? (
        <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
      ) : (
        <CheckCircle2 className="w-6 h-6 text-teal-500 shrink-0" />
      )}
      <div>
        <h4 className="font-semibold text-slate-900 text-sm">{title}</h4>
        <p className="text-xs text-slate-500 mt-0.5">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="ml-4 p-1 hover:bg-slate-100 rounded-full transition text-slate-400 hover:text-slate-600"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export const MobileStickyBar: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 flex items-center gap-2 shadow-2xl">
      <a
        href="https://wa.me/573001234567?text=Hola%20Agencia%20Enlace%20de%20Viajes,%20deseo%20cotizar%20un%20paquete"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition"
      >
        <MessageCircle className="w-4 h-4 shrink-0" />
        <span>Cotizar por WhatsApp</span>
      </a>

      <a
        href="tel:+573001234567"
        className="py-3 px-4 bg-slate-900 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition"
      >
        <Phone className="w-4 h-4 text-orange-400" />
        <span>Llamar</span>
      </a>
    </div>
  );
};

import React from 'react';
import { Plane, Sparkles, Compass } from 'lucide-react';

export const Marquee: React.FC = () => {
  const items = [
    '✈️ Colombia Encantadora',
    '🌊 Caribe & San Andrés',
    '☕ Eje Cafetero & Salento',
    '🏙️ Medellín Eterna Primavera',
    '🌸 Feria de las Flores 2026',
    '💃 Cali Capital de la Salsa',
    '🏛️ Bogotá & Monserrate',
    '🌴 Parque Tayrona VIP',
  ];

  return (
    <div className="bg-slate-900 py-5 border-y border-slate-800 overflow-hidden relative select-none">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...items, ...items, ...items].map((text, index) => (
          <div key={index} className="inline-flex items-center mx-6 text-slate-200 font-serif font-semibold text-lg sm:text-2xl">
            <span className="mr-6">{text}</span>
            <Sparkles className="w-4 h-4 text-orange-400 opacity-75" />
          </div>
        ))}
      </div>
    </div>
  );
};

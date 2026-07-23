import React from 'react';
import { X, Clock, CheckCircle2, MessageCircle, Calendar } from 'lucide-react';
import { Destination } from '../types';

interface DestinationModalProps {
  destination: Destination | null;
  onClose: () => void;
}

export const DestinationModal: React.FC<DestinationModalProps> = ({ destination, onClose }) => {
  if (!destination) return null;

  const handleWhatsAppBooking = () => {
    const text = `Hola Agencia Enlace de Viajes! 👋 Me interesa cotizar el paquete: *${destination.title}* (${destination.price}). ¿Me pueden brindar más información sobre disponibilidad y fechas?`;
    window.open(`https://wa.me/573001234567?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative border border-slate-100 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-sm transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={destination.image}
            alt={destination.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold uppercase tracking-wider rounded-full mb-2 inline-block">
              {destination.tag}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
              {destination.title}
            </h2>
            <div className="flex items-center gap-4 mt-2 text-slate-200 text-sm">
              {destination.duration && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span>{destination.duration}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <span>{destination.price}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
              Sobre la experiencia
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {destination.description}
            </p>
          </div>

          {destination.highlights && destination.highlights.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Lugares destacados & actividades incluidas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {destination.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-orange-50/50 border border-orange-100/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 font-medium">Precio estimado por persona</div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">{destination.price}</div>
            </div>

            <button
              onClick={handleWhatsAppBooking}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Cotizar con Asesor por WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

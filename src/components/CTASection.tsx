import React from 'react';
import { MessageCircle, Mail, Compass } from 'lucide-react';

export const CTASection: React.FC = () => {
  return (
    <section className="py-24 px-4 sm:px-6 relative overflow-hidden bg-slate-950 text-white">
      {/* Background Graphic */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950" />

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-semibold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5" />
          <span>Experiencias a la Medida</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight">
          Naturalmente, nos encantan los <span className="text-orange-400 italic">buenos retos</span>
        </h2>

        <p className="text-slate-300 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed font-normal">
          Sabemos que el deseo de viajar va más allá de los planes convencionales. Quieres explorar a tu ritmo, dejándote llevar por tus propios deseos. Estamos listos para diseñar tu itinerario ideal desde cero.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href="https://wa.me/573001234567?text=Hola%20Agencia%20Enlace%20de%20Viajes,%20tengo%20un%20plan%20a%20la%20medida%20en%20mente"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-base shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Cuéntanos tu Plan por WhatsApp</span>
          </a>

          <a
            href="mailto:info@enlacedeviajes.com"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-base flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5"
          >
            <Mail className="w-5 h-5 text-teal-400" />
            <span>Escríbenos por Email</span>
          </a>
        </div>
      </div>
    </section>
  );
};

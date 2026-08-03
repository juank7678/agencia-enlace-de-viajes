import React from 'react';
import { Compass, MessageCircle, Star, ShieldCheck, Award, MapPin } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950 py-20 px-4 sm:px-6">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 animate-pulse-slow opacity-40"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2000&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/80" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Certification Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Agencia Certificada Colombia · RNT 42508</span>
            </div>

            {/* Main Title */}
            <h1 className="font-serif text-white text-4xl sm:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
              Diseñamos la{' '}
              <span className="italic bg-gradient-to-r from-orange-400 via-amber-300 to-teal-300 bg-clip-text text-transparent">
                conexión perfecta
              </span>{' '}
              entre tus sueños y el mundo
            </h1>

            {/* Description Subtitle */}
            <p className="text-slate-300 text-base sm:text-lg xl:text-xl font-normal leading-relaxed max-w-2xl">
              Porque no se trata solo de ir, sino de hacerlo bien. ¿Cuánto hace que no te dejas sorprender por el horizonte? Experiencias hechas a tu medida.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href="#destinos"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-base shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2.5 transition transform hover:-translate-y-1"
              >
                <Compass className="w-5 h-5" />
                <span>Explorar Destinos</span>
              </a>

              <a
                href="{`https://wa.me/${import.meta.env.VITE_ADMIN_WHATSAPP?.replace(/\D/g, '') || '573226136377'}?text=Hola%20Agencia%20Enlace%20de%20Viajes,%20quisiera%20asesor%C3%ADa%20personalizada`}"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-semibold text-base flex items-center justify-center gap-2.5 transition transform hover:-translate-y-1"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <span>Hablemos por WhatsApp</span>
              </a>
            </div>

            {/* Metrics Counter */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 max-w-md">
              <div>
                <div className="font-serif text-white text-2xl sm:text-4xl font-bold text-orange-400">10+</div>
                <div className="text-slate-400 text-xs sm:text-sm font-medium mt-1">Años de trayectoria</div>
              </div>
              <div>
                <div className="font-serif text-white text-2xl sm:text-4xl font-bold text-teal-400">500+</div>
                <div className="text-slate-400 text-xs sm:text-sm font-medium mt-1">Viajeros satisfechos</div>
              </div>
              <div>
                <div className="font-serif text-white text-2xl sm:text-4xl font-bold text-amber-300">50+</div>
                <div className="text-slate-400 text-xs sm:text-sm font-medium mt-1">Destinos únicos</div>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Destination Card */}
          <div className="lg:col-span-5 hidden lg:block relative">
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/15 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">Experiencia Destacada</div>
                    <div className="text-slate-400 text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-orange-400" />
                      <span>Medellín, Colombia</span>
                    </div>
                  </div>
                </div>

                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden mb-4 h-64 border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=800&q=80"
                  alt="Feria de las Flores Medellín"
                  className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
                />
                <div className="absolute top-3 right-3 px-3 py-1 bg-orange-600 text-white font-bold text-xs rounded-full shadow-lg">
                  Feria de las Flores 2026
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <h3 className="text-white font-serif font-bold text-xl">Medellín & Guatapé VIP</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Incluye Silleteros + Hotel + Chiva Rumbera</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Desde</div>
                  <div className="text-xl font-bold text-amber-300">$1.299.000 COP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

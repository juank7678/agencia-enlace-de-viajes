import React, { useState } from 'react';
import { ArrowRight, Clock, Star, Sparkles } from 'lucide-react';
import { Destination } from '../types';
import { INITIAL_DESTINATIONS } from '../data/initialData';

interface DestinationsProps {
  onSelectDestination: (dest: Destination) => void;
}

export const Destinations: React.FC<DestinationsProps> = ({ onSelectDestination }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filters = [
    { id: 'all', label: 'Todos los Destinos' },
    { id: 'cultural', label: 'Cultural' },
    { id: 'naturaleza', label: 'Naturaleza' },
    { id: 'ciudad', label: 'Ciudad' },
    { id: 'playa', label: 'Playa' },
    { id: 'evento', label: 'Evento' },
    { id: 'bienestar', label: 'Bienestar' },
    { id: 'aventura', label: 'Aventura' },
  ];

  const filteredDestinations =
    activeFilter === 'all'
      ? INITIAL_DESTINATIONS
      : INITIAL_DESTINATIONS.filter((d) => d.category === activeFilter);

  return (
    <section className="py-24 px-4 sm:px-6 bg-[#FFF8F0]" id="destinos">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 text-orange-700 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>¿Hasta dónde quieres llegar?</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
            Hay viajes que empiezan <span className="text-orange-600 italic">cerca</span> y otros que te llevan{' '}
            <span className="text-teal-600 italic">lejos</span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg">
            Lo importante no es solo la distancia, sino las historias imborrables que traerás contigo.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeFilter === f.id
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Destination Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => onSelectDestination(dest)}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col cursor-pointer transform hover:-translate-y-1.5"
            >
              {/* Image Container */}
              <div className="relative h-72 w-full overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                {/* Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-orange-500 text-white font-semibold text-xs rounded-full uppercase tracking-wider shadow-md">
                  {dest.tag}
                </div>

                {/* Rating */}
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 bg-slate-900/70 backdrop-blur-md rounded-full text-amber-300 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  <span>5.0</span>
                </div>

                {/* Duration */}
                {dest.duration && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-slate-200 text-xs font-medium bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    <Clock className="w-3.5 h-3.5 text-orange-400" />
                    <span>{dest.duration}</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-xl text-slate-900 group-hover:text-orange-600 transition">
                    {dest.title}
                  </h3>
                  <p className="text-slate-600 text-sm mt-2 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Precio estimado</span>
                    <span className="font-bold text-slate-900 text-base sm:text-lg">{dest.price}</span>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-orange-50 group-hover:bg-orange-500 text-orange-600 group-hover:text-white flex items-center justify-center transition shadow-sm">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

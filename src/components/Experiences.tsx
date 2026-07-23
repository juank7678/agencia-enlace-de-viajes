import React from 'react';
import { MapPin, Utensils, Zap, Heart, Ship, Users, Compass } from 'lucide-react';

export const Experiences: React.FC = () => {
  const experiences = [
    {
      icon: MapPin,
      color: 'from-orange-500 to-amber-500',
      title: 'Tours Guiados Patrimoniales',
      description: 'Explora con guías nativos expertos que conocen cada historia, rincón místico y leyenda de los pueblos de Colombia.',
    },
    {
      icon: Utensils,
      color: 'from-red-500 to-orange-500',
      title: 'Gastronomía Local & Cata',
      description: 'Sabores auténticos, mercados tradicionales, catas de café de origen y cenas en restaurantes de alta cocina regional.',
    },
    {
      icon: Zap,
      color: 'from-amber-500 to-teal-500',
      title: 'Aventura & Naturaleza',
      description: 'Parapente en Jericó, torrentismo en San Gil, rafting en el Río Claro y senderismo por páramos sagrados.',
    },
    {
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      title: 'Bienestar & Retiros Wellness',
      description: 'Spa termal, yoga en la selva, desconexión digital y masajes relajantes rodeados de naturaleza virgen.',
    },
    {
      icon: Ship,
      color: 'from-cyan-500 to-blue-600',
      title: 'Cruceros & Islas Exóticas',
      description: 'Navega en catamarán privado por Cartagena, pasadías VIP en las Islas del Rosario o cruceros por el Caribe.',
    },
    {
      icon: Users,
      color: 'from-emerald-500 to-teal-600',
      title: 'Viajes de Grupo & Empresariales',
      description: 'Planes corporativos, eventos de integración, viajes familiares de gran escala e itinerarios escolares certificados.',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 bg-gradient-to-b from-[#FFF8F0] to-orange-50/60" id="experiencias">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Experiencias Exclusivas</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
            ¿Cómo quieres vivir <span className="text-orange-600 italic">tu viaje</span>?
          </h2>

          <p className="text-slate-600 text-base sm:text-lg">
            Diseñamos cada momento pensando en tus gustos, ritmo y expectativas únicas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((exp, idx) => {
            const Icon = exp.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-md hover:shadow-xl transition duration-300 flex flex-col justify-between group transform hover:-translate-y-1"
              >
                <div>
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${exp.color} flex items-center justify-center text-white mb-6 shadow-md shadow-orange-500/10 group-hover:scale-110 transition`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="font-serif font-bold text-xl text-slate-900 mb-3 group-hover:text-orange-600 transition">
                    {exp.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed">{exp.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center text-xs font-semibold text-orange-600 group-hover:translate-x-1 transition">
                  <span>Conocer detalles del plan →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

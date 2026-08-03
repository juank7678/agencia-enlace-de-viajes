import React from 'react';
import { ShieldCheck, Heart, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const phoneNumber = import.meta.env.VITE_ADMIN_WHATSAPP || '+57 322 6136377';
  const whatsappNumber = import.meta.env.VITE_ADMIN_WHATSAPP?.replace(/\D/g, '') || '573226136377';

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-24 lg:pb-16 px-4 sm:px-6 border-t border-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 p-0.5 border border-amber-500/30">
                <img
                  src="/logo.jpg"
                  alt="Agencia Enlace de Viajes"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <div className="font-serif font-bold text-xl text-white">Enlace de Viajes</div>
                <div className="text-slate-400 text-xs font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>RNT 42508 · Agencia Registrada</span>
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Diseñamos la conexión perfecta entre tus sueños y el mundo. Más de 10 años creando experiencias de viaje inolvidables en Colombia y destinos internacionales.
            </p>
          </div>

          {/* Col 2: Destinos */}
          <div>
            <h4 className="font-serif font-bold text-base text-white mb-4">Destinos Principales</h4>
            <ul className="space-y-2.5 text-slate-400 text-sm">
              <li>
                <a href="#destinos" className="hover:text-orange-400 transition">
                  Caribe & San Andrés
                </a>
              </li>
              <li>
                <a href="#destinos" className="hover:text-orange-400 transition">
                  Medellín & Guatapé
                </a>
              </li>
              <li>
                <a href="#destinos" className="hover:text-orange-400 transition">
                  Feria de las Flores
                </a>
              </li>
              <li>
                <a href="#destinos" className="hover:text-orange-400 transition">
                  Eje Cafetero & Salento
                </a>
              </li>
              <li>
                <a href="#destinos" className="hover:text-orange-400 transition">
                  Bogotá & Monserrate
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Enlaces */}
          <div>
            <h4 className="font-serif font-bold text-base text-white mb-4">Atención al Cliente</h4>
            <ul className="space-y-2.5 text-slate-400 text-sm">
              <li>
                <a href="#promociones" className="hover:text-orange-400 transition">
                  Promociones Activas
                </a>
              </li>
              <li>
                <a href="#publicaciones" className="hover:text-orange-400 transition">
                  Material Gráfico / Posters
                </a>
              </li>
              <li>
                <a href="#experiencias" className="hover:text-orange-400 transition">
                  Servicios Incluidos
                </a>
              </li>
              <li>
                <a href="#contacto" className="hover:text-orange-400 transition">
                  Formulario de Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div>
            <h4 className="font-serif font-bold text-base text-white mb-4">Contacto Directo</h4>
            <div className="space-y-3 text-slate-400 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition block">
                    {phoneNumber}
                  </a>
                  <span className="text-xs text-slate-500">WhatsApp & Llamadas</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                <div>
                  <a href="mailto:info@enlacedeviajes.com" className="hover:text-orange-400 transition block">
                    info@enlacedeviajes.com
                  </a>
                  <span className="text-xs text-slate-500">Email</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <div>
                  <div className="hover:text-teal-400 transition block">
                    Cra. 48A #39A Sur 46
                  </div>
                  <span className="text-xs text-slate-500">Medellín, Colombia</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Agencia Enlace de Viajes. RNT 42508. Todos los derechos reservados.
          </div>
          <div className="italic text-slate-400 flex items-center gap-1">
            <span>Seremos el mejor aliado en tus viajes.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

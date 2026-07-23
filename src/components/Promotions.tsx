import React from 'react';
import { Tag, Trash2, MessageCircle, Plus, Loader2, Sparkles } from 'lucide-react';
import { Promotion } from '../types';

interface PromotionsProps {
  promotions: Promotion[];
  isLoading: boolean;
  isAdmin: boolean;
  onDeletePromo: (id: string | number) => void;
  onOpenAddPromoModal: () => void;
}

export const Promotions: React.FC<PromotionsProps> = ({
  promotions,
  isLoading,
  isAdmin,
  onDeletePromo,
  onOpenAddPromoModal,
}) => {
  return (
    <section className="py-24 px-4 sm:px-6 bg-gradient-to-b from-white via-orange-50/40 to-[#FFF8F0]" id="promociones">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" />
            <span>Ofertas Exclusivas Supabase</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
            Promociones <span className="text-orange-600 italic">Especiales</span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg">
            Aprovecha nuestros paquetes con tarifa preferencial y facilidades de pago para tus vacaciones soñadas.
          </p>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="text-sm font-medium">Cargando promociones desde Supabase...</span>
          </div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 max-w-lg mx-auto shadow-sm">
            <p className="text-slate-500 font-medium">No hay promociones registradas en este momento.</p>
            {isAdmin && (
              <button
                onClick={onOpenAddPromoModal}
                className="mt-4 px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-full text-sm inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Primera Promoción</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promotions.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col justify-between relative group"
              >
                <div>
                  {/* Promo Image */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                    {p.badge && (
                      <span className="absolute top-4 right-4 px-3 py-1 bg-orange-600 text-white font-bold text-xs rounded-full shadow-lg">
                        {p.badge}
                      </span>
                    )}

                    <span className="absolute bottom-3 left-4 px-3 py-1 bg-slate-900/80 backdrop-blur-md text-slate-200 font-semibold text-[11px] rounded-full uppercase tracking-wider">
                      {p.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-3">
                    <h3 className="font-serif font-bold text-xl text-slate-900 group-hover:text-orange-600 transition">
                      {p.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{p.description}</p>
                  </div>
                </div>

                {/* Footer / Pricing & CTA */}
                <div className="p-6 pt-0 space-y-4">
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Precio especial</span>
                      <span className="font-bold text-orange-600 text-lg sm:text-xl">{p.price}</span>
                    </div>

                    {/* Admin Delete Action */}
                    {isAdmin && (
                      <button
                        onClick={() => onDeletePromo(p.id)}
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                        title="Eliminar promoción"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <a
                    href={`https://wa.me/573001234567?text=${encodeURIComponent(
                      `Hola Agencia Enlace de Viajes, quisiera consultar la promoción: *${p.title}* (${p.price})`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Cotizar por WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Admin Action Button - Only visible when Admin Mode is unlocked */}
        {isAdmin && (
          <div className="text-center mt-12">
            <button
              onClick={onOpenAddPromoModal}
              className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-full shadow-lg inline-flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4 text-orange-400" />
              <span>Agregar Nueva Promoción (Administrador)</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

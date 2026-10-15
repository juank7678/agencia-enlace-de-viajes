import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle, Settings, ShieldCheck, Unlock, Pencil } from 'lucide-react';
import { DEFAULT_BANNER, whatsappLink } from '../config';
import { toSafeInlineHtml } from '../lib/html';

interface NavbarProps {
  onOpenAdmin: () => void;
  onEditBanner: () => void;
  isAdmin: boolean;
  bannerText?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onEditBanner, isAdmin, bannerText }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bannerHtml = toSafeInlineHtml(bannerText || DEFAULT_BANNER);

  return (
    <>
      {/* Top Banner: ocupa todo el ancho y el texto se ajusta en varias líneas en lugar de recortarse */}
      <div className="relative z-50 w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-100 border-b border-slate-800">
        <div className="flex w-full items-center justify-center gap-3 px-4 sm:px-8 py-2.5">
          <p
            className="flex-1 text-center text-xs sm:text-sm leading-snug text-balance [&_strong]:font-semibold [&_strong]:text-amber-300 [&_b]:text-amber-300"
            dangerouslySetInnerHTML={{ __html: bannerHtml }}
          />
          {isAdmin && (
            <button
              onClick={onEditBanner}
              className="shrink-0 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition"
              title="Editar banner"
              aria-label="Editar banner"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-md py-3'
            : 'bg-[#FFF8F0]/95 backdrop-blur-sm py-4 border-b border-slate-900/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Brand & Official Logo */}
          <a href="#inicio" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center p-0.5 shadow-md border border-amber-500/30 group-hover:scale-105 transition">
              <img
                src="/logo.svg"
                alt="Agencia Enlace de Viajes Logo"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  // Fallback if logo file fails to render
                  const target = e.target as HTMLElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="font-serif font-bold text-lg leading-tight text-slate-900 group-hover:text-orange-600 transition">
                Enlace de Viajes
              </div>
              <div className="text-[11px] text-slate-500 font-medium tracking-wide flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
                <span>RNT 42508 · Certificada</span>
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
            <a href="#inicio" className="hover:text-orange-600 transition py-1">
              Inicio
            </a>
            <a href="#destinos" className="hover:text-orange-600 transition py-1">
              Destinos
            </a>
            <a href="#promociones" className="hover:text-orange-600 transition py-1">
              Promociones
            </a>
            <a href="#publicaciones" className="hover:text-orange-600 transition py-1">
              Publicaciones
            </a>
            <a href="#experiencias" className="hover:text-orange-600 transition py-1">
              Experiencias
            </a>
            <a href="#contacto" className="hover:text-orange-600 transition py-1">
              Contacto
            </a>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Admin Status Indicator & Gear Trigger */}
            <button
              onClick={onOpenAdmin}
              className={`p-2.5 rounded-full transition flex items-center justify-center ${
                isAdmin
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300 ring-2 ring-emerald-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-orange-100 hover:text-orange-600'
              }`}
              title={isAdmin ? 'Modo Administración Activo' : 'Acceso administrador'}
              aria-label={isAdmin ? 'Abrir panel de administración' : 'Acceso administrador'}
            >
              {isAdmin ? <Unlock className="w-4 h-4 text-emerald-600" /> : <Settings className="w-4 h-4" />}
            </button>

            {/* WhatsApp CTA */}
            <a
              href={whatsappLink('Hola Agencia Enlace de Viajes, me gustaría cotizar un viaje')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-sm shadow-md shadow-orange-500/20 transition transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Cotizar Ahora</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              aria-label="Abrir Menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-full max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-slide-left">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img src="/logo.svg" alt="Logo" className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <div className="font-serif font-bold text-slate-900">Enlace de Viajes</div>
                    <div className="text-xs text-slate-500">RNT 42508</div>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4 py-6 font-medium text-slate-800">
                <a
                  href="#inicio"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-orange-50 rounded-lg hover:text-orange-600 transition"
                >
                  Inicio
                </a>
                <a
                  href="#destinos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-orange-50 rounded-lg hover:text-orange-600 transition"
                >
                  Destinos
                </a>
                <a
                  href="#promociones"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-orange-50 rounded-lg hover:text-orange-600 transition"
                >
                  Promociones
                </a>
                <a
                  href="#publicaciones"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-orange-50 rounded-lg hover:text-orange-600 transition"
                >
                  Publicaciones / Posters
                </a>
                <a
                  href="#experiencias"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-orange-50 rounded-lg hover:text-orange-600 transition"
                >
                  Experiencias
                </a>
                <a
                  href="#contacto"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-orange-50 rounded-lg hover:text-orange-600 transition"
                >
                  Contacto
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                <Settings className="w-4 h-4 text-slate-600" />
                <span>{isAdmin ? 'Panel de Control Admin' : 'Acceso Administrador'}</span>
              </button>

              <a
                href={whatsappLink('Hola Agencia Enlace de Viajes, quisiera cotizar')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contactar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

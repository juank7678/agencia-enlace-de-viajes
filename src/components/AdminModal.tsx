import React, { useState } from 'react';
import { X, Lock, KeyRound, Tag, Upload, Megaphone, ShieldCheck, LogOut, CheckCircle2 } from 'lucide-react';
import { POSTER_FOLDERS } from '../data/initialData';

interface AdminModalProps {
  isOpen: boolean;
  isAdmin: boolean;
  onClose: () => void;
  onLogin: (passcode: string) => boolean;
  onLogout: () => void;
  onAddPromotion: (promo: {
    title: string;
    description: string;
    price: string;
    badge: string;
    category: string;
    image: string;
  }) => void;
  onAddPoster: (poster: {
    title: string;
    folder: string;
    image: string;
  }) => void;
  onUpdateBanner: (text: string) => void;
  onShowToast: (title: string, msg: string, type?: 'success' | 'error') => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  isAdmin,
  onClose,
  onLogin,
  onLogout,
  onAddPromotion,
  onAddPoster,
  onUpdateBanner,
  onShowToast,
}) => {
  if (!isOpen) return null;

  // Login form state
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Promo form state
  const [promoTitle, setPromoTitle] = useState('');
  const [promoDesc, setPromoDesc] = useState('');
  const [promoPrice, setPromoPrice] = useState('');
  const [promoBadge, setPromoBadge] = useState('-20% DESC');
  const [promoCategory, setPromoCategory] = useState('caribe');
  const [promoImage, setPromoImage] = useState('https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80');

  // Poster form state
  const [posterTitle, setPosterTitle] = useState('');
  const [posterFolder, setPosterFolder] = useState('caribe');
  const [posterImage, setPosterImage] = useState('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80');

  // Banner form state
  const [bannerInput, setBannerInput] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(passcode);
    if (!success) {
      setLoginError(true);
      onShowToast('Clave incorrecta', 'Intenta con: enlace2026', 'error');
    } else {
      setLoginError(false);
      setPasscode('');
      onShowToast('Modo Administración Desbloqueado', 'Ahora puedes agregar o eliminar promociones y posters.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          callback(event.target.result as string);
          onShowToast('Imagen procesada', 'Archivo cargado con éxito.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoTitle || !promoPrice || !promoDesc) {
      onShowToast('Campos incompletos', 'Completa título, precio y descripción.', 'error');
      return;
    }

    onAddPromotion({
      title: promoTitle,
      description: promoDesc,
      price: promoPrice,
      badge: promoBadge,
      category: promoCategory,
      image: promoImage,
    });

    setPromoTitle('');
    setPromoDesc('');
    setPromoPrice('');
    onShowToast('¡Promoción guardada en Supabase!', promoTitle);
  };

  const handlePosterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!posterTitle) {
      onShowToast('Campos incompletos', 'Ingresa el título del poster.', 'error');
      return;
    }

    onAddPoster({
      title: posterTitle,
      folder: posterFolder,
      image: posterImage,
    });

    setPosterTitle('');
    onShowToast('¡Poster guardado en Supabase!', posterTitle);
  };

  const handleBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerInput) return;
    onUpdateBanner(bannerInput);
    setBannerInput('');
    onShowToast('Banner actualizado', 'Las novedades se reflejarán en la barra superior.');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: PASSWORD AUTHENTICATION DIALOG (Fase 4) */}
        {!isAdmin ? (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white mx-auto shadow-xl shadow-orange-500/20">
              <KeyRound className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-2xl text-slate-900">Acceso de Administración</h3>
              <p className="text-slate-500 text-sm mt-1">
                Ingresa la clave de seguridad para activar las herramientas de gestión de contenidos.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-sm mx-auto">
              <div>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Introduce la clave de acceso"
                  className={`w-full px-4 py-3.5 rounded-2xl border text-center font-mono text-lg focus:outline-none focus:ring-2 transition ${
                    loginError
                      ? 'border-red-400 ring-red-400 bg-red-50'
                      : 'border-slate-200 focus:ring-orange-500 focus:border-transparent bg-slate-50'
                  }`}
                  autoFocus
                />
                <p className="text-[11px] text-slate-400 mt-2">
                  💡 Clave por defecto: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-700">enlace2026</code>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Desbloquear Panel</span>
              </button>
            </form>
          </div>
        ) : (
          /* STEP 2: UNLOCKED ADMIN PANEL */
          <div className="space-y-8 max-h-[80vh] overflow-y-auto pr-1">
            {/* Admin Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-slate-900">Panel de Control Administrador</h3>
                  <p className="text-emerald-600 font-medium text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 inline" />
                    <span>Conectado a Supabase REST API</span>
                  </p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                title="Cerrar sesión de administración"
              >
                <LogOut className="w-4 h-4" />
                <span>Bloquear</span>
              </button>
            </div>

            {/* FORM 1: AGREGAR PROMOCION */}
            <div className="space-y-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
              <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2 text-orange-600">
                <Tag className="w-4 h-4" />
                <span>Agregar Nueva Promoción en Supabase</span>
              </h4>

              <form onSubmit={handlePromoSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Título</label>
                    <input
                      type="text"
                      value={promoTitle}
                      onChange={(e) => setPromoTitle(e.target.value)}
                      placeholder="Ej: Caribe VIP 2x1"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Precio</label>
                    <input
                      type="text"
                      value={promoPrice}
                      onChange={(e) => setPromoPrice(e.target.value)}
                      placeholder="Ej: Desde $1.199.000 COP"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Badge</label>
                    <input
                      type="text"
                      value={promoBadge}
                      onChange={(e) => setPromoBadge(e.target.value)}
                      placeholder="Ej: -20% DESC"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Categoría</label>
                    <select
                      value={promoCategory}
                      onChange={(e) => setPromoCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                    >
                      <option value="caribe">Caribe</option>
                      <option value="medellin">Medellín</option>
                      <option value="bogota">Bogotá</option>
                      <option value="eje-cafetero">Eje Cafetero</option>
                      <option value="internacional">Internacional</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Descripción</label>
                  <textarea
                    rows={2}
                    value={promoDesc}
                    onChange={(e) => setPromoDesc(e.target.value)}
                    placeholder="Detalles de lo que incluye el paquete..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Imagen del Paquete</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoImage}
                      onChange={(e) => setPromoImage(e.target.value)}
                      placeholder="URL de la imagen o selecciona archivo local"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                    />
                    <label className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, setPromoImage)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl text-xs shadow transition"
                >
                  + Guardar Promoción en Supabase
                </button>
              </form>
            </div>

            {/* FORM 2: SUBIR POSTER */}
            <div className="space-y-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
              <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2 text-teal-600">
                <Upload className="w-4 h-4" />
                <span>Subir Nuevo Poster por Destino</span>
              </h4>

              <form onSubmit={handlePosterSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Título Poster</label>
                    <input
                      type="text"
                      value={posterTitle}
                      onChange={(e) => setPosterTitle(e.target.value)}
                      placeholder="Ej: Cartagena Colonial"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Carpeta de Destino</label>
                    <select
                      value={posterFolder}
                      onChange={(e) => setPosterFolder(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                    >
                      {POSTER_FOLDERS.map((f) => (
                        <option key={f.name} value={f.name}>
                          {f.label} ({f.name})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Imagen Poster</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={posterImage}
                      onChange={(e) => setPosterImage(e.target.value)}
                      placeholder="URL de la imagen o selecciona archivo"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                    />
                    <label className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, setPosterImage)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs shadow transition"
                >
                  + Guardar Poster en Supabase
                </button>
              </form>
            </div>

            {/* FORM 3: BANNER SUPERIOR */}
            <div className="space-y-3 bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
              <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2 text-purple-600">
                <Megaphone className="w-4 h-4" />
                <span>Actualizar Anuncio Superior</span>
              </h4>

              <form onSubmit={handleBannerSubmit} className="space-y-3">
                <input
                  type="text"
                  value={bannerInput}
                  onChange={(e) => setBannerInput(e.target.value)}
                  placeholder="Ej: 🌟 OFERTA SPECIAL: 20% en paquetes al Caribe hasta el 31 de Agosto"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition"
                >
                  Actualizar Banner
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

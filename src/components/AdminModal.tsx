import React, { useState } from 'react';
import { X, Lock, KeyRound, Tag, Upload, Megaphone, ShieldCheck, LogOut, CheckCircle2, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { POSTER_FOLDERS } from '../data/initialData';

interface AdminModalProps {
  isOpen: boolean;
  isAdmin: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<boolean>;
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
  isLoading = false,
  onClose,
  onLogin,
  onLogout,
  onAddPromotion,
  onAddPoster,
  onUpdateBanner,
  onShowToast,
}) => {
  if (!isOpen) return null;

  // Login form state (Supabase Auth)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    // Validar campos
    if (!email.trim()) {
      setLoginError('El email es requerido');
      setIsSubmitting(false);
      return;
    }

    if (!password) {
      setLoginError('La contraseña es requerida');
      setIsSubmitting(false);
      return;
    }

    try {
      const success = await onLogin(email, password);
      if (success) {
        setLoginError('');
        setEmail('');
        setPassword('');
        onShowToast('✅ Acceso Concedido', 'Sesión de administración iniciada');
      } else {
        setLoginError('Email o contraseña incorrectos');
        onShowToast('❌ Error de Autenticación', 'Verifica tus credenciales', 'error');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      setLoginError(message);
      onShowToast('❌ Error', message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          callback(event.target.result as string);
          onShowToast('✅ Imagen procesada', 'Archivo cargado con éxito.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoTitle || !promoPrice || !promoDesc) {
      onShowToast('⚠️ Campos incompletos', 'Completa título, precio y descripción.', 'error');
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
    onShowToast('✅ Promoción guardada', promoTitle);
  };

  const handlePosterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!posterTitle) {
      onShowToast('⚠️ Campos incompletos', 'Ingresa el título del poster.', 'error');
      return;
    }

    onAddPoster({
      title: posterTitle,
      folder: posterFolder,
      image: posterImage,
    });

    setPosterTitle('');
    onShowToast('✅ Poster guardado', posterTitle);
  };

  const handleBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerInput) return;
    onUpdateBanner(bannerInput);
    setBannerInput('');
    onShowToast('✅ Banner actualizado', 'Los cambios se reflejarán en la barra superior.');
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

        {/* STEP 1: SUPABASE AUTH LOGIN */}
        {!isAdmin ? (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white mx-auto shadow-xl shadow-orange-500/20">
              <KeyRound className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-2xl text-slate-900">Panel de Administración</h3>
              <p className="text-slate-500 text-sm mt-1">
                Inicia sesión con tu email y contraseña de Supabase
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-sm mx-auto">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jcguerrero500@gmail.com"
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50 disabled:bg-slate-100"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu contraseña segura"
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50 disabled:bg-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {loginError}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verificando...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Iniciar Sesión</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
              <p>🔒 Autenticación segura con Supabase</p>
            </div>
          </div>
        ) : (
          /* STEP 2: ADMIN PANEL UNLOCKED */
          <div className="space-y-8 max-h-[80vh] overflow-y-auto pr-1">
            {/* Admin Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Panel Admin</div>
                  <div className="text-xs text-emerald-600">✅ Sesión activa</div>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* TAB 1: Add Promotion */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-orange-600" />
                Agregar Promoción
              </h4>
              <form onSubmit={handlePromoSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Título"
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <textarea
                  placeholder="Descripción"
                  value={promoDesc}
                  onChange={(e) => setPromoDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  placeholder="Precio (ej: $1.299.000)"
                  value={promoPrice}
                  onChange={(e) => setPromoPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  placeholder="Badge (ej: -20% DESC)"
                  value={promoBadge}
                  onChange={(e) => setPromoBadge(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <select
                  value={promoCategory}
                  onChange={(e) => setPromoCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="caribe">Caribe</option>
                  <option value="medellin">Medellín</option>
                  <option value="bogota">Bogotá</option>
                </select>
                <div className="flex gap-2">
                  <label className="flex-1 px-3 py-2 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-orange-400 text-sm text-slate-600 hover:text-orange-600 flex items-center justify-center gap-2 transition">
                    <Upload className="w-4 h-4" />
                    <span>Subir imagen</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setPromoImage)}
                      className="hidden"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg text-sm transition"
                >
                  Guardar Promoción
                </button>
              </form>
            </div>

            {/* TAB 2: Add Poster */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-600" />
                Agregar Poster
              </h4>
              <form onSubmit={handlePosterSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Título"
                  value={posterTitle}
                  onChange={(e) => setPosterTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={posterFolder}
                  onChange={(e) => setPosterFolder(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {POSTER_FOLDERS.map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.label}
                    </option>
                  ))}
                </select>
                <label className="flex-1 px-3 py-2 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 text-sm text-slate-600 hover:text-blue-600 flex items-center justify-center gap-2 transition">
                  <Upload className="w-4 h-4" />
                  <span>Seleccionar imagen</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, setPosterImage)}
                    className="hidden"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition"
                >
                  Guardar Poster
                </button>
              </form>
            </div>

            {/* TAB 3: Edit Banner */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-purple-600" />
                Editar Banner
              </h4>
              <form onSubmit={handleBannerSubmit} className="space-y-3">
                <textarea
                  placeholder="Texto del banner (acepta HTML básico)"
                  value={bannerInput}
                  onChange={(e) => setBannerInput(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-sm transition"
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

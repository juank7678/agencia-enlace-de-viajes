import React, { useEffect, useState } from 'react';
import {
  X, Lock, KeyRound, Tag, Upload, Megaphone, ShieldCheck, LogOut, Mail, Eye, EyeOff, Loader2, Image as ImageIcon,
} from 'lucide-react';
import { POSTER_FOLDERS } from '../data/initialData';
import { Poster, PosterInput, Promotion, PromotionInput } from '../types';
import { validatePromotion } from '../lib/validators';
import { uploadImage } from '../lib/images';
import { toSafeInlineHtml } from '../lib/html';

export type AdminTarget =
  | { kind: 'promotion'; item?: Promotion }
  | { kind: 'poster'; item?: Poster }
  | { kind: 'banner' };

type ToastFn = (title: string, msg: string, type?: 'success' | 'error') => void;

interface AdminModalProps {
  isOpen: boolean;
  isAdmin: boolean;
  email: string;
  target: AdminTarget;
  bannerText: string;
  onClose: () => void;
  onChangeTarget: (target: AdminTarget) => void;
  onLogin: (email: string, password: string) => Promise<string | null>;
  onLogout: () => void;
  onSavePromotion: (input: PromotionInput, id?: Promotion['id']) => Promise<string | null>;
  onSavePoster: (input: PosterInput, id?: Poster['id']) => Promise<string | null>;
  onSaveBanner: (text: string) => Promise<string | null>;
  onShowToast: ToastFn;
}

const inputClass =
  'w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white disabled:bg-slate-100';

export const AdminModal: React.FC<AdminModalProps> = (props) => {
  const { isOpen, onClose } = props;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start sm:items-center justify-center p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Panel de administración"
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {props.isAdmin ? <AdminPanel {...props} /> : <LoginForm onLogin={props.onLogin} onShowToast={props.onShowToast} />}
      </div>
    </div>
  );
};

// ================= LOGIN =================
const LoginForm: React.FC<{ onLogin: AdminModalProps['onLogin']; onShowToast: ToastFn }> = ({ onLogin, onShowToast }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Ingresa tu email y contraseña.');
      return;
    }
    setSubmitting(true);
    setError('');
    const err = await onLogin(email, password);
    setSubmitting(false);
    if (err) {
      setError(err);
      return;
    }
    onShowToast('✅ Acceso concedido', 'Sesión de administración iniciada.');
  };

  return (
    <div className="space-y-6 text-center py-4">
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white mx-auto shadow-xl shadow-orange-500/20">
        <KeyRound className="w-8 h-8" />
      </div>
      <div>
        <h3 className="font-serif font-bold text-2xl text-slate-900">Panel de Administración</h3>
        <p className="text-slate-500 text-sm mt-1">Inicia sesión con tu cuenta de administrador</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto text-left">
        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-2">Email</span>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@enlacedeviajes.com"
              disabled={submitting}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50"
            />
          </div>
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-slate-700 mb-2">Contraseña</span>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </label>

        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
          <span>{submitting ? 'Verificando...' : 'Iniciar Sesión'}</span>
        </button>
      </form>
    </div>
  );
};

// ================= PANEL =================
const TABS = [
  { kind: 'promotion', label: 'Promoción', icon: Tag },
  { kind: 'poster', label: 'Poster', icon: ImageIcon },
  { kind: 'banner', label: 'Banner', icon: Megaphone },
] as const;

const AdminPanel: React.FC<AdminModalProps> = ({
  email, target, bannerText, onChangeTarget, onLogout, onSavePromotion, onSavePoster, onSaveBanner, onShowToast, onClose,
}) => {
  const editingId = target.kind !== 'banner' ? target.item?.id : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 pr-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-slate-900">Panel Admin</div>
            <div className="text-xs text-emerald-600 truncate">Sesión activa · {email}</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          title="Cerrar sesión"
          className="p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition flex items-center gap-1.5 text-xs font-semibold"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl" role="tablist">
        {TABS.map(({ kind, label, icon: Icon }) => (
          <button
            key={kind}
            role="tab"
            aria-selected={target.kind === kind}
            onClick={() => onChangeTarget({ kind })}
            className={`py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition ${
              target.kind === kind ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* key: reinicia el formulario al cambiar de pestaña o de elemento a editar */}
      {target.kind === 'promotion' && (
        <PromotionForm key={`promo-${editingId ?? 'new'}`} item={target.item} onSave={onSavePromotion} onShowToast={onShowToast} onDone={onClose} />
      )}
      {target.kind === 'poster' && (
        <PosterForm key={`poster-${editingId ?? 'new'}`} item={target.item} onSave={onSavePoster} onShowToast={onShowToast} onDone={onClose} />
      )}
      {target.kind === 'banner' && <BannerForm current={bannerText} onSave={onSaveBanner} onShowToast={onShowToast} />}
    </div>
  );
};

// ================= IMAGEN =================
const ImageField: React.FC<{
  value: string;
  folder: 'promotions' | 'posters';
  onChange: (url: string) => void;
  onUploadingChange: (uploading: boolean) => void;
  onShowToast: ToastFn;
  error?: string;
}> = ({ value, folder, onChange, onUploadingChange, onShowToast, error }) => {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    onUploadingChange(true);
    try {
      const uploaded = await uploadImage(file, folder);
      onChange(uploaded.url);
      if (uploaded.storage === 'inline') {
        onShowToast('⚠️ Imagen embebida', 'El almacenamiento de imágenes no está configurado; se guardará comprimida.', 'error');
      }
    } catch (err) {
      onShowToast('❌ Imagen no válida', err instanceof Error ? err.message : String(err), 'error');
    } finally {
      setUploading(false);
      onUploadingChange(false);
    }
  };

  const isInline = value.startsWith('data:');

  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-slate-700">Imagen</span>
      <div className="flex gap-3 items-stretch">
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
          ) : value ? (
            <img src={value} alt="Vista previa" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-slate-300" />
          )}
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          <label className="px-3 py-2.5 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-orange-400 text-sm text-slate-600 hover:text-orange-600 flex items-center justify-center gap-2 transition">
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Subiendo...' : 'Subir desde el equipo'}</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} disabled={uploading} className="hidden" />
          </label>
          <input
            type="url"
            placeholder="…o pega la URL de una imagen"
            value={isInline ? '' : value}
            onChange={(e) => onChange(e.target.value)}
            disabled={uploading}
            className={inputClass}
          />
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

// ================= PROMOCIÓN =================
const PromotionForm: React.FC<{
  item?: Promotion;
  onSave: AdminModalProps['onSavePromotion'];
  onShowToast: ToastFn;
  onDone: () => void;
}> = ({ item, onSave, onShowToast, onDone }) => {
  const [form, setForm] = useState<PromotionInput>({
    title: item?.title ?? '',
    description: item?.description ?? '',
    price: item?.price ?? '',
    badge: item?.badge ?? '-20% DESC',
    category: item?.category ?? 'caribe',
    image: item?.image ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof PromotionInput) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validatePromotion(form);
    setErrors(validation.errors);
    if (!validation.valid) return;

    setSaving(true);
    const err = await onSave(form, item?.id);
    setSaving(false);
    if (err) {
      onShowToast('❌ No se guardó la promoción', err, 'error');
      return;
    }
    onShowToast('✅ Promoción guardada', `"${form.title}" ya está publicada.`);
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      <h4 className="font-semibold text-slate-900">{item ? 'Editar promoción' : 'Nueva promoción'}</h4>
      <Field label="Título" error={errors.title}>
        <input className={inputClass} value={form.title} onChange={(e) => set('title')(e.target.value)} />
      </Field>
      <Field label="Descripción" error={errors.description}>
        <textarea className={inputClass} rows={3} value={form.description} onChange={(e) => set('description')(e.target.value)} />
      </Field>
      <div className="grid sm:grid-cols-3 gap-3">
        <Field label="Precio" error={errors.price}>
          <input className={inputClass} placeholder="$1.299.000 COP" value={form.price} onChange={(e) => set('price')(e.target.value)} />
        </Field>
        <Field label="Etiqueta">
          <input className={inputClass} placeholder="-20% DESC" value={form.badge ?? ''} onChange={(e) => set('badge')(e.target.value)} />
        </Field>
        <Field label="Categoría">
          <select className={inputClass} value={form.category} onChange={(e) => set('category')(e.target.value)}>
            {POSTER_FOLDERS.map((f) => (
              <option key={f.name} value={f.name}>{f.label}</option>
            ))}
          </select>
        </Field>
      </div>
      <ImageField
        value={form.image}
        folder="promotions"
        onChange={set('image')}
        onUploadingChange={setUploading}
        onShowToast={onShowToast}
        error={errors.image}
      />
      <SubmitButton busy={saving} disabled={uploading} label={item ? 'Guardar cambios' : 'Publicar promoción'} />
    </form>
  );
};

// ================= POSTER =================
const PosterForm: React.FC<{
  item?: Poster;
  onSave: AdminModalProps['onSavePoster'];
  onShowToast: ToastFn;
  onDone: () => void;
}> = ({ item, onSave, onShowToast, onDone }) => {
  const [form, setForm] = useState<PosterInput>({
    title: item?.title ?? '',
    folder: item?.folder ?? 'caribe',
    image: item?.image ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof PosterInput) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (form.title.trim().length < 3) nextErrors.title = 'El título debe tener al menos 3 caracteres';
    if (!form.image.trim()) nextErrors.image = 'La imagen es requerida';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    const err = await onSave(form, item?.id);
    setSaving(false);
    if (err) {
      onShowToast('❌ No se guardó el poster', err, 'error');
      return;
    }
    onShowToast('✅ Poster guardado', `"${form.title}" ya está publicado.`);
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      <h4 className="font-semibold text-slate-900">{item ? 'Editar poster' : 'Nuevo poster'}</h4>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Título" error={errors.title}>
          <input className={inputClass} value={form.title} onChange={(e) => set('title')(e.target.value)} />
        </Field>
        <Field label="Carpeta">
          <select className={inputClass} value={form.folder} onChange={(e) => set('folder')(e.target.value)}>
            {POSTER_FOLDERS.map((f) => (
              <option key={f.name} value={f.name}>{f.label}</option>
            ))}
          </select>
        </Field>
      </div>
      <ImageField
        value={form.image}
        folder="posters"
        onChange={set('image')}
        onUploadingChange={setUploading}
        onShowToast={onShowToast}
        error={errors.image}
      />
      <SubmitButton busy={saving} disabled={uploading} label={item ? 'Guardar cambios' : 'Publicar poster'} />
    </form>
  );
};

// ================= BANNER =================
const BannerForm: React.FC<{
  current: string;
  onSave: AdminModalProps['onSaveBanner'];
  onShowToast: ToastFn;
}> = ({ current, onSave, onShowToast }) => {
  const [text, setText] = useState(current);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSaving(true);
    const err = await onSave(text);
    setSaving(false);
    if (err) {
      onShowToast('❌ No se actualizó el banner', err, 'error');
      return;
    }
    onShowToast('✅ Banner actualizado', 'Todos los visitantes verán el nuevo mensaje.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h4 className="font-semibold text-slate-900">Mensaje de la barra superior</h4>
      <Field label="Texto">
        <textarea className={inputClass} rows={3} maxLength={300} value={text} onChange={(e) => setText(e.target.value)} />
      </Field>
      <p className="text-xs text-slate-500">
        Puedes resaltar con <code>&lt;strong&gt;texto&lt;/strong&gt;</code>. Otras etiquetas se muestran como texto.
      </p>
      <div>
        <span className="block text-xs font-medium text-slate-500 mb-1">Vista previa</span>
        <div
          className="bg-slate-900 text-slate-100 text-xs sm:text-sm py-2 px-4 rounded-xl text-center leading-snug"
          dangerouslySetInnerHTML={{ __html: toSafeInlineHtml(text) }}
        />
      </div>
      <SubmitButton busy={saving} label="Actualizar banner" />
    </form>
  );
};

// ================= UI =================
const Field: React.FC<{ label: string; error?: string; children: React.ReactNode }> = ({ label, error, children }) => (
  <label className="block">
    <span className="block text-sm font-medium text-slate-700 mb-1">{label}</span>
    {children}
    {error && <span className="block text-xs text-red-600 mt-1">{error}</span>}
  </label>
);

const SubmitButton: React.FC<{ busy: boolean; disabled?: boolean; label: string }> = ({ busy, disabled, label }) => (
  <button
    type="submit"
    disabled={busy || disabled}
    className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-400 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2"
  >
    {busy && <Loader2 className="w-4 h-4 animate-spin" />}
    {busy ? 'Guardando...' : label}
  </button>
);

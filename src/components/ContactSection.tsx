import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { sendContactToSupabase } from '../services/api';
import { validateContactForm } from '../lib/validators';

interface ContactSectionProps {
  onShowToast: (title: string, msg: string, type?: 'success' | 'error') => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onShowToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [destination, setDestination] = useState('Colombia');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = validateContactForm({ name, email, destination, message });
    if (!validation.valid) {
      Object.values(validation.errors).forEach((error) => {
        onShowToast('⚠️ Validación', error, 'error');
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await sendContactToSupabase({
        name,
        email,
        destination,
        message,
      });

      if (!result.success) {
        if (result.validationErrors) {
          Object.values(result.validationErrors).forEach((error) => {
            onShowToast('❌ Error', error, 'error');
          });
        } else if (result.error) {
          onShowToast('❌ Error al enviar', result.error.message, 'error');
        }
      } else {
        onShowToast('✅ ¡Éxito!', 'Un asesor de Agencia Enlace de Viajes te contactará en breve.');
        setName('');
        setEmail('');
        setMessage('');
        setDestination('Colombia');
      }
    } catch (err) {
      console.error('Error submitting contact form:', err);
      onShowToast('⚠️ Mensaje recibido', 'Gracias por escribirnos. Te contactaremos pronto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappNumber = import.meta.env.VITE_ADMIN_WHATSAPP?.replace(/\D/g, '') || '573226136377';
  const whatsappPhone = import.meta.env.VITE_ADMIN_WHATSAPP?.replace(/\D/g, '')
    ? `+${import.meta.env.VITE_ADMIN_WHATSAPP?.replace(/\D/g, '')}`
    : '+57 322 6136377';

  return (
    <section className="py-24 px-4 sm:px-6 bg-white" id="contacto">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Contact info */}
          <div className="space-y-8">
            <div>
              <span className="px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold uppercase tracking-wider inline-block mb-4">
                Atención Personalizada
              </span>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
                Hablemos de tu <span className="text-orange-600 italic">próximo viaje</span>
              </h2>

              <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed">
                Diseñamos la conexión perfecta entre tus sueños y el mundo. Más de 10 años creando itinerarios inolvidables en Colombia e internacionales.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hola%20Agencia%20Enlace%20de%20Viajes,%20quisiera%20asesor%C3%ADa%20personalizada`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 bg-slate-50 hover:bg-orange-50/60 rounded-2xl border border-slate-100 hover:border-orange-200 transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-base">Atención Inmediata WhatsApp</div>
                  <div className="text-slate-500 text-sm font-medium">{whatsappPhone}</div>
                </div>
              </a>

              <a
                href="mailto:info@enlacedeviajes.com"
                className="flex items-center gap-4 p-5 bg-slate-50 hover:bg-orange-50/60 rounded-2xl border border-slate-100 hover:border-orange-200 transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-base">Correo Oficial</div>
                  <div className="text-slate-500 text-sm font-medium">info@enlacedeviajes.com</div>
                </div>
              </a>

              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-base">Ubicación</div>
                  <div className="text-slate-500 text-sm font-medium">Cra. 48A #39A Sur 46 · Medellín</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Supabase Connected Form (Fase 2) */}
          <div className="bg-gradient-to-br from-orange-50/80 via-white to-teal-50/80 p-8 sm:p-10 rounded-3xl border border-orange-100 shadow-xl">
            <div className="mb-6">
              <h3 className="font-serif font-bold text-2xl text-slate-900">Envíanos un mensaje</h3>
              <p className="text-slate-500 text-xs mt-1">
                Tus datos se registran en nuestra base de datos de consulta directa en Supabase
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre y apellido"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Destino de interés
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                >
                  <option value="Colombia">Colombia (General)</option>
                  <option value="Caribe">Caribe & San Andrés</option>
                  <option value="Medellin">Medellín & Feria de las Flores</option>
                  <option value="Eje Cafetero">Eje Cafetero & Salento</option>
                  <option value="Bogota">Bogotá & alrededores</option>
                  <option value="Cali">Cali & Valle del Cauca</option>
                  <option value="Internacional">Cruceros e Internacional</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Mensaje o detalles de tu solicitud *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="¿En qué fechas deseas viajar? ¿Cuántas personas viajan contigo?"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-2xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Guardando en Supabase...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Enviar Solicitud</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// Datos de contacto centralizados. VITE_ADMIN_WHATSAPP permite sobrescribirlos por entorno.
const RAW_WHATSAPP = import.meta.env.VITE_ADMIN_WHATSAPP || '+573226136377';

export const WHATSAPP_NUMBER = RAW_WHATSAPP.replace(/\D/g, '');
export const PHONE_E164 = `+${WHATSAPP_NUMBER}`;
export const PHONE_DISPLAY = WHATSAPP_NUMBER.startsWith('57') && WHATSAPP_NUMBER.length === 12
  ? `+57 ${WHATSAPP_NUMBER.slice(2, 5)} ${WHATSAPP_NUMBER.slice(5)}`
  : PHONE_E164;

export function whatsappLink(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const DEFAULT_BANNER =
  '🌟 <strong>OFERTA ESPECIAL:</strong> 20% de descuento en paquetes al Caribe Colombiano · Código: <strong>CARIBE2026</strong>';

// Bucket público de Supabase Storage para imágenes de promociones y posters.
export const MEDIA_BUCKET = 'media';

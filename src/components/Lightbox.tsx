import React from 'react';
import { X, Download, Share2 } from 'lucide-react';

interface LightboxProps {
  imageSrc: string | null;
  title?: string;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ imageSrc, title, onClose }) => {
  if (!imageSrc) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Agencia Enlace de Viajes',
          text: '¡Mira esta opción de viaje en Agencia Enlace de Viajes!',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled', err);
      }
    } else {
      window.open(`https://wa.me/573001234567?text=${encodeURIComponent('Hola, me interesa este paquete: ' + (title || ''))}`, '_blank');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-3 z-10" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleShare}
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition backdrop-blur-sm"
          title="Compartir"
        >
          <Share2 className="w-5 h-5" />
        </button>
        <a
          href={imageSrc}
          download="enlace-viajes-poster.jpg"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition backdrop-blur-sm"
          title="Descargar imagen"
        >
          <Download className="w-5 h-5" />
        </a>
        <button
          onClick={onClose}
          className="p-3 bg-white/20 hover:bg-orange-500 text-white rounded-full transition"
          title="Cerrar"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div
        className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageSrc}
          alt={title || 'Poster de Viajes'}
          className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
        />
        {title && (
          <div className="mt-4 px-6 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-white font-medium text-sm border border-white/10">
            {title}
          </div>
        )}
      </div>
    </div>
  );
};
